import { NextResponse } from "next/server";
import { KLAVIYO_API_REVISION } from "@/lib/integrations/klaviyo-monday/config";

const PROFILE_ID = "01M0HH6TB41WJHGQAKAJE2SEJJ";

async function kv(path: string) {
  const key = process.env.KLAVIYO_PRIVATE_API_KEY;
  if (!key) throw new Error("Missing KLAVIYO_PRIVATE_API_KEY");
  const response = await fetch(`https://a.klaviyo.com${path}`, {
    headers: {
      Authorization: `Klaviyo-API-Key ${key}`,
      accept: "application/vnd.api+json",
      revision: KLAVIYO_API_REVISION,
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Klaviyo ${response.status}: ${await response.text()}`);
  return response.json();
}

export async function GET() {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const profile = await kv(`/api/profiles/${PROFILE_ID}?additional-fields[profile]=subscriptions`);
  const params = new URLSearchParams({
    filter: `equals(profile_id,"${PROFILE_ID}")`,
    include: "metric",
    sort: "-datetime",
    "page[size]": "20",
    "fields[event]": "datetime,event_properties,id",
    "fields[metric]": "name,id,integration",
  });
  const events = await kv(`/api/events?${params}`);

  const attrs = profile.data.attributes;
  const props = attrs.properties || {};
  const selectedProperties = Object.fromEntries([
    "Lead Source",
    "RFQ Source",
    "RFQ Submitted At",
    "Last Processed Typeform RFQ Event ID",
    "Processed Typeform RFQ Event IDs",
    "Pending Typeform RFQ Event ID",
    "Pending Typeform RFQ Submitted At",
    "Monday RFQ Lead ID",
    "Monday Contact ID",
    "Lifecycle Stage",
    "CRM Status",
    "Welcome Status",
  ].map((key) => [key, props[key] ?? null]));

  const metrics = new Map((events.included || []).filter((x: any) => x.type === "metric").map((x: any) => [x.id, x.attributes?.name]));
  const eventSummary = (events.data || []).map((event: any) => ({
    id: event.id,
    datetime: event.attributes?.datetime,
    metricId: event.relationships?.metric?.data?.id || null,
    metricName: metrics.get(event.relationships?.metric?.data?.id) || null,
    properties: event.attributes?.event_properties || {},
  }));

  return NextResponse.json({
    ok: true,
    profile: {
      id: profile.data.id,
      email: attrs.email,
      properties: selectedProperties,
      emailMarketing: attrs.subscriptions?.email?.marketing || null,
    },
    events: eventSummary,
  }, { headers: { "Cache-Control": "no-store" } });
}
