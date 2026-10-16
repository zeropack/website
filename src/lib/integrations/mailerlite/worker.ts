import type { Suppression } from "./model";

export type Pending = { event: Suppression; attempts: number; leaseUntil: number; lastError?: string };
export type Versioned = { value: Pending; version: string };
export type Receipt = { event: Suppression; outcome: "applied" | "identity_mismatch"; processedAt: string };
export interface Store {
  lockContact(event: Suppression, now: number): Promise<string | null>;
  unlockContact(event: Suppression, version: string): Promise<void>;
  receipt(id: string): Promise<Receipt | null>;
  read(id: string): Promise<Versioned | null>;
  write(id: string, value: Pending, version: string): Promise<string | null>;
  finish(id: string, value: Receipt, version: string): Promise<void>;
  remove(id: string, version: string): Promise<void>;
}
export interface Crm {
  apply(event: Suppression): Promise<"applied" | "identity_mismatch">;
}

// A durable lease covers all bounded Monday requests; conditional writes prevent
// concurrent callbacks and cron workers from processing the same event together.
export async function processEvent(id: string, store: Store, crm: Crm, now = Date.now()): Promise<string> {
  const previous = await store.read(id);
  if (!previous) return "missing";
  if (await store.receipt(id)) {
    await store.remove(id, previous.version);
    return "duplicate";
  }
  if (previous.value.leaseUntil > now) return "busy";
  const claimed = { ...previous.value, attempts: previous.value.attempts + 1, leaseUntil: now + 180_000 };
  const version = await store.write(id, claimed, previous.version);
  if (!version) return "busy";
  const contactLock = await store.lockContact(claimed.event, now);
  if (!contactLock) {
    await store.write(id, { ...claimed, leaseUntil: 0 }, version);
    return "busy";
  }
  try {
    const outcome = await crm.apply(claimed.event);
    await store.finish(id, { event: claimed.event, outcome, processedAt: new Date(now).toISOString() }, version);
    return outcome;
  } catch {
    // Keep pending after an ambiguous network failure. The next attempt rereads
    // Monday's status and audit marker before attempting either write again.
    await store.write(id, { ...claimed, leaseUntil: 0, lastError: "crm_or_storage_request_failed" }, version);
    return "retry";
  } finally {
    await store.unlockContact(claimed.event, contactLock);
  }
}
