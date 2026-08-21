import {
  KLAVIYO_API_REVISION,
  MONDAY_API_VERSION,
  MONDAY_CONTACTS_BOARD_ID,
} from "./config";

const MONDAY_LEADS_BOARD_ID = 5029468201;
const MONDAY_INBOUND_LEADS_GROUP_ID = "topics";

export const TYPEFORM_RFQ_FORM_ID = "m0adYoQw";
export const TYPEFORM_FILLED_OUT_METRIC_ID = "WXmDtp";
export const TYPEFORM_RFQ_PRODUCTION_CUTOVER_AT = "2026-08-21T06:00:00.000Z";

const CONTACT = {
  email: "contact_email",
  status: "color_mm5gwvh2",
} as const;

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
  lastInteraction: "date__1",
  utmSource: "text_mm5n94p3",
  utmMedium: "text_mm5n9hyd",
  utmCampaign: "text_mm5nng7t",
  utmContent: "text_mm5n4b3n",
} as const;

export type TypeformRfqRecoveryMode = "preview" | "apply";

type TypeformEvent = {
  id: string;
  datetime: string;
  profileId: string;
  formId: string;
  properties: Record<string, unknown>;
};

type KlaviyoProfile = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  organization: string | null;
  properties: Record<string, unknown>;
  consent: string | null;
  canReceiveMarketing: boolean;
  suppressionReason: string | null;
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

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(String(value ?? "").replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(text).filter((entry): entry is string => Boolean(entry));
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
  const payload = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };
  if (!response.ok || !payload.data || payload.errors?.length) {
    throw new Error(
      `Monday API error: ${payload.errors?.map((error) => error.message).join("; ") || response.status}`,
    );
  }
  return payload.data;
}

async function klaviyo<T>(pathOrUrl: string, init?: RequestInit): Promise<T> {
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
    throw new Error(`Klaviyo API error ${response.status}: ${body.slice(0, 800)}`);
  }
  if (response.status === 202 || response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

async function profileById(profileId: string): Promise<KlaviyoProfile> {
  const payload = await klaviyo<{ data: any }>(
    `/api/profiles/${encodeURIComponent(profileId)}?additional-fields[profile]=subscriptions`,
  );
  const resource = payload.data;
  const attrs = resource?.attributes || {};
  const marketing = attrs.subscriptions?.email?.marketing || {};
  return {
    id: String(resource?.id || ""),
    email: String(attrs.email || "").trim().toLowerCase(),
    firstName: text(attrs.first_name),
    lastName: text(attrs.last_name),
    phone: text(attrs.phone_number),
    organization: text(attrs.organization),
    properties: attrs.properties || {},
    consent: text(marketing.consent),
    canReceiveMarketing: marketing.can_receive_email_marketing === true,
    suppressionReason: text(marketing.suppression?.[0]?.reason),
  };
}

async function patchProfileProperties(
  profileId: string,
  properties: Record<string, unknown>,
) {
  await klaviyo(`/api/profiles/${encodeURIComponent(profileId)}`, {
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

async function recentTypeformEvents(since: Date): Promise<TypeformEvent[]> {
  const params = new URLSearchParams({
    filter: `and(equals(metric_id,"${TYPEFORM_FILLED_OUT_METRIC_ID}"),greater-or-equal(datetime,${since.toISOString()}))`,
    "fields[event]": "datetime,event_properties,id",
    sort: "datetime",
    "page[size]": "100",
  });
  let next: string | null = `/api/events?${params}`;
  const events: TypeformEvent[] = [];
  let pages = 0;

  while (next && pages < 20) {
    pages += 1;
    const page: { data: any[]; links?: { next?: string | null } } = await klaviyo(next);
    for (const resource of page.data) {
      const datetime = text(resource?.attributes?.datetime);
      const properties = resource?.attributes?.event_properties || {};
      const profileId = text(properties.profile) || text(resource?.relationships?.profile?.data?.id);
      const formId = text(properties.formId) || text(properties.form_id) || "";
      if (!datetime || !profileId || formId !== TYPEFORM_RFQ_FORM_ID) continue;
      events.push({
        id: String(resource.id),
        datetime: new Date(datetime).toISOString(),
        profileId,
        formId,
        properties,
      });
    }
    next = page.links?.next || null;
  }

  return events;
}

async function leadsByEmail(email: string) {
  const query = `query LeadsByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(
      board_id: $boardId,
      limit: 25,
      columns: [{column_id: "${LEAD.email}", column_values: [$email]}]
    ) {
      items { id name created_at column_values(ids: ["${LEAD.email}", "${LEAD.status}", "${LEAD.source}", "${LEAD.lastInteraction}"]) { id text } }
    }
  }`;
  const data = await monday<{ items_page_by_column_values: { items: any[] } }>(query, {
    boardId: MONDAY_LEADS_BOARD_ID,
    email,
  });
  return data.items_page_by_column_values.items;
}

async function contactsByEmail(email: string) {
  const query = `query ContactsByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(
      board_id: $boardId,
      limit: 10,
      columns: [{column_id: "${CONTACT.email}", column_values: [$email]}]
    ) {
      items { id name column_values(ids: ["${CONTACT.email}", "${CONTACT.status}"]) { id text } }
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
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const matches = await contactsByEmail(email);
    if (matches.length > 1) {
      throw new Error(`Multiple Monday Contacts found for ${email}; refusing automatic RFQ lifecycle write.`);
    }
    if (matches.length === 1) return matches[0];
    if (attempt < 7) await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  return null;
}

function dateOnly(value: unknown): string | null {
  const raw = text(value);
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : null;
}

function buildLeadValues(profile: KlaviyoProfile, event: TypeformEvent) {
  const props = profile.properties;
  const values: Record<string, unknown> = {
    [LEAD.email]: { email: profile.email, text: profile.email },
    [LEAD.status]: { label: "Quote Requested" },
    [LEAD.source]: { label: "Website" },
    [LEAD.lastInteraction]: { date: event.datetime.slice(0, 10) },
  };

  if (profile.firstName) values[LEAD.firstName] = profile.firstName;
  if (profile.lastName) values[LEAD.lastName] = profile.lastName;
  if (profile.phone) values[LEAD.phone] = profile.phone;

  const country = text(props.Country) || text(props.country);
  const packaging = text(props["Type of Packaging"]);
  const moq = numberValue(props["Order Qty"]);
  const dimensions = text(props["Packaging Dimensions"]);
  const printing = text(props["Packaging Printing"]);
  const delivery = dateOnly(props["Delivery Time"]);
  const additional = text(props["Additional Comments"]);

  if (country) values[LEAD.country] = country;
  if (packaging) values[LEAD.packaging] = packaging;
  if (moq !== null) values[LEAD.moq] = moq;
  if (dimensions) values[LEAD.dimensions] = dimensions;
  if (printing) values[LEAD.printing] = printing;
  if (delivery) values[LEAD.delivery] = { date: delivery };
  if (additional) values[LEAD.additional] = additional;

  for (const [column, property] of [
    [LEAD.utmSource, "utm_source"],
    [LEAD.utmMedium, "utm_medium"],
    [LEAD.utmCampaign, "utm_campaign"],
    [LEAD.utmContent, "utm_content"],
  ] as const) {
    const value = text(props[property]);
    if (value) values[column] = value;
  }

  return values;
}

function candidateLead(existing: any[], event: TypeformEvent) {
  const eventTime = new Date(event.datetime).getTime();
  return existing.find((item) => {
    const created = Date.parse(item.created_at || "");
    if (!Number.isFinite(created) || Math.abs(created - eventTime) > 60 * 60 * 1000) return false;
    const source = item.column_values?.find((column: any) => column.id === LEAD.source)?.text || "";
    return source.trim().toLowerCase() === "website";
  });
}

async function processEvent(event: TypeformEvent, mode: TypeformRfqRecoveryMode) {
  let profile = await profileById(event.profileId);
  if (!profile.email) {
    return { action: "blocked-missing-email", eventId: event.id, profileId: profile.id };
  }

  const processed = stringArray(profile.properties["Processed Typeform RFQ Event IDs"]);
  if (processed.includes(event.id)) {
    return {
      action: "already-processed",
      eventId: event.id,
      eventAt: event.datetime,
      email: profile.email,
      profileId: profile.id,
    };
  }

  const pendingEventId = text(profile.properties["Pending Typeform RFQ Event ID"]);
  if (pendingEventId && pendingEventId !== event.id) {
    return {
      action: "blocked-earlier-rfq-pending",
      eventId: event.id,
      pendingEventId,
      email: profile.email,
      profileId: profile.id,
    };
  }

  const existingContacts = await contactsByEmail(profile.email);
  if (existingContacts.length > 1) {
    throw new Error(`Multiple Monday Contacts found for ${profile.email}; refusing RFQ recovery.`);
  }

  const values = buildLeadValues(profile, event);
  if (existingContacts.length === 1) {
    values[LEAD.contacts] = { item_ids: [Number(existingContacts[0].id)] };
  }

  let leadId = pendingEventId === event.id
    ? text(profile.properties["Monday RFQ Lead ID"])
    : null;
  if (!leadId) {
    const existingLeads = await leadsByEmail(profile.email);
    const candidate = candidateLead(existingLeads, event);
    if (candidate) leadId = String(candidate.id);
  }

  if (mode === "preview") {
    return {
      action: leadId ? "would-resume" : "would-create",
      eventId: event.id,
      eventAt: event.datetime,
      formId: event.formId,
      profileId: profile.id,
      email: profile.email,
      leadId,
      existingContactId: existingContacts[0]?.id || null,
      leadSource: "Website",
      leadStatus: "Quote Requested",
      rfqSubmittedAt: event.datetime,
      marketingConsentWillChange: false,
      currentMarketingConsent: profile.consent,
      canReceiveMarketing: profile.canReceiveMarketing,
      currentSuppression: profile.suppressionReason,
      mappedColumns: Object.keys(values),
    };
  }

  if (!leadId) {
    const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email;
    leadId = await createLead(name, values);
  }

  await patchProfileProperties(profile.id, {
    "Lead Source": "Website",
    "RFQ Source": "Typeform",
    "Pending Typeform RFQ Event ID": event.id,
    "Pending Typeform RFQ Submitted At": event.datetime,
    "Monday RFQ Lead ID": leadId,
  });

  let contact = existingContacts[0] || null;
  if (!contact) contact = await resolveCanonicalContact(profile.email);
  if (!contact) {
    return {
      action: "pending-contact",
      eventId: event.id,
      eventAt: event.datetime,
      profileId: profile.id,
      email: profile.email,
      leadId,
      marketingConsentChanged: false,
    };
  }

  await setContactRfqRequested(contact.id);
  await linkLeadContact(leadId, contact.id);

  profile = await profileById(profile.id);
  const finalProcessed = stringArray(profile.properties["Processed Typeform RFQ Event IDs"]);
  if (!finalProcessed.includes(event.id)) finalProcessed.push(event.id);

  await patchProfileProperties(profile.id, {
    "Lead Source": "Website",
    "RFQ Source": "Typeform",
    "RFQ Submitted At": event.datetime,
    "Last Processed Typeform RFQ Event ID": event.id,
    "Processed Typeform RFQ Event IDs": finalProcessed.slice(-50),
    "Pending Typeform RFQ Event ID": "",
    "Pending Typeform RFQ Submitted At": "",
    "Monday RFQ Lead ID": leadId,
    "Monday Contact ID": contact.id,
  });

  return {
    action: "processed",
    eventId: event.id,
    eventAt: event.datetime,
    profileId: profile.id,
    email: profile.email,
    leadId,
    contactId: contact.id,
    contactLifecycle: "RFQ Requested",
    marketingConsentChanged: false,
  };
}

export async function recoverTypeformRfqEventsV2(
  mode: TypeformRfqRecoveryMode,
  options: { lookbackHours?: number; cutoverAt?: string | null } = {},
) {
  const lookbackHours = Math.max(24, options.lookbackHours ?? 168);
  const lookback = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);
  const cutover = new Date(options.cutoverAt || TYPEFORM_RFQ_PRODUCTION_CUTOVER_AT);
  const since = cutover > lookback ? cutover : lookback;
  const events = await recentTypeformEvents(since);
  const results: Array<Record<string, unknown>> = [];

  for (const event of events) {
    try {
      results.push(await processEvent(event, mode));
    } catch (error) {
      results.push({
        action: "error",
        eventId: event.id,
        eventAt: event.datetime,
        profileId: event.profileId,
        error: error instanceof Error ? error.message : "Unknown RFQ recovery error",
      });
    }
  }

  return {
    status: "ok",
    metricId: TYPEFORM_FILLED_OUT_METRIC_ID,
    formId: TYPEFORM_RFQ_FORM_ID,
    since: since.toISOString(),
    scanned: events.length,
    results,
  };
}
