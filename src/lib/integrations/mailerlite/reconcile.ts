import { listSuppressedSubscribers, mondayCrm } from "./clients";
import { fromSubscriber, type Rules } from "./model";
import { blobStore, enqueue, pendingIds, saveHealth } from "./storage";
import { processEvent } from "./worker";

export function rules(): Rules {
  const accountId = process.env.MAILERLITE_ACCOUNT_ID || "";
  if (!/^\d+$/.test(accountId)) throw new Error("MailerLite account configuration missing");
  return { accountId, mode: process.env.MAILERLITE_SYNC_MODE === "campaign" ? "campaign" : "internal" };
}
export function configured(): boolean {
  return process.env.MAILERLITE_SYNC_ENABLED === "true" && /^\d+$/.test(process.env.MAILERLITE_ACCOUNT_ID || "") && /^[a-f0-9]{64}$/i.test(process.env.MAILERLITE_EVENT_ENCRYPTION_KEY || "") && Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}
export async function reconcileMailerLite() {
  if (!configured()) return { enabled: false, polling: "not_configured" };
  const summary = { enabled: true, mode: rules().mode, polling: process.env.MAILERLITE_API_KEY ? "configured" : "credential_missing", scanned: 0, queued: 0, applied: 0, quarantined: 0, retry: 0, busy: 0, errors: 0 };
  if (process.env.MAILERLITE_API_KEY) {
    try {
      for (const status of ["unsubscribed", "bounced", "junk"] as const) {
        summary.scanned += await listSuppressedSubscribers(status, async row => {
          const event = fromSubscriber(row, rules());
          if (event) { await enqueue(event); summary.queued++; }
        });
      }
      summary.polling = "complete";
    } catch { summary.errors++; summary.polling = "failed"; }
  }
  for (const id of await pendingIds()) {
    try {
      const outcome = await processEvent(id, blobStore, mondayCrm);
      if (outcome === "applied") summary.applied++;
      else if (outcome === "identity_mismatch") summary.quarantined++;
      else if (outcome === "retry") summary.retry++;
      else if (outcome === "busy") summary.busy++;
    } catch { summary.errors++; }
  }
  await saveHealth(summary);
  return summary;
}
export async function safeReconcileMailerLite() {
  try {
    const result = await reconcileMailerLite();
    if ("errors" in result && (result.errors || result.retry || result.quarantined || result.polling === "credential_missing")) console.error("[mailerlite reconciliation] attention required", JSON.stringify(result));
    return result;
  }
  catch { console.error("[mailerlite reconciliation] failed; pending events retained"); return { enabled: true, errors: 1 }; }
}
