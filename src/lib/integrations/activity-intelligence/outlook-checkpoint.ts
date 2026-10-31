import { BlobNotFoundError, get, put } from "@vercel/blob";

/** Durable, mailbox-scoped timestamp only. No customer data is stored in Blob. */
const ENV = process.env.VERCEL_ENV === "production" ? "production" : "preview";
const PATH = `internal/outlook-recovery/${ENV}/phase2-checkpoint.json`;
export type RecoveryCheckpoint = { lastSuccessfulAt: string; updatedAt: string };
export async function readRecoveryCheckpoint(): Promise<RecoveryCheckpoint | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Missing durable checkpoint storage");
  let result;
  try {
    // The pathname is fixed: listing the store adds an Advanced Operation
    // without discovering anything needed to read this checkpoint.
    result = await get(PATH, { access: "public", useCache: false });
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
  if (!result) return null;
  if (result.statusCode !== 200) throw new Error("Checkpoint retrieval failed");
  const parsed: unknown = await new Response(result.stream).json();
  if (!parsed || typeof parsed !== "object") throw new Error("Corrupt checkpoint");
  const row = parsed as Partial<RecoveryCheckpoint>;
  if (!row.lastSuccessfulAt || !Number.isFinite(Date.parse(row.lastSuccessfulAt))) throw new Error("Invalid checkpoint");
  return { lastSuccessfulAt: row.lastSuccessfulAt, updatedAt: row.updatedAt || row.lastSuccessfulAt };
}
export async function saveRecoveryCheckpoint(next: RecoveryCheckpoint): Promise<void> {
  if (!Number.isFinite(Date.parse(next.lastSuccessfulAt))) throw new Error("Invalid checkpoint timestamp");
  await put(PATH, JSON.stringify(next), { access: "public", contentType: "application/json", allowOverwrite: true, addRandomSuffix: false });
}
