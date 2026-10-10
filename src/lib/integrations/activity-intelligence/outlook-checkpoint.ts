import { list, put } from "@vercel/blob";

/** Durable, mailbox-scoped timestamp only. No customer data is stored in Blob. */
const PATH = "internal/outlook-recovery/phase2-checkpoint.json";
export type RecoveryCheckpoint = { lastSuccessfulAt: string; updatedAt: string };
export async function readRecoveryCheckpoint(): Promise<RecoveryCheckpoint | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Missing durable checkpoint storage");
  const files = await list({ prefix: PATH, limit: 10 });
  const entry = files.blobs.find(x => x.pathname === PATH);
  if (!entry) return null;
  const response = await fetch(entry.url, { cache: "no-store" });
  if (!response.ok) throw new Error("Checkpoint retrieval failed");
  const parsed: unknown = await response.json();
  if (!parsed || typeof parsed !== "object") throw new Error("Corrupt checkpoint");
  const row = parsed as Partial<RecoveryCheckpoint>;
  if (!row.lastSuccessfulAt || !Number.isFinite(Date.parse(row.lastSuccessfulAt))) throw new Error("Invalid checkpoint");
  return { lastSuccessfulAt: row.lastSuccessfulAt, updatedAt: row.updatedAt || row.lastSuccessfulAt };
}
export async function saveRecoveryCheckpoint(next: RecoveryCheckpoint): Promise<void> {
  if (!Number.isFinite(Date.parse(next.lastSuccessfulAt))) throw new Error("Invalid checkpoint timestamp");
  await put(PATH, JSON.stringify(next), { access: "public", contentType: "application/json", allowOverwrite: true, addRandomSuffix: false });
}
