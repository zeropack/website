import assert from "node:assert/strict";
import test from "node:test";
import { previewKlaviyoActivities } from "./preview";

test("normalizes unique matched Klaviyo events and suppresses duplicates", () => {
  const event = { id: "evt_1", metricName: "Opened Email", profileId: "p1", occurredAt: "2026-10-09T00:00:00Z", properties: { machine_open: true } };
  const map = new Map([["p1", ["101"]]]);
  const first = previewKlaviyoActivities([event, event], map, new Set());
  assert.equal(first.candidates.length, 1);
  assert.equal(first.candidates[0].class, "diagnostic");
  assert.equal(first.skipped.duplicate, 1);
  const replay = previewKlaviyoActivities([event], map, new Set(["klaviyo:evt_1"]));
  assert.equal(replay.candidates.length, 0);
});

test("does not create activities for ambiguous profile matches", () => {
  const result = previewKlaviyoActivities(
    [{ id: "evt", metricName: "Clicked Email", profileId: "p1", occurredAt: "2026-10-09T00:00:00Z", properties: {} }],
    new Map([["p1", ["100", "101"]]]), new Set()
  );
  assert.equal(result.candidates.length, 0);
  assert.equal(result.skipped.unmatched, 1);
});

test("recognizes the observed Klaviyo Packaging Guide form event without classifying an RFQ form as guide", () => {
  const entries = [
    { id: "a", metricName: "Filled Out Form", profileId: "p1", occurredAt: "2026-10-09T00:00:00Z", properties: { step_name: "Packaging Guide signup", page_url: "https://www.zeropack.co/packaging-guide/download" } },
    { id: "b", metricName: "Filled Out Form", profileId: "p1", occurredAt: "2026-10-09T00:00:00Z", properties: { step_name: "RFQ enquiry", page_url: "https://www.zeropack.co/contact" } },
  ];
  const result = previewKlaviyoActivities(entries, new Map([["p1", ["101"]]]), new Set());
  assert.equal(result.candidates.length, 1);
  assert.equal(result.candidates[0].kind, "klaviyo_guide_signup");
});
