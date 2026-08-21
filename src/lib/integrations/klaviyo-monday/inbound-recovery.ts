import {
  KLAVIYO_API_REVISION,
  MONDAY_API_VERSION,
  MONDAY_CONTACTS_BOARD_ID,
} from "./config";

const MONDAY_CONTACT_US_BOARD_ID = 5029468391;
const MONDAY_LEADS_BOARD_ID = 5029468201;
const MONDAY_INBOUND_LEADS_GROUP_ID = "topics";

// At the time this cutover was recorded, the Zero Pack account had no
// Typeform "Filled Out Form" metric yet. Events before this point are not
// eligible for production RFQ recovery.
export const TYPEFORM_RFQ_PRODUCTION_CUTOVER_AT = "2026-08-21T06:00:00.000Z";

const TYPEFORM_METRIC_NAME = "Filled Out Form";
const TYPEFORM_SOURCE = "Typeform";
const WEBSITE_LEAD_SOURCE = "Website";

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

export type InboundRecoveryMode = "preview" | "apply";

type KlaviyoProfile = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  organization: string | null;
  properties: Record<string, unknown>;
  canReceiveMarketing: boolean;
  consent: string | null;
  suppressionReason: string | null;
};

type TypeformEvent = {
  id: string;
  datetime: string;
  properties: Record<string, unknown>;
  profileId: string;
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
  return value.map((entry) => text(entry)).filter((entry): entry is string => Boolean(entry));
}

function isoDate(value: string): string | null {
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : null;
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

function mapProfile(resource: any): KlaviyoProfile {
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
    canReceiveMarketing: marketing.can_receive_email_marketing === true,
    consent: text(marketing.consent),
    suppressionReason: text(marketing.suppression?.[0]?.reason),
  };
}

async function profileById(profileId: string): Promise<KlaviyoProfile> {
  const payload = await klaviyo<{ data: any }>(
    `/api/profiles/${encodeURIComponent(profileId)}?additional-fields[profile]=subscriptions`,
  );
  return mapProfile(payload.data);
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

async function allProfiles(): Promise<KlaviyoProfile[]> {
  const params = new URLSearchParams({
    "additional-fields[profile]": "subscriptions",
    "page[size]": "100",
  });
  let next: string | null = `/api/profiles?${params}`;
  const profiles: KlaviyoProfile[] = [];
  while (next) {
    const page: { data: any[]; links?: { next?: string | null } } = await klaviyo(next);
    profiles.push(...page.data.map(mapProfile));
    next = page.links?.next || null;
  }
  return profiles;
}

async function findTypeformMetricId(): Promise<string | null> {
  let next: string | null = "/api/metrics?page[size]=100";
  const named: Array<{ id: string; integration: string }> = [];
  while (next) {
    const page: {
      data: Array<{
        id: string;
        attributes?: { name?: string; integration?: { name?: string } };
      }>;
      links?: { next?: string | null };
    } = await klaviyo(next);
    for (const metric of page.data) {
      if (metric.attributes?.name !== TYPEFORM_METRIC_NAME) continue;
      named.push({
        id: metric.id,
        integration: metric.attributes?.integration?.name || "",
      });
    }
    next = page.links?.next || null;
  }

  const typeform = named.filter((metric) =>
    metric.integration.toLowerCase().includes("typeform"),
  );
  if (typeform.length > 1) {
    throw new Error("Multiple Typeform Filled Out Form metrics found; refusing ambiguous RFQ recovery.");
  }
  if (typeform.length === 1) return typeform[0].id;

  // Before the first v2 Typeform submission the metric may not exist at all. If
  // exactly one same-named metric later appears without integration metadata,
  // accepting it is deterministic; multiple candidates still fail closed.
  if (named.length === 1 && !named[0].integration) return named[0].id;
  return null;
}

async function recentTypeformEvents(
  metricId: string,
  since: Date,
): Promise<TypeformEvent[]> {
  const filter = `equals(metric_id,"${metricId}")`;
  const params = new URLSearchParams({
    filter,
    "fields[event]": "datetime,event_properties,id",
    sort: "-datetime",
    "page[size]": "100",
  });
  let next: string | null = `/api/events?${params}`;
  const events: TypeformEvent[] = [];
  let pages = 0;

  while (next && pages < 20) {
    pages += 1;
    const page: { data: any[]; links?: { next?: string | null } } = await klaviyo(next);
    let reachedCutoff = false;
    for (const resource of page.data) {
      const datetime = text(resource?.attributes?.datetime);
      if (!datetime) continue;
      const occurredAt = new Date(datetime);
      if (!Number.isFinite(occurredAt.getTime())) continue;
      if (occurredAt < since) {
        reachedCutoff = true;
        continue;
      }
      const profileId = text(resource?.relationships?.profile?.data?.id);
      if (!profileId) continue;
      events.push({
        id: String(resource.id),
        datetime: occurredAt.toISOString(),
        properties: resource?.attributes?.event_properties || {},
        profileId,
      });
    }
    if (reachedCutoff) break;
    next = page.links?.next || null;
  }

  return events.sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  );
}

function valueFrom(
  profile: KlaviyoProfile,
  event: TypeformEvent,
  ...keys: string[]
): unknown {
  for (const key of keys) {
    const profileValue = profile.properties[key];
    if (profileValue !== undefined && profileValue !== null && profileValue !== "") {
      return profileValue;
    }
    const eventValue = event.properties[key];
    if (eventValue !== undefined && eventValue !== null && eventValue !== "") {
      return eventValue;
    }
  }
  return null;
}

async function leadsByEmail(email: string) {
  const columns = Object.values(LEAD);
  const query = `query LeadsByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(
      board_id: $boardId,
      limit: 25,
      columns: [{column_id: "${LEAD.email}", column_values: [$email]}]
    ) {
      items {
        id name created_at
        column_values(ids: ${JSON.stringify(columns)}) { id text }
      }
    }
  }`;
  const data = await monday<{
    items_page_by_column_values: { items: any[] };
  }>(query, { boardId: MONDAY_LEADS_BOARD_ID, email });
  return data.items_page_by_column_values.items;
}

function leadColumn(item: any, columnId: string) {
  return item.column_values?.find((column: any) => column.id === columnId)?.text?.trim() || "";
}

function retryLeadCandidate(
  existing: any[],
  event: TypeformEvent,
  desired: Record<string, unknown>,
) {
  const eventAt = new Date(event.datetime).getTime();
  return existing.find((item) => {
    const createdAt = Date.parse(item.created_at || "");
    if (!Number.isFinite(createdAt) || Math.abs(createdAt - eventAt) > 60 * 60 * 1000) {
      return false;
    }
    if (leadColumn(item, LEAD.source).toLowerCase() !== WEBSITE_LEAD_SOURCE.toLowerCase()) {
      return false;
    }
    const checks: Array<[string, unknown]> = [
      [LEAD.packaging, desired[LEAD.packaging]],
      [LEAD.moq, desired[LEAD.moq]],
      [LEAD.dimensions, desired[LEAD.dimensions]],
      [LEAD.printing, desired[LEAD.printing]],
      [LEAD.delivery, desired[LEAD.delivery]],
      [LEAD.additional, desired[LEAD.additional]],
    ];
    return checks.every(([columnId, desiredValue]) => {
      if (desiredValue === undefined || desiredValue === null || desiredValue === "") return true;
      const comparable =
        typeof desiredValue === "object" && desiredValue && "date" in (desiredValue as any)
          ? String((desiredValue as any).date)
          : String(desiredValue);
      return leadColumn(item, columnId).trim().toLowerCase() === comparable.trim().toLowerCase();
    });
  });
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
  const data = await monday<{
    items_page_by_column_values: { items: any[] };
  }>(query, { boardId: MONDAY_CONTACTS_BOARD_ID, email });
  return data.items_page_by_column_values.items;
}

async function createLead(name: string, values: Record<string, unknown>) {
  const mutation = `mutation CreateInboundRfqLead(
    $boardId: ID!, $groupId: String!, $name: String!, $values: JSON!
  ) {
    create_item(
      board_id: $boardId,
      group_id: $groupId,
      item_name: $name,
      column_values: $values
    ) { id }
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
    change_multiple_column_values(
      board_id: $boardId,
      item_id: $itemId,
      column_values: $values
    ) { id }
  }`;
  await monday(mutation, {
    boardId: MONDAY_CONTACTS_BOARD_ID,
    itemId: contactId,
    values: JSON.stringify({ [CONTACT.status]: { label: "RFQ Requested" } }),
  });
}

async function linkLeadContact(leadId: string, contactId: string) {
  const mutation = `mutation LinkLeadContact($boardId: ID!, $itemId: ID!, $values: JSON!) {
    change_multiple_column_values(
      board_id: $boardId,
      item_id: $itemId,
      column_values: $values
    ) { id }
  }`;
  await monday(mutation, {
    boardId: MONDAY_LEADS_BOARD_ID,
    itemId: leadId,
    values: JSON.stringify({
      [LEAD.contacts]: { item_ids: [Number(contactId)] },
    }),
  });
}

async function resolveCanonicalContact(email: string) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const matches = await contactsByEmail(email);
    if (matches.length > 1) {
      throw new Error(
        `Multiple Monday Contacts found for ${email}; refusing automatic RFQ lifecycle write.`,
      );
    }
    if (matches.length === 1) return matches[0];
    if (attempt < 7) await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  return null;
}

function buildLeadValues(profile: KlaviyoProfile, event: TypeformEvent) {
  const values: Record<string, unknown> = {
    [LEAD.email]: { email: profile.email, text: profile.email },
    [LEAD.status]: { label: "Quote Requested" },
    [LEAD.source]: { label: WEBSITE_LEAD_SOURCE },
  };

  const firstName = profile.firstName || text(valueFrom(profile, event, "First Name", "first_name"));
  const lastName = profile.lastName || text(valueFrom(profile, event, "Last Name", "last_name"));
  const phone = profile.phone || text(valueFrom(profile, event, "Contact Number", "Phone Number", "phone_number"));
  const country = text(valueFrom(profile, event, "Country", "country"));
  const packaging = text(valueFrom(profile, event, "What type of Packaging are you looking for?", "Packaging Type", "packaging_type"));
  const moq = numberValue(valueFrom(profile, event, "What is your estimated order quantity or MOQ requirement?", "MOQ", "moq"));
  const dimensions = text(valueFrom(profile, event, "What are your required packaging dimensions?", "Packaging Dimensions", "dimensions"));
  const printing = text(valueFrom(profile, event, "Do you have specific printing or branding requirements?", "Printing Requirements", "printing_requirements"));
  const delivery = text(valueFrom(profile, event, "What is your target delivery timeline?", "Delivery Timeline", "delivery_timeline"));
  const additional = text(valueFrom(profile, event, "Let us know if you have any additional requirements.", "Additional Requirements", "additional_requirements"));

  if (firstName) values[LEAD.firstName] = firstName;
  if (lastName) values[LEAD.lastName] = lastName;
  if (phone) values[LEAD.phone] = phone;
  if (country) values[LEAD.country] = country;
  if (packaging) values[LEAD.packaging] = packaging;
  if (moq !== null) values[LEAD.moq] = moq;
  if (dimensions) values[LEAD.dimensions] = dimensions;
  if (printing) values[LEAD.printing] = printing;
  const deliveryDate = delivery ? isoDate(delivery) : null;
  if (deliveryDate) values[LEAD.delivery] = { date: deliveryDate };
  if (additional) values[LEAD.additional] = additional;

  const submittedDate = isoDate(event.datetime);
  if (submittedDate) values[LEAD.lastInteraction] = { date: submittedDate };

  for (const [column, keys] of [
    [LEAD.utmSource, ["utm_source", "UTM Source"]],
    [LEAD.utmMedium, ["utm_medium", "UTM Medium"]],
    [LEAD.utmCampaign, ["utm_campaign", "UTM Campaign"]],
    [LEAD.utmContent, ["utm_content", "UTM Content"]],
  ] as const) {
    const value = text(valueFrom(profile, event, ...keys));
    if (value) values[column] = value;
  }

  return { values, firstName, lastName };
}

async function processTypeformEvent(
  event: TypeformEvent,
  mode: InboundRecoveryMode,
) {
  let profile = await profileById(event.profileId);
  if (!profile.email) {
    return { action: "blocked-missing-email", eventId: event.id, profileId: event.profileId };
  }

  const processedIds = new Set(
    stringArray(profile.properties["Processed Typeform RFQ Event IDs"]),
  );
  if (processedIds.has(event.id)) {
    return {
      action: "already-processed",
      eventId: event.id,
      eventAt: event.datetime,
      profileId: profile.id,
      email: profile.email,
    };
  }

  const pendingEventId = text(profile.properties["Pending Typeform RFQ Event ID"]);
  if (pendingEventId && pendingEventId !== event.id) {
    return {
      action: "blocked-earlier-rfq-pending",
      eventId: event.id,
      eventAt: event.datetime,
      pendingEventId,
      profileId: profile.id,
      email: profile.email,
    };
  }

  const { values, firstName, lastName } = buildLeadValues(profile, event);
  const preExistingContacts = await contactsByEmail(profile.email);
  if (preExistingContacts.length > 1) {
    throw new Error(`Multiple Monday Contacts found for ${profile.email}; refusing RFQ recovery.`);
  }
  if (preExistingContacts.length === 1) {
    values[LEAD.contacts] = { item_ids: [Number(preExistingContacts[0].id)] };
  }

  let leadId =
    pendingEventId === event.id
      ? text(profile.properties["Monday RFQ Lead ID"])
      : null;

  if (!leadId) {
    const existingLeads = await leadsByEmail(profile.email);
    const retryCandidate = retryLeadCandidate(existingLeads, event, values);
    if (retryCandidate) leadId = String(retryCandidate.id);
  }

  if (mode === "preview") {
    return {
      action: leadId ? "would-resume" : "would-create",
      eventId: event.id,
      eventAt: event.datetime,
      profileId: profile.id,
      email: profile.email,
      leadId,
      leadSource: WEBSITE_LEAD_SOURCE,
      leadStatus: "Quote Requested",
      existingContactId: preExistingContacts[0]?.id || null,
      marketingConsentWillChange: false,
      currentMarketingConsent: profile.consent,
      currentSuppression: profile.suppressionReason,
      mappedColumns: Object.keys(values),
    };
  }

  if (!leadId) {
    const name = [firstName, lastName].filter(Boolean).join(" ") || profile.email;
    leadId = await createLead(name, values);
  }

  // Persist the event/Lead pair before waiting for Monday's downstream Lead →
  // Contact Us → Contact automation. A retry can therefore resume rather than
  // create another Lead if the downstream automation is delayed.
  await patchProfileProperties(profile.id, {
    "Lead Source": WEBSITE_LEAD_SOURCE,
    "RFQ Source": TYPEFORM_SOURCE,
    "Pending Typeform RFQ Event ID": event.id,
    "Pending Typeform RFQ Submitted At": event.datetime,
    "Monday RFQ Lead ID": leadId,
  });

  let contact = preExistingContacts[0] || null;
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
  const finalProcessedIds = stringArray(
    profile.properties["Processed Typeform RFQ Event IDs"],
  );
  if (!finalProcessedIds.includes(event.id)) finalProcessedIds.push(event.id);

  await patchProfileProperties(profile.id, {
    "Lead Source": WEBSITE_LEAD_SOURCE,
    "RFQ Source": TYPEFORM_SOURCE,
    "RFQ Submitted At": event.datetime,
    "Last Processed Typeform RFQ Event ID": event.id,
    "Processed Typeform RFQ Event IDs": finalProcessedIds.slice(-50),
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

export async function recoverTypeformRfqEvents(
  mode: InboundRecoveryMode,
  options: { lookbackHours?: number; cutoverAt?: string | null } = {},
) {
  const metricId = await findTypeformMetricId();
  if (!metricId) {
    return {
      status: "waiting-for-first-typeform-event",
      metricName: TYPEFORM_METRIC_NAME,
      metricId: null,
      scanned: 0,
      results: [],
    };
  }

  const lookbackHours = Math.max(24, options.lookbackHours ?? 168);
  const lookback = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);
  const configuredCutover = new Date(
    options.cutoverAt || TYPEFORM_RFQ_PRODUCTION_CUTOVER_AT,
  );
  const since = configuredCutover > lookback ? configuredCutover : lookback;
  const events = await recentTypeformEvents(metricId, since);
  const results: Array<Record<string, unknown>> = [];

  for (const event of events) {
    try {
      results.push(await processTypeformEvent(event, mode));
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
    metricName: TYPEFORM_METRIC_NAME,
    metricId,
    since: since.toISOString(),
    scanned: events.length,
    results,
  };
}

const STANDARD_INBOUND_SOURCES = new Set([
  "Packaging Guide",
  "Newsletter",
  "Contact Us",
]);

async function contactUsMatches(email: string) {
  const query = `query ContactUsByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(
      board_id: $boardId,
      limit: 10,
      columns: [{column_id: "${CONTACT_US.email}", column_values: [$email]}]
    ) { items { id } }
  }`;
  const data = await monday<{
    items_page_by_column_values: { items: Array<{ id: string }> };
  }>(query, { boardId: MONDAY_CONTACT_US_BOARD_ID, email });
  return data.items_page_by_column_values.items;
}

async function createContactUs(profile: KlaviyoProfile, source: string) {
  const values: Record<string, unknown> = {
    [CONTACT_US.email]: { email: profile.email, text: profile.email },
    [CONTACT_US.subscribed]: { label: "Subscribed" },
    [CONTACT_US.comments]: `Klaviyo inbound intake | Profile ID: ${profile.id} | Source: ${source}`,
  };
  if (profile.firstName) values[CONTACT_US.firstName] = profile.firstName;
  if (profile.lastName) values[CONTACT_US.lastName] = profile.lastName;
  if (profile.phone) values[CONTACT_US.phone] = profile.phone;
  if (profile.organization) values[CONTACT_US.company] = profile.organization;

  const mutation = `mutation CreateContactUs($boardId: ID!, $name: String!, $values: JSON!) {
    create_item(board_id: $boardId, item_name: $name, column_values: $values) { id }
  }`;
  const data = await monday<{ create_item: { id: string } }>(mutation, {
    boardId: MONDAY_CONTACT_US_BOARD_ID,
    name: [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email,
    values: JSON.stringify(values),
  });
  return data.create_item.id;
}

export async function recoverStandardInboundProfiles(mode: InboundRecoveryMode) {
  const profiles = await allProfiles();
  const results: Array<Record<string, unknown>> = [];

  for (const profile of profiles) {
    if (text(profile.properties["Monday Contact ID"])) continue;
    const source = text(profile.properties["Acquisition Source"]);
    if (!source || !STANDARD_INBOUND_SOURCES.has(source)) continue;

    if (
      !profile.canReceiveMarketing ||
      profile.consent === "UNSUBSCRIBED" ||
      profile.suppressionReason
    ) {
      results.push({
        action: "blocked-not-marketable",
        profileId: profile.id,
        email: profile.email,
        source,
      });
      continue;
    }

    if (!profile.email) {
      results.push({ action: "blocked-missing-email", profileId: profile.id, source });
      continue;
    }

    const matches = await contactUsMatches(profile.email);
    if (matches.length > 1) {
      results.push({
        action: "blocked-ambiguous-contact-us",
        profileId: profile.id,
        email: profile.email,
        source,
      });
      continue;
    }
    if (matches.length === 1) {
      results.push({
        action: "already-present",
        profileId: profile.id,
        email: profile.email,
        source,
        contactUsItemId: matches[0].id,
      });
      continue;
    }

    if (mode === "preview") {
      results.push({
        action: "would-create",
        profileId: profile.id,
        email: profile.email,
        source,
      });
      continue;
    }

    const contactUsItemId = await createContactUs(profile, source);
    results.push({
      action: "created",
      profileId: profile.id,
      email: profile.email,
      source,
      contactUsItemId,
    });
  }

  return { scanned: profiles.length, eligible: results.length, results };
}
