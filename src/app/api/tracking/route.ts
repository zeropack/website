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

function htmlToText(value: string): string {
  return decodeEntities(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[\t\r ]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .trim();
}

function tableRows(html: string): string[][] {
  const rows: string[][] = [];
  for (const rowMatch of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = Array.from(
      rowMatch[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi),
      (cell) => htmlToText(cell[1]),
    ).filter(Boolean);
    if (cells.length) rows.push(cells);
  }
  return rows;
}

function looksLikeHeader(cells: string[]): boolean {
  const joined = cells.join(" ").toLowerCase();
  return joined.includes("date/time") && joined.includes("location");
}

function looksLikeDateTime(value: string): boolean {
  return (
    /\d{1,4}[\-/]\d{1,2}[\-/]\d{1,4}/.test(value) ||
    /\d{1,2}:\d{2}/.test(value) ||
    /\d{1,2}\s+[A-Za-z]{3,9}/.test(value)
  );
}

function readAttribute(tag: string, name: string): string {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match ? decodeEntities(match[1]).trim() : "";
}

function parseAttributeEvents(payload: string): TrackingEvent[] {
  const events: TrackingEvent[] = [];

  for (const match of payload.matchAll(/<[^>]+\bclass\s*=\s*["'][^"']*\btrackitem\b[^"']*["'][^>]*>/gi)) {
    const tag = match[0];
    const dateTime = readAttribute(tag, "sdate");
    const location = readAttribute(tag, "place");
    const details = readAttribute(tag, "intro");
    const waybill = readAttribute(tag, "billid") || null;
    const trackingNumber = readAttribute(tag, "transbillid") || null;

    if (!dateTime || !details) continue;
    events.push({ waybill, trackingNumber, dateTime, location, details });
  }

  return events;
}

function parseEvents(payload: string): TrackingEvent[] {
  const events: TrackingEvent[] = [...parseAttributeEvents(payload)];

  for (const cells of tableRows(payload)) {
    if (looksLikeHeader(cells)) continue;

    if (cells.length >= 5) {
      const [waybill, trackingNumber, dateTime, location, details] = cells;
      if (!dateTime || !details || !looksLikeDateTime(dateTime)) continue;
      events.push({
        waybill: waybill || null,
        trackingNumber: trackingNumber || null,
        dateTime,
        location: location || "",
        details,
      });
      continue;
    }

    if (cells.length >= 3 && looksLikeDateTime(cells[0])) {
      const [dateTime, location, ...detailCells] = cells;
      const details = detailCells.join(" — ").trim();
      if (!details) continue;
      events.push({
        waybill: null,
        trackingNumber: null,
        dateTime,
        location: location || "",
        details,
      });
    }
  }

  const deduped = new Map<string, TrackingEvent>();
  for (const event of events) {
    const key = `${event.dateTime}|${event.location}|${event.details}`.toLowerCase();
    if (!deduped.has(key)) deduped.set(key, event);
  }
  return Array.from(deduped.values());
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
  if (/ordered|shipping information received|label created|manifested|information received/.test(text)) {
    return { stage: "ordered", label: "Ordered" };
  }
  return { stage: "in_transit", label: "In transit" };
}

function detectCarrier(events: TrackingEvent[]): string | null {
  const text = events.map((event) => `${event.location} ${event.details}`).join(" ").toLowerCase();
  if (text.includes("australia post") || text.includes("auspost")) return "Australia Post";
  if (text.includes("startrack")) return "StarTrack";
  if (text.includes("dhl")) return "DHL";
  if (text.includes("fedex")) return "FedEx";
  if (text.includes("ups")) return "UPS";
  return null;
}

async function fetchKingtrans(url: string, init?: RequestInit): Promise<string> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-AU,en;q=0.9",
      "User-Agent": "Mozilla/5.0 (compatible; ZeroPackTracking/1.0; +https://zeropack.co/track)",
      ...(init?.headers || {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) throw new Error(`Kingtrans returned ${response.status}.`);

  const body = await response.text();
  if (body.length > MAX_UPSTREAM_BYTES) {
    throw new Error("Kingtrans tracking response exceeded the allowed size.");
  }
  return body;
}

async function fetchRepeatEvents(number: string): Promise<TrackingEvent[]> {
  const url = new URL(KINGTRANS_TRACK_PATH, KINGTRANS_ORIGIN);
  url.searchParams.set("action", "repeat");

  const body = new URLSearchParams({
    index: "0",
    billid: number,
    isRepeat: "no",
    language: "en",
  });

  const payload = await fetchKingtrans(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      Referer: `${KINGTRANS_ORIGIN}${KINGTRANS_TRACK_PATH}?bills=${encodeURIComponent(number)}&language=en`,
    },
    body: body.toString(),
  });

  let parseTarget = payload;
  try {
    const json = JSON.parse(payload) as unknown;
    parseTarget = JSON.stringify(json);
  } catch {
    // Kingtrans commonly returns HTML/XML-like fragments rather than JSON.
  }

  return parseEvents(parseTarget);
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
      console.warn(`[tracking] Kingtrans returned no parsed events for ${number}`);
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
