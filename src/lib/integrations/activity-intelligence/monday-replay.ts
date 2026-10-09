import type { ActivityCandidate } from "./model";

/**
 * Read a complete CRM timeline before considering any write.
 * Caller MUST paginate the native timeline to completion; partial coverage fails closed.
 */
export type TimelineActivity = {
  id: string;
  type: string;
  content?: string | null;
  custom_activity_id?: string | null;
};

export function reconciliationKeysFromTimeline(
  entries: TimelineActivity[],
  complete: boolean,
): ReadonlySet<string> {
  if (!complete) throw new Error("Incomplete Monday timeline: activity sync disabled");
  const keys = new Set<string>();
  for (const entry of entries) {
    const content = entry.content || "";
    const match = /^Reconciliation key: (klaviyo:[A-Za-z0-9_-]+)$/m.exec(content);
    if (match) keys.add(match[1]);
  }
  return keys;
}

export function filterReplaySafeCandidates(
  entries: TimelineActivity[],
  complete: boolean,
  candidates: ActivityCandidate[],
): { pending: ActivityCandidate[]; duplicates: number } {
  const seen = new Set(reconciliationKeysFromTimeline(entries, complete));
  const pending: ActivityCandidate[] = [];
  let duplicates = 0;
  for (const candidate of candidates) {
    if (candidate.source !== "klaviyo" || !candidate.fingerprint.startsWith("klaviyo:")) {
      throw new Error("Only Klaviyo events are allowed in Phase 1");
    }
    if (seen.has(candidate.fingerprint)) {
      duplicates++;
      continue;
    }
    seen.add(candidate.fingerprint);
    pending.push(candidate);
  }
  return { pending, duplicates };
}
