import { KLAVIYO_API_REVISION, MONDAY_API_VERSION, MONDAY_CONTACTS_BOARD_ID } from "./config";

const MONDAY_CONTACT_US_BOARD_ID = 5029468391;

const CONTACT_US_COLUMNS = {
  firstName: "text_mm5neh7s",
  lastName: "text_mm5gzfyz",
  email: "email",
  phone: "phone_mm5gn3m9",
  company: "text_mm6cb6x0",
  comments: "long_text",
  subscribed: "single_selecteohsebj",
} as const;

const CONTACT_COLUMNS = {
  firstName: "text_mm5n6d0w",
  lastName: "text_mm4pxvbs",
  email: "contact_email",
  phone: "contact_phone",
  status: "color_mm5gwvh2",
  subscription: "color_mm69w7w7",
  region: "dropdown_mm69wb6t",
  companyName: "text_mm694vax",
} as const;

export type AcquisitionMode = "preview" | "apply";
export type ApprovedInboundSource = "Packaging Guide" | "Newsletter" | "Contact Us" | "Typeform";
export type ApprovedOutboundSource = "Lead Research" | "Manual CRM" | "Migration";

const INBOUND_SOURCES = new Set<ApprovedInboundSource>([
  "Packaging Guide",
  "Newsletter",
  "Contact Us",
  "Typeform",
]);

const OUTBOUND_SOURCES = new Set<ApprovedOutboundSource>([
  "Lead Research",
  "Manual CRM",
  "Migration",
]);

export type KlaviyoIntakePayload = {
  profile_id: string;
  source: ApprovedInboundSource;
};

export type ProfileSyncRequest = {
  contactIds: string[];
  source: ApprovedOutboundSource;
  mode?: AcquisitionMode;
};

type KlaviyoProfile = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  company: string | null;
  mondayContactId: string | null;
  canReceiveMarketing: boolean;
  consent: string | null;
  suppressionReason: string | null;
};

type MondayContact = {
  id: string;
  name: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  status: string | null;
  subscription: string | null;
  region: string | null;
  companyName: string | null;
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
  const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (!response.ok || payload.errors?.length || !payload.data) {
    throw new Error(`Monday API error: ${payload.errors?.map((e) => e.message).join("; ") || response.status}`);
  }
  return payload.data;
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

function stringProperty(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function mapProfile(resource: any): KlaviyoProfile {
  const attrs = resource.attributes || {};
  const props = attrs.properties || {};
  const marketing = attrs.subscriptions?.email?.marketing || {};
  return {
    id: String(resource.id),
    email: String(attrs.email || "").trim().toLowerCase(),
    firstName: stringProperty(attrs.first_name),
    lastName: stringProperty(attrs.last_name),
    phone: stringProperty(attrs.phone_number),
    company: stringProperty(attrs.organization) || stringProperty(props.Company) || stringProperty(props["Company Name"]),
    mondayContactId: stringProperty(props["Monday Contact ID"]),
    canReceiveMarketing: marketing.can_receive_email_marketing === true,
    consent: stringProperty(marketing.consent),
    suppressionReason: stringProperty(marketing.suppression?.[0]?.reason),
  };
}

async function getKlaviyoProfileById(profileId: string): Promise<KlaviyoProfile> {
  const payload = await klaviyoFetch<{ data: any }>(
    `/api/profiles/${encodeURIComponent(profileId)}?additional-fields[profile]=subscriptions`,
  );
  return mapProfile(payload.data);
}

async function getKlaviyoProfileByEmail(email: string): Promise<KlaviyoProfile | null> {
  const escaped = email.replaceAll('"', '\\"');
  const params = new URLSearchParams({
    filter: `equals(email,"${escaped}")`,
    "additional-fields[profile]": "subscriptions",
  });
  const payload = await klaviyoFetch<{ data: any[] }>(`/api/profiles?${params.toString()}`);
  if (payload.data.length === 0) return null;
  if (payload.data.length > 1) throw new Error(`Multiple Klaviyo profiles found for ${email}; refusing ambiguous sync.`);
  return mapProfile(payload.data[0]);
}

async function findContactUsItemsByEmail(email: string): Promise<Array<{ id: string; email: string }>> {
  const query = `query ContactUsByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(board_id: $boardId, limit: 10, columns: [{column_id: "${CONTACT_US_COLUMNS.email}", column_values: [$email]}]) {
      items { id column_values(ids: ["${CONTACT_US_COLUMNS.email}"]) { id text } }
    }
  }`;
  const data = await mondayGraphql<{ items_page_by_column_values: { items: Array<{ id: string; column_values: Array<{ id: string; text: string | null }> }> } }>(query, {
    boardId: MONDAY_CONTACT_US_BOARD_ID,
    email,
  });
  return data.items_page_by_column_values.items.map((item) => ({
    id: item.id,
    email: item.column_values.find((c) => c.id === CONTACT_US_COLUMNS.email)?.text || "",
  }));
}

async function createContactUsIntake(profile: KlaviyoProfile, source: ApprovedInboundSource): Promise<string> {
  const mutation = `mutation CreateContactUs($boardId: ID!, $name: String!, $values: JSON!) {
    create_item(board_id: $boardId, item_name: $name, column_values: $values) { id }
  }`;
  const values: Record<string, unknown> = {
    [CONTACT_US_COLUMNS.email]: profile.email,
    [CONTACT_US_COLUMNS.subscribed]: { label: "Subscribed" },
    [CONTACT_US_COLUMNS.comments]: `Klaviyo inbound intake | Profile ID: ${profile.id} | Source: ${source}`,
  };
  if (profile.firstName) values[CONTACT_US_COLUMNS.firstName] = profile.firstName;
  if (profile.lastName) values[CONTACT_US_COLUMNS.lastName] = profile.lastName;
  if (profile.phone) values[CONTACT_US_COLUMNS.phone] = profile.phone;
  if (profile.company) values[CONTACT_US_COLUMNS.company] = profile.company;

  const data = await mondayGraphql<{ create_item: { id: string } }>(mutation, {
    boardId: MONDAY_CONTACT_US_BOARD_ID,
    name: profile.email,
    values: JSON.stringify(values),
  });
  return data.create_item.id;
}

export function inboundSourceAllowed(source: string): source is ApprovedInboundSource {
  return INBOUND_SOURCES.has(source as ApprovedInboundSource);
}

export function outboundSourceAllowed(source: string): source is ApprovedOutboundSource {
  return OUTBOUND_SOURCES.has(source as ApprovedOutboundSource);
}

export function acquisitionFlowAllowed(flowId: string | null): boolean {
  const configured = (process.env.KLAVIYO_ACQUISITION_FLOW_IDS || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return configured.length > 0 && Boolean(flowId && configured.includes(flowId));
}

export async function processInboundKlaviyoIntake(params: {
  payload: KlaviyoIntakePayload;
  flowId: string | null;
  mode?: AcquisitionMode;
}) {
  const mode = params.mode === "apply" ? "apply" : "preview";
  if (!inboundSourceAllowed(params.payload.source)) throw new Error("Unapproved acquisition source.");
  if (!acquisitionFlowAllowed(params.flowId)) throw new Error("Unapproved Klaviyo acquisition flow.");

  const profile = await getKlaviyoProfileById(params.payload.profile_id);
  if (!profile.email) throw new Error("Klaviyo profile has no email; refusing CRM intake.");
  if (!profile.canReceiveMarketing || profile.consent === "UNSUBSCRIBED" || profile.suppressionReason) {
    return { ok: true, mode, action: "blocked-not-marketable", profileId: profile.id, email: profile.email } as const;
  }

  const matches = await findContactUsItemsByEmail(profile.email);
  if (matches.length > 1) throw new Error(`Multiple Contact Us items found for ${profile.email}; refusing duplicate intake.`);
  if (matches.length === 1) {
    return { ok: true, mode, action: "already-present", profileId: profile.id, email: profile.email, contactUsItemId: matches[0].id } as const;
  }

  if (mode === "preview") {
    return { ok: true, mode, action: "would-create", profileId: profile.id, email: profile.email, source: params.payload.source } as const;
  }

  const itemId = await createContactUsIntake(profile, params.payload.source);
  return { ok: true, mode, action: "created", profileId: profile.id, email: profile.email, source: params.payload.source, contactUsItemId: itemId } as const;
}

async function listMondayContactsByIds(ids: string[]): Promise<MondayContact[]> {
  if (ids.length === 0) return [];
  const query = `query ContactsByIds($ids: [ID!]!) {
    items(ids: $ids) {
      id name
      column_values(ids: ${JSON.stringify(Object.values(CONTACT_COLUMNS))}) { id text }
    }
  }`;
  const data = await mondayGraphql<{ items: Array<{ id: string; name: string; column_values: Array<{ id: string; text: string | null }> }> }>(query, { ids });
  return data.items.map((item) => {
    const text = (id: string) => item.column_values.find((c) => c.id === id)?.text?.trim() || null;
    return {
      id: item.id,
      name: item.name,
      email: (text(CONTACT_COLUMNS.email) || "").toLowerCase(),
      firstName: text(CONTACT_COLUMNS.firstName),
      lastName: text(CONTACT_COLUMNS.lastName),
      phone: text(CONTACT_COLUMNS.phone),
      status: text(CONTACT_COLUMNS.status),
      subscription: text(CONTACT_COLUMNS.subscription),
      region: text(CONTACT_COLUMNS.region),
      companyName: text(CONTACT_COLUMNS.companyName),
    };
  });
}

async function upsertKlaviyoProfile(contact: MondayContact, source: ApprovedOutboundSource): Promise<KlaviyoProfile> {
  const properties: Record<string, string> = {
    "Monday Contact ID": contact.id,
    "Acquisition Source": source,
  };
  if (contact.status) properties["CRM Status"] = contact.status;
  if (contact.region) properties.Region = contact.region;
  if (contact.companyName) properties.Company = contact.companyName;

  const attributes: Record<string, unknown> = {
    email: contact.email,
    properties,
  };
  if (contact.firstName) attributes.first_name = contact.firstName;
  if (contact.lastName) attributes.last_name = contact.lastName;
  if (contact.phone) attributes.phone_number = contact.phone;
  if (contact.companyName) attributes.organization = contact.companyName;

  const payload = await klaviyoFetch<{ data: any }>("/api/profile-import?additional-fields[profile]=subscriptions", {
    method: "POST",
    body: JSON.stringify({ data: { type: "profile", attributes } }),
  });
  return mapProfile(payload.data);
}

export async function syncMondayContactsToKlaviyo(request: ProfileSyncRequest) {
  const mode: AcquisitionMode = request.mode === "apply" ? "apply" : "preview";
  if (!outboundSourceAllowed(request.source)) throw new Error("Unapproved outbound source.");
  const ids = [...new Set(request.contactIds.map(String).map((v) => v.trim()).filter(Boolean))];
  if (ids.length === 0) throw new Error("At least one Monday Contact ID is required.");
  if (ids.length > 100) throw new Error("A maximum of 100 contacts may be processed per execution.");

  const contacts = await listMondayContactsByIds(ids);
  const byId = new Map(contacts.map((c) => [c.id, c]));
  const results: Array<Record<string, unknown>> = [];

  for (const id of ids) {
    const contact = byId.get(id);
    if (!contact) {
      results.push({ contactId: id, action: "blocked-missing-contact" });
      continue;
    }
    if (!contact.email) {
      results.push({ contactId: id, action: "blocked-missing-email" });
      continue;
    }

    const existing = await getKlaviyoProfileByEmail(contact.email);
    if (existing?.mondayContactId && existing.mondayContactId !== contact.id) {
      results.push({ contactId: id, email: contact.email, profileId: existing.id, action: "blocked-identity-conflict", existingMondayContactId: existing.mondayContactId });
      continue;
    }

    if (mode === "preview") {
      results.push({
        contactId: id,
        email: contact.email,
        profileId: existing?.id || null,
        action: existing ? "would-update" : "would-create",
        marketingConsentWillChange: false,
        existingConsent: existing?.consent || null,
        existingSuppression: existing?.suppressionReason || null,
      });
      continue;
    }

    const profile = await upsertKlaviyoProfile(contact, request.source);
    results.push({
      contactId: id,
      email: contact.email,
      profileId: profile.id,
      action: existing ? "updated" : "created",
      marketingConsentChanged: false,
      consent: profile.consent,
      suppression: profile.suppressionReason,
    });
  }

  return { ok: true, mode, source: request.source, requested: ids.length, processed: results.length, results };
}

export function internalAuthorized(req: Request): boolean {
  const secret = process.env.INTERNAL_API_SECRET;
  return Boolean(secret && req.headers.get("x-zp-secret") === secret);
}

export function intakeAuthorized(req: Request): boolean {
  const secret = process.env.KLAVIYO_INTAKE_SECRET;
  return Boolean(secret && req.headers.get("x-zp-intake-secret") === secret);
}

export const acquisitionConfig = {
  contactUsBoardId: MONDAY_CONTACT_US_BOARD_ID,
  contactsBoardId: MONDAY_CONTACTS_BOARD_ID,
};
