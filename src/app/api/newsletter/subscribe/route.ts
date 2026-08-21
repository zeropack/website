import { NextResponse } from "next/server";

import { KLAVIYO_API_REVISION } from "@/lib/integrations/klaviyo-monday/config";

const NEWSLETTER_LIST_ID = "VaVKfk";
const ACQUISITION_SOURCE = "Newsletter";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
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

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { email?: string; website?: string }
    | null;

  const email = body?.email?.trim().toLowerCase() || "";
  const honeypot = body?.website?.trim() || "";

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!validEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const imported = await klaviyo<{ data: { id: string } }>(
      "/api/profile-import?additional-fields[profile]=subscriptions",
      {
        method: "POST",
        body: JSON.stringify({
          data: {
            type: "profile",
            attributes: {
              email,
              properties: {
                "Acquisition Source": ACQUISITION_SOURCE,
                "Welcome Status": "No",
              },
            },
          },
        }),
      },
    );

    await klaviyo<void>("/api/profile-subscription-bulk-create-jobs", {
      method: "POST",
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            custom_source: "Zero Pack website footer newsletter",
            profiles: {
              data: [
                {
                  type: "profile",
                  id: imported.data.id,
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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[newsletter subscribe]", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to subscribe right now. Please try again.",
      },
      { status: 502 },
    );
  }
}
