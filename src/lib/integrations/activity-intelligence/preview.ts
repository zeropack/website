import {
  activityKey,
  classifyKlaviyoMetric,
  uniqueContactId,
  type ActivityCandidate,
} from "./model";

/** Read-only normalization for a single Klaviyo activity event. */
export type KlaviyoEventInput = {
  id: string;
  metricName: string;
  profileId: string | null;
  occurredAt: string;
  properties: Record<string, unknown>;
};

/**
 * Matching is supplied by the existing governed Klaviyo profile mirror.
 * Ambiguous or missing matches are deliberately skipped.
 */
export function previewKlaviyoActivities(
  events: KlaviyoEventInput[],
  contactIdsByProfileId: Map<string, string[]>,
  alreadyRecorded: ReadonlySet<string>,
): { candidates: ActivityCandidate[]; skipped: Record<string, number> } {
  const candidates: ActivityCandidate[] = [];
  const skipped: Record<string, number> = {
    unmatched: 0, unsupported: 0, duplicate: 0, invalid: 0,
  };
  const seen = new Set(alreadyRecorded);

  for (const event of events) {
    if (!event.id || !event.profileId || !Number.isFinite(Date.parse(event.occurredAt))) {
      skipped.invalid++;
      continue;
    }
    const contactId = uniqueContactId(contactIdsByProfileId.get(event.profileId) || []);
    if (!contactId) {
      skipped.unmatched++;
      continue;
    }
    const classification = classifyKlaviyoMetric(event.metricName, event.properties);
    if (!classification) {
      skipped.unsupported++;
      continue;
    }
    const fingerprint = activityKey("klaviyo", event.id);
    if (seen.has(fingerprint)) {
      skipped.duplicate++;
      continue;
    }
    seen.add(fingerprint);
    const summary = `${event.metricName} (Klaviyo)`;
    candidates.push({
      source: "klaviyo",
      sourceEventId: event.id,
      contactId,
      occurredAt: new Date(event.occurredAt).toISOString(),
      kind: classification.kind,
      class: classification.class,
      confidence: classification.confidence,
      summary,
      fingerprint,
    });
  }
  return { candidates, skipped };
}
