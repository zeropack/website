import test from "node:test";
import assert from "node:assert/strict";
import { fromSubscriber, TEST_CONTACT_ID } from "./model";
import { processEvent, type Pending, type Receipt, type Store } from "./worker";

const event = fromSubscriber({ id: "201453473383842879", email: "test@example.com", status: "unsubscribed", updated_at: "2026-10-16T03:00:00Z", fields: { monday_contact_id: TEST_CONTACT_ID, zp_permission_scope: "internal_test_only" } }, { accountId: "2716838", mode: "internal" })!;
class MemoryStore implements Store {
  pending: Pending | null = { event, attempts: 0, leaseUntil: 0 };
  done: Receipt | null = null; version = 1;
  contactLocked = false;
  async lockContact() { if (this.contactLocked) return null; this.contactLocked = true; return "lock"; }
  async unlockContact() { this.contactLocked = false; }
  async receipt() { return this.done; }
  async read() { return this.pending ? { value: structuredClone(this.pending), version: String(this.version) } : null; }
  async write(_id: string, value: Pending, version: string) {
    if (version !== String(this.version)) return null;
    this.pending = value; return String(++this.version);
  }
  async finish(_id: string, value: Receipt, version: string) { this.done = value; await this.remove(_id, version); }
  async remove(_id: string, version: string) { if (version === String(this.version)) this.pending = null; }
}
test("duplicate callbacks and simultaneous workers apply only once", async () => {
  const store = new MemoryStore(); let calls = 0;
  const crm = { async apply() { calls++; return "applied" as const; } };
  const results = await Promise.all([processEvent(event.id, store, crm, 100), processEvent(event.id, store, crm, 100)]);
  assert.equal(calls, 1);
  assert.ok(results.includes("applied"));
  store.pending = { event, attempts: 0, leaseUntil: 0 };
  assert.equal(await processEvent(event.id, store, crm, 101), "duplicate");
  assert.equal(calls, 1);
});
test("failed or ambiguous CRM writes remain retryable", async () => {
  const store = new MemoryStore(); let fail = true;
  const crm = { async apply() { if (fail) throw new Error("timeout"); return "applied" as const; } };
  assert.equal(await processEvent(event.id, store, crm, 100), "retry");
  assert.equal(store.pending?.leaseUntil, 0);
  assert.equal(store.done, null);
  fail = false;
  assert.equal(await processEvent(event.id, store, crm, 200), "applied");
  assert.equal((store.done as Receipt | null)?.event.id, event.id);
});
test("crashed workers can be recovered after lease expiry", async () => {
  const store = new MemoryStore(); store.pending!.leaseUntil = 500;
  const crm = { async apply() { return "applied" as const; } };
  assert.equal(await processEvent(event.id, store, crm, 499), "busy");
  assert.equal(await processEvent(event.id, store, crm, 501), "applied");
});
test("identity mismatch is quarantined and does not loop indefinitely", async () => {
  const store = new MemoryStore();
  assert.equal(await processEvent(event.id, store, { async apply() { return "identity_mismatch"; } }, 100), "identity_mismatch");
  assert.equal(store.done?.outcome, "identity_mismatch");
  assert.equal(store.pending, null);
});
test("other events for the same Contact cannot race a do-not-contact update", async () => {
  const store = new MemoryStore(); store.contactLocked = true; let calls = 0;
  assert.equal(await processEvent(event.id, store, { async apply() { calls++; return "applied"; } }, 100), "busy");
  assert.equal(calls, 0); assert.equal(store.pending?.leaseUntil, 0);
  store.contactLocked = false;
  assert.equal(await processEvent(event.id, store, { async apply() { calls++; return "applied"; } }, 101), "applied");
  assert.equal(calls, 1);
});
