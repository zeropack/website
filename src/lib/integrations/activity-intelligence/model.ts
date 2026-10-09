/**
 * Activity intelligence selection contract.
 *
 * This module deliberately does not update lifecycle, marketing consent or CRM schema.
 * Outlook correspondence is imported only after a separate native Monday timeline
 * comparison confirms it is missing. Klaviyo opens are low-confidence engagement.
 */
export type ActivityKind =
  | "klaviyo_email_received"
  | "klaviyo_email_opened"
  | "klaviyo_email_clicked"
  | "klaviyo_guide_signup"
  | "klaviyo_newsletter_signup"
  | "klaviyo_site_activity"
  | "outlook_missing_sent"
  | "outlook_missing_received";

export type ActivityClass = "operational" | "behavioural" | "diagnostic";

export type ActivityCandidate = {
  source: "klaviyo" | "outlook";
  sourceEventId: string;
  contactId: string;
  occurredAt: string;
  kind: ActivityKind;
  class: ActivityClass;
  summary: string;
  fingerprint: string;
  confidence: "confirmed" | "basic" | "uncertain";
};

/** Fail closed if a profile maps to zero or multiple canonical Contacts. */
export function uniqueContactId(ids: string[]): string | null {
  const distinct = [...new Set(ids.filter(Boolean))];
  return distinct.length === 1 ? distinct[0] : null;
}

export function classifyKlaviyoMetric(name: string, properties: Record<string, unknown>): Pick<ActivityCandidate, "kind" | "class" | "confidence"> | null {
  switch (name) {
    case "Received Email":
      return { kind: "klaviyo_email_received", class: "operational", confidence: "confirmed" };
    case "Opened Email":
      return { kind: "klaviyo_email_opened", class: "diagnostic", confidence: "basic" };
    case "Clicked Email":
      return { kind: "klaviyo_email_clicked", class: "behavioural", confidence: "basic" };
    case "Subscribed to Email Marketing":
      return { kind: "klaviyo_newsletter_signup", class: "behavioural", confidence: "confirmed" };
    case "Active on Site":
      return { kind: "klaviyo_site_activity", class: "diagnostic", confidence: "uncertain" };
    case "Form completed by profile":
    case "Form submitted by profile": {
      const target = String(properties.page_url || properties.form_name || properties.formName || "");
      if (/packaging-guide/i.test(target)) {
        return { kind: "klaviyo_guide_signup", class: "behavioural", confidence: "basic" };
      }
      return null; // Don't mistake RFQs, contact requests or arbitrary forms for a guide signup.
    }
    default:
      return null;
  }
}

/**
 * An open does not confer commercial engagement or consent, irrespective
 * of whether the event's machine_open flag is false.
 */
export function mayPromoteCommercialState(_kind: ActivityKind): false {
  return false;
}

export type MailSummary = {
  internetMessageId?: string | null;
  providerMessageId?: string | null;
  direction: "sent" | "received";
  from: string;
  to: string[];
  subject: string;
  occurredAt: string;
};

/** A subject alone is never enough to suppress an Outlook import as a duplicate. */
export function sameEmail(a: MailSummary, b: MailSummary): boolean {
  const normalise = (s: string | null | undefined) => (s || "").trim().toLowerCase().replace(/^<|>$/g, "");
  if (a.internetMessageId && b.internetMessageId &&
      normalise(a.internetMessageId) === normalise(b.internetMessageId)) return true;
  if (a.providerMessageId && b.providerMessageId &&
      normalise(a.providerMessageId) === normalise(b.providerMessageId)) return true;
  return false;
}

export function shouldRecoverOutlookMessage(
  candidate: MailSummary,
  nativeMessages: MailSummary[],
  contactId: string | null,
): boolean {
  if (!contactId) return false;
  // If the native timeline cannot be inspected comprehensively, caller must not invoke this function.
  return !nativeMessages.some((native) => sameEmail(candidate, native));
}

export function activityKey(source: string, eventId: string): string {
  if (!source || !eventId) throw new Error("Missing event identity");
  return `${source}:${eventId}`;
}
