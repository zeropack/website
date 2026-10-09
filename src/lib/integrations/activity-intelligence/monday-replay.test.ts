import assert from "node:assert/strict";
import test from "node:test";
import { filterReplaySafeCandidates } from "./monday-replay";
import type { ActivityCandidate } from "./model";

const candidate: ActivityCandidate = {
  source: "klaviyo", sourceEventId: "7w2gCrfbNEi", contactId: "2865231882",
  occurredAt: "2026-10-09T06:10:41Z", kind: "klaviyo_email_opened",
  class: "diagnostic", confidence: "basic", summary: "Opened Email",
  fingerprint: "klaviyo:7w2gCrfbNEi",
};

test("real pilot activity key blocks repeat import", () => {
  const entries = [{ id: "94169a27-ba02-405d-b645-6c8534a97638", type: "custom",
    content: "Source: Klaviyo\nReconciliation key: klaviyo:7w2gCrfbNEi\nClassification: diagnostic/basic engagement only",
  }];
  const result = filterReplaySafeCandidates(entries, true, [candidate]);
  assert.equal(result.pending.length, 0);
  assert.equal(result.duplicates, 1);
});

test("incomplete timeline fails closed", () => {
  assert.throws(() => filterReplaySafeCandidates([], false, [candidate]), /Incomplete Monday timeline/);
});

test("outlook cannot enter phase 1", () => {
  assert.throws(() => filterReplaySafeCandidates([], true, [{ ...candidate, source: "outlook" }]), /Only Klaviyo/);
});
