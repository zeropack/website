import { NextResponse } from "next/server";
import { getMarketFromHost, normalizeHost } from "@/lib/marketRouting";

/** Server-side quote intake — wire to CRM/email via env */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Treat the website hostname as the trusted market signal. Customer-entered country/region
  // remains separate so fulfilment location does not overwrite acquisition-market attribution.
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const requestHost = normalizeHost(forwardedHost || req.headers.get("host"));
  const resolved = getMarketFromHost(requestHost);
  const websiteMarket = resolved === "au" || resolved === "uk" ? resolved : "global";

  const referer = req.headers.get("referer");
  let sourcePagePath: string | null = null;
  if (referer) {
    try {
      sourcePagePath = new URL(referer).pathname;
    } catch {
      sourcePagePath = null;
    }
  }

  const enrichedBody = {
    ...body,
    websiteMarket,
    sourceHost: requestHost || null,
    sourcePagePath,
  };

  const webhook = process.env.QUOTE_WEBHOOK_URL;
  const secret = process.env.INTERNAL_API_SECRET;

  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "x-zp-secret": secret } : {}),
      },
      body: JSON.stringify(enrichedBody),
    }).catch(() => null);
  } else if (process.env.NODE_ENV === "development") {
    console.info("[quote intake]", JSON.stringify(enrichedBody, null, 2));
  }

  return NextResponse.json({ ok: true });
}
