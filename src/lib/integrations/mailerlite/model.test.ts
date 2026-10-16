import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { decrypt, encrypt, fromSubscriber, fromWebhook, nextOutreachResult, SERIES, TEST_CONTACT_ID, validSignature } from "./model";

const rules = { accountId: "2716838", mode: "internal" as const };
const row = { id: "201453473383842879", email: "Test@Example.com", status: "unsubscribed", account_id: 2716838, unsubscribed_at: "2026-10-16 03:00:00Z", updated_at: "2026-10-16T03:00:00Z", fields: { monday_contact_id: TEST_CONTACT_ID, zp_permission_scope: "internal_test_only" } };
test("signature binds the exact raw body and rejects malformed signatures", () => {
  const body = JSON.stringify(row), secret = "test-only-secret", signature = createHmac("sha256", secret).update(body).digest("hex");
  assert.ok(validSignature(body, signature, secret));
  assert.equal(validSignature(body + " ", signature, secret), false);
  assert.equal(validSignature(body, signature, "different"), false);
  for (const sig of [null, "", "zz".repeat(32), "a".repeat(63)]) assert.equal(validSignature(body, sig, secret), false);
});
test("accepts a mapped controlled subscriber without making newsletter consent claims", () => {
  const event = fromSubscriber(row, rules)!;
  assert.equal(event.email, "test@example.com");
  assert.equal(event.subscriberId, row.id);
  assert.equal(event.reason, "unsubscribed");
  assert.equal(event.contactId, TEST_CONTACT_ID);
  assert.equal(event.id, fromSubscriber({ ...row, email: "test@example.com" }, rules)?.id);
});
test("rejects wrong account, unmapped identity, unapproved scope and unsafe numeric IDs", () => {
  for (const value of [{ ...row, account_id: 9 }, { ...row, id: Number(row.id) }, { ...row, fields: {} }, { ...row, fields: { ...row.fields, zp_permission_scope: "newsletter" } }, { ...row, fields: { ...row.fields, monday_contact_id: "2757775716" } }, { ...row, email: "invalid" }, { ...row, unsubscribed_at: "bad" }]) assert.equal(fromSubscriber(value, rules), null);
});
test("campaign mode still rejects unrelated marketing audiences", () => {
  const campaign = { ...row, fields: { monday_contact_id: "2757775716", zp_permission_scope: SERIES } };
  assert.ok(fromSubscriber(campaign, { ...rules, mode: "campaign" }));
  assert.equal(fromSubscriber({ ...campaign, fields: { ...campaign.fields, zp_permission_scope: "future_newsletter" } }, { ...rules, mode: "campaign" }), null);
});
test("webhook event is authoritative despite provider example using active status", () => {
  assert.equal(fromWebhook({ ...row, event: "subscriber.unsubscribed", status: "active" }, rules)?.reason, "unsubscribed");
  assert.equal(fromWebhook({ type: "subscriber.spam_reported", subscriber: row, account_id: 2716838 }, rules)?.reason, "spam");
  assert.equal(fromWebhook({ ...row, event: "subscriber.active" }, rules), null);
  assert.equal(fromWebhook({ ...row, event: "campaign.sent" }, rules), null);
  assert.equal(fromWebhook({ ...row, event: "__proto__" }, rules), null);
  assert.equal(fromSubscriber({ ...row, status: "constructor" }, rules), null);
});
test("bounce never weakens a do-not-contact or invalid-email suppression", () => {
  assert.equal(nextOutreachResult("Do Not Contact", "bounced"), "Do Not Contact");
  assert.equal(nextOutreachResult("Invalid Email", "bounced"), "Invalid Email");
  assert.equal(nextOutreachResult("Positive", "unsubscribed"), "Do Not Contact");
  assert.equal(nextOutreachResult(null, "bounced"), "Bounced Email");
});
test("queue encryption hides personal data and authenticates ciphertext", () => {
  const key = "a".repeat(64), text = encrypt(row, key);
  assert.equal(text.includes(row.email), false);
  assert.equal(text.includes(row.id), false);
  assert.deepEqual(decrypt(text, key), row);
  assert.notEqual(text, encrypt(row, key));
  const changed = JSON.parse(text); changed.data = "AAAA" + changed.data.slice(4);
  assert.throws(() => decrypt(JSON.stringify(changed), key));
  assert.throws(() => decrypt(text, "b".repeat(64)));
});
