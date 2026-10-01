import { NextRequest, NextResponse } from "next/server";
import { KLAVIYO_API_REVISION } from "@/lib/integrations/klaviyo-monday/config";

export const dynamic = "force-dynamic";

type ToolId = "mailer_size" | "layflat_tubing_size";

type ResultPayload = {
  email?: string;
  tool_id?: ToolId;
  tool_name?: string;
  market?: string;
  display_unit?: "mm" | "in";
  marketing_opt_in?: boolean;
  input_width_mm?: number;
  input_length_mm?: number;
  input_depth_mm?: number;
  recommended_width_mm?: number;
  recommended_length_mm?: number;
  flap_mm?: number | null;
  adhesive?: "single" | "double" | null;
  extra_room_mm?: number | null;
  width_clearance_mm?: number | null;
  cutter_tail_mm?: number | null;
};

const TOOL_SOURCE: Record<ToolId, string> = {
  mailer_size: "Website Tool — Mailer Size Calculator",
  layflat_tubing_size: "Website Tool — Layflat Tubing Calculator",
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 && value <= 5000;
}

async function klaviyo(path: string, body: unknown): Promise<void> {
  const response = await fetch(`https://a.klaviyo.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${requiredEnv("KLAVIYO_PRIVATE_API_KEY")}`,
      accept: "application/vnd.api+json",
      revision: KLAVIYO_API_REVISION,
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Klaviyo API error ${response.status}: ${detail.slice(0, 400)}`);
  }
}

export async function POST(req: NextRequest) {
  const payload = (await req.json().catch(() => null)) as ResultPayload | null;
  if (!payload) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const email = payload.email?.trim().toLowerCase() || "";
  if (!validEmail(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  if (payload.tool_id !== "mailer_size" && payload.tool_id !== "layflat_tubing_size") {
    return NextResponse.json({ ok: false, error: "Unknown calculator." }, { status: 400 });
  }

  const requiredNumbers = [
    payload.input_width_mm,
    payload.input_length_mm,
    payload.input_depth_mm,
    payload.recommended_width_mm,
    payload.recommended_length_mm,
  ];
  if (!requiredNumbers.every(validNumber)) {
    return NextResponse.json({ ok: false, error: "Invalid calculator result." }, { status: 400 });
  }

  const source = TOOL_SOURCE[payload.tool_id];
  const properties: Record<string, string | number | boolean> = {
    tool_id: payload.tool_id,
    tool_name: payload.tool_name || source.replace("Website Tool — ", ""),
    tool_type: payload.tool_id === "mailer_size" ? "mailer" : "layflat",
    website_market: payload.market || "global",
    display_unit: payload.display_unit === "in" ? "in" : "mm",
    input_width_mm: payload.input_width_mm!,
    input_length_mm: payload.input_length_mm!,
    input_depth_mm: payload.input_depth_mm!,
    recommended_width_mm: payload.recommended_width_mm!,
    recommended_length_mm: payload.recommended_length_mm!,
    marketing_opt_in: payload.marketing_opt_in === true,
    consent_source: source,
  };

  if (payload.tool_id === "mailer_size") {
    if (typeof payload.flap_mm === "number") properties.flap_mm = payload.flap_mm;
    if (payload.adhesive) properties.adhesive = payload.adhesive;
    if (typeof payload.extra_room_mm === "number") properties.extra_room_mm = payload.extra_room_mm;
  } else {
    if (typeof payload.width_clearance_mm === "number") properties.width_clearance_mm = payload.width_clearance_mm;
    if (typeof payload.cutter_tail_mm === "number") properties.cutter_tail_mm = payload.cutter_tail_mm;
  }

  try {
    await klaviyo("/api/events", {
      data: {
        type: "event",
        attributes: {
          metric: {
            data: {
              type: "metric",
              attributes: { name: "Website Tool Result Requested" },
            },
          },
          profile: {
            data: {
              type: "profile",
              attributes: { email },
            },
          },
          properties,
          unique_id: `website-tool:${payload.tool_id}:${crypto.randomUUID()}`,
          backfill: false,
        },
      },
    });

    if (payload.marketing_opt_in === true) {
      await klaviyo("/api/profile-subscription-bulk-create-jobs", {
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            custom_source: source,
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email,
                    subscriptions: {
                      email: {
                        marketing: { consent: "SUBSCRIBED" },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      });
    }

    return NextResponse.json({
      ok: true,
      result_email_requested: true,
      marketing_opt_in_recorded: payload.marketing_opt_in === true,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn’t save that request just now. Please try again." },
      { status: 502 },
    );
  }
}
