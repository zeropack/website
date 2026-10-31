import { BlobNotFoundError, BlobPreconditionFailedError, del, get, list, put } from "@vercel/blob";
import { decrypt, encrypt, hash, type Suppression } from "./model";
import type { Pending, Receipt, Store, Versioned } from "./worker";

const root = () => `internal/mailerlite/${process.env.VERCEL_ENV === "production" ? "production" : "preview"}/`;
const key = () => process.env.MAILERLITE_EVENT_ENCRYPTION_KEY || "";
const path = (kind: string, id: string) => {
  if (!/^[a-f0-9]{64}$/.test(id)) throw new Error("Invalid event identity");
  return `${root()}${kind}/${id}.json`;
};
async function read<T>(pathname: string): Promise<{ value: T; version: string } | null> {
  try {
    const result = await get(pathname, { access: "public", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return { value: decrypt<T>(await new Response(result.stream).text(), key()), version: result.blob.etag };
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}
async function create(pathname: string, value: unknown): Promise<boolean> {
  try {
    await put(pathname, encrypt(value, key()), { access: "public", addRandomSuffix: false, allowOverwrite: false, contentType: "application/json", cacheControlMaxAge: 0 });
    return true;
  } catch (error) {
    if (/already exists|already been uploaded|BlobAlreadyExists/i.test(String(error))) return false;
    throw error;
  }
}
export async function enqueue(event: Suppression): Promise<void> {
  if (await blobStore.receipt(event.id)) return;
  await create(path("pending", event.id), { event, attempts: 0, leaseUntil: 0 } satisfies Pending);
}
export const blobStore: Store = {
  async lockContact(event, now) {
    const pathname = path("locks", hash(`${event.accountId}:${event.contactId}`));
    const lease = { leaseUntil: now + 180_000, eventId: event.id };
    if (await create(pathname, lease)) return (await read(pathname))!.version;
    const previous = await read<{ leaseUntil: number }>(pathname);
    if (!previous || previous.value.leaseUntil > now) return null;
    try {
      const result = await put(pathname, encrypt(lease, key()), { access: "public", addRandomSuffix: false, ifMatch: previous.version, contentType: "application/json", cacheControlMaxAge: 0 });
      return result.etag;
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError) return null;
      throw error;
    }
  },
  async unlockContact(event, version) {
    try { await del(path("locks", hash(`${event.accountId}:${event.contactId}`)), { ifMatch: version }); }
    catch (error) { if (!(error instanceof BlobNotFoundError || error instanceof BlobPreconditionFailedError)) throw error; }
  },
  async receipt(id) { return (await read<Receipt>(path("receipts", id)))?.value || null; },
  async read(id): Promise<Versioned | null> { return read<Pending>(path("pending", id)); },
  async write(id, value, version) {
    try {
      const result = await put(path("pending", id), encrypt(value, key()), { access: "public", addRandomSuffix: false, ifMatch: version, contentType: "application/json", cacheControlMaxAge: 0 });
      return result.etag;
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError) return null;
      throw error;
    }
  },
  async finish(id, value, version) {
    await create(path("receipts", id), value);
    await blobStore.remove(id, version);
  },
  async remove(id, version) {
    try { await del(path("pending", id), { ifMatch: version }); }
    catch (error) { if (!(error instanceof BlobNotFoundError || error instanceof BlobPreconditionFailedError)) throw error; }
  },
};
export async function pendingIds(limit = 40): Promise<string[]> {
  const result = await list({ prefix: `${root()}pending/`, limit });
  return result.blobs.map(row => row.pathname.split("/").at(-1)!.replace(/\.json$/, ""));
}
export async function saveHealth(summary: Record<string, unknown>): Promise<void> {
  // This record contains aggregate counts/configuration flags only, never PII.
  const pathname = `${root()}health.json`;
  const now = Date.now();
  try {
    const result = await get(pathname, { access: "public", useCache: false });
    if (result?.statusCode === 200) {
      const previous: unknown = await new Response(result.stream).json();
      if (previous && typeof previous === "object" && !Array.isArray(previous)) {
        const { checkedAt, ...lastSummary } = previous as Record<string, unknown>;
        const age = now - Date.parse(String(checkedAt));
        const stable = (value: Record<string, unknown>) => JSON.stringify(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
        // Persist every changed result immediately, plus a six-hour heartbeat.
        // Polling, durable events, retries and suppression writes still run every time.
        if (age >= 0 && age < 6 * 60 * 60 * 1000 && stable(lastSummary) === stable(summary)) return;
      }
    }
  } catch {
    // Missing, unreadable or corrupt health must not suppress the current result.
    // Fall back to the original write path; do not log record contents or secrets.
  }
  await put(pathname, JSON.stringify({ ...summary, checkedAt: new Date(now).toISOString() }), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 0 });
}
