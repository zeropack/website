import {
  marketingMirrorStatus,
  type KlaviyoProfileState,
  type MondayContact,
  type MondayKlaviyoMirror,
} from "./clients";
import {
  KLAVIYO_PROFILE_COLUMNS,
  MONDAY_API_VERSION,
  MONDAY_KLAVIYO_PROFILES_BOARD_ID,
  REGION_MAP,
} from "./config";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function mondayGraphql<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const response = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      Authorization: requiredEnv("MONDAY_API_TOKEN"),
      "Content-Type": "application/json",
      "API-Version": MONDAY_API_VERSION,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const payload = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };
  if (!response.ok || payload.errors?.length || !payload.data) {
    throw new Error(
      `Monday API error: ${payload.errors?.map((error) => error.message).join("; ") || response.status}`,
    );
  }
  return payload.data;
}

function desiredRegion(
  contact: MondayContact | null,
  existing: MondayKlaviyoMirror | null,
): string {
  if (contact?.region) return REGION_MAP[contact.region] || "Global";
  return existing?.region || "Global";
}

function affirmativeConsent(profile: KlaviyoProfileState): boolean {
  return profile.canReceiveMarketing && profile.consent === "SUBSCRIBED";
}

export function mirrorNeedsSafeUpdate(params: {
  existing: MondayKlaviyoMirror | null;
  contact: MondayContact | null;
  profile: KlaviyoProfileState;
}): boolean {
  const { existing, contact, profile } = params;
  if (!existing) return true;

  const status = marketingMirrorStatus(profile);
  const region = desiredRegion(contact, existing);
  const suppressionDate = profile.suppressionTimestamp?.slice(0, 10) || null;

  if ((existing.email || "").toLowerCase() !== profile.email.toLowerCase()) return true;
  if (existing.profileId !== profile.id) return true;
  if (contact && existing.linkedContactId !== contact.id) return true;
  if (existing.subscriptionStatus !== status) return true;
  if ((existing.suppressionReason || "") !== (profile.suppressionReason || "")) return true;
  if (existing.suppressionDate !== suppressionDate) return true;
  if (existing.region !== region) return true;

  // Consent Source / Date describe the affirmative opt-in provenance. An unsubscribe or
  // non-consent suppression must not replace them with the later suppression method/time.
  if (affirmativeConsent(profile)) {
    const consentDate = profile.consentTimestamp?.slice(0, 10) || null;
    if ((existing.consentSource || "") !== (profile.consentSource || "")) return true;
    if (existing.consentDate !== consentDate) return true;
  }

  return false;
}

function desiredValues(params: {
  existing: MondayKlaviyoMirror | null;
  contact: MondayContact | null;
  profile: KlaviyoProfileState;
}): Record<string, unknown> {
  const { existing, contact, profile } = params;
  const values: Record<string, unknown> = {
    [KLAVIYO_PROFILE_COLUMNS.email]: {
      email: profile.email,
      text: profile.email,
    },
    [KLAVIYO_PROFILE_COLUMNS.profileId]: profile.id,
    [KLAVIYO_PROFILE_COLUMNS.subscriptionStatus]: {
      label: marketingMirrorStatus(profile),
    },
    [KLAVIYO_PROFILE_COLUMNS.region]: {
      label: desiredRegion(contact, existing),
    },
    [KLAVIYO_PROFILE_COLUMNS.suppressionReason]: profile.suppressionReason || "",
    [KLAVIYO_PROFILE_COLUMNS.suppressionDate]: profile.suppressionTimestamp
      ? { date: profile.suppressionTimestamp.slice(0, 10) }
      : null,
  };

  if (contact) {
    values[KLAVIYO_PROFILE_COLUMNS.contact] = {
      item_ids: [Number(contact.id)],
    };
  }

  if (affirmativeConsent(profile)) {
    values[KLAVIYO_PROFILE_COLUMNS.consentSource] = profile.consentSource || "";
    values[KLAVIYO_PROFILE_COLUMNS.consentDate] = profile.consentTimestamp
      ? { date: profile.consentTimestamp.slice(0, 10) }
      : null;
  } else if (!existing) {
    // New unmatched/suppressed mirrors start without invented affirmative consent provenance.
    values[KLAVIYO_PROFILE_COLUMNS.consentSource] = "";
    values[KLAVIYO_PROFILE_COLUMNS.consentDate] = null;
  }

  return values;
}

export async function upsertMondayKlaviyoMirrorSafe(params: {
  contact: MondayContact | null;
  profile: KlaviyoProfileState;
  existing?: MondayKlaviyoMirror | null;
  forceSyncTimestamp?: boolean;
}): Promise<{ itemId: string; changed: boolean }> {
  const existing = params.existing || null;
  const changed = mirrorNeedsSafeUpdate({
    existing,
    contact: params.contact,
    profile: params.profile,
  });

  if (!changed && !params.forceSyncTimestamp) {
    return { itemId: existing!.id, changed: false };
  }

  const values = desiredValues({
    existing,
    contact: params.contact,
    profile: params.profile,
  });
  values[KLAVIYO_PROFILE_COLUMNS.lastSync] = {
    date: new Date().toISOString().slice(0, 10),
  };

  if (existing) {
    const mutation = `
      mutation UpdateMirror($boardId: ID!, $itemId: ID!, $values: JSON!) {
        change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $values) { id }
      }
    `;
    await mondayGraphql(mutation, {
      boardId: MONDAY_KLAVIYO_PROFILES_BOARD_ID,
      itemId: existing.id,
      values: JSON.stringify(values),
    });
    return { itemId: existing.id, changed: true };
  }

  const mutation = `
    mutation CreateMirror($boardId: ID!, $name: String!, $values: JSON!) {
      create_item(board_id: $boardId, item_name: $name, column_values: $values) { id }
    }
  `;
  const created = await mondayGraphql<{ create_item: { id: string } }>(mutation, {
    boardId: MONDAY_KLAVIYO_PROFILES_BOARD_ID,
    name: params.contact?.name || params.profile.email || params.profile.id,
    values: JSON.stringify(values),
  });
  return { itemId: created.create_item.id, changed: true };
}
