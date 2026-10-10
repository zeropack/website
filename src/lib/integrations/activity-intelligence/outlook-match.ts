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
  // Positive matches can establish an existing native email even when Monday
  // omits RFC IDs. A missing match NEVER establishes absence in that case.
  if (nativeMessages?.some(x => sameEmail(candidate, x))) {
    return { action: "duplicate", contactId: matches[0], reason: "Already in native Monday correspondence (stable ID)" };
  }
  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
  const precise = (native: MailSummary) =>
    native.direction === candidate.direction &&
    Boolean(native.from) && normalize(native.from) === normalize(candidate.from) &&
    normalize(native.subject) === normalize(candidate.subject) &&
    Date.parse(native.occurredAt) > 0 &&
    Math.abs(Date.parse(native.occurredAt) - Date.parse(candidate.occurredAt)) <= 120000;
  if (nativeMessages?.some(precise)) {
    return { action: "duplicate", contactId: matches[0], reason: "Already in native Monday correspondence (sender/subject/time)" };
  }
  if (!nativeHistoryComplete || nativeMessages === null) {
    return { action: "hold", reason: "Monday native correspondence history not proven complete" };
  }
  if (nativeMessages.some(x => !x.internetMessageId && !x.providerMessageId)) {
    return { action: "hold", reason: "Native email without comparable identifier" };
  }
  return { action: "eligible", contactId: matches[0] };
}
