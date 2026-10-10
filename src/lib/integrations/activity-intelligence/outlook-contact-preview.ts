import { listMondayContacts } from "@/lib/integrations/klaviyo-monday/clients";
import { scanOutlookGraph } from "./outlook-graph";
import { reconcileOutlookWithMonday } from "./outlook-match";
import { readMondayNativeMail } from "./outlook-native-reader";
import type { MailSummary } from "./model";

type Review = {
  messageId: string; contactId?: string;
  decision: "hold" | "duplicate" | "needs_origin_review";
  reason: string;
};

/**
 * Strict, bounded read-only dry-run. Even proven-absent native correspondence
 * requires a separate source-origin check before any future write is allowed.
 */
export async function previewOutlookContactMatching(lookbackHours = 24, maxPages = 2) {
  const [scan, contacts] = await Promise.all([scanOutlookGraph(lookbackHours, maxPages), listMondayContacts()]);
  const index = new Map<string, Set<string>>();
  for (const contact of contacts) {
    const address = contact.email.trim().toLowerCase();
    if (!address) continue;
    const ids = index.get(address) || new Set<string>();
    ids.add(contact.id);
    index.set(address, ids);
  }
  const reviews: Review[] = [];
  const nativeCache = new Map<string, Awaited<ReturnType<typeof readMondayNativeMail>>>();
  // Bound native API lookups. Deferred candidates remain held, never implicitly cleared.
  const MAX_NATIVE_CONTACTS = 5;
  for (const message of scan.items) {
    if (message.disposition !== "candidate") {
      reviews.push({ messageId: message.messageId, decision: "hold", reason: message.reason });
      continue;
    }
    const address = message.address.trim().toLowerCase();
    if (!address || address === "hello@zeropack.co") {
      reviews.push({ messageId: message.messageId, decision: "hold", reason: "Missing/excluded external party" });
      continue;
    }
    const matches = [...(index.get(address) || [])];
    if (matches.length !== 1) {
      reviews.push({ messageId: message.messageId, decision: "hold", reason: matches.length ? "Ambiguous Contact" : "No existing Contact" });
      continue;
    }
    const contactId = matches[0];
    if (!nativeCache.has(contactId)) {
      if (nativeCache.size >= MAX_NATIVE_CONTACTS) {
        reviews.push({ messageId: message.messageId, decision: "hold", reason: "Native QA budget exhausted; deferred" });
        continue;
      }
      nativeCache.set(contactId, await readMondayNativeMail(contactId));
    }
    const native = nativeCache.get(contactId)!;
    const summary: MailSummary = {
      internetMessageId: message.internetMessageId, providerMessageId: message.messageId,
      direction: message.direction, from: message.from, to: message.to,
      subject: message.subject, occurredAt: message.occurredAt,
    };
    const result = reconcileOutlookWithMonday(summary, address, contacts, native.messages, native.complete);
    if (result.action === "duplicate") {
      reviews.push({ messageId: message.messageId, contactId, decision: "duplicate", reason: result.reason });
    } else if (result.action === "eligible") {
      reviews.push({ messageId: message.messageId, contactId, decision: "needs_origin_review",
        reason: "Unique Contact and no comparable native message; human-verifiable manual/customer origin still required" });
    } else {
      reviews.push({ messageId: message.messageId, contactId, decision: "hold", reason: native.reason || result.reason });
    }
  }
  return {
    mode: "dry_run" as const, scanned: scan.scanned,
    pendingOriginReview: reviews.filter(x => x.decision === "needs_origin_review").length,
    duplicates: reviews.filter(x => x.decision === "duplicate").length,
    held: reviews.filter(x => x.decision === "hold").length,
    reviews,
    warning: "NO items authorised for recovery or writing. Origin, CRM native correspondence completeness and execution QA are mandatory.",
  };
}
