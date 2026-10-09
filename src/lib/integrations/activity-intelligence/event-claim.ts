import { put } from "@vercel/blob";

/**
 * Atomic durable event claim. Blob rejects an existing pathname when overwrite is disabled.
 * A failed write leaves its claim in place; that event requires explicit reconciliation,
 * rather than retrying and risking a duplicate CRM activity.
 */
export async function claimKlaviyoEvent(eventId: string): Promise<boolean> {
  if (!/^[A-Za-z0-9_-]{5,128}$/.test(eventId)) throw new Error("Invalid event identity");
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("Missing durable activity-ledger configuration");
  try {
    await put(`activity-intelligence/klaviyo/${eventId}.json`,
      JSON.stringify({ source: "klaviyo", eventId, status: "claimed" }), {
        access: "public", addRandomSuffix: false, allowOverwrite: false,
        contentType: "application/json", token,
      });
    return true;
  } catch (err) {
    const msg = String(err);
    if (/already exists|already been uploaded|conflict|BlobAlreadyExists|409/i.test(msg)) return false;
    throw err;
  }
}
