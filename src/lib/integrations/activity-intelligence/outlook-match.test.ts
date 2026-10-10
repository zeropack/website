import assert from "node:assert/strict";
import test from "node:test";
import { reconcileOutlookWithMonday } from "./outlook-match";

const candidate = {
  internetMessageId: "<external.123@example.test>", providerMessageId: "outlook-id-1",
  direction: "received" as const, from: "buyer@example.test", to: ["hello@zeropack.co"],
  subject: "Packaging enquiry", occurredAt: "2026-10-09T03:00:00.000Z",
};
const contacts = [{ id: "123", email: "buyer@example.test" }];

test("holds absent or ambiguous Contact instead of creating CRM identity", () => {
  assert.equal(reconcileOutlookWithMonday(candidate, "buyer@example.test", [], [], true).action, "hold");
  assert.equal(reconcileOutlookWithMonday(candidate, "buyer@example.test", [...contacts, {id:"456",email:"buyer@example.test"}], [], true).action, "hold");
});
test("holds incomplete native correspondence even with unique contact", () => {
  assert.equal(reconcileOutlookWithMonday(candidate, "buyer@example.test", contacts, null, false).action, "hold");
  assert.equal(reconcileOutlookWithMonday(candidate, "buyer@example.test", contacts, [{...candidate, internetMessageId: undefined, providerMessageId: undefined}], true).action, "hold");
});
test("native RFC id always takes priority over Outlook's mutable provider ID", () => {
  const native = {...candidate, providerMessageId: "different-Monday-provider-id"};
  assert.equal(reconcileOutlookWithMonday(candidate, "buyer@example.test", contacts, [native], true).action, "duplicate");
});
test("only proven-absent native email for unique Contact can become eligible", () => {
  assert.equal(reconcileOutlookWithMonday(candidate, "buyer@example.test", contacts, [], true).action, "eligible");
  assert.equal(reconcileOutlookWithMonday({...candidate,internetMessageId:undefined}, "buyer@example.test", contacts, [], true).action, "hold");
});
