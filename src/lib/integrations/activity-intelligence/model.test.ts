import assert from "node:assert/strict";
import test from "node:test";
import {
  activityKey, classifyKlaviyoMetric, mayPromoteCommercialState,
  sameEmail, shouldRecoverOutlookMessage, uniqueContactId,
} from "./model";

test("rejects ambiguous and missing contact matches", () => {
  assert.equal(uniqueContactId([]), null);
  assert.equal(uniqueContactId(["123", "456"]), null);
  assert.equal(uniqueContactId(["123", "123"]), "123");
});

test("opens are diagnostic, including non-machine opens", () => {
  const open = classifyKlaviyoMetric("Opened Email", { machine_open: false });
  assert.equal(open?.class, "diagnostic");
  assert.equal(open?.confidence, "basic");
  assert.equal(mayPromoteCommercialState("klaviyo_email_opened"), false);
});

test("only explicit guide context produces a guide signup candidate", () => {
  assert.equal(classifyKlaviyoMetric("Form submitted by profile", { form_name: "RFQ" }), null);
  assert.equal(classifyKlaviyoMetric("Form completed by profile", {
    page_url: "https://www.zeropack.au/packaging-guide/download",
  })?.kind, "klaviyo_guide_signup");
});

test("subjects are not sufficient for email deduplication", () => {
  const a = { direction: "sent" as const, from: "hello@zeropack.co", to: ["a@example.com"], subject: "Hello", occurredAt: "2026-10-01T00:00:00Z" };
  const b = { ...a, occurredAt: "2026-10-02T00:00:00Z" };
  assert.equal(sameEmail(a, b), false);
  assert.equal(shouldRecoverOutlookMessage(a, [b], null), false);
  assert.equal(shouldRecoverOutlookMessage(a, [b], "123"), true);
  assert.equal(sameEmail({ ...a, internetMessageId: "<abc@example.com>" }, { ...b, internetMessageId: "abc@example.com" }), true);
});

test("source event keys are deterministic and require IDs", () => {
  assert.equal(activityKey("klaviyo", "evt_1"), "klaviyo:evt_1");
  assert.throws(() => activityKey("klaviyo", ""));
});
