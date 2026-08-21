import {
  KLAVIYO_API_REVISION,
  MONDAY_API_VERSION,
  MONDAY_CONTACTS_BOARD_ID,
} from "./config";

const MONDAY_CONTACT_US_BOARD_ID = 5029468391;

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
} as const;

export const STANDARD_INBOUND_PRODUCTION_CUTOVER_AT =
  "2026-08-21T09:06:00.000Z";

export type StandardInboundMode = "preview" | "apply";
type StandardInboundSource = "Packaging Guide" | "Newsletter" | "Contact Us";

const APPROVED_SOURCES = new Set<StandardInboundSource>([
  "Packaging Guide",
  "Newsletter",
  "Contact Us",
]);

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
  updated: string;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
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
      `Monday API error: ${payload.errors?.map((e) => e.message).join("; ") || response.status}`,
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

function mapProfile(resource: any): Profile {
  const attrs = resource?.attributes || {};
  const props = attrs.properties || {};
  const marketing = attrs.subscriptions?.email?.marketing || {};
  return {
    id: String(resource?.id || ""),
    email: String(attrs.email || "").trim().toLowerCase(),
    firstName: text(attrs.first_name),
    lastName: text(attrs.last_name),
    phone: text(attrs.phone_number),
    company:
      text(attrs.organization) || text(props.Company) || text(props["Company Name"]),
    mondayContactId: text(props["Monday Contact ID"]),
    acquisitionSource: text(props["Acquisition Source"]),
    canReceiveMarketing: marketing.can_receive_email_marketing === true,
    consent: text(marketing.consent),
    suppressionReason: text(marketing.suppression?.[0]?.reason),
    updated: String(attrs.updated || ""),
  };
}

function sourceAllowed(value: string | null): value is StandardInboundSource {
  return Boolean(value && APPROVED_SOURCES.has(value as StandardInboundSource));
}

async function profilesUpdatedAfter(cutoverAt: string): Promise<Profile[]> {
  const params = new URLSearchParams({
    filter: `greater-than(updated,${cutoverAt})`,
    "additional-fields[profile]": "subscriptions",
    "page[size]": "100",
    sort: "updated",
  });
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

async function contactMatches(email: string) {
  const query = `query ContactsByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(
      board_id: $boardId,
      limit: 10,
      columns: [{column_id: "${CONTACT.email}", column_values: [$email]}]
    ) { items { id } }
  }`;
  const data = await monday<{
    items_page_by_column_values: { items: Array<{ id: string }> };
  }>(query, { boardId: MONDAY_CONTACTS_BOARD_ID, email });
  return data.items_page_by_column_values.items;
}

async function createContactUs(profile: Profile, source: StandardInboundSource) {
  const values: Record<string, unknown> = {
    [CONTACT_US.email]: { email: profile.email, text: profile.email },
    [CONTACT_US.subscribed]: { label: "Subscribed" },
    [CONTACT_US.comments]:
      `Klaviyo inbound intake | Profile ID: ${profile.id} | Source: ${source}`,
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

async function bindMondayContact(profileId: string, contactId: string) {
  await klaviyo(`/api/profiles/${encodeURIComponent(profileId)}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "profile",
        id: profileId,
        attributes: {
          properties: { "Monday Contact ID": contactId },
        },
      },
    }),
  });
}

export async function recoverStandardInboundProfilesV2(
  mode: StandardInboundMode,
  options: { cutoverAt?: string } = {},
) {
  const cutoverAt = options.cutoverAt || STANDARD_INBOUND_PRODUCTION_CUTOVER_AT;
  const cutover = new Date(cutoverAt);
  if (Number.isNaN(cutover.getTime())) {
    throw new Error("Invalid standard inbound cutover timestamp.");
  }

  const profiles = await profilesUpdatedAfter(cutover.toISOString());
  const results: Array<Record<string, unknown>> = [];

  for (const profile of profiles) {
    if (!sourceAllowed(profile.acquisitionSource)) continue;
    if (!profile.email) {
      results.push({ profileId: profile.id, action: "blocked-missing-email" });
      continue;
    }
    if (profile.mondayContactId) {
      results.push({
        profileId: profile.id,
        email: profile.email,
        source: profile.acquisitionSource,
        action: "already-bound",
        mondayContactId: profile.mondayContactId,
      });
      continue;
    }

    // Standard inbound sources are marketing-acquisition forms, unlike hard RFQs.
    // They may create CRM intake only when Klaviyo currently confirms marketability.
    if (
      !profile.canReceiveMarketing ||
      profile.consent === "UNSUBSCRIBED" ||
      profile.suppressionReason
    ) {
      results.push({
        profileId: profile.id,
        email: profile.email,
        source: profile.acquisitionSource,
        action: "blocked-not-marketable",
        consent: profile.consent,
        suppression: profile.suppressionReason,
      });
      continue;
    }

    const contacts = await contactMatches(profile.email);
    if (contacts.length > 1) {
      results.push({
        profileId: profile.id,
        email: profile.email,
        source: profile.acquisitionSource,
        action: "blocked-ambiguous-contact",
        matches: contacts.map((item) => item.id),
      });
      continue;
    }
    if (contacts.length === 1) {
      if (mode === "apply") await bindMondayContact(profile.id, contacts[0].id);
      results.push({
        profileId: profile.id,
        email: profile.email,
        source: profile.acquisitionSource,
        action: mode === "apply" ? "bound-existing-contact" : "would-bind-existing-contact",
        mondayContactId: contacts[0].id,
        marketingConsentChanged: false,
      });
      continue;
    }

    const contactUs = await contactUsMatches(profile.email);
    if (contactUs.length > 1) {
      results.push({
        profileId: profile.id,
        email: profile.email,
        source: profile.acquisitionSource,
        action: "blocked-ambiguous-contact-us",
        matches: contactUs.map((item) => item.id),
      });
      continue;
    }
    if (contactUs.length === 1) {
      results.push({
        profileId: profile.id,
        email: profile.email,
        source: profile.acquisitionSource,
        action: "awaiting-contact-automation",
        contactUsItemId: contactUs[0].id,
      });
      continue;
    }

    if (mode === "preview") {
      results.push({
        profileId: profile.id,
        email: profile.email,
        source: profile.acquisitionSource,
        action: "would-create-contact-us",
        marketingConsentChanged: false,
      });
      continue;
    }

    const contactUsItemId = await createContactUs(profile, profile.acquisitionSource);
    results.push({
      profileId: profile.id,
      email: profile.email,
      source: profile.acquisitionSource,
      action: "created-contact-us",
      contactUsItemId,
      marketingConsentChanged: false,
    });
  }

  return {
    cutoverAt: cutover.toISOString(),
    scannedUpdatedProfiles: profiles.length,
    eligibleSourceProfiles: results.length,
    results,
  };
}
