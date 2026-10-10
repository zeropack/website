/** Source-preserving classification before any Outlook recovery write. */
export const QBO_NOTIFICATION_SENDER = "quickbooks@notification.intuit.com";

export type OutlookRecoverySource = "outlook_manual" | "quickbooks_notification";
export type OutlookRecoveryCategory = "manual_sent" | "customer_received" | "qbo_quote" | "qbo_invoice";
export type OutlookRecoveryDecision =
  | { action: "candidate"; source: OutlookRecoverySource; category: OutlookRecoveryCategory; recipient: string; documentId?: string }
  | { action: "skip" | "hold"; reason: string };

export type OutlookEnvelope = {
  from: string;
  to: string[];
  direction: "sent" | "received";
  subject: string;
  internetMessageId?: string | null;
  providerMessageId?: string | null;
  /** Explicitly authenticated message metadata only; never infer desktop origin from a missing header. */
  sourceFolder?: "sent" | "inbox" | "other";
};

function email(value: string): string {
  return value.trim().toLowerCase().replace(/^.*<([^>]+)>$/, "$1");
}

export function classifyOutlookRecovery(message: OutlookEnvelope): OutlookRecoveryDecision {
  if (!message.internetMessageId && !message.providerMessageId) {
    return { action: "hold", reason: "No durable provider message identifier" };
  }
  const sender = email(message.from);
  const recipients = [...new Set(message.to.map(email).filter(Boolean))];
  if (sender === QBO_NOTIFICATION_SENDER) {
    if (recipients.length !== 1) return { action: "hold", reason: "QBO has ambiguous/missing recipient" };
    const quote = /\b(?:quote|estimate)\s*(?:#|no\.?|number\s*)?([A-Z0-9-]{3,})\b/i.exec(message.subject);
    const invoice = /\b(?:invoice)\s*(?:#|no\.?|number\s*)?([A-Z0-9-]{3,})\b/i.exec(message.subject);
    if (quote && invoice) return { action: "hold", reason: "Ambiguous QBO document type" };
    if (!quote && !invoice) return { action: "hold", reason: "Unrecognized QBO document" };
    return {
      action: "candidate", source: "quickbooks_notification",
      category: quote ? "qbo_quote" : "qbo_invoice",
      recipient: recipients[0],
      documentId: (quote || invoice)![1],
    };
  }
  if (/^(no-?reply|donotreply|notifications?|system)@/i.test(sender) || sender === "australia+noreply@guardian.co.uk") {
    return { action: "skip", reason: "Automated notification" };
  }
  // Editorial/backlink conversations are outside customer CRM recovery.\n  if (sender === "drew@surfrider.org.au" || recipients.includes("drew@surfrider.org.au")) {\n    return { action: "skip", reason: "Backlink outreach; not customer CRM correspondence" };\n  }\n  if (message.direction === "sent" && message.sourceFolder === "sent") {
    if (recipients.length !== 1) return { action: "hold", reason: "Multiple recipients require individual identity reconciliation" };
    return { action: "candidate", source: "outlook_manual", category: "manual_sent", recipient: recipients[0] };
  }
  if (message.direction === "received" && message.sourceFolder === "inbox") {
    return { action: "candidate", source: "outlook_manual", category: "customer_received", recipient: sender };
  }
  return { action: "hold", reason: "Cannot establish correspondence direction and origin" };
}

/** Never use Outlook message IDs, Klaviyo event IDs, and native Monday IDs interchangeably. */
export function recoveryLedgerKey(source: OutlookRecoverySource, identifier: string): string {
  if (!identifier.trim()) throw new Error("Missing source identifier");
  return `${source}:${identifier.trim()}`;
}
