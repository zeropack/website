import assert from "node:assert/strict";
import test from "node:test";
import { classifyOutlookRecovery, recoveryLedgerKey } from "./outlook-source";

const base = { internetMessageId: "<msg1@example.com>", to: ["client@example.com"], subject: "Hello", from: "hello@zeropack.co", direction: "sent" as const, sourceFolder: "sent" as const };

test("manual correspondence needs known folder and direction", () => {
  assert.equal(classifyOutlookRecovery(base).action, "candidate");
  assert.equal(classifyOutlookRecovery({ ...base, sourceFolder: "other" }).action, "hold");
  assert.equal(classifyOutlookRecovery({ ...base, internetMessageId: undefined }).action, "hold");
});

test("QBO notifications require specific recipient and quote/invoice reference", () => {
  const quote = classifyOutlookRecovery({ ...base, from: "Zero Pack <quickbooks@notification.intuit.com>", subject: "Quote ZP-938521 from Zero Pack", direction: "received", sourceFolder: "inbox" });
  assert.equal(quote.action, "candidate");
  if (quote.action === "candidate") {
    assert.equal(quote.source, "quickbooks_notification");
    assert.equal(quote.category, "qbo_quote");
    assert.equal(quote.documentId, "ZP-938521");
  }
  assert.equal(classifyOutlookRecovery({ ...base, from: "quickbooks@notification.intuit.com", subject: "Your account alert" }).action, "hold");
  assert.equal(classifyOutlookRecovery({ ...base, from: "quickbooks@notification.intuit.com", subject: "Invoice #3374", to: ["a@example.com", "b@example.com"] }).action, "hold");
});

test("source keys preserve provenance", () => {
  assert.notEqual(recoveryLedgerKey("outlook_manual", "123"), recoveryLedgerKey("quickbooks_notification", "123"));
});
