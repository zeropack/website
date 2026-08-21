import { KLAVIYO_API_REVISION, MONDAY_API_VERSION, MONDAY_CONTACTS_BOARD_ID } from "./config";

const MONDAY_CONTACT_US_BOARD_ID = 5029468391;
const MONDAY_LEADS_BOARD_ID = 5029468201;
const LEAD_CONTACT_RELATION = "board_relation_mm5gpfwm";

const CONTACT_US = {
  firstName: "text_mm5neh7s",
  lastName: "text_mm5gzfyz",
  email: "email",
  phone: "phone_mm5gn3m9",
  company: "text_mm6cb6x0",
  comments: "long_text",
  subscribed: "single_selecteohsebj",
} as const;

const CONTACT = {
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

const inboundSources = new Set<ApprovedInboundSource>([
  "Packaging Guide",
  "Newsletter",
  "Contact Us",
  "Typeform",
]);
const outboundSources = new Set<ApprovedOutboundSource>([
  "Lead Research",
  "Manual CRM",
  "Migration",
]);

export type KlaviyoIntakePayload = { profile_id: string; source: ApprovedInboundSource };
export type ProfileSyncRequest = { contactIds: string[]; source: ApprovedOutboundSource; mode?: AcquisitionMode };

type Profile = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  company: string | null;
  mondayContactId: string | null;
  acquisitionSource: string | null;
  canReceiveMarketing: boolean;
  consent: string | null;
  suppressionReason: string | null;
};

type Contact = {
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

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function monday<T>(query: string, variables: Record<string, unknown>): Promise<T> {
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
  if (!response.ok || !payload.data || payload.errors?.length) {
    throw new Error(`Monday API error: ${payload.errors?.map((e) => e.message).join("; ") || response.status}`);
  }
  return payload.data;
}

async function klaviyo<T>(pathOrUrl: string, init?: RequestInit): Promise<T> {
  const url = pathOrUrl.startsWith("https://") ? pathOrUrl : `https://a.klaviyo.com${pathOrUrl}`;
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

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function mapProfile(resource: any): Profile {
  const attrs = resource.attributes || {};
  const props = attrs.properties || {};
  const marketing = attrs.subscriptions?.email?.marketing || {};
  return {
    id: String(resource.id),
    email: String(attrs.email || "").trim().toLowerCase(),
    firstName: text(attrs.first_name),
    lastName: text(attrs.last_name),
    phone: text(attrs.phone_number),
    company: text(attrs.organization) || text(props.Company) || text(props["Company Name"]),
    mondayContactId: text(props["Monday Contact ID"]),
    acquisitionSource: text(props["Acquisition Source"]),
    canReceiveMarketing: marketing.can_receive_email_marketing === true,
    consent: text(marketing.consent),
    suppressionReason: text(marketing.suppression?.[0]?.reason),
  };
}

async function profileById(id: string): Promise<Profile> {
  const payload = await klaviyo<{ data: any }>(`/api/profiles/${encodeURIComponent(id)}?additional-fields[profile]=subscriptions`);
  return mapProfile(payload.data);
}

async function profileByEmail(email: string): Promise<Profile | null> {
  const params = new URLSearchParams({
    filter: `equals(email,"${email.replaceAll('"', '\\"')}")`,
    "additional-fields[profile]": "subscriptions",
  });
  const payload = await klaviyo<{ data: any[] }>(`/api/profiles?${params}`);
  if (!payload.data.length) return null;
  if (payload.data.length > 1) throw new Error(`Multiple Klaviyo profiles found for ${email}; refusing ambiguous sync.`);
  return mapProfile(payload.data[0]);
}

async function allProfiles(): Promise<Profile[]> {
  const params = new URLSearchParams({ "additional-fields[profile]": "subscriptions", "page[size]": "100" });
  let next: string | null = `/api/profiles?${params}`;
  const result: Profile[] = [];
  while (next) {
    const page: { data: any[]; links?: { next?: string | null } } = await klaviyo(next);
    result.push(...page.data.map(mapProfile));
    next = page.links?.next || null;
  }
  return result;
}

async function contactUsMatches(email: string) {
  const query = `query ContactUsByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(board_id: $boardId, limit: 10, columns: [{column_id: "${CONTACT_US.email}", column_values: [$email]}]) {
      items { id }
    }
  }`;
  const data = await monday<{ items_page_by_column_values: { items: Array<{ id: string }> } }>(query, {
    boardId: MONDAY_CONTACT_US_BOARD_ID,
    email,
  });
  return data.items_page_by_column_values.items;
}

async function createContactUs(profile: Profile, source: ApprovedInboundSource) {
  const values: Record<string, unknown> = {
    [CONTACT_US.email]: profile.email,
    [CONTACT_US.subscribed]: { label: "Subscribed" },
    [CONTACT_US.comments]: `Klaviyo inbound intake | Profile ID: ${profile.id} | Source: ${source}`,
  };
  if (profile.firstName) values[CONTACT_US.firstName] = profile.firstName;
  if (profile.lastName) values[CONTACT_US.lastName] = profile.lastName;
  if (profile.phone) values[CONTACT_US.phone] = profile.phone;
  if (profile.company) values[CONTACT_US.company] = profile.company;

  const mutation = `mutation CreateContactUs($boardId: ID!, $name: String!, $values: JSON!) {
    create_item(board_id: $boardId, item_name: $name, column_values: $values) { id }
  }`;
  const data = await monday<{ create_item: { id: string } }>(mutation, {
    boardId: MONDAY_CONTACT_US_BOARD_ID,
    name: profile.email,
    values: JSON.stringify(values),
  });
  return data.create_item.id;
}

export function inboundSourceAllowed(source: string): source is ApprovedInboundSource {
  return inboundSources.has(source as ApprovedInboundSource);
}
export function outboundSourceAllowed(source: string): source is ApprovedOutboundSource {
  return outboundSources.has(source as ApprovedOutboundSource);
}
export function acquisitionFlowAllowed(flowId: string | null) {
  const allowed = (process.env.KLAVIYO_ACQUISITION_FLOW_IDS || "").split(",").map((v) => v.trim()).filter(Boolean);
  return allowed.length > 0 && Boolean(flowId && allowed.includes(flowId));
}

async function intakeProfile(profile: Profile, source: ApprovedInboundSource, mode: AcquisitionMode) {
  if (!profile.email) throw new Error("Klaviyo profile has no email; refusing CRM intake.");
  if (!profile.canReceiveMarketing || profile.consent === "UNSUBSCRIBED" || profile.suppressionReason) {
    return { action: "blocked-not-marketable", profileId: profile.id, email: profile.email };
  }
  const matches = await contactUsMatches(profile.email);
  if (matches.length > 1) throw new Error(`Multiple Contact Us items found for ${profile.email}; refusing duplicate intake.`);
  if (matches.length === 1) return { action: "already-present", profileId: profile.id, email: profile.email, contactUsItemId: matches[0].id };
  if (mode === "preview") return { action: "would-create", profileId: profile.id, email: profile.email, source };
  const contactUsItemId = await createContactUs(profile, source);
  return { action: "created", profileId: profile.id, email: profile.email, source, contactUsItemId };
}

export async function processInboundKlaviyoIntake(params: { payload: KlaviyoIntakePayload; flowId: string | null; mode?: AcquisitionMode }) {
  const mode: AcquisitionMode = params.mode === "apply" ? "apply" : "preview";
  if (!inboundSourceAllowed(params.payload.source)) throw new Error("Unapproved acquisition source.");
  if (!acquisitionFlowAllowed(params.flowId)) throw new Error("Unapproved Klaviyo acquisition flow.");
  const result = await intakeProfile(await profileById(params.payload.profile_id), params.payload.source, mode);
  return { ok: true, mode, ...result };
}

export async function recoverApprovedInboundProfiles(mode: AcquisitionMode) {
  const profiles = await allProfiles();
  const results: Array<Record<string, unknown>> = [];
  for (const profile of profiles) {
    if (profile.mondayContactId) continue;
    if (!profile.acquisitionSource || !inboundSourceAllowed(profile.acquisitionSource)) continue;
    results.push(await intakeProfile(profile, profile.acquisitionSource, mode));
  }
  return { scanned: profiles.length, eligible: results.length, results };
}

async function contactsByIds(ids: string[]): Promise<Contact[]> {
  if (!ids.length) return [];
  const query = `query ContactsByIds($ids: [ID!]!) {
    items(ids: $ids) { id name column_values(ids: ${JSON.stringify(Object.values(CONTACT))}) { id text } }
  }`;
  const data = await monday<{ items: Array<{ id: string; name: string; column_values: Array<{ id: string; text: string | null }> }> }>(query, { ids });
  return data.items.map((item) => {
    const get = (id: string) => item.column_values.find((c) => c.id === id)?.text?.trim() || null;
    return {
      id: item.id,
      name: item.name,
      email: (get(CONTACT.email) || "").toLowerCase(),
      firstName: get(CONTACT.firstName),
      lastName: get(CONTACT.lastName),
      phone: get(CONTACT.phone),
      status: get(CONTACT.status),
      subscription: get(CONTACT.subscription),
      region: get(CONTACT.region),
      companyName: get(CONTACT.companyName),
    };
  });
}

async function upsertProfile(contact: Contact, source: ApprovedOutboundSource, existing: Profile | null) {
  const properties: Record<string, string> = { "Monday Contact ID": contact.id };
  if (!existing?.acquisitionSource) properties["Acquisition Source"] = source;
  if (contact.status) properties["CRM Status"] = contact.status;
  if (contact.region) properties.Region = contact.region;
  if (contact.companyName) properties.Company = contact.companyName;

  const attributes: Record<string, unknown> = { email: contact.email, properties };
  if (contact.firstName) attributes.first_name = contact.firstName;
  if (contact.lastName) attributes.last_name = contact.lastName;
  if (contact.phone) attributes.phone_number = contact.phone;
  if (contact.companyName) attributes.organization = contact.companyName;

  const payload = await klaviyo<{ data: any }>("/api/profile-import?additional-fields[profile]=subscriptions", {
    method: "POST",
    body: JSON.stringify({ data: { type: "profile", attributes } }),
  });
  return mapProfile(payload.data);
}

export async function syncMondayContactsToKlaviyo(request: ProfileSyncRequest) {
  const mode: AcquisitionMode = request.mode === "apply" ? "apply" : "preview";
  if (!outboundSourceAllowed(request.source)) throw new Error("Unapproved outbound source.");
  const ids = [...new Set(request.contactIds.map(String).map((v) => v.trim()).filter(Boolean))];
  if (!ids.length) throw new Error("At least one Monday Contact ID is required.");
  if (ids.length > 100) throw new Error("A maximum of 100 contacts may be processed per execution.");

  const contacts = await contactsByIds(ids);
  const byId = new Map(contacts.map((c) => [c.id, c]));
  const results: Array<Record<string, unknown>> = [];
  for (const id of ids) {
    const contact = byId.get(id);
    if (!contact) { results.push({ contactId: id, action: "blocked-missing-contact" }); continue; }
    if (!contact.email) { results.push({ contactId: id, action: "blocked-missing-email" }); continue; }

    const existing = await profileByEmail(contact.email);
    if (existing?.mondayContactId && existing.mondayContactId !== contact.id) {
      results.push({ contactId: id, email: contact.email, profileId: existing.id, action: "blocked-identity-conflict", existingMondayContactId: existing.mondayContactId });
      continue;
    }
    if (mode === "preview") {
      results.push({ contactId: id, email: contact.email, profileId: existing?.id || null, action: existing ? "would-update" : "would-create", marketingConsentWillChange: false, acquisitionSourceWillRemain: existing?.acquisitionSource || request.source, existingConsent: existing?.consent || null, existingSuppression: existing?.suppressionReason || null });
      continue;
    }
    const profile = await upsertProfile(contact, request.source, existing);
    results.push({ contactId: id, email: contact.email, profileId: profile.id, action: existing ? "updated" : "created", marketingConsentChanged: false, acquisitionSource: profile.acquisitionSource, consent: profile.consent, suppression: profile.suppressionReason });
  }
  return { ok: true, mode, source: request.source, requested: ids.length, processed: results.length, results };
}

async function recentCreatedContactIds(from: Date, to: Date): Promise<string[]> {
  const fromDate = from.toISOString().slice(0, 10);
  const toDate = to.toISOString().slice(0, 10);
  const query = `query RecentContacts($boardId: ID!, $cursor: String) {
    boards(ids: [$boardId]) {
      items_page(limit: 500, cursor: $cursor, query_params: { rules: [{ column_id: "creation_log", compare_attribute: "CREATED_AT", compare_value: ["${fromDate}", "${toDate}"], operator: between }] }) {
        cursor items { id created_at }
      }
    }
  }`;
  const ids: string[] = [];
  let cursor: string | null = null;
  do {
    const data: { boards: Array<{ items_page: { cursor: string | null; items: Array<{ id: string; created_at: string }> } }> } = await monday(query, { boardId: MONDAY_CONTACTS_BOARD_ID, cursor });
    const page = data.boards[0]?.items_page;
    if (!page) break;
    for (const item of page.items) if (new Date(item.created_at) >= from && new Date(item.created_at) <= to) ids.push(item.id);
    cursor = page.cursor;
  } while (cursor);
  return ids;
}

async function recentLeadContactIds(from: Date, to: Date): Promise<string[]> {
  const query = `query RecentLeads($boardId: ID!) {
    boards(ids: [$boardId]) {
      items_page(limit: 500) {
        items { id created_at column_values(ids: ["${LEAD_CONTACT_RELATION}"]) { id ... on BoardRelationValue { linked_item_ids } } }
      }
    }
  }`;
  const data = await monday<{ boards: Array<{ items_page: { items: Array<{ id: string; created_at: string; column_values: Array<{ id: string; linked_item_ids?: string[] }> }> } }> }>(query, { boardId: MONDAY_LEADS_BOARD_ID });
  const ids: string[] = [];
  for (const item of data.boards[0]?.items_page.items || []) {
    const created = new Date(item.created_at);
    if (created < from || created > to) continue;
    ids.push(...(item.column_values.find((c) => c.id === LEAD_CONTACT_RELATION)?.linked_item_ids || []).map(String));
  }
  return ids;
}

export async function recoverRecentOutboundProfiles(mode: AcquisitionMode, options: { cutoverAt: string; lookbackHours?: number }) {
  const cutover = new Date(options.cutoverAt);
  if (Number.isNaN(cutover.getTime())) throw new Error("Invalid profile sync cutover timestamp.");
  const now = new Date();
  const lookback = new Date(now.getTime() - (options.lookbackHours ?? 72) * 60 * 60 * 1000);
  const from = cutover > lookback ? cutover : lookback;

  const [createdContacts, leadContacts] = await Promise.all([
    recentCreatedContactIds(from, now),
    recentLeadContactIds(from, now),
  ]);
  const leadSet = new Set(leadContacts);
  const manualOnly = [...new Set(createdContacts)].filter((id) => !leadSet.has(id));
  const leadIds = [...leadSet];

  const manual = manualOnly.length ? await syncMondayContactsToKlaviyo({ contactIds: manualOnly.slice(0, 100), source: "Manual CRM", mode }) : null;
  const leadResearch = leadIds.length ? await syncMondayContactsToKlaviyo({ contactIds: leadIds.slice(0, 100), source: "Lead Research", mode }) : null;
  return { from: from.toISOString(), to: now.toISOString(), manual, leadResearch };
}

export function internalAuthorized(req: Request) {
  const secret = process.env.INTERNAL_API_SECRET;
  return Boolean(secret && req.headers.get("x-zp-secret") === secret);
}
export function intakeAuthorized(req: Request) {
  const secret = process.env.KLAVIYO_INTAKE_SECRET;
  return Boolean(secret && req.headers.get("x-zp-intake-secret") === secret);
}
