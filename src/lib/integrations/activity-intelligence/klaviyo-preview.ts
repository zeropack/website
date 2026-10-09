import { KLAVIYO_API_REVISION } from "@/lib/integrations/klaviyo-monday/config";
import {
  listMondayContacts, listMondayKlaviyoMirrors, listKlaviyoProfiles,
} from "@/lib/integrations/klaviyo-monday/clients";
import { previewKlaviyoActivities, type KlaviyoEventInput } from "./preview";
import { activityTypeFor } from "./activity-types";

const METRIC_NAMES = new Set([
  "Received Email", "Opened Email", "Clicked Email",
  "Subscribed to Email Marketing", "Active on Site", "Filled Out Form",
]);

type KlaviyoEventResource = {
  id: string;
  attributes: {
    datetime?: string;
    event_properties?: Record<string, unknown>;
  };
  relationships?: {
    profile?: { data?: { id?: string } | null };
    metric?: { data?: { id?: string; attributes?: { name?: string } } | null };
  };
};

type KlaviyoResponse = {
  data?: KlaviyoEventResource[];
  included?: Array<{ id: string; type: string; attributes?: { name?: string } }>;
  links?: { next?: string | null };
};

const KLAVIYO_ORIGIN = "https://a.klaviyo.com";

/** Bounded, read-only Klaviyo API scan. No hidden full-account historical replay. */
export async function fetchRecentKlaviyoEvents(lookbackHours: number, maxPages: number): Promise<KlaviyoEventInput[]> {
  const key = process.env.KLAVIYO_PRIVATE_API_KEY;
  if (!key) throw new Error("Klaviyo API configuration missing");
  if (!Number.isInteger(lookbackHours) || lookbackHours < 1 || lookbackHours > 168) throw new Error("Invalid lookback");
  if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages > 5) throw new Error("Invalid page budget");
  const since = new Date(Date.now() - lookbackHours * 3600000).toISOString();
  let path: string | null = `/api/events/?filter=${encodeURIComponent(`greater-or-equal(datetime,${since})`)}&include=profile,metric&page[size]=100&sort=-datetime`;
  const events: KlaviyoEventInput[] = [];
  const pageUrls = new Set<string>();
  for (let page = 0; path && page < maxPages; page++) {
    const url: URL = new URL(path, KLAVIYO_ORIGIN);
    if (pageUrls.has(url.href)) throw new Error("Repeated Klaviyo pagination cursor");
    pageUrls.add(url.href);
    if (url.origin !== KLAVIYO_ORIGIN || !url.pathname.startsWith("/api/events/")) {
      throw new Error("Unsafe Klaviyo pagination URL");
    }
    const response: Response = await fetch(url, {
      headers: { Authorization: `Klaviyo-API-Key ${key}`, revision: KLAVIYO_API_REVISION, accept: "application/vnd.api+json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Klaviyo read failed: ${response.status}`);
    const body = await response.json() as KlaviyoResponse;
    const metrics = new Map((body.included || []).filter(x => x.type === "metric").map(x => [x.id, x.attributes?.name || ""]));
    for (const item of body.data || []) {
      const embeddedMetric = item.relationships?.metric?.data;
      const metricName = embeddedMetric?.attributes?.name || metrics.get(embeddedMetric?.id || "") || "";
      if (!METRIC_NAMES.has(metricName)) continue;
      events.push({
        id: item.id,
        metricName,
        profileId: item.relationships?.profile?.data?.id || null,
        occurredAt: item.attributes.datetime || "",
        properties: item.attributes.event_properties || {},
      });
    }
    path = body.links?.next || null;
  }
  if (path) throw new Error("Event page budget exhausted; refusing incomplete preview");
  return events;
}

/**
 * Human-readable dry-run, not a CRM writer.
 * An event is admitted only when a unique existing profile and Contact are linked.
 */
export async function previewRecentActivity(lookbackHours = 24, maxPages = 3) {
  const [events, contacts, mirrors, profiles] = await Promise.all([
    fetchRecentKlaviyoEvents(lookbackHours, maxPages),
    listMondayContacts(),
    listMondayKlaviyoMirrors(),
    listKlaviyoProfiles(),
  ]);
  const knownContacts = new Set(contacts.map(x => x.id));
  const profileIds = new Set(profiles.map(x => x.id));
  const byProfile = new Map<string, string[]>();
  for (const mirror of mirrors) {
    if (!mirror.profileId || !mirror.linkedContactId) continue;
    if (!profileIds.has(mirror.profileId) || !knownContacts.has(mirror.linkedContactId)) continue;
    const ids = byProfile.get(mirror.profileId) || [];
    ids.push(mirror.linkedContactId);
    byProfile.set(mirror.profileId, ids);
  }
  const result = previewKlaviyoActivities(events, byProfile, new Set());
  return {
    mode: "preview" as const,
    scanned: events.length,
    eligible: result.candidates.length,
    skipped: result.skipped,
    // No email addresses, secrets, arbitrary event properties, or message bodies returned.
    candidates: result.candidates.map(item => ({
      contactId: item.contactId,
      sourceEventId: item.sourceEventId,
      occurredAt: item.occurredAt,
      activityTypeId: activityTypeFor(item.kind),
      kind: item.kind,
      classification: item.class,
      confidence: item.confidence,
    })),
    warning: "Preview only. No Outlook reader, persistent ledger, CRM timeline writes or automated schedule is active.",
  };
}
