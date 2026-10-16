import test from "node:test";
import assert from "node:assert/strict";
import { mondayCrm, listSuppressedSubscribers } from "./clients";
import { fromSubscriber, TEST_CONTACT_ID } from "./model";

const event = fromSubscriber({ id: "201453473383842879", email: "test@example.com", status: "unsubscribed", updated_at: "2026-10-16T03:00:00Z", fields: { monday_contact_id: TEST_CONTACT_ID, zp_permission_scope: "internal_test_only" } }, { accountId: "2716838", mode: "internal" })!;
const originalFetch = globalThis.fetch;
test("writes only outreach disposition, preserving commercial status, subscription and tokens", async () => {
  const previous = process.env.MONDAY_API_TOKEN; process.env.MONDAY_API_TOKEN = "test-only";
  const bodies: Array<{ query: string; variables: Record<string, string> }> = [];
  globalThis.fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body)); bodies.push(body);
    return Response.json({ data: body.query.startsWith("query") ? { items: [{ id: TEST_CONTACT_ID, board: { id: "5029468199" }, column_values: [{ id: "contact_email", text: "test@example.com" }, { id: "color_mm6jydpn", text: "Positive" }], updates: [] }] } : { result: { id: "1" } } });
  };
  try {
    assert.equal(await mondayCrm.apply(event), "applied");
    const write = bodies.find(x => x.variables.values)!;
    assert.deepEqual(JSON.parse(write.variables.values), { color_mm6jydpn: { label: "Do Not Contact" } });
    assert.equal(bodies.length, 3);
    assert.ok(bodies.at(-1)?.variables.body.includes("Newsletter consent and commercial lifecycle unchanged"));
  } finally { globalThis.fetch = originalFetch; if (previous === undefined) delete process.env.MONDAY_API_TOKEN; else process.env.MONDAY_API_TOKEN = previous; }
});
test("wrong email or board produces no mutation", async () => {
  const previous = process.env.MONDAY_API_TOKEN; process.env.MONDAY_API_TOKEN = "test-only";
  for (const [board, email] of [["9", event.email], ["5029468199", "other@example.com"]]) {
    let calls = 0;
    globalThis.fetch = async () => { calls++; return Response.json({ data: { items: [{ id: TEST_CONTACT_ID, board: { id: board }, column_values: [{ id: "contact_email", text: email }], updates: [] }] } }); };
    assert.equal(await mondayCrm.apply(event), "identity_mismatch"); assert.equal(calls, 1);
  }
  globalThis.fetch = originalFetch; if (previous === undefined) delete process.env.MONDAY_API_TOKEN; else process.env.MONDAY_API_TOKEN = previous;
});
test("API pagination cannot send credentials to another host", async () => {
  const previous = process.env.MAILERLITE_API_KEY; process.env.MAILERLITE_API_KEY = "test-only"; let calls = 0;
  globalThis.fetch = async () => { calls++; return Response.json({ data: [], links: { next: "https://attacker.example/api/subscribers" } }); };
  try { await assert.rejects(listSuppressedSubscribers("unsubscribed", async () => {}), /pagination guard/); assert.equal(calls, 1); }
  finally { globalThis.fetch = originalFetch; if (previous === undefined) delete process.env.MAILERLITE_API_KEY; else process.env.MAILERLITE_API_KEY = previous; }
});
