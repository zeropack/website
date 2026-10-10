import { sameEmail, type MailSummary } from "./model";

export type OutlookContactRef = { id: string; email: string };
export type OutlookMatchDecision =
  | { action: "hold"; reason: string }
  | { action: "duplicate"; contactId: string; reason: string }
  | { action: "eligible"; contactId: string };

/** Exact Contact address, followed by simple, conservative duplicate suppression.
 * Native Monday entries without RFC IDs do not block otherwise valid customer mail.
 * Callers must still exclude Monday-originated, campaign, system and backlink sends.
 */
export function reconcileOutlookWithMonday(
  candidate: MailSummary, externalAddress: string, contacts: OutlookContactRef[],
  nativeMessages: MailSummary[] | null, nativeHistoryComplete: boolean,
): OutlookMatchDecision {
  const email = externalAddress.trim().toLowerCase();
  if (!email || ["hello@zeropack.co", "hello@zeropack.au", "enquiries@zeropack.co"].includes(email))
    return { action: "hold", reason: "Missing/excluded external party" };
  if (!candidate.occurredAt || !Number.isFinite(Date.parse(candidate.occurredAt)))
    return { action: "hold", reason: "Missing trusted timestamp" };
  if (!candidate.internetMessageId && !candidate.providerMessageId)
    return { action: "hold", reason: "Missing source identity" };
  const ids = [...new Set(contacts.filter(x => x.email.trim().toLowerCase() === email).map(x => x.id))];
  if (ids.length !== 1)
    return { action: "hold", reason: ids.length ? "Ambiguous Contact" : "No existing Contact" };
  // Fail closed if the authoritative timeline request itself failed or was partial.
  if (nativeMessages === null || !nativeHistoryComplete)
    return { action: "hold", reason: "Incomplete native timeline read" };
  const normal = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  const matching = nativeMessages.some(m => {
    if (sameEmail(candidate, m)) return true;
    if (!m.occurredAt || !Number.isFinite(Date.parse(m.occurredAt))) return false;
    if (Math.abs(Date.parse(m.occurredAt) - Date.parse(candidate.occurredAt)) > 120000) return false;
    // Monday GraphQL omits native email sender metadata. Exact Contact +
    // subject + close timestamp is sufficient for practical deduplication.
    if (!m.from) return Boolean(m.subject && normal(m.subject) === normal(candidate.subject));
    return m.direction === candidate.direction && Boolean(m.subject) &&
      normal(m.from) === normal(candidate.from) && normal(m.subject) === normal(candidate.subject);
  });
  if (matching) return { action: "duplicate", contactId: ids[0], reason: "Already recorded in Monday" };
  return { action: "eligible", contactId: ids[0] };
}
