import { createHmac, timingSafeEqual } from "node:crypto";

import { KLAVIYO_API_REVISION, MONDAY_API_VERSION, MONDAY_CONTACTS_BOARD_ID } from "./config";

const MONDAY_LEADS_BOARD_ID = 5029468201;
const MONDAY_INBOUND_LEADS_GROUP_ID = "topics";
const TYPEFORM_RFQ_FORM_ID = "m0adYoQw";

const LEAD = {
  firstName: "text_mm4q6q7x",
  lastName: "text_mm4qzr9k",
  email: "lead_email",
  phone: "lead_phone",
  status: "lead_status",
  source: "color_mkyb8krc",
  contacts: "board_relation_mm5gpfwm",
  country: "text_mm4q4v9d",
  packaging: "text_mm4q90j3",
  moq: "numeric_mm4qqc15",
  dimensions: "text_mm4qe675",
  printing: "text_mm4qas74",
  delivery: "date_mm4q1xx6",
  additional: "text_mm4qr0a6",
  utmSource: "text_mm5n94p3",
  utmMedium: "text_mm5n9hyd",
  utmCampaign: "text_mm5nng7t",
  utmContent: "text_mm5n4b3n",
} as const;

const CONTACT = {
  email: "contact_email",
  status: "color_mm5gwvh2",
  subscription: "color_mm69w7w7",
} as const;

const TYPEFORM_FIELD_REFS = {
  firstName: "274fe66b-2139-4436-89c7-56a2554f9626",
  lastName: "6506ea3b-aae7-478f-9651-fc212dfce1b9",
  phone: "8b954765-87e0-4416-a174-a169459551f0",
  email: "15335d19-ee96-4b36-a417-1eb6cfe3911f",
  website: "9f10ce50-f3d3-4831-8685-77b319b31f79",
  company: "69545e7e-65ef-4075-9251-bbe9b56e2544",
  country: "585631f6-8b7f-4d31-8bb9-3ff6ec3b64b0",
  packaging: "21cc4b98-db75-4975-b351-9505176a6ab5",
  moq: "37d8389c-f6cf-4883-a0f2-5a5d637d7e30",
  dimensions: "d27d0000-9d56-4019-9d4e-306e7909f03a",
  printing: "d1181182-18d9-4c1e-94b8-fc7424ce3129",
  delivery: "dcc933ad-6cd5-4670-b776-83c0b7d4333d",
  additional: "52127cd8-62a4-44c7-826a-3470334cc1e1",
} as const;

export type RfqIntakeMode = "preview" | "apply";

type Marketing = {
  can_receive_email_marketing?: boolean;
  consent?: string | null;
  suppression?: Array<{ reason?: string | null }>;
};

type KlaviyoRfqProfile = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  properties: Record<string, unknown>;
  marketing: Marketing;
};

type TypeformSignal = {
  formId: string;
  responseId: string | null;
  email: string;
  answers: Record<string, unknown>;
  variables: Record<string, unknown>;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function text(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function scalarAnswer(answer: any): unknown {
  if (!answer || typeof answer !== "object") return null;
  for (const key of ["email", "text", "phone_number", "number", "date", "boolean", "url"]) {
    if (answer[key] !== undefined && answer[key] !== null) return answer[key];
  }
  if (Array.isArray(answer.choices?.labels)) return answer.choices.labels.join(", ");
  if (answer.choice?.label) return answer.choice.label;
  return null;
}

export function parseTypeformSignal(payload: any): TypeformSignal {
  const response = payload?.form_response || payload?.response || payload?.data?.form_response || payload?.data || payload || {};
  const formId = String(response.form_id || response.formId || payload?.form_id || payload?.formId || "").trim();
  const responseId = text(response.token) || text(response.response_id) || text(response.responseId) || text(payload?.response_id) || text(payload?.responseId) || text(payload?.event_id);

  const answers: Record<string, unknown> = {};
  for (const answer of Array.isArray(response.answers) ? response.answers : []) {
    const ref = text(answer?.field?.ref) || text(answer?.field?.id);
    if (ref) answers[ref] = scalarAnswer(answer);
  }

  const variables: Record<string, unknown> = {};
  for (const variable of Array.isArray(response.variables) ? response.variables : []) {
    const key = text(variable?.key);
    if (!key) continue;
    variables[key] = variable.text ?? variable.number ?? variable.boolean ?? variable.value ?? null;
  }
  if (payload?.lead_source !== undefined) variables.lead_source = payload.lead_source;

  const email = (
    text(answers[TYPEFORM_FIELD_REFS.email]) ||
    text(response.email) ||
    text(payload?.email) ||
    ""
  ).toLowerCase();

  return { formId, responseId, email, answers, variables };
}

export function verifyTypeformSignature(rawBody: string, signature: string | null) {
  const secret = requiredEnv("TYPEFORM_RFQ_WEBHOOK_SECRET");
  if (!signature?.startsWith("sha256=")) return false;
  const actual = signature.slice("sha256=".length);
  const expected = createHmac("sha256", secret).update(rawBody).digest("base64");
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
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
  return (await response.json()) as T;
}

async function klaviyoProfileByEmail(email: string): Promise<KlaviyoRfqProfile | null> {
  const params = new URLSearchParams({
    filter: `equals(email,"${email.replaceAll('"', '\\"')}")`,
    "additional-fields[profile]": "subscriptions",
  });
  const payload = await klaviyo<{ data: any[] }>(`/api/profiles?${params}`);
  if (!payload.data.length) return null;
  if (payload.data.length > 1) throw new Error(`Multiple Klaviyo profiles found for ${email}; refusing RFQ intake.`);
  const resource = payload.data[0];
  const attrs = resource.attributes || {};
  return {
    id: String(resource.id),
    email: String(attrs.email || "").trim().toLowerCase(),
    firstName: text(attrs.first_name),
    lastName: text(attrs.last_name),
    phone: text(attrs.phone_number),
    properties: attrs.properties || {},
    marketing: attrs.subscriptions?.email?.marketing || {},
  };
}

async function waitForKlaviyoProfile(email: string) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const profile = await klaviyoProfileByEmail(email);
    if (profile) return profile;
    if (attempt < 5) await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  throw new Error(`Klaviyo profile for ${email} is not available yet; retry delivery.`);
}

function prop(profile: KlaviyoRfqProfile, ...keys: string[]) {
  for (const key of keys) {
    const value = profile.properties[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
}

function leadSource(profile: KlaviyoRfqProfile, signal: TypeformSignal) {
  return text(prop(profile, "Lead Source", "lead_source", "leadSource")) || text(signal.variables.lead_source);
}

function rfqValue(profile: KlaviyoRfqProfile, signal: TypeformSignal, ref: string, ...keys: string[]) {
  return prop(profile, ...keys) ?? signal.answers[ref] ?? null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(String(value ?? "").replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function normalized(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

async function leadsByEmail(email: string) {
  const columns = Object.values(LEAD);
  const query = `query LeadsByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(board_id: $boardId, limit: 25, columns: [{column_id: "${LEAD.email}", column_values: [$email]}]) {
      items { id name created_at column_values(ids: ${JSON.stringify(columns)}) { id text value } }
    }
  }`;
  const data = await monday<{ items_page_by_column_values: { items: any[] } }>(query, {
    boardId: MONDAY_LEADS_BOARD_ID,
    email,
  });
  return data.items_page_by_column_values.items;
}

function leadColumn(item: any, id: string) {
  return item.column_values?.find((column: any) => column.id === id)?.text?.trim() || "";
}

function duplicateLead(existing: any[], desired: Record<string, unknown>) {
  const now = Date.now();
  return existing.find((item) => {
    const created = Date.parse(item.created_at || "");
    if (!Number.isFinite(created) || now - created > 24 * 60 * 60 * 1000) return false;
    if (normalized(leadColumn(item, LEAD.source)) !== "website") return false;
    const comparisons: Array<[string, unknown]> = [
      [LEAD.packaging, desired[LEAD.packaging]],
      [LEAD.moq, desired[LEAD.moq]],
      [LEAD.dimensions, desired[LEAD.dimensions]],
      [LEAD.printing, desired[LEAD.printing]],
      [LEAD.delivery, desired[LEAD.delivery]],
      [LEAD.additional, desired[LEAD.additional]],
    ];
    return comparisons.every(([id, value]) => !value || normalized(leadColumn(item, id)) === normalized(value));
  });
}

async function contactsByEmail(email: string) {
  const query = `query ContactsByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(board_id: $boardId, limit: 10, columns: [{column_id: "${CONTACT.email}", column_values: [$email]}]) {
      items { id name column_values(ids: ["${CONTACT.email}", "${CONTACT.status}", "${CONTACT.subscription}"]) { id text } }
    }
  }`;
  const data = await monday<{ items_page_by_column_values: { items: any[] } }>(query, {
    boardId: MONDAY_CONTACTS_BOARD_ID,
    email,
  });
  return data.items_page_by_column_values.items;
}

async function createLead(name: string, values: Record<string, unknown>) {
  const mutation = `mutation CreateInboundRfqLead($boardId: ID!, $groupId: String!, $name: String!, $values: JSON!) {
    create_item(board_id: $boardId, group_id: $groupId, item_name: $name, column_values: $values) { id }
  }`;
  const data = await monday<{ create_item: { id: string } }>(mutation, {
    boardId: MONDAY_LEADS_BOARD_ID,
    groupId: MONDAY_INBOUND_LEADS_GROUP_ID,
    name,
    values: JSON.stringify(values),
  });
  return data.create_item.id;
}

async function setContactRfqRequested(contactId: string) {
  const mutation = `mutation SetContactRfq($boardId: ID!, $itemId: ID!, $values: JSON!) {
    change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $values) { id }
  }`;
  await monday(mutation, {
    boardId: MONDAY_CONTACTS_BOARD_ID,
    itemId: contactId,
    values: JSON.stringify({ [CONTACT.status]: { label: "RFQ Requested" } }),
  });
}

async function linkLeadContact(leadId: string, contactId: string) {
  const mutation = `mutation LinkLeadContact($boardId: ID!, $itemId: ID!, $values: JSON!) {
    change_multiple_column_values(board_id: $boardId, item_id: $itemId, column_values: $values) { id }
  }`;
  await monday(mutation, {
    boardId: MONDAY_LEADS_BOARD_ID,
    itemId: leadId,
    values: JSON.stringify({ [LEAD.contacts]: { item_ids: [Number(contactId)] } }),
  });
}

async function resolveCanonicalContact(email: string) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const matches = await contactsByEmail(email);
    if (matches.length > 1) throw new Error(`Multiple Monday Contacts found for ${email}; refusing automatic RFQ lifecycle write.`);
    if (matches.length === 1) return matches[0];
    if (attempt < 5) await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  return null;
}

export async function processTypeformRfqIntake(payload: unknown, mode: RfqIntakeMode = "preview") {
  const signal = parseTypeformSignal(payload);
  if (signal.formId !== TYPEFORM_RFQ_FORM_ID) throw new Error(`Unapproved Typeform form: ${signal.formId || "missing"}.`);
  if (!signal.email) throw new Error("Typeform RFQ signal has no email; refusing intake.");

  const profile = await waitForKlaviyoProfile(signal.email);
  const source = leadSource(profile, signal);
  if (normalized(source) !== "website") throw new Error(`RFQ Lead Source must be Website; received ${source || "blank"}.`);

  const suppression = profile.marketing.suppression?.[0]?.reason || null;
  if (profile.marketing.can_receive_email_marketing !== true || profile.marketing.consent === "UNSUBSCRIBED" || suppression) {
    throw new Error(`Klaviyo profile ${profile.email} is not currently marketable; refusing subscribed RFQ intake.`);
  }

  const values: Record<string, unknown> = {
    [LEAD.email]: profile.email,
    [LEAD.status]: { label: "Quote Requested" },
    [LEAD.source]: { label: "Website" },
  };

  const firstName = profile.firstName || text(rfqValue(profile, signal, TYPEFORM_FIELD_REFS.firstName, "First Name", "first_name"));
  const lastName = profile.lastName || text(rfqValue(profile, signal, TYPEFORM_FIELD_REFS.lastName, "Last Name", "last_name"));
  const phone = profile.phone || text(rfqValue(profile, signal, TYPEFORM_FIELD_REFS.phone, "Contact Number", "Phone Number", "phone_number"));
  const country = text(rfqValue(profile, signal, TYPEFORM_FIELD_REFS.country, "Country", "country"));
  const packaging = text(rfqValue(profile, signal, TYPEFORM_FIELD_REFS.packaging, "What type of Packaging are you looking for?", "Packaging Type", "packaging_type"));
  const moq = asNumber(rfqValue(profile, signal, TYPEFORM_FIELD_REFS.moq, "What is your estimated order quantity or MOQ requirement?", "MOQ", "moq"));
  const dimensions = text(rfqValue(profile, signal, TYPEFORM_FIELD_REFS.dimensions, "What are your required packaging dimensions?", "Packaging Dimensions", "dimensions"));
  const printing = text(rfqValue(profile, signal, TYPEFORM_FIELD_REFS.printing, "Do you have specific printing or branding requirements?", "Printing Requirements", "printing_requirements"));
  const delivery = text(rfqValue(profile, signal, TYPEFORM_FIELD_REFS.delivery, "What is your target delivery timeline?", "Delivery Timeline", "delivery_timeline"));
  const additional = text(rfqValue(profile, signal, TYPEFORM_FIELD_REFS.additional, "Let us know if you have any additional requirements.", "Additional Requirements", "additional_requirements"));

  if (firstName) values[LEAD.firstName] = firstName;
  if (lastName) values[LEAD.lastName] = lastName;
  if (phone) values[LEAD.phone] = phone;
  if (country) values[LEAD.country] = country;
  if (packaging) values[LEAD.packaging] = packaging;
  if (moq !== null) values[LEAD.moq] = moq;
  if (dimensions) values[LEAD.dimensions] = dimensions;
  if (printing) values[LEAD.printing] = printing;
  if (delivery) values[LEAD.delivery] = { date: delivery.slice(0, 10) };
  if (additional) values[LEAD.additional] = additional;

  for (const [column, keys] of [
    [LEAD.utmSource, ["utm_source", "UTM Source"]],
    [LEAD.utmMedium, ["utm_medium", "UTM Medium"]],
    [LEAD.utmCampaign, ["utm_campaign", "UTM Campaign"]],
    [LEAD.utmContent, ["utm_content", "UTM Content"]],
  ] as const) {
    const value = text(prop(profile, ...keys));
    if (value) values[column] = value;
  }

  const existingLeads = await leadsByEmail(profile.email);
  const duplicate = duplicateLead(existingLeads, values);
  if (duplicate) {
    return { ok: true, mode, action: "already-present", leadId: duplicate.id, profileId: profile.id, email: profile.email, responseId: signal.responseId };
  }

  const preExistingContacts = await contactsByEmail(profile.email);
  if (preExistingContacts.length > 1) throw new Error(`Multiple Monday Contacts found for ${profile.email}; refusing RFQ intake.`);
  if (preExistingContacts.length === 1) values[LEAD.contacts] = { item_ids: [Number(preExistingContacts[0].id)] };

  const name = [firstName, lastName].filter(Boolean).join(" ") || profile.email;
  if (mode === "preview") {
    return {
      ok: true,
      mode,
      action: "would-create",
      profileId: profile.id,
      email: profile.email,
      responseId: signal.responseId,
      leadSource: "Website",
      leadStatus: "Quote Requested",
      existingContactId: preExistingContacts[0]?.id || null,
      mappedColumns: Object.keys(values),
    };
  }

  const leadId = await createLead(name, values);
  let contact = preExistingContacts[0] || null;
  if (!contact) contact = await resolveCanonicalContact(profile.email);
  if (contact) {
    await setContactRfqRequested(contact.id);
    await linkLeadContact(leadId, contact.id);
  }

  return {
    ok: true,
    mode,
    action: "created",
    leadId,
    contactId: contact?.id || null,
    contactLifecycleApplied: Boolean(contact),
    profileId: profile.id,
    email: profile.email,
    responseId: signal.responseId,
  };
}
