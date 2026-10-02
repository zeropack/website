import { NextRequest, NextResponse } from "next/server";

import { KLAVIYO_API_REVISION, MONDAY_API_VERSION } from "@/lib/integrations/klaviyo-monday/config";

const COOKIE_NAME = "zp_reintro_token";
const EMAIL_COLUMN_ID = "contact_email";
const FIRST_NAME_COLUMN_ID = "text_mm5n6d0w";
const COMMENTS_COLUMN_ID = "long_text4";
const NEWSLETTER_LIST_ID = "VaVKfk";
const SUBSCRIPTION_SOURCE = "Zero Pack customer re-introduction — explicit landing-page opt-in";
const ACQUISITION_SOURCE = "ZWC Customer Re-introduction";

type MondayColumnValue = { id: string; text: string | null };

type ContactIdentity = {
  itemId: string;
  email: string;
  firstName: string | null;
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
      "API-Version": MONDAY_API_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (!response.ok || payload.errors?.length || !payload.data) {
    throw new Error(
      `Monday API error: ${payload.errors?.map((error) => error.message).join("; ") || response.status}`,
    );
  }
  return payload.data;
}

async function klaviyo<T>(path: string, init?: RequestInit): Promise<T> {
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
    throw new Error(`Klaviyo API error ${response.status}: ${body.slice(0, 400)}`);
  }

  if (response.status === 202 || response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function decodeToken(token: string): { itemId: string; nonce: string } | null {
  if (!/^[A-Za-z0-9_-]{30,180}$/.test(token)) return null;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const match = decoded.match(/^(\d+)\.([a-f0-9]{32,96})$/);
    if (!match) return null;
    return { itemId: match[1], nonce: match[2] };
  } catch {
    return null;
  }
}

function commentsContainToken(comments: string, token: string): boolean {
  return comments
    .split(/\r?\n/)
    .some((line) => line.trim() === `[ZP_SUBSCRIBE_TOKEN:${token}]`);
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "your email address";
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"•".repeat(Math.max(3, Math.min(8, local.length - visible.length)))}@${domain}`;
}

async function resolveContact(token: string): Promise<ContactIdentity | null> {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  const query = `
    query CustomerReintroContact($ids: [ID!]!) {
      items(ids: $ids) {
        id
        column_values(ids: ["${EMAIL_COLUMN_ID}", "${FIRST_NAME_COLUMN_ID}", "${COMMENTS_COLUMN_ID}"]) {
          id
          text
        }
      }
    }
  `;

  const data = await mondayGraphql<{
    items: Array<{ id: string; column_values: MondayColumnValue[] }>;
  }>(query, { ids: [decoded.itemId] });

  const item = data.items[0];
  if (!item || item.id !== decoded.itemId) return null;

  const columns = Object.fromEntries(item.column_values.map((column) => [column.id, column.text || ""]));
  const email = String(columns[EMAIL_COLUMN_ID] || "").trim().toLowerCase();
  const comments = String(columns[COMMENTS_COLUMN_ID] || "");
  const firstName = String(columns[FIRST_NAME_COLUMN_ID] || "").trim() || null;

  if (!validEmail(email) || !commentsContainToken(comments, token)) return null;

  return { itemId: item.id, email, firstName };
}

async function getKlaviyoProfile(email: string): Promise<{
  id: string;
  subscribed: boolean;
} | null> {
  const params = new URLSearchParams({
    filter: `equals(email,"${email.replaceAll('"', '\\"')}")`,
    "additional-fields[profile]": "subscriptions",
  });

  const result = await klaviyo<{
    data: Array<{
      id: string;
      attributes?: {
        subscriptions?: {
          email?: {
            marketing?: {
              consent?: string | null;
              can_receive_email_marketing?: boolean;
            };
          };
        };
      };
    }>;
  }>(`/api/profiles?${params.toString()}`);

  if (result.data.length > 1) throw new Error(`Multiple Klaviyo profiles found for ${email}.`);
  const profile = result.data[0];
  if (!profile) return null;

  const marketing = profile.attributes?.subscriptions?.email?.marketing;
  return {
    id: profile.id,
    subscribed: marketing?.consent === "SUBSCRIBED" && marketing.can_receive_email_marketing === true,
  };
}

async function createProfile(contact: ContactIdentity): Promise<string> {
  const result = await klaviyo<{ data: { id: string } }>("/api/profile-import", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "profile",
        attributes: {
          email: contact.email,
          ...(contact.firstName ? { first_name: contact.firstName } : {}),
          properties: {
            "Acquisition Source": ACQUISITION_SOURCE,
            "Welcome Status": "No",
          },
        },
      },
    }),
  });

  return result.data.id;
}

async function subscribe(profileId: string, email: string): Promise<void> {
  await klaviyo<void>("/api/profile-subscription-bulk-create-jobs/", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          custom_source: SUBSCRIPTION_SOURCE,
          profiles: {
            data: [
              {
                type: "profile",
                id: profileId,
                attributes: {
                  email,
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: "SUBSCRIBED",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        relationships: {
          list: {
            data: {
              type: "list",
              id: NEWSLETTER_LIST_ID,
            },
          },
        },
      },
    }),
  });
}

async function subscriptionConfirmed(email: string): Promise<boolean> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const profile = await getKlaviyoProfile(email);
    if (profile?.subscribed) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

function clearTokenCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value || "";

  try {
    const contact = await resolveContact(token);
    if (!contact) {
      return NextResponse.json(
        { ok: false, error: "This subscription link is not valid. Please use the link from your email." },
        { status: 400 },
      );
    }

    const profile = await getKlaviyoProfile(contact.email);
    return NextResponse.json({
      ok: true,
      maskedEmail: maskEmail(contact.email),
      alreadySubscribed: Boolean(profile?.subscribed),
    });
  } catch (error) {
    console.error("[customer reintro subscribe lookup]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to load this subscription right now. Please try again." },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value || "";
  const body = (await request.json().catch(() => null)) as { confirm?: boolean } | null;

  if (body?.confirm !== true) {
    return NextResponse.json({ ok: false, error: "Subscription confirmation is required." }, { status: 400 });
  }

  try {
    const contact = await resolveContact(token);
    if (!contact) {
      return NextResponse.json(
        { ok: false, error: "This subscription link is not valid. Please use the link from your email." },
        { status: 400 },
      );
    }

    const existing = await getKlaviyoProfile(contact.email);
    if (existing?.subscribed) {
      const response = NextResponse.json({ ok: true, pending: false, alreadySubscribed: true });
      clearTokenCookie(response);
      return response;
    }

    const profileId = existing?.id || (await createProfile(contact));
    await subscribe(profileId, contact.email);

    if (!(await subscriptionConfirmed(contact.email))) {
      return NextResponse.json({ ok: true, pending: true }, { status: 202 });
    }

    const response = NextResponse.json({ ok: true, pending: false });
    clearTokenCookie(response);
    return response;
  } catch (error) {
    console.error("[customer reintro subscribe]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to subscribe right now. Please try again." },
      { status: 502 },
    );
  }
}
