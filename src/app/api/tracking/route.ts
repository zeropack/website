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
  return (
    joined.includes("waybill") &&
    (joined.includes("date/time") || joined.includes("datetime")) &&
    joined.includes("details")
  );
}

function looksLikeDateTime(value: string): boolean {
  return (
    /\d{1,4}[\-/]\d{1,2}[\-/]\d{1,4}/.test(value) ||
    /\d{1,2}:\d{2}/.test(value) ||
    /\d{1,2}\s+[A-Za-z]{3,9}/.test(value)
  );
}

function parseEvents(html: string): TrackingEvent[] {
  const events: TrackingEvent[] = [];

  for (const cells of tableRows(html)) {
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

function sameOriginDetailUrls(html: string, trackingNumber: string): string[] {
  const urls = new Set<string>();

  for (const match of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    const href = decodeEntities(match[1]).trim();
    if (!href || href.startsWith("#") || href.toLowerCase().startsWith("javascript:")) {
      continue;
    }

    try {
      const url = new URL(href, KINGTRANS_ORIGIN);
      if (url.origin !== KINGTRANS_ORIGIN) continue;
      const candidate = url.toString();
      const lower = candidate.toLowerCase();
      if (
        lower.includes("track") &&
        (candidate.includes(trackingNumber) || lower.includes("detail"))
      ) {
        urls.add(candidate);
      }
    } catch {
      // Ignore malformed links in the upstream HTML.
    }
  }

  return Array.from(urls).slice(0, 3);
}

function statusFromEvents(events: TrackingEvent[]): {
  stage: TrackingStage;
  label: string;
} {
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

async function fetchKingtrans(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-AU,en;q=0.9",
      "User-Agent": "ZeroPackTracking/1.0 (+https://zeropack.co/track)",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    throw new Error(`Kingtrans returned ${response.status}.`);
  }

  const body = await response.text();
  if (body.length > MAX_UPSTREAM_BYTES) {
    throw new Error("Kingtrans tracking response exceeded the allowed size.");
  }
  return body;
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

  const upstream = new URL(KINGTRANS_TRACK_PATH, KINGTRANS_ORIGIN);
  upstream.searchParams.set("bills", number);
  upstream.searchParams.set("language", "en");

  try {
    const summaryHtml = await fetchKingtrans(upstream.toString());
    const allEvents = [...parseEvents(summaryHtml)];

    if (allEvents.length < 2) {
      const detailUrls = sameOriginDetailUrls(summaryHtml, number);
      for (const detailUrl of detailUrls) {
        try {
          const detailHtml = await fetchKingtrans(detailUrl);
          allEvents.push(...parseEvents(detailHtml));
        } catch (error) {
          console.warn("[tracking] Unable to fetch Kingtrans detail page", error);
        }
      }
    }

    const deduped = new Map<string, TrackingEvent>();
    for (const event of allEvents) {
      const key = `${event.dateTime}|${event.location}|${event.details}`.toLowerCase();
      if (!deduped.has(key)) deduped.set(key, event);
    }
    const events = Array.from(deduped.values());

    if (!events.length) {
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
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
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
