import { NextResponse } from "next/server";

const KLAVIYO_API_REVISION = "2025-07-15";
const TEST_PROFILE_ID = "01M0KP0TNR0DWKJ1KVC99SX7TW";
const STAGES = ["RFQ Requested", "RFQ Sent", "Won", "Lost"] as const;

export async function GET() {
  if (process.env.VERCEL_ENV !== "preview") {
    return new NextResponse(null, { status: 404 });
  }

  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "missing-klaviyo-key" }, { status: 500 });
  }

  const results: Array<{ stage: string; status: number }> = [];
  for (const stage of STAGES) {
    const response = await fetch("https://a.klaviyo.com/api/events", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        accept: "application/vnd.api+json",
        revision: KLAVIYO_API_REVISION,
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "event",
          attributes: {
            metric: {
              data: {
                type: "metric",
                attributes: { name: `Monday CRM Lifecycle — ${stage}` },
              },
            },
            profile: { data: { type: "profile", id: TEST_PROFILE_ID } },
            properties: {
              "Source System": "Monday CRM",
              "Commissioning Seed": true,
              "Lifecycle Stage": stage,
            },
            unique_id: `commissioning-api-lifecycle-${stage.toLowerCase().replaceAll(" ", "-")}-2026-08-24`,
            backfill: true,
          },
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json(
        { ok: false, stage, status: response.status, error: body.slice(0, 500) },
        { status: 502 },
      );
    }
    results.push({ stage, status: response.status });
  }

  return NextResponse.json({ ok: true, results });
}
