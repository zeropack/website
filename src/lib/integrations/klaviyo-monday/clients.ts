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

export type KlaviyoProfileState = {
  id: string;
  email: string;
  lifecycleStage: string | null;
  canReceiveMarketing: boolean;
  consent: string | null;
  consentTimestamp: string | null;
  consentSource: string | null;
  suppressionReason: string | null;
  suppressionTimestamp: string | null;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function mondayGraphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
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

export async function getMondayContactByEmail(email: string): Promise<MondayContact | null> {
  const query = `
    query FindContact($boardId: ID!, $email: String!) {
      items_page_by_column_values(
        board_id: $boardId
        limit: 2
        columns: [{ column_id: "${CONTACT_COLUMNS.email}", column_values: [$email] }]
      ) {
        items {
          id
          name
          column_values(ids: [
            "${CONTACT_COLUMNS.email}",
            "${CONTACT_COLUMNS.firstName}",
            "${CONTACT_COLUMNS.lastName}",
            "${CONTACT_COLUMNS.lifecycleStatus}",
            "${CONTACT_COLUMNS.subscription}",
            "${CONTACT_COLUMNS.region}"
          ]) { id text value }
        }
      }
    }
  `;

  const data = await mondayGraphql<{
    items_page_by_column_values: {
      items: Array<{ id: string; name: string; column_values: MondayColumnValue[] }>;
    };
  }>(query, { boardId: MONDAY_CONTACTS_BOARD_ID, email });

  const items = data.items_page_by_column_values.items;
  if (items.length === 0) return null;
  if (items.length > 1) {
    throw new Error(`Multiple Monday Contacts found for ${email}; refusing ambiguous sync.`);
  }

  const item = items[0];
  return {
    id: item.id,
    name: item.name,
    email: columnText(item.column_values, CONTACT_COLUMNS.email) || email,
    firstName: columnText(item.column_values, CONTACT_COLUMNS.firstName),
    lastName: columnText(item.column_values, CONTACT_COLUMNS.lastName),
    lifecycleStatus: columnText(item.column_values, CONTACT_COLUMNS.lifecycleStatus),
    subscription: columnText(item.column_values, CONTACT_COLUMNS.subscription),
    region: columnText(item.column_values, CONTACT_COLUMNS.region),
  };
}

async function klaviyoFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://a.klaviyo.com${path}`, {
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

export async function getKlaviyoProfileByEmail(email: string): Promise<KlaviyoProfileState | null> {
  const params = new URLSearchParams({
    filter: `equals(email,"${email.replaceAll('"', '\\"')}")`,
    "additional-fields[profile]": "subscriptions",
  });

  const payload = await klaviyoFetch<{
    data: Array<{
      id: string;
      attributes: {
        email: string;
        properties?: Record<string, unknown>;
        subscriptions?: {
          email?: {
            marketing?: {
              can_receive_email_marketing?: boolean;
              consent?: string | null;
              consent_timestamp?: string | null;
              custom_method_detail?: string | null;
              method_detail?: string | null;
              suppression?: { reason?: string; timestamp?: string } | null;
            };
          };
        };
      };
    }>;
  }>(`/api/profiles?${params.toString()}`);

  if (payload.data.length === 0) return null;
  if (payload.data.length > 1) {
    throw new Error(`Multiple Klaviyo profiles found for ${email}; refusing ambiguous sync.`);
  }

  const profile = payload.data[0];
  const marketing = profile.attributes.subscriptions?.email?.marketing;
  return {
    id: profile.id,
    email: profile.attributes.email,
    lifecycleStage:
      typeof profile.attributes.properties?.[KLAVIYO_LIFECYCLE_PROPERTY] === "string"
        ? String(profile.attributes.properties[KLAVIYO_LIFECYCLE_PROPERTY])
        : null,
    canReceiveMarketing: marketing?.can_receive_email_marketing === true,
    consent: marketing?.consent || null,
    consentTimestamp: marketing?.consent_timestamp || null,
    consentSource: marketing?.custom_method_detail || marketing?.method_detail || null,
    suppressionReason: marketing?.suppression?.reason || null,
    suppressionTimestamp: marketing?.suppression?.timestamp || null,
  };
}

export async function setKlaviyoLifecycleStage(
  profileId: string,
  stage: CommercialLifecycleStatus,
): Promise<void> {
  await klaviyoFetch(`/api/profiles/${profileId}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "profile",
        id: profileId,
        attributes: { properties: { [KLAVIYO_LIFECYCLE_PROPERTY]: stage } },
      },
    }),
  });
}

export async function createLifecycleEvent(params: {
  profileId: string;
  stage: CommercialLifecycleStatus;
  mondayContactId: string;
}): Promise<void> {
  const uniqueId = `monday-contact:${params.mondayContactId}:lifecycle:${params.stage}`;
  await klaviyoFetch("/api/events", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "event",
        attributes: {
          metric: { data: { type: "metric", attributes: { name: params.stage } } },
          profile: { data: { type: "profile", id: params.profileId } },
          properties: {
            source: "Monday CRM",
            monday_contact_id: params.mondayContactId,
            lifecycle_stage: params.stage,
          },
          unique_id: uniqueId,
        },
      },
    }),
  });
}

export function marketingMirrorStatus(profile: KlaviyoProfileState): "Subscribed" | "Unsubscribed" | "Suppressed" | "Pending" {
  if (profile.suppressionReason) return "Suppressed";
  if (profile.canReceiveMarketing) return "Subscribed";
  if (profile.consent === "UNSUBSCRIBED") return "Unsubscribed";
  return "Pending";
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

async function findKlaviyoMirrorByProfileId(profileId: string): Promise<string | null> {
  const query = `
    query FindMirror($boardId: ID!, $profileId: String!) {
      items_page_by_column_values(
        board_id: $boardId
        limit: 2
        columns: [{ column_id: "${KLAVIYO_PROFILE_COLUMNS.profileId}", column_values: [$profileId] }]
      ) { items { id } }
    }
  `;
  const data = await mondayGraphql<{ items_page_by_column_values: { items: Array<{ id: string }> } }>(
    query,
    { boardId: MONDAY_KLAVIYO_PROFILES_BOARD_ID, profileId },
  );
  const items = data.items_page_by_column_values.items;
  if (items.length > 1) throw new Error(`Duplicate Klaviyo Profiles mirrors found for ${profileId}.`);
  return items[0]?.id || null;
}

export async function upsertMondayKlaviyoMirror(params: {
  contact: MondayContact;
  profile: KlaviyoProfileState;
}): Promise<string> {
  const mirrorStatus = marketingMirrorStatus(params.profile);
  const contactSubscription = mirrorStatus === "Subscribed" ? "Subscribed" : mirrorStatus === "Pending" ? "Pending" : "Unsubscribed";
  const today = new Date().toISOString().slice(0, 10);
  const region = params.contact.region ? REGION_MAP[params.contact.region] || "Global" : "Global";

  const values: Record<string, unknown> = {
    [KLAVIYO_PROFILE_COLUMNS.email]: { email: params.profile.email, text: params.profile.email },
    [KLAVIYO_PROFILE_COLUMNS.contact]: { item_ids: [Number(params.contact.id)] },
    [KLAVIYO_PROFILE_COLUMNS.profileId]: params.profile.id,
    [KLAVIYO_PROFILE_COLUMNS.subscriptionStatus]: { label: mirrorStatus },
    [KLAVIYO_PROFILE_COLUMNS.consentSource]: params.profile.consentSource || "",
    [KLAVIYO_PROFILE_COLUMNS.region]: { label: region },
    [KLAVIYO_PROFILE_COLUMNS.lastSync]: { date: today },
  };

  if (params.profile.consentTimestamp) {
    values[KLAVIYO_PROFILE_COLUMNS.consentDate] = { date: params.profile.consentTimestamp.slice(0, 10) };
  }
  if (params.profile.suppressionReason) {
    values[KLAVIYO_PROFILE_COLUMNS.suppressionReason] = params.profile.suppressionReason;
  }
  if (params.profile.suppressionTimestamp) {
    values[KLAVIYO_PROFILE_COLUMNS.suppressionDate] = { date: params.profile.suppressionTimestamp.slice(0, 10) };
  }

  const existingId = await findKlaviyoMirrorByProfileId(params.profile.id);
  if (existingId) {
    const mutation = `
      mutation UpdateMirror($boardId: ID!, $itemId: ID!, $values: JSON!) {
        change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $values) { id }
      }
    `;
    await mondayGraphql(mutation, {
      boardId: MONDAY_KLAVIYO_PROFILES_BOARD_ID,
      itemId: existingId,
      values: JSON.stringify(values),
    });
  } else {
    const mutation = `
      mutation CreateMirror($boardId: ID!, $name: String!, $values: JSON!) {
        create_item(board_id: $boardId, item_name: $name, column_values: $values) { id }
      }
    `;
    const created = await mondayGraphql<{ create_item: { id: string } }>(mutation, {
      boardId: MONDAY_KLAVIYO_PROFILES_BOARD_ID,
      name: params.contact.name || params.profile.email,
      values: JSON.stringify(values),
    });
    await updateMondayContactSubscription(params.contact.id, contactSubscription);
    return created.create_item.id;
  }

  await updateMondayContactSubscription(params.contact.id, contactSubscription);
  return existingId;
}
