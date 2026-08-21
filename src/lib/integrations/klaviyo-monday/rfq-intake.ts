import { KLAVIYO_API_REVISION, MONDAY_API_VERSION, MONDAY_CONTACTS_BOARD_ID } from "./config";

export type RfqIntakeMode = "preview" | "apply";

const MONDAY_LEADS_BOARD_ID = 5029468201;
const CONTACT_PROSPECTS_GROUP = "group_mm62szd3";
const LEAD_INBOUND_GROUP = "topics";

const CONTACT = {
  firstName: "text_mm5n6d0w",
  lastName: "text_mm4pxvbs",
  email: "contact_email",
  phone: "contact_phone",
  type: "status",
  lifecycle: "color_mm5gwvh2",
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
  utmSource: "text_mm5n94p3",
  utmMedium: "text_mm5n9hyd",
  utmCampaign: "text_mm5nng7t",
  utmContent: "text_mm5n4b3n",
} as const;

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

type Contact = {
  id: string;
  lifecycle: string | null;
  companyIds: string[];
};

type Lead = { id: string; status: string | null };

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
    throw new Error(`Monday API error: ${payload.errors?.map((error) => error.message).join("; ") || response.status}`);
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
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function property(properties: Record<string, unknown>, ...names: string[]): string | null {
  for (const name of names) {
    const value = text(properties[name]);
    if (value) return value;
  }
  return null;
}

function mapProfile(resource: any): Profile {
  const attributes = resource.attributes || {};
  const properties = (attributes.properties || {}) as Record<string, unknown>;
  const marketing = attributes.subscriptions?.email?.marketing || {};
  return {
    id: String(resource.id),
    email: String(attributes.email || "").trim().toLowerCase(),
    firstName: text(attributes.first_name) || property(properties, "First Name", "first_name"),
    lastName: text(attributes.last_name) || property(properties, "Last Name", "last_name"),
    phone: text(attributes.phone_number) || property(properties, "Contact Number", "Phone", "phone"),
    company: text(attributes.organization) || property(properties, "Company Name", "Company"),
    acquisitionSource: property(properties, "Acquisition Source", "acquisition_source"),
    leadSource: property(properties, "Lead Source", "lead_source"),
    mondayContactId: property(properties, "Monday Contact ID"),
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
  const profiles: Profile[] = [];
  while (next) {
    const page: { data: any[]; links?: { next?: string | null } } = await klaviyo(next);
    profiles.push(...page.data.map(mapProfile));
    next = page.links?.next || null;
  }
  return profiles;
}

function rfqProperty(profile: Profile, ...names: string[]): string | null {
  return property(profile.properties, ...names);
}

export function isWebsiteRfqProfile(profile: Profile): boolean {
  const typeform = profile.acquisitionSource?.toLowerCase() === "typeform";
  const websiteSource = ["website", "typeform"].includes((profile.leadSource || "").toLowerCase());
  const hasRfqFields = Boolean(
    rfqProperty(profile, "What type of Packaging are you looking for?", "Packaging Type", "packaging_type") ||
      rfqProperty(
        profile,
        "What is your estimated order quantity or MOQ requirement?",
        "Estimated Order Quantity",
        "quantity",
      ),
  );
  return typeform || (websiteSource && hasRfqFields);
}

function subscriptionLabel(profile: Profile): "Subscribed" | "Pending" | "Unsubscribed" {
  if (profile.canReceiveMarketing && profile.consent !== "UNSUBSCRIBED" && !profile.suppressionReason) return "Subscribed";
  if (profile.consent === "PENDING") return "Pending";
  return "Unsubscribed";
}

async function contactsByEmail(email: string): Promise<Contact[]> {
  const query = `query ContactByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(board_id: $boardId, limit: 10, columns: [{column_id: "${CONTACT.email}", column_values: [$email]}]) {
      items {
        id
        column_values(ids: ["${CONTACT.lifecycle}", "${CONTACT.company}"]) {
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
    lifecycle: item.column_values.find((column) => column.id === CONTACT.lifecycle)?.text || null,
    companyIds:
      item.column_values.find((column) => column.id === CONTACT.company)?.linked_item_ids?.map(String) || [],
  }));
}

async function leadsByEmail(email: string): Promise<Lead[]> {
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

async function createContact(profile: Profile): Promise<Contact> {
  const values: Record<string, unknown> = {
    [CONTACT.email]: profile.email,
    [CONTACT.type]: { label: "Primary Contact" },
    [CONTACT.lifecycle]: { label: "New Lead" },
    [CONTACT.subscription]: { label: subscriptionLabel(profile) },
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
  return { id: data.create_item.id, lifecycle: "New Lead", companyIds: [] };
}

async function moveContactToRfq(contact: Contact, profile: Profile): Promise<void> {
  if (contact.lifecycle === "Blacklisted") {
    throw new Error(`Contact ${contact.id} is Blacklisted; refusing automatic RFQ reactivation.`);
  }
  const values: Record<string, unknown> = {
    [CONTACT.subscription]: { label: subscriptionLabel(profile) },
  };
  if (contact.lifecycle !== "RFQ Requested") values[CONTACT.lifecycle] = { label: "RFQ Requested" };
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

function leadValues(profile: Profile, contact: Contact): Record<string, unknown> {
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

  const textMappings: Array<[string, string | null]> = [
    [LEAD.country, rfqProperty(profile, "Country", "country")],
    [LEAD.packagingType, rfqProperty(profile, "What type of Packaging are you looking for?", "Packaging Type", "packaging_type")],
    [LEAD.dimensions, rfqProperty(profile, "What are your required packaging dimensions?", "Packaging Dimensions", "dimensions")],
    [LEAD.printRequirements, rfqProperty(profile, "Do you have specific printing or branding requirements?", "Printing Requirements", "print_requirements")],
    [LEAD.additionalRequirements, rfqProperty(profile, "Let us know if you have any additional requirements.", "Additional Requirements", "additional_requirements")],
    [LEAD.utmSource, rfqProperty(profile, "utm_source")],
    [LEAD.utmMedium, rfqProperty(profile, "utm_medium")],
    [LEAD.utmCampaign, rfqProperty(profile, "utm_campaign")],
    [LEAD.utmContent, rfqProperty(profile, "utm_content")],
  ];
  for (const [column, value] of textMappings) if (value) values[column] = value;

  const quantity = rfqProperty(
    profile,
    "What is your estimated order quantity or MOQ requirement?",
    "Estimated Order Quantity",
    "quantity",
  );
  if (quantity) {
    const numeric = Number(quantity.replaceAll(",", ""));
    if (Number.isFinite(numeric)) values[LEAD.quantity] = numeric;
  }

  const delivery = rfqProperty(profile, "What is your target delivery timeline?", "Target Delivery Timeline", "target_delivery");
  if (delivery && /^\d{4}-\d{2}-\d{2}/.test(delivery)) values[LEAD.targetDelivery] = { date: delivery.slice(0, 10) };
  return values;
}

async function createLead(profile: Profile, contact: Contact): Promise<string> {
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

async function updateLead(lead: Lead, profile: Profile, contact: Contact): Promise<void> {
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

async function stampProfile(profile: Profile, contactId: string): Promise<void> {
  const properties: Record<string, string> = {
    "Monday Contact ID": contactId,
    "CRM Status": "RFQ Requested",
  };
  if (!profile.acquisitionSource) properties["Acquisition Source"] = "Typeform";
  if (!profile.leadSource) properties["Lead Source"] = "Website";
  await klaviyo(`/api/profiles/${encodeURIComponent(profile.id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "profile",
        id: profile.id,
        attributes: { properties },
      },
    }),
  });
}

async function processProfile(profile: Profile, mode: RfqIntakeMode) {
  if (!profile.email) throw new Error("Klaviyo RFQ profile has no email; refusing CRM intake.");

  const contacts = await contactsByEmail(profile.email);
  if (contacts.length > 1) {
    throw new Error(`Multiple Monday Contacts found for ${profile.email}; refusing ambiguous RFQ intake.`);
  }
  const leads = await leadsByEmail(profile.email);
  const activeLeads = leads.filter((lead) => !lead.status || ACTIVE_LEAD_STATUSES.has(lead.status));
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
      marketingSubscriptionMirror: subscriptionLabel(profile),
      marketingConsentWillChange: false,
    };
  }

  const contact = contacts[0] || (await createContact(profile));
  await moveContactToRfq(contact, profile);

  let leadId: string;
  if (activeLeads[0]) {
    await updateLead(activeLeads[0], profile, contact);
    leadId = activeLeads[0].id;
  } else {
    leadId = await createLead(profile, contact);
  }
  await stampProfile(profile, contact.id);

  return {
    action: contacts.length
      ? activeLeads[0]
        ? "updated-contact-and-lead"
        : "updated-contact-created-lead"
      : "created-contact-and-lead",
    profileId: profile.id,
    email: profile.email,
    contactId: contact.id,
    leadId,
    leadSource: "Website",
    contactLifecycle: "RFQ Requested",
    leadStatus: "Quote Requested",
    marketingSubscriptionMirror: subscriptionLabel(profile),
    marketingConsentChanged: false,
  };
}

export async function processWebsiteRfqProfile(profileId: string, mode: RfqIntakeMode = "preview") {
  const profile = await profileById(profileId);
  if (!isWebsiteRfqProfile(profile)) {
    throw new Error("Profile is not recognisable as an approved website RFQ submission.");
  }
  const result = await processProfile(profile, mode);
  return { ok: true, mode, ...result };
}

export async function recoverWebsiteRfqProfiles(mode: RfqIntakeMode) {
  const profiles = await allProfiles();
  const candidates = profiles.filter(isWebsiteRfqProfile);
  const results: Array<Record<string, unknown>> = [];
  for (const profile of candidates) results.push(await processProfile(profile, mode));
  return { scanned: profiles.length, eligible: candidates.length, results };
}
