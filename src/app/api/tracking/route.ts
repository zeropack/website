import { NextResponse } from "next/server";

type TrackingEvent = {
  waybill: string | null;
  trackingNumber: string | null;
  dateTime: string;
  location: string;
  details: string;
};

type TrackingStage = "ordered" | "in_transit" | "out_for_delivery" | "delivered";
type TrackingMapKind = "carrier" | "event" | "destination_port" | "destination";

type PublicDestination = {
  label: string;
  locality: string | null;
  state: string | null;
  postcode: string | null;
  country: string | null;
};

type ProjectEnrichment = {
  eta: string | null;
  status: string | null;
  destination: PublicDestination | null;
};

type TrackingMap = {
  query: string;
  display: string;
  label: string;
  kind: TrackingMapKind;
  note: string;
};

const KINGTRANS_ORIGIN = "https://ausdirect.kingtrans.net";
const KINGTRANS_TRACK_PATH = "/WebTrack";
const MAX_UPSTREAM_BYTES = 1_500_000;

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_CLIENT_PROJECTS_BOARD_ID = "5029468197";
const MONDAY_TRACKING_COLUMN_ID = "text_mm4p92n3";
const MONDAY_ETA_COLUMN_ID = "date_mm5ncqc6";
const MONDAY_STATUS_COLUMN_ID = "project_status";
const MONDAY_COMPANY_RELATION_COLUMN_ID = "board_relation_mm6471v8";
const MONDAY_COMPANY_LOCATION_COLUMN_ID = "location_mm4nwpvd";

const DESTINATION_PORTS: Partial<Record<string, { query: string; display: string }>> = {
  NSW: { query: "Port Botany NSW Australia", display: "Sydney / Port Botany, NSW" },
  VIC: { query: "Port of Melbourne VIC Australia", display: "Melbourne port region, VIC" },
  SA: { query: "Port Adelaide SA Australia", display: "Port Adelaide, SA" },
  QLD: { query: "Port of Brisbane QLD Australia", display: "Brisbane port region, QLD" },
  WA: { query: "Fremantle Port WA Australia", display: "Fremantle / Perth port region, WA" },
  TAS: { query: "Port of Hobart TAS Australia", display: "Hobart port region, TAS" },
  NT: { query: "Port Darwin NT Australia", display: "Darwin port region, NT" },
};

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
  if (/out for delivery|onboard for delivery|with courier|courier for delivery|prepare for delivery|picked up for delivery\s*\(destination\)/.test(text)) {
    return { stage: "out_for_delivery", label: "Out for delivery" };
  }
  if (/ordered|shipping information received|label created|manifested|shipment submitted/.test(text)) {
    return { stage: "ordered", label: "Ordered" };
  }
  return { stage: "in_transit", label: "In transit" };
}

function isGenericCarrierLocation(value: string): boolean {
  const normalised = value.trim().toLowerCase();
  if (!normalised) return true;
  if (normalised.includes("ausdirect")) return true;
  return /^(warehouse|depot|facility|hub|clearance facility|customs|port)$/i.test(normalised);
}

function eventPlace(details: string): { query: string; display: string } | null {
  const expectedPort = details.match(/expected to arrive at\s+(.+?\bport)\b/i)?.[1]?.replace(/\s+/g, " ").trim();
  if (expectedPort) {
    const australian = /\b(sydney|melbourne|perth|brisbane|adelaide|fremantle|darwin|hobart)\b/i.test(expectedPort);
    return {
      query: australian ? `${expectedPort} Australia` : expectedPort,
      display: expectedPort,
    };
  }

  const facility = details.match(/arriv(?:e|ed) at\s+([A-Za-z][A-Za-z .'-]{2,40})\s+facility\b/i)?.[1]?.trim();
  if (facility) {
    return { query: `${facility} China`, display: facility };
  }

  const heading = details.match(/heading towards\s+([A-Za-z][A-Za-z .'-]{2,40})\b/i)?.[1]?.trim();
  if (heading) {
    return { query: `${heading} China`, display: heading };
  }

  return null;
}

function isDestinationSide(details: string): boolean {
  return /ship arrived destination port|port of discharge|discharged\s*\(port of discharge\)|consignment (?:information reported to|cleared by|held by) customs|consignment cleared by aqis|clearance facility|container available|carrier released|freight\s*charges\s*settled/i.test(details);
}

function isLastMile(details: string): boolean {
  return /last mile delivery|sorting at local depot|prepare for delivery|picked up for delivery\s*\(destination\)|out for delivery|onboard for delivery|with courier|courier for delivery|delivered|signed for/i.test(details);
}

function isLabelOnly(details: string): boolean {
  return /label created|shipment submitted|shipping information received|manifested/i.test(details);
}

function destinationMap(destination: PublicDestination, ordered: boolean): TrackingMap {
  return {
    query: destination.label,
    display: destination.label,
    label: "Delivery destination",
    kind: "destination",
    note: ordered
      ? "Label created — waiting for the first physical carrier movement."
      : "Carrier location is not available for this update, so the map is showing the delivery destination.",
  };
}

function buildTrackingMap(
  events: TrackingEvent[],
  status: { stage: TrackingStage; label: string },
  project: ProjectEnrichment | null,
): TrackingMap | null {
  const latest = events[0];
  if (!latest) return project?.destination ? destinationMap(project.destination, status.stage === "ordered") : null;

  const rawLocation = latest.location.trim();
  if (rawLocation && !isGenericCarrierLocation(rawLocation)) {
    return {
      query: rawLocation,
      display: rawLocation,
      label: "Latest tracking location",
      kind: "carrier",
      note: "Location supplied by the carrier tracking feed. This is not a live GPS position.",
    };
  }

  const explicitPlace = eventPlace(latest.details);
  if (explicitPlace) {
    return {
      ...explicitPlace,
      label: "Carrier-reported route",
      kind: "event",
      note: "Map position is based on the place named in the latest carrier update. This is not a live GPS position.",
    };
  }

  if (status.stage === "delivered" || isLastMile(latest.details)) {
    return project?.destination ? destinationMap(project.destination, false) : null;
  }

  if (isDestinationSide(latest.details)) {
    const state = project?.destination?.state || "";
    const port = DESTINATION_PORTS[state];
    if (port) {
      return {
        ...port,
        label: "Destination port region",
        kind: "destination_port",
        note: "Approximate destination port region based on the delivery state. This is not a live scan or GPS location.",
      };
    }
  }

  if (project?.destination) {
    return destinationMap(project.destination, status.stage === "ordered" || isLabelOnly(latest.details));
  }

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

function parsePublicDestination(rawValue: string | null | undefined): PublicDestination | null {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as {
      address?: string;
      city?: { long_name?: string };
      country?: { long_name?: string };
    };
    const address = parsed.address?.trim() || "";
    const locality = parsed.city?.long_name?.trim() || null;
    const state = address.match(/\b(ACT|NSW|NT|QLD|SA|TAS|VIC|WA)\b/i)?.[1]?.toUpperCase() || null;
    const postcode = address.match(/\b(\d{4})\b(?=\s*(?:Australia)?\s*$)/i)?.[1] || null;
    const country = parsed.country?.long_name?.trim() || null;

    const label = [locality, state, postcode].filter(Boolean).join(" ").trim();
    if (!label) return null;

    return { label, locality, state, postcode, country };
  } catch {
    return null;
  }
}

async function fetchProjectEnrichment(number: string): Promise<ProjectEnrichment | null> {
  const token = process.env.MONDAY_API_TOKEN?.trim();
  if (!token) return null;

  const query = `
    query TrackingProject($boardId: ID!, $columnId: String!, $value: String!) {
      items_page_by_column_values(
        board_id: $boardId,
        columns: [{ column_id: $columnId, column_values: [$value] }],
        limit: 2
      ) {
        items {
          column_values(ids: ["${MONDAY_ETA_COLUMN_ID}", "${MONDAY_STATUS_COLUMN_ID}", "${MONDAY_COMPANY_RELATION_COLUMN_ID}"]) {
            id
            text
            value
            ... on BoardRelationValue {
              linked_items {
                column_values(ids: ["${MONDAY_COMPANY_LOCATION_COLUMN_ID}"]) {
                  id
                  value
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        boardId: MONDAY_CLIENT_PROJECTS_BOARD_ID,
        columnId: MONDAY_TRACKING_COLUMN_ID,
        value: number,
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) throw new Error(`Monday returned ${response.status}.`);

  const payload = (await response.json()) as {
    errors?: Array<{ message?: string }>;
    data?: {
      items_page_by_column_values?: {
        items?: Array<{
          column_values?: Array<{
            id: string;
            text?: string | null;
            value?: string | null;
            linked_items?: Array<{
              column_values?: Array<{ id: string; value?: string | null }>;
            }>;
          }>;
        }>;
      };
    };
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message || "Monday tracking lookup failed.");
  }

  const items = payload.data?.items_page_by_column_values?.items || [];
  if (items.length !== 1) return null;

  const columns = items[0].column_values || [];
  const eta = columns.find((column) => column.id === MONDAY_ETA_COLUMN_ID)?.text?.trim() || null;
  const status = columns.find((column) => column.id === MONDAY_STATUS_COLUMN_ID)?.text?.trim() || null;
  const relation = columns.find((column) => column.id === MONDAY_COMPANY_RELATION_COLUMN_ID);
  const locationValue = relation?.linked_items?.[0]?.column_values?.find(
    (column) => column.id === MONDAY_COMPANY_LOCATION_COLUMN_ID,
  )?.value;

  return {
    eta,
    status,
    destination: parsePublicDestination(locationValue),
  };
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
    const projectPromise = fetchProjectEnrichment(number).catch((error) => {
      console.warn("[tracking] Monday enrichment unavailable", error);
      return null;
    });
    const events = await fetchRepeatEvents(number);
    const project = await projectPromise;

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
    const latestLocation = latest.location && !isGenericCarrierLocation(latest.location) ? latest.location : null;
    const map = buildTrackingMap(events, status, project);

    return NextResponse.json(
      {
        ok: true,
        trackingNumber: number,
        carrier: "Kingtrans",
        status,
        latestUpdate: latest.dateTime,
        latestLocation,
        map,
        project,
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
