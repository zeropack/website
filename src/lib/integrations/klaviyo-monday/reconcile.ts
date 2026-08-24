import {
  contactSubscriptionForProfile,
  createLifecycleEvent,
  getMondayLifecycleTransitions,
  listKlaviyoProfiles,
  listMondayContacts,
  listMondayKlaviyoMirrors,
  setKlaviyoLifecycleStage,
  updateMondayContactSubscription,
  type KlaviyoProfileState,
  type MondayContact,
  type MondayKlaviyoMirror,
} from "./clients";
import { isCommercialLifecycleStatus } from "./config";
import {
  mirrorNeedsSafeUpdate,
  upsertMondayKlaviyoMirrorSafe,
} from "./mirror";
import { markWelcomeExitedIfInProgress } from "./welcome";

export type ReconcileMode = "preview" | "apply";

export type ReconcileOptions = {
  mode?: ReconcileMode;
  lifecycleLookbackHours?: number;
  lifecycleCutoverAt?: string | null;
};

export type ReconcileResult = {
  ok: true;
  mode: ReconcileMode;
  profilesScanned: number;
  profilesWithoutEmail: number;
  mirrorsWouldChange: number;
  mirrorsChanged: number;
  contactSubscriptionsWouldChange: number;
  contactSubscriptionsChanged: number;
  unmatchedProfiles: number;
  ambiguousProfiles: number;
  lifecycleEnabled: boolean;
  lifecycleTransitionsSeen: number;
  lifecycleTransitionsEligible: number;
  lifecycleTransitionsSkippedStale: number;
  lifecycleProfilesWouldUpdate: number;
  lifecycleProfilesUpdated: number;
  lifecycleEventsWouldSubmit: number;
  lifecycleEventsSubmitted: number;
  lifecycleUnmatched: number;
  welcomeProfilesExited: number;
  notes: string[];
};

type Match<T> = { value: T | null; ambiguous: boolean };

function addToMultiMap<T>(map: Map<string, T[]>, key: string | null, value: T) {
  if (!key) return;
  const normalised = key.trim().toLowerCase();
  if (!normalised) return;
  const values = map.get(normalised) || [];
  values.push(value);
  map.set(normalised, values);
}

function uniqueFromMap<T>(map: Map<string, T[]>, key: string | null): Match<T> {
  if (!key) return { value: null, ambiguous: false };
  const values = map.get(key.trim().toLowerCase()) || [];
  if (values.length === 1) return { value: values[0], ambiguous: false };
  return { value: null, ambiguous: values.length > 1 };
}

function resolveContactForProfile(params: {
  profile: KlaviyoProfileState;
  mirror: MondayKlaviyoMirror | null;
  contactsById: Map<string, MondayContact>;
  contactsByEmail: Map<string, MondayContact[]>;
}): Match<MondayContact> {
  const linkedId = params.mirror?.linkedContactId;
  if (linkedId && params.contactsById.has(linkedId)) {
    return { value: params.contactsById.get(linkedId)!, ambiguous: false };
  }

  if (params.profile.mondayContactId) {
    const byId = params.contactsById.get(params.profile.mondayContactId);
    if (byId) return { value: byId, ambiguous: false };
  }

  return uniqueFromMap(params.contactsByEmail, params.profile.email);
}

function resolveProfileForContact(params: {
  contact: MondayContact;
  mirrorsByContactId: Map<string, MondayKlaviyoMirror[]>;
  profilesById: Map<string, KlaviyoProfileState>;
  profilesByMondayContactId: Map<string, KlaviyoProfileState[]>;
  profilesByEmail: Map<string, KlaviyoProfileState[]>;
}): Match<KlaviyoProfileState> {
  const mirrors = params.mirrorsByContactId.get(params.contact.id) || [];
  if (mirrors.length > 1) return { value: null, ambiguous: true };
  if (mirrors.length === 1 && mirrors[0].profileId) {
    const profile = params.profilesById.get(mirrors[0].profileId!);
    if (profile) return { value: profile, ambiguous: false };
  }

  const byContactId = uniqueFromMap(
    params.profilesByMondayContactId,
    params.contact.id,
  );
  if (byContactId.value || byContactId.ambiguous) return byContactId;

  return uniqueFromMap(params.profilesByEmail, params.contact.email);
}

function parseCutover(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function reconcileKlaviyoMonday(
  options: ReconcileOptions = {},
): Promise<ReconcileResult> {
  const mode: ReconcileMode = options.mode === "apply" ? "apply" : "preview";
  const contacts = await listMondayContacts();
  const mirrors = await listMondayKlaviyoMirrors();
  const profiles = await listKlaviyoProfiles();

  const contactsById = new Map(contacts.map((contact) => [contact.id, contact]));
  const contactsByEmail = new Map<string, MondayContact[]>();
  for (const contact of contacts) addToMultiMap(contactsByEmail, contact.email, contact);

  const mirrorsByProfileId = new Map<string, MondayKlaviyoMirror[]>();
  const mirrorsByEmail = new Map<string, MondayKlaviyoMirror[]>();
  const mirrorsByContactId = new Map<string, MondayKlaviyoMirror[]>();
  for (const mirror of mirrors) {
    addToMultiMap(mirrorsByProfileId, mirror.profileId, mirror);
    addToMultiMap(mirrorsByEmail, mirror.email, mirror);
    addToMultiMap(mirrorsByContactId, mirror.linkedContactId, mirror);
  }

  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
  const profilesByEmail = new Map<string, KlaviyoProfileState[]>();
  const profilesByMondayContactId = new Map<string, KlaviyoProfileState[]>();
  for (const profile of profiles) {
    addToMultiMap(profilesByEmail, profile.email, profile);
    addToMultiMap(profilesByMondayContactId, profile.mondayContactId, profile);
  }

  const result: ReconcileResult = {
    ok: true,
    mode,
    profilesScanned: profiles.length,
    profilesWithoutEmail: 0,
    mirrorsWouldChange: 0,
    mirrorsChanged: 0,
    contactSubscriptionsWouldChange: 0,
    contactSubscriptionsChanged: 0,
    unmatchedProfiles: 0,
    ambiguousProfiles: 0,
    lifecycleEnabled: false,
    lifecycleTransitionsSeen: 0,
    lifecycleTransitionsEligible: 0,
    lifecycleTransitionsSkippedStale: 0,
    lifecycleProfilesWouldUpdate: 0,
    lifecycleProfilesUpdated: 0,
    lifecycleEventsWouldSubmit: 0,
    lifecycleEventsSubmitted: 0,
    lifecycleUnmatched: 0,
    welcomeProfilesExited: 0,
    notes: [],
  };

  // Klaviyo is authoritative for marketing eligibility. Monday receives only a mirror.
  for (const profile of profiles) {
    if (!profile.email) {
      result.profilesWithoutEmail += 1;
      continue;
    }

    const byProfileId = uniqueFromMap(mirrorsByProfileId, profile.id);
    if (byProfileId.ambiguous) {
      result.ambiguousProfiles += 1;
      continue;
    }

    const byMirrorEmail = byProfileId.value
      ? { value: null, ambiguous: false }
      : uniqueFromMap(mirrorsByEmail, profile.email);
    if (byMirrorEmail.ambiguous) {
      result.ambiguousProfiles += 1;
      continue;
    }
    const existingMirror = byProfileId.value || byMirrorEmail.value;

    const match = resolveContactForProfile({
      profile,
      mirror: existingMirror,
      contactsById,
      contactsByEmail,
    });
    if (match.ambiguous) {
      result.ambiguousProfiles += 1;
      continue;
    }
    const contact = match.value;
    if (!contact) result.unmatchedProfiles += 1;

    if (contact) {
      const targetSubscription = contactSubscriptionForProfile(profile);
      if (contact.subscription !== targetSubscription) {
        result.contactSubscriptionsWouldChange += 1;
        if (mode === "apply") {
          await updateMondayContactSubscription(contact.id, targetSubscription);
          contact.subscription = targetSubscription;
          result.contactSubscriptionsChanged += 1;
        }
      }
    }

    if (
      mirrorNeedsSafeUpdate({
        existing: existingMirror,
        contact,
        profile,
      })
    ) {
      result.mirrorsWouldChange += 1;
      if (mode === "apply") {
        const written = await upsertMondayKlaviyoMirrorSafe({
          contact,
          profile,
          existing: existingMirror,
        });
        if (written.changed) result.mirrorsChanged += 1;
      }
    }
  }

  // Lifecycle events are separately gated. A cutover prevents deployment from replaying
  // historical CRM transitions when the unattended service is first enabled.
  const cutover = parseCutover(
    options.lifecycleCutoverAt ?? process.env.MONDAY_LIFECYCLE_SYNC_CUTOVER_AT,
  );
  if (!cutover) {
    result.notes.push(
      "Lifecycle event processing is disabled until MONDAY_LIFECYCLE_SYNC_CUTOVER_AT is configured.",
    );
    return result;
  }
  result.lifecycleEnabled = true;

  const transitions = await getMondayLifecycleTransitions(
    options.lifecycleLookbackHours ?? 72,
  );
  result.lifecycleTransitionsSeen = transitions.length;

  for (const transition of transitions) {
    if (new Date(transition.occurredAt) < cutover) continue;
    const contact = contactsById.get(transition.contactId);
    if (!contact) {
      result.lifecycleUnmatched += 1;
      continue;
    }

    // Only the latest still-current transition may fire a lifecycle message. This prevents
    // a delayed poll from replaying an obsolete RFQ stage after the CRM has already advanced.
    if (
      !isCommercialLifecycleStatus(contact.lifecycleStatus) ||
      contact.lifecycleStatus !== transition.stage
    ) {
      result.lifecycleTransitionsSkippedStale += 1;
      continue;
    }
    result.lifecycleTransitionsEligible += 1;

    const profileMatch = resolveProfileForContact({
      contact,
      mirrorsByContactId,
      profilesById,
      profilesByMondayContactId,
      profilesByEmail,
    });
    if (profileMatch.ambiguous || !profileMatch.value) {
      result.lifecycleUnmatched += 1;
      continue;
    }
    const profile = profileMatch.value;

    // A real commercial lifecycle transition also terminates an active Welcome journey.
    // Only profiles explicitly marked No or In Progress are changed; Yes and Exempt are preserved.
    if (mode === "apply") {
      const exited = await markWelcomeExitedIfInProgress(profile.id);
      if (exited) result.welcomeProfilesExited += 1;
    }

    // Submit the deterministic lifecycle event before using the profile property as a durable
    // stage marker. Re-submitting the same transition is safe because createLifecycleEvent uses
    // a unique_id derived from the Monday contact, stage and occurrence. This also self-heals
    // the former failure mode where the property was written but the triggering event was lost.
    const stageNeedsUpdate = profile.lifecycleStage !== transition.stage;
    if (stageNeedsUpdate) result.lifecycleProfilesWouldUpdate += 1;
    result.lifecycleEventsWouldSubmit += 1;

    if (mode === "apply") {
      await createLifecycleEvent({
        profileId: profile.id,
        stage: transition.stage,
        previousStage: transition.previousStage,
        mondayContactId: contact.id,
        acquisitionSource: profile.acquisitionSource,
        occurrenceId: transition.occurrenceId,
      });
      result.lifecycleEventsSubmitted += 1;

      if (stageNeedsUpdate) {
        await setKlaviyoLifecycleStage(
          profile.id,
          transition.stage,
          contact.id,
          profile.acquisitionSource,
        );
        profile.lifecycleStage = transition.stage;
        profile.mondayContactId = contact.id;
        result.lifecycleProfilesUpdated += 1;
      }
    }
  }

  return result;
}
