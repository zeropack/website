import { sameEmail, type MailSummary } from "./model";

export type OutlookContactRef = { id: string; email: string };
export type OutlookMatchDecision =
  | { action: "hold"; reason: string }
  | { action: "duplicate"; contactId: string; reason: string }
  | { action: "eligible"; contactId: string };

/**
 * This gate must be called only after a complete authoritative Monday native
 * Email & Activities read. A null/partial native history is NEVER evidence
 * that a message was not already recorded.
 */
export function reconcileOutlookWithMonday(
  candidate: MailSummary,
  externalAddress: string,
  contacts: OutlookContactRef[],
  nativeMessages: MailSummary[] | null,
  nativeHistoryComplete: boolean,
): OutlookMatchDecision {
  const address = externalAddress.trim().toLowerCase();
  if (!address || address === "hello@zeropack.co") return { action: "hold", reason: "Missing/excluded external party" };
  if (!candidate.internetMessageId) return { action: "hold", reason: "Missing stable RFC internetMessageId" };
  if (!candidate.occurredAt || Number.isNaN(Date.parse(candidate.occurredAt))) {
    return { action: "hold", reason: "Missing trusted email timestamp" };
  }
  const matches = [...new Set(contacts.filter(x => x.email.trim().toLowerCase() === address).map(x => x.id))];
  if (matches.length !== 1) return { action: "hold", reason: matches.length ? "Ambiguous CRM Contact" : "No existing CRM Contact" };
  if (!nativeHistoryComplete || nativeMessages === null) {
    return { action: "hold", reason: "Monday native correspondence history not proven complete" };
  }
  // Monday native messages must include comparable stable message identifiers.
  // Unknown native email identities cannot be interpreted as absence.
  if (nativeMessages.some(x => !x.internetMessageId && !x.providerMessageId)) {
    return { action: "hold", reason: "Native email without comparable identifier" };
  }
  if (nativeMessages.some(x => sameEmail(candidate, x))) {
    return { action: "duplicate", contactId: matches[0], reason: "Already in native Monday correspondence" };
  }
  return { action: "eligible", contactId: matches[0] };
}
