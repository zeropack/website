import { listMondayContacts } from "@/lib/integrations/klaviyo-monday/clients";
import { scanOutlookGraph } from "./outlook-graph";

/** Read-only identity triage. No message becomes write-eligible before native timeline QA. */
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
  const reviews = scan.items.map(m => {
    if (m.disposition !== "candidate") return { messageId: m.messageId, decision: "hold", reason: m.reason };
    if (!m.address || m.address.toLowerCase() === "hello@zeropack.co") {
      return { messageId: m.messageId, decision: "hold", reason: "Excluded self correspondence" };
    }
    const ids = [...(index.get(m.address.trim().toLowerCase()) || [])];
    if (ids.length !== 1) return { messageId: m.messageId, decision: "hold", reason: ids.length ? "Ambiguous Contact" : "No existing Contact" };
    return {
      messageId: m.messageId, contactId: ids[0], decision: "needs_native_qa",
      reason: "Unique Contact; authoritative native Emails & Activities deduplication required",
    };
  });
  return {
    mode: "dry_run" as const, scanned: scan.scanned,
    uniquelyMatched: reviews.filter(x => x.decision === "needs_native_qa").length,
    held: reviews.filter(x => x.decision === "hold").length,
    reviews,
    warning: "No correspondence cleared for recovery. Native Monday correspondence comparison and source-origin review remain mandatory.",
  };
}
