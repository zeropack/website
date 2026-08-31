import { NextResponse } from "next/server";

type TrackingEvent = {
  waybill: string | null;
  trackingNumber: string | null;
  dateTime: string;
  location: string;
  details: string;
};

type TrackingStage = "ordered" | "in_transit" | "out_for_delivery" | "delivered";

const KINGTRANS_ORIGIN = "https://ausdirect.kingtrans.net";
const KINGTRANS_TRACK_PATH = "/WebTrack";
const MAX_UPSTREAM_BYTES = 1_500_000;

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
}

function readAttribute(tag: string, name: string): string {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match ? decodeEntities(match[1]).trim() : "";
}

function parseXmlEvents(payload: string, fallbackTrackingNumber: string): TrackingEvent[] {
  const parentTrack = payload.match(/<track\b[^>]*>/i)?.[0] || "";
  const waybill = readAttribute(parentTrack, "billid") || fallbackTrackingNumber || null;
  const trackingNumber =
    readAttribute(parentTrack, "transbillid") || fallbackTrackingNumber || null;

  const events: TrackingEvent[] = [];
  for (const match of payload.matchAll(/<trackitem\b[^>]*\/?\s*>/gi)) {
    const tag = match[0];
    const dateTime = readAttribute(tag, "sdate");
    const location = readAttribute(tag, "place");
    const details = readAttribute(tag, "intro");
    if (!dateTime || !details) continue;
    events.push({ waybill, trackingNumber, dateTime, location, details });
  }

  const deduped = new Map<string, TrackingEvent>();
  for (const event of events) {
    const key = `${event.dateTime}|${event.location}|${event.details}`.toLowerCase();
    if (!deduped.has(key)) deduped.set(key, event);
  }

  return Array.from(deduped.values()).sort((a, b) =>
    b.dateTime.localeCompare(a.dateTime),
  );
}

function statusFromEvents(events: TrackingEvent[]): { stage: TrackingStage; label: string } {
  const latest = events[0];
  const text = `${latest?.details || ""} ${latest?.location || ""}`.toLowerCase();

  if (/delivered|signed for|left in (a )?safe place|proof of delivery/.test(text)) {
    return { stage: "delivered", label: "Delivered" };
  }
  if (/out for delivery|onboard for delivery|with courier|courier for delivery/.test(text)) {
    return { stage: "out_for_delivery", label: "Out for delivery" };
  }
  if (/ordered|shipping information received|label created|manifested|information received|shipment submitted/.test(text)) {
    return { stage: "ordered", label: "Ordered" };
  }
  return { stage: "in_transit", label: "In transit" };
}

function detectCarrier(events: TrackingEvent[]): string | null {
  const text = events
    .map((event) => `${event.location} ${event.details}`)
    .join(" ")
    .toLowerCase();

  if (text.includes("australia post") || text.includes("auspost")) return "Australia Post";
  if (text.includes("startrack")) return "StarTrack";
  if (text.includes("dhl")) return "DHL";
  if (text.includes("fedex")) return "FedEx";
  if (text.includes("ups")) return "UPS";
  return null;
}

function cookieHeader(response: Response): string | null {
  const getSetCookie = (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  const cookies = typeof getSetCookie === "function" ? getSetCookie.call(response.headers) : [];
  const values = cookies.length ? cookies : response.headers.get("set-cookie") ? [response.headers.get("set-cookie")!] : [];
  if (!values.length) return null;
  return values.map((value) => value.split(";", 1)[0]).join("; ");
}

async function readBody(response: Response): Promise<string> {
  if (!response.ok) throw new Error(`Kingtrans returned ${response.status}.`);
  const body = await response.text();
  if (body.length > MAX_UPSTREAM_BYTES) {
    throw new Error("Kingtrans tracking response exceeded the allowed size.");
  }
  return body;
}

async function fetchRepeatEvents(number: string): Promise<TrackingEvent[]> {
  const initialUrl = new URL(KINGTRANS_TRACK_PATH, KINGTRANS_ORIGIN);
  initialUrl.searchParams.set("bills", number);
  initialUrl.searchParams.set("language", "en");

  const commonHeaders = {
    Accept: "*/*",
    "Accept-Language": "en-AU,en;q=0.9",
    "User-Agent": "Mozilla/5.0 (compatible; ZeroPackTracking/1.0; +https://zeropack.co/track)",
  };

  const initialResponse = await fetch(initialUrl, {
    headers: commonHeaders,
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(12_000),
  });
  await readBody(initialResponse);
  const cookie = cookieHeader(initialResponse);

  const repeatUrl = new URL(KINGTRANS_TRACK_PATH, KINGTRANS_ORIGIN);
  repeatUrl.searchParams.set("action", "repeat");

  const body = new URLSearchParams({
    index: "0",
    billid: number,
    isRepeat: "no",
    language: "en",
  });

  const repeatResponse = await fetch(repeatUrl, {
    method: "POST",
    headers: {
      ...commonHeaders,
      Accept: "application/xml,text/xml,*/*;q=0.8",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      Origin: KINGTRANS_ORIGIN,
      Referer: initialUrl.toString(),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body.toString(),
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  const payload = await readBody(repeatResponse);
  return parseXmlEvents(payload, number);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get("number")?.trim() || "";

  if (!/^[A-Za-z0-9][A-Za-z0-9._\/-]{3,39}$/.test(number)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid tracking number." },
      { status: 400 },
    );
  }

  try {
    const events = await fetchRepeatEvents(number);

    if (!events.length) {
      console.warn(`[tracking] Kingtrans returned no parsed XML events for ${number}`);
      return NextResponse.json(
        {
          ok: false,
          error: "We couldn't find tracking events for that number yet. Please check the number or try again shortly.",
        },
        { status: 404 },
      );
    }

    const status = statusFromEvents(events);
    const latest = events[0];

    return NextResponse.json(
      {
        ok: true,
        trackingNumber: number,
        carrier: detectCarrier(events),
        status,
        latestUpdate: latest.dateTime,
        latestLocation: latest.location || null,
        events,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("[tracking]", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Tracking is temporarily unavailable. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}
