import { KLAVIYO_API_REVISION, MONDAY_API_VERSION, MONDAY_CONTACTS_BOARD_ID } from "./config";

export type AcquisitionMode = "preview" | "apply";
export type ApprovedInboundSource = "Packaging Guide" | "Newsletter" | "Contact Us" | "Typeform";
export type KlaviyoIntakePayload = { profile_id: string; source: ApprovedInboundSource };

const MONDAY_CONTACT_US_BOARD_ID = 5029468391;
const MONDAY_LEADS_BOARD_ID = 5029468201;
const CONTACT_PROSPECTS_GROUP = "group_mm62szd3";
const LEAD_INBOUND_GROUP = "topics";

const CONTACT = {
  firstName: "text_mm5n6d0w",
  lastName: "text_mm4pxvbs",
  email: "contact_email",
  phone: "contact_phone",
  type: "status",
  status: "color_mm5gwvh2",
  subscription: "color_mm69w7w7",
  comments: "long_text4",
  companyName: "text_mm694vax",
  company: "contact_account",
} as const;

const LEAD = {
  contact: "board_relation_mm5gpfwm",
  company: "board_relation_mm698yk1",
  email: "lead_email",
  firstName: "text_mm4q6q7x",
  lastName: "text_mm4qzr9k",
  phone: "lead_phone",
  status: "lead_status",
  source: "color_mkyb8krc",
  country: "text_mm4q4v9d",
  packagingType: "text_mm4q90j3",
  quantity: "numeric_mm4qqc15",
  dimensions: "text_mm4qe675",
  printRequirements: "text_mm4qas74",
  targetDelivery: "date_mm4q1xx6",
  additionalRequirements: "text_mm4qr0a6",
  companyWebsite: "text_mm5n94p3",
  companyName: "text_mm5n9hyd",
} as const;

const CONTACT_US = {
  firstName: "text_mm5neh7s",
  lastName: "text_mm5gzfyz",
  email: "email",
  phone: "phone_mm5gn3m9",
  company: "text5",
  comments: "long_text",
  subscribed: "single_selecteohsebj",
} as const;

const APPROVED_SOURCES = new Set<ApprovedInboundSource>([
  "Packaging Guide",
  "Newsletter",
  "Contact Us",
  "Typeform",
]);

const ACTIVE_LEAD_STATUSES = new Set([
  "New",
  "New Lead",
  "Contacted",
  "Engaged",
  "Qualified",
  "Quote Requested",
  "Quote Sent",
  "Negotiating",
]);

type Profile = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  company: string | null;
  acquisitionSource: string | null;
  leadSource: string | null;
  mondayContactId: string | null;
  properties: Record<string, unknown>;
  canReceiveMarketing: boolean;
  consent: string | null;
  suppressionReason: string | null;
};

type MondayContact = {
  id: string;
  status: string | null;
  companyIds: string[];
};

type MondayLead = {
  id: string;
  status: string | null;
};

function requiredEnv(name: string): string {
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

async function klaviyo<T>(pathOrUrl: string): Promise<T> {
  const url = pathOrUrl.startsWith("https://") ? pathOrUrl : `https://a.klaviyo.com${pathOrUrl}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Klaviyo-API-Key ${requiredEnv("KLAVIYO_PRIVATE_API_KEY")}`,
      accept: "application/vnd.api+json",
      revision: KLAVIYO_API_REVISION,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Klaviyo API error ${response.status}: ${body.slice(0, 600)}`);
  }
  return (await response.json()) as T;
}

function text(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function prop(properties: Record<string, unknown>, ...names: string[]): string | null {
  for (const name of names) {
    const value = text(properties[name]);
    if (value) return value;
  }
  return null;
}

function mapProfile(resource: any): Profile {
  const attrs = resource.attributes || {};
  const properties = (attrs.properties || {}) as Record<string, unknown>;
  const marketing = attrs.subscriptions?.email?.marketing || {};
  return {
    id: String(resource.id),
    email: String(attrs.email || "").trim().toLowerCase(),
    firstName: text(attrs.first_name) || prop(properties, "First Name", "first_name"),
    lastName: text(attrs.last_name) || prop(properties, "Last Name", "last_name"),
    phone: text(attrs.phone_number) || prop(properties, "Contact Number", "Phone", "phone"),
    company: text(attrs.organization) || prop(properties, "Company Name", "Company"),
    acquisitionSource: prop(properties, "Acquisition Source", "acquisition_source"),
    leadSource: prop(properties, "Lead Source", "lead_source"),
    mondayContactId: prop(properties, "Monday Contact ID"),
    properties,
    canReceiveMarketing: marketing.can_receive_email_marketing === true,
    consent: text(marketing.consent),
    suppressionReason: text(marketing.suppression?.[0]?.reason),
  };
}

async function profileById(id: string): Promise<Profile> {
  const payload = await klaviyo<{ data: any }>(
    `/api/profiles/${encodeURIComponent(id)}?additional-fields[profile]=subscriptions`,
  );
  return mapProfile(payload.data);
}

async function allProfiles(): Promise<Profile[]> {
  const params = new URLSearchParams({
    "additional-fields[profile]": "subscriptions",
    "page[size]": "100",
  });
  let next: string | null = `/api/profiles?${params.toString()}`;
  const result: Profile[] = [];
  while (next) {
    const page: { data: any[]; links?: { next?: string | null } } = await klaviyo(next);
    result.push(...page.data.map(mapProfile));
    next = page.links?.next || null;
  }
  return result;
}

export function inboundSourceAllowed(source: string): source is ApprovedInboundSource {
  return APPROVED_SOURCES.has(source as ApprovedInboundSource);
}

export function acquisitionFlowAllowed(flowId: string | null): boolean {
  const allowed = (process.env.KLAVIYO_ACQUISITION_FLOW_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return allowed.length > 0 && Boolean(flowId && allowed.includes(flowId));
}

export function intakeAuthorized(req: Request): boolean {
  const secret = process.env.KLAVIYO_INTAKE_SECRET;
  return Boolean(secret && req.headers.get("x-zp-intake-secret") === secret);
}

function marketable(profile: Profile): boolean {
  return Boolean(
    profile.email &&
      profile.canReceiveMarketing &&
      profile.consent !== "UNSUBSCRIBED" &&
      !profile.suppressionReason,
  );
}

function rfqValue(profile: Profile, ...names: string[]): string | null {
  return prop(profile.properties, ...names);
}

function isWebsiteRfq(profile: Profile, source?: ApprovedInboundSource): boolean {
  const routeSaysTypeform = source === "Typeform";
  const sourceSaysTypeform = profile.acquisitionSource?.toLowerCase() === "typeform";
  const leadSaysWebsite = ["website", "typeform"].includes((profile.leadSource || "").toLowerCase());
  const hasRfqData = Boolean(
    rfqValue(
      profile,
      "What type of Packaging are you looking for?",
      "Packaging Type",
      "packaging_type",
    ) ||
      rfqValue(
        profile,
        "What is your estimated order quantity or MOQ requirement?",
        "Estimated Order Quantity",
        "quantity",
      ),
  );
  return routeSaysTypeform || sourceSaysTypeform || (leadSaysWebsite && hasRfqData);
}

async function contactMatches(email: string): Promise<MondayContact[]> {
  const query = `query ContactByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(board_id: $boardId, limit: 10, columns: [{column_id: "${CONTACT.email}", column_values: [$email]}]) {
      items {
        id
        column_values(ids: ["${CONTACT.status}", "${CONTACT.company}"]) {
          id
          text
          ... on BoardRelationValue { linked_item_ids }
        }
      }
    }
  }`;
  const data = await monday<{
    items_page_by_column_values: {
      items: Array<{
        id: string;
        column_values: Array<{ id: string; text?: string | null; linked_item_ids?: string[] }>;
      }>;
    };
  }>(query, { boardId: MONDAY_CONTACTS_BOARD_ID, email });
  return data.items_page_by_column_values.items.map((item) => ({
    id: item.id,
    status: item.column_values.find((column) => column.id === CONTACT.status)?.text || null,
    companyIds:
      item.column_values.find((column) => column.id === CONTACT.company)?.linked_item_ids?.map(String) || [],
  }));
}

async function leadMatches(email: string): Promise<MondayLead[]> {
  const query = `query LeadByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(board_id: $boardId, limit: 25, columns: [{column_id: "${LEAD.email}", column_values: [$email]}]) {
      items { id column_values(ids: ["${LEAD.status}"]) { id text } }
    }
  }`;
  const data = await monday<{
    items_page_by_column_values: {
      items: Array<{ id: string; column_values: Array<{ id: string; text?: string | null }> }>;
    };
  }>(query, { boardId: MONDAY_LEADS_BOARD_ID, email });
  return data.items_page_by_column_values.items.map((item) => ({
    id: item.id,
    status: item.column_values.find((column) => column.id === LEAD.status)?.text || null,
  }));
}

async function createContact(profile: Profile): Promise<MondayContact> {
  const values: Record<string, unknown> = {
    [CONTACT.email]: profile.email,
    [CONTACT.type]: { label: "Primary Contact" },
    [CONTACT.status]: { label: "New Lead" },
    [CONTACT.subscription]: { label: "Subscribed" },
    [CONTACT.comments]: `Website RFQ via Klaviyo | Profile ID: ${profile.id}`,
  };
  if (profile.firstName) values[CONTACT.firstName] = profile.firstName;
  if (profile.lastName) values[CONTACT.lastName] = profile.lastName;
  if (profile.phone) values[CONTACT.phone] = profile.phone;
  if (profile.company) values[CONTACT.companyName] = profile.company;

  const mutation = `mutation CreateContact($boardId: ID!, $groupId: String!, $name: String!, $values: JSON!) {
    create_item(board_id: $boardId, group_id: $groupId, item_name: $name, column_values: $values) { id }
  }`;
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email;
  const data = await monday<{ create_item: { id: string } }>(mutation, {
    boardId: MONDAY_CONTACTS_BOARD_ID,
    groupId: CONTACT_PROSPECTS_GROUP,
    name,
    values: JSON.stringify(values),
  });
  return { id: data.create_item.id, status: "New Lead", companyIds: [] };
}

async function updateContactForRfq(contact: MondayContact, profile: Profile): Promise<void> {
  if (contact.status === "Blacklisted") {
    throw new Error(`Contact ${contact.id} is Blacklisted; refusing automatic RFQ reactivation.`);
  }
  const values: Record<string, unknown> = {
    [CONTACT.subscription]: { label: "Subscribed" },
  };
  if (contact.status !== "RFQ Requested") values[CONTACT.status] = { label: "RFQ Requested" };
  if (profile.firstName) values[CONTACT.firstName] = profile.firstName;
  if (profile.lastName) values[CONTACT.lastName] = profile.lastName;
  if (profile.phone) values[CONTACT.phone] = profile.phone;
  if (profile.company) values[CONTACT.companyName] = profile.company;

  const mutation = `mutation UpdateContact($boardId: ID!, $itemId: ID!, $values: JSON!) {
    change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $values) { id }
  }`;
  await monday(mutation, {
    boardId: MONDAY_CONTACTS_BOARD_ID,
    itemId: contact.id,
    values: JSON.stringify(values),
  });
}

function leadValues(profile: Profile, contact: MondayContact): Record<string, unknown> {
  const values: Record<string, unknown> = {
    [LEAD.email]: profile.email,
    [LEAD.status]: { label: "Quote Requested" },
    [LEAD.source]: { label: "Website" },
    [LEAD.contact]: { item_ids: [contact.id] },
  };
  if (contact.companyIds.length === 1) values[LEAD.company] = { item_ids: contact.companyIds };
  if (profile.firstName) values[LEAD.firstName] = profile.firstName;
  if (profile.lastName) values[LEAD.lastName] = profile.lastName;
  if (profile.phone) values[LEAD.phone] = profile.phone;
  if (profile.company) values[LEAD.companyName] = profile.company;

  const mappings: Array<[string, string | null]> = [
    [LEAD.country, rfqValue(profile, "Country", "country")],
    [LEAD.companyWebsite, rfqValue(profile, "Company Website", "company_website")],
    [
      LEAD.packagingType,
      rfqValue(profile, "What type of Packaging are you looking for?", "Packaging Type", "packaging_type"),
    ],
    [
      LEAD.quantity,
      rfqValue(profile, "What is your estimated order quantity or MOQ requirement?", "Estimated Order Quantity", "quantity"),
    ],
    [
      LEAD.dimensions,
      rfqValue(profile, "What are your required packaging dimensions?", "Packaging Dimensions", "dimensions"),
    ],
    [
      LEAD.printRequirements,
      rfqValue(profile, "Do you have specific printing or branding requirements?", "Printing Requirements", "print_requirements"),
    ],
    [LEAD.targetDelivery, rfqValue(profile, "What is your target delivery timeline?", "Target Delivery Timeline", "target_delivery")],
    [
      LEAD.additionalRequirements,
      rfqValue(profile, "Let us know if you have any additional requirements.", "Additional Requirements", "additional_requirements"),
    ],
  ];
  for (const [column, value] of mappings) {
    if (!value) continue;
    values[column] = column === LEAD.targetDelivery ? { date: value.slice(0, 10) } : value;
  }
  return values;
}

async function createLead(profile: Profile, contact: MondayContact): Promise<string> {
  const mutation = `mutation CreateLead($boardId: ID!, $groupId: String!, $name: String!, $values: JSON!) {
    create_item(board_id: $boardId, group_id: $groupId, item_name: $name, column_values: $values) { id }
  }`;
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email;
  const data = await monday<{ create_item: { id: string } }>(mutation, {
    boardId: MONDAY_LEADS_BOARD_ID,
    groupId: LEAD_INBOUND_GROUP,
    name,
    values: JSON.stringify(leadValues(profile, contact)),
  });
  return data.create_item.id;
}

async function updateLead(lead: MondayLead, profile: Profile, contact: MondayContact): Promise<void> {
  const values = leadValues(profile, contact);
  if (lead.status === "Quote Requested") delete values[LEAD.status];
  const mutation = `mutation UpdateLead($boardId: ID!, $itemId: ID!, $values: JSON!) {
    change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $values) { id }
  }`;
  await monday(mutation, {
    boardId: MONDAY_LEADS_BOARD_ID,
    itemId: lead.id,
    values: JSON.stringify(values),
  });
}

async function processWebsiteRfq(profile: Profile, mode: AcquisitionMode) {
  if (!profile.email) throw new Error("Klaviyo profile has no email; refusing RFQ intake.");
  if (!marketable(profile)) {
    return { action: "blocked-not-marketable", profileId: profile.id, email: profile.email };
  }

  const contacts = await contactMatches(profile.email);
  if (contacts.length > 1) {
    throw new Error(`Multiple Monday Contacts found for ${profile.email}; refusing ambiguous RFQ intake.`);
  }
  const existingLeads = await leadMatches(profile.email);
  const activeLeads = existingLeads.filter((lead) => !lead.status || ACTIVE_LEAD_STATUSES.has(lead.status));
  if (activeLeads.length > 1) {
    throw new Error(`Multiple active Monday Leads found for ${profile.email}; refusing ambiguous RFQ intake.`);
  }

  if (mode === "preview") {
    return {
      action: contacts.length ? "would-update-contact-and-upsert-lead" : "would-create-contact-and-lead",
      profileId: profile.id,
      email: profile.email,
      existingContactId: contacts[0]?.id || null,
      existingLeadId: activeLeads[0]?.id || null,
      leadSource: "Website",
      contactLifecycleTarget: "RFQ Requested",
      leadStatusTarget: "Quote Requested",
    };
  }

  const contact = contacts[0] || (await createContact(profile));
  await updateContactForRfq(contact, profile);

  let leadId: string;
  if (activeLeads[0]) {
    await updateLead(activeLeads[0], profile, contact);
    leadId = activeLeads[0].id;
  } else {
    leadId = await createLead(profile, contact);
  }

  return {
    action: contacts.length ? (activeLeads[0] ? "updated-contact-and-lead" : "updated-contact-created-lead") : "created-contact-and-lead",
    profileId: profile.id,
    email: profile.email,
    contactId: contact.id,
    leadId,
    leadSource: "Website",
    contactLifecycle: "RFQ Requested",
    leadStatus: "Quote Requested",
  };
}

async function contactUsMatches(email: string): Promise<Array<{ id: string }>> {
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

async function processGeneralInbound(profile: Profile, source: Exclude<ApprovedInboundSource, "Typeform">, mode: AcquisitionMode) {
  if (!profile.email) throw new Error("Klaviyo profile has no email; refusing CRM intake.");
  if (!marketable(profile)) {
    return { action: "blocked-not-marketable", profileId: profile.id, email: profile.email };
  }
  const matches = await contactUsMatches(profile.email);
  if (matches.length > 1) throw new Error(`Multiple Contact Us items found for ${profile.email}; refusing duplicate intake.`);
  if (matches.length === 1) {
    return { action: "already-present", profileId: profile.id, email: profile.email, contactUsItemId: matches[0].id };
  }
  if (mode === "preview") return { action: "would-create-contact-us", profileId: profile.id, email: profile.email, source };

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
  return { action: "created-contact-us", profileId: profile.id, email: profile.email, source, contactUsItemId: data.create_item.id };
}

async function processProfile(profile: Profile, source: ApprovedInboundSource, mode: AcquisitionMode) {
  if (source === "Typeform" || isWebsiteRfq(profile, source)) return processWebsiteRfq(profile, mode);
  return processGeneralInbound(profile, source, mode);
}

export async function processInboundKlaviyoIntake(params: {
  payload: KlaviyoIntakePayload;
  flowId: string | null;
  mode?: AcquisitionMode;
}) {
  const mode: AcquisitionMode = params.mode === "apply" ? "apply" : "preview";
  if (!inboundSourceAllowed(params.payload.source)) throw new Error("Unapproved acquisition source.");
  if (!acquisitionFlowAllowed(params.flowId)) throw new Error("Unapproved Klaviyo acquisition flow.");
  const result = await processProfile(await profileById(params.payload.profile_id), params.payload.source, mode);
  return { ok: true, mode, ...result };
}

function resolvedSource(profile: Profile): ApprovedInboundSource | null {
  if (isWebsiteRfq(profile)) return "Typeform";
  const source = profile.acquisitionSource;
  return source && inboundSourceAllowed(source) ? source : null;
}

export async function recoverApprovedInboundProfiles(mode: AcquisitionMode) {
  const profiles = await allProfiles();
  const results: Array<Record<string, unknown>> = [];
  for (const profile of profiles) {
    const source = resolvedSource(profile);
    if (!source) continue;
    if (source !== "Typeform" && profile.mondayContactId) continue;
    results.push(await processProfile(profile, source, mode));
  }
  return { scanned: profiles.length, eligible: results.length, results };
}
