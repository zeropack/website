import {
  CONTACT_COLUMNS,
  KLAVIYO_API_REVISION,
  KLAVIYO_LIFECYCLE_PROPERTY,
  KLAVIYO_PROFILE_COLUMNS,
  MONDAY_API_VERSION,
  MONDAY_CONTACTS_BOARD_ID,
  MONDAY_KLAVIYO_PROFILES_BOARD_ID,
  REGION_MAP,
  type CommercialLifecycleStatus,
} from "./config";

type MondayColumnValue = {
  id: string;
  text: string | null;
  value: string | null;
};

type MondayItem = {
  id: string;
  name: string;
  column_values: MondayColumnValue[];
};

export type MondayContact = {
  id: string;
  name: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  lifecycleStatus: string | null;
  subscription: string | null;
  region: string | null;
};

export type MondayKlaviyoMirror = {
  id: string;
  name: string;
  profileId: string | null;
  email: string | null;
  linkedContactId: string | null;
  subscriptionStatus: string | null;
  consentSource: string | null;
  consentDate: string | null;
  suppressionReason: string | null;
  suppressionDate: string | null;
  region: string | null;
  lastSync: string | null;
};

export type KlaviyoProfileState = {
  id: string;
  email: string;
  lifecycleStage: string | null;
  mondayContactId: string | null;
  acquisitionSource: string | null;
  canReceiveMarketing: boolean;
  consent: string | null;
  consentTimestamp: string | null;
  consentSource: string | null;
  suppressionReason: string | null;
  suppressionTimestamp: string | null;
};

export type MondayLifecycleTransition = {
  activityId: string;
  occurrenceId: string;
  actionRecordUuid: string | null;
  contactId: string;
  previousStage: string | null;
  stage: CommercialLifecycleStatus;
  occurredAt: string;
};

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

function columnText(columns: MondayColumnValue[], id: string): string | null {
  return columns.find((column) => column.id === id)?.text?.trim() || null;
}

function columnRaw(columns: MondayColumnValue[], id: string): string | null {
  return columns.find((column) => column.id === id)?.value || null;
}

function relationItemId(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as {
      linkedPulseIds?: Array<{ linkedPulseId?: number | string }>;
      item_ids?: Array<number | string>;
    };
    const id = parsed.linkedPulseIds?.[0]?.linkedPulseId ?? parsed.item_ids?.[0];
    return id == null ? null : String(id);
  } catch {
    return null;
  }
}

async function listMondayItems(
  boardId: number,
  columnIds: string[],
): Promise<MondayItem[]> {
  const query = `
    query ListItems($boardId: ID!, $cursor: String) {
      boards(ids: [$boardId]) {
        items_page(limit: 500, cursor: $cursor) {
          cursor
          items {
            id
            name
            column_values(ids: ${JSON.stringify(columnIds)}) { id text value }
          }
        }
      }
    }
  `;

  const items: MondayItem[] = [];
  let cursor: string | null = null;
  do {
    const data = await mondayGraphql<{
      boards: Array<{
        items_page: { cursor: string | null; items: MondayItem[] };
      }>;
    }>(query, { boardId, cursor });
    const page = data.boards[0]?.items_page;
    if (!page) break;
    items.push(...page.items);
    cursor = page.cursor;
  } while (cursor);

  return items;
}

export async function listMondayContacts(): Promise<MondayContact[]> {
  const items = await listMondayItems(MONDAY_CONTACTS_BOARD_ID, [
    CONTACT_COLUMNS.email,
    CONTACT_COLUMNS.firstName,
    CONTACT_COLUMNS.lastName,
    CONTACT_COLUMNS.lifecycleStatus,
    CONTACT_COLUMNS.subscription,
    CONTACT_COLUMNS.region,
  ]);

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    email: columnText(item.column_values, CONTACT_COLUMNS.email) || "",
    firstName: columnText(item.column_values, CONTACT_COLUMNS.firstName),
    lastName: columnText(item.column_values, CONTACT_COLUMNS.lastName),
    lifecycleStatus: columnText(item.column_values, CONTACT_COLUMNS.lifecycleStatus),
    subscription: columnText(item.column_values, CONTACT_COLUMNS.subscription),
    region: columnText(item.column_values, CONTACT_COLUMNS.region),
  }));
}

export async function listMondayKlaviyoMirrors(): Promise<MondayKlaviyoMirror[]> {
  const items = await listMondayItems(MONDAY_KLAVIYO_PROFILES_BOARD_ID, [
    KLAVIYO_PROFILE_COLUMNS.email,
    KLAVIYO_PROFILE_COLUMNS.contact,
    KLAVIYO_PROFILE_COLUMNS.profileId,
    KLAVIYO_PROFILE_COLUMNS.subscriptionStatus,
    KLAVIYO_PROFILE_COLUMNS.consentSource,
    KLAVIYO_PROFILE_COLUMNS.consentDate,
    KLAVIYO_PROFILE_COLUMNS.suppressionReason,
    KLAVIYO_PROFILE_COLUMNS.suppressionDate,
    KLAVIYO_PROFILE_COLUMNS.region,
    KLAVIYO_PROFILE_COLUMNS.lastSync,
  ]);

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    profileId: columnText(item.column_values, KLAVIYO_PROFILE_COLUMNS.profileId),
    email: columnText(item.column_values, KLAVIYO_PROFILE_COLUMNS.email),
    linkedContactId: relationItemId(
      columnRaw(item.column_values, KLAVIYO_PROFILE_COLUMNS.contact),
    ),
    subscriptionStatus: columnText(
      item.column_values,
      KLAVIYO_PROFILE_COLUMNS.subscriptionStatus,
    ),
    consentSource: columnText(item.column_values, KLAVIYO_PROFILE_COLUMNS.consentSource),
    consentDate: columnText(item.column_values, KLAVIYO_PROFILE_COLUMNS.consentDate),
    suppressionReason: columnText(
      item.column_values,
      KLAVIYO_PROFILE_COLUMNS.suppressionReason,
    ),
    suppressionDate: columnText(
      item.column_values,
      KLAVIYO_PROFILE_COLUMNS.suppressionDate,
    ),
    region: columnText(item.column_values, KLAVIYO_PROFILE_COLUMNS.region),
    lastSync: columnText(item.column_values, KLAVIYO_PROFILE_COLUMNS.lastSync),
  }));
}

export async function getMondayContactByEmail(
  email: string,
): Promise<MondayContact | null> {
  const contacts = await listMondayContacts();
  const matches = contacts.filter(
    (contact) => contact.email.toLowerCase() === email.toLowerCase(),
  );
  if (matches.length === 0) return null;
  if (matches.length > 1) {
    throw new Error(`Multiple Monday Contacts found for ${email}; refusing ambiguous sync.`);
  }
  return matches[0];
}

async function klaviyoFetch<T>(pathOrUrl: string, init?: RequestInit): Promise<T> {
  const url = pathOrUrl.startsWith("https://")
    ? pathOrUrl
    : `https://a.klaviyo.com${pathOrUrl}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Klaviyo-API-Key ${requiredEnv("KLAVIYO_PRIVATE_API_KEY")}`,
      accept: "application/vnd.api+json",
      revision: KLAVIYO_API_REVISION,
      "Content-Type": "application/vnd.api+json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Klaviyo API error ${response.status}: ${body.slice(0, 600)}`);
  }

  if (response.status === 202 || response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

type KlaviyoProfileResource = {
  id: string;
  attributes: {
    email?: string | null;
    properties?: Record<string, unknown>;
    subscriptions?: {
      email?: {
        marketing?: {
          can_receive_email_marketing?: boolean;
          consent?: string | null;
          consent_timestamp?: string | null;
          custom_method_detail?: string | null;
          method?: string | null;
          method_detail?: string | null;
          suppression?: Array<{ reason?: string; timestamp?: string }> | null;
        };
      };
    };
  };
};

function mapKlaviyoProfile(profile: KlaviyoProfileResource): KlaviyoProfileState {
  const marketing = profile.attributes.subscriptions?.email?.marketing;
  const suppression = marketing?.suppression?.[0] || null;
  const properties = profile.attributes.properties || {};
  const methodParts = [
    marketing?.custom_method_detail,
    marketing?.method,
    marketing?.method_detail,
  ].filter((value): value is string => Boolean(value));

  return {
    id: profile.id,
    email: profile.attributes.email || "",
    lifecycleStage:
      typeof properties[KLAVIYO_LIFECYCLE_PROPERTY] === "string"
        ? String(properties[KLAVIYO_LIFECYCLE_PROPERTY])
        : null,
    mondayContactId:
      typeof properties["Monday Contact ID"] === "string"
        ? String(properties["Monday Contact ID"])
        : null,
    acquisitionSource:
      typeof properties["Acquisition Source"] === "string"
        ? String(properties["Acquisition Source"])
        : null,
    canReceiveMarketing: marketing?.can_receive_email_marketing === true,
    consent: marketing?.consent || null,
    consentTimestamp: marketing?.consent_timestamp || null,
    consentSource: methodParts.join(" — ") || null,
    suppressionReason: suppression?.reason || null,
    suppressionTimestamp: suppression?.timestamp || null,
  };
}

export async function listKlaviyoProfiles(): Promise<KlaviyoProfileState[]> {
  const params = new URLSearchParams({
    "additional-fields[profile]": "subscriptions",
    "page[size]": "100",
  });
  let next: string | null = `/api/profiles?${params.toString()}`;
  const profiles: KlaviyoProfileState[] = [];

  while (next) {
    const payload: {
      data: KlaviyoProfileResource[];
      links?: { next?: string | null };
    } = await klaviyoFetch(next);
    profiles.push(...payload.data.map(mapKlaviyoProfile));
    next = payload.links?.next || null;
  }

  return profiles;
}

export async function getKlaviyoProfileByEmail(
  email: string,
): Promise<KlaviyoProfileState | null> {
  const params = new URLSearchParams({
    filter: `equals(email,"${email.replaceAll('"', '\\"')}")`,
    "additional-fields[profile]": "subscriptions",
  });
  const payload = await klaviyoFetch<{ data: KlaviyoProfileResource[] }>(
    `/api/profiles?${params.toString()}`,
  );
  if (payload.data.length === 0) return null;
  if (payload.data.length > 1) {
    throw new Error(`Multiple Klaviyo profiles found for ${email}; refusing ambiguous sync.`);
  }
  return mapKlaviyoProfile(payload.data[0]);
}

export async function getKlaviyoProfileById(
  profileId: string,
): Promise<KlaviyoProfileState | null> {
  try {
    const payload = await klaviyoFetch<{ data: KlaviyoProfileResource }>(
      `/api/profiles/${profileId}?additional-fields[profile]=subscriptions`,
    );
    return mapKlaviyoProfile(payload.data);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Klaviyo API error 404")) {
      return null;
    }
    throw error;
  }
}

export async function setKlaviyoLifecycleStage(
  profileId: string,
  stage: CommercialLifecycleStatus,
  mondayContactId?: string,
  acquisitionSource?: string | null,
): Promise<void> {
  const properties: Record<string, string> = {
    [KLAVIYO_LIFECYCLE_PROPERTY]: stage,
  };
  if (mondayContactId) properties["Monday Contact ID"] = mondayContactId;
  if (acquisitionSource) properties["Acquisition Source"] = acquisitionSource;

  await klaviyoFetch(`/api/profiles/${profileId}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "profile",
        id: profileId,
        attributes: { properties },
      },
    }),
  });
}

function mondayOccurrenceToIso(occurrenceId: string): string {
  const ticks = Number(occurrenceId);
  if (!Number.isFinite(ticks)) return new Date().toISOString();
  return new Date(ticks / 10_000).toISOString();
}

export async function createLifecycleEvent(params: {
  profileId: string;
  stage: CommercialLifecycleStatus;
  previousStage?: string | null;
  mondayContactId: string;
  acquisitionSource?: string | null;
  occurrenceId: string;
}): Promise<void> {
  const uniqueId = `monday:${params.mondayContactId}:lifecycle:${params.stage}:${params.occurrenceId}`;
  const properties: Record<string, string> = {
    "Monday Contact ID": params.mondayContactId,
    "Lifecycle Stage": params.stage,
    "Previous Lifecycle Stage": params.previousStage || "",
    "Source System": "Monday CRM",
  };
  if (params.acquisitionSource) {
    properties["Acquisition Source"] = params.acquisitionSource;
  }

  await klaviyoFetch("/api/events", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "event",
        attributes: {
          metric: { data: { type: "metric", attributes: { name: params.stage } } },
          profile: { data: { type: "profile", id: params.profileId } },
          properties,
          unique_id: uniqueId,
          time: mondayOccurrenceToIso(params.occurrenceId),
          backfill: false,
        },
      },
    }),
  });
}

export function marketingMirrorStatus(
  profile: KlaviyoProfileState,
): "Subscribed" | "Unsubscribed" | "Suppressed" | "Pending" | "Unknown" {
  if (
    profile.consent === "UNSUBSCRIBED" ||
    profile.suppressionReason === "UNSUBSCRIBE"
  ) {
    return "Unsubscribed";
  }
  if (profile.suppressionReason) return "Suppressed";
  if (profile.canReceiveMarketing) return "Subscribed";
  if (profile.consent === "PENDING") return "Pending";
  return "Unknown";
}

export function contactSubscriptionForProfile(
  profile: KlaviyoProfileState,
): "Subscribed" | "Unsubscribed" | "Pending" {
  const state = marketingMirrorStatus(profile);
  if (state === "Subscribed") return "Subscribed";
  if (state === "Pending") return "Pending";
  return "Unsubscribed";
}

export async function updateMondayContactSubscription(
  contactId: string,
  status: "Subscribed" | "Unsubscribed" | "Pending",
): Promise<void> {
  const mutation = `
    mutation UpdateContactSubscription($boardId: ID!, $itemId: ID!, $values: JSON!) {
      change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $values) { id }
    }
  `;
  await mondayGraphql(mutation, {
    boardId: MONDAY_CONTACTS_BOARD_ID,
    itemId: contactId,
    values: JSON.stringify({ [CONTACT_COLUMNS.subscription]: { label: status } }),
  });
}

function mirrorDesiredValues(params: {
  contact: MondayContact | null;
  profile: KlaviyoProfileState;
}): Record<string, unknown> {
  const mirrorStatus = marketingMirrorStatus(params.profile);
  const region = params.contact?.region
    ? REGION_MAP[params.contact.region] || "Global"
    : "Global";
  const values: Record<string, unknown> = {
    [KLAVIYO_PROFILE_COLUMNS.email]: {
      email: params.profile.email,
      text: params.profile.email,
    },
    [KLAVIYO_PROFILE_COLUMNS.profileId]: params.profile.id,
    [KLAVIYO_PROFILE_COLUMNS.subscriptionStatus]: { label: mirrorStatus },
    [KLAVIYO_PROFILE_COLUMNS.consentSource]: params.profile.consentSource || "",
    [KLAVIYO_PROFILE_COLUMNS.region]: { label: region },
  };

  if (params.contact) {
    values[KLAVIYO_PROFILE_COLUMNS.contact] = {
      item_ids: [Number(params.contact.id)],
    };
  }
  values[KLAVIYO_PROFILE_COLUMNS.consentDate] = params.profile.consentTimestamp
    ? { date: params.profile.consentTimestamp.slice(0, 10) }
    : null;
  values[KLAVIYO_PROFILE_COLUMNS.suppressionReason] =
    params.profile.suppressionReason || "";
  values[KLAVIYO_PROFILE_COLUMNS.suppressionDate] =
    params.profile.suppressionTimestamp
      ? { date: params.profile.suppressionTimestamp.slice(0, 10) }
      : null;

  return values;
}

function mirrorNeedsUpdate(
  mirror: MondayKlaviyoMirror,
  contact: MondayContact | null,
  profile: KlaviyoProfileState,
): boolean {
  const desiredStatus = marketingMirrorStatus(profile);
  const desiredRegion = contact?.region ? REGION_MAP[contact.region] || "Global" : "Global";
  const desiredConsentDate = profile.consentTimestamp?.slice(0, 10) || null;
  const desiredSuppressionDate = profile.suppressionTimestamp?.slice(0, 10) || null;

  return (
    mirror.email !== profile.email ||
    mirror.linkedContactId !== (contact?.id || null) ||
    mirror.subscriptionStatus !== desiredStatus ||
    (mirror.consentSource || "") !== (profile.consentSource || "") ||
    mirror.consentDate !== desiredConsentDate ||
    (mirror.suppressionReason || "") !== (profile.suppressionReason || "") ||
    mirror.suppressionDate !== desiredSuppressionDate ||
    mirror.region !== desiredRegion
  );
}

export async function upsertMondayKlaviyoMirror(params: {
  contact: MondayContact | null;
  profile: KlaviyoProfileState;
  existing?: MondayKlaviyoMirror | null;
  forceSyncTimestamp?: boolean;
}): Promise<{ itemId: string; changed: boolean }> {
  const values = mirrorDesiredValues(params);
  const today = new Date().toISOString().slice(0, 10);
  const existing = params.existing || null;
  const changed = !existing || mirrorNeedsUpdate(existing, params.contact, params.profile);

  if (!changed && !params.forceSyncTimestamp) {
    return { itemId: existing!.id, changed: false };
  }

  values[KLAVIYO_PROFILE_COLUMNS.lastSync] = { date: today };

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

export async function getMondayLifecycleTransitions(
  lookbackHours = 72,
): Promise<MondayLifecycleTransition[]> {
  const now = new Date();
  const from = new Date(now.getTime() - lookbackHours * 60 * 60 * 1000);
  const query = `
    query LifecycleActivity($from: Date!, $to: Date!) {
      boards(ids: [${MONDAY_CONTACTS_BOARD_ID}]) {
        activity_logs(from: $from, to: $to) {
          id
          event
          data
          created_at
        }
      }
    }
  `;
  const data = await mondayGraphql<{
    boards: Array<{
      activity_logs: Array<{
        id: string;
        event: string;
        data: string;
        created_at: string;
      }>;
    }>;
  }>(query, { from: from.toISOString(), to: now.toISOString() });

  const transitions: MondayLifecycleTransition[] = [];
  for (const log of data.boards[0]?.activity_logs || []) {
    if (log.event !== "update_column_value") continue;
    let detail: {
      pulse_id?: number | string;
      column_id?: string;
      action_record_uuid?: string | null;
      previous_value?: { label?: { text?: string } };
      value?: { label?: { text?: string } };
    };
    try {
      detail = JSON.parse(log.data);
    } catch {
      continue;
    }
    if (detail.column_id !== CONTACT_COLUMNS.lifecycleStatus) continue;
    const stage = detail.value?.label?.text || null;
    if (
      stage !== "RFQ Requested" &&
      stage !== "RFQ Sent" &&
      stage !== "Won" &&
      stage !== "Lost"
    ) {
      continue;
    }
    if (detail.pulse_id == null) continue;
    transitions.push({
      activityId: log.id,
      occurrenceId: log.created_at,
      actionRecordUuid: detail.action_record_uuid || null,
      contactId: String(detail.pulse_id),
      previousStage: detail.previous_value?.label?.text || null,
      stage,
      occurredAt: mondayOccurrenceToIso(log.created_at),
    });
  }

  return transitions.sort(
    (a, b) => Number(a.occurrenceId) - Number(b.occurrenceId),
  );
}
