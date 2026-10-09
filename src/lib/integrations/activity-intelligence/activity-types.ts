/** Existing, human-created Monday CRM custom activity types.
 * IDs verified against Monday on 2026-10-09. No schema changes made here.
 */
export const ACTIVITY_TYPES = {
  emailSent: { id: "8b6c4544-b271-4cc6-a9fc-40811d6f8e9c", name: "Email Sent" },
  emailReceived: { id: "5596cef2-66b3-4dfe-8cce-c366d66cd4f2", name: "Email Received" },
  klaviyo: { id: "d5f103e1-8869-4333-91c2-0919e994c402", name: "Klaviyo Activity" },
  quoteSent: { id: "d76e258f-7eae-441e-8760-d520f155be89", name: "Quote Sent" },
  other: { id: "89e8aa79-45f6-47a6-90f5-9bac4d956cfa", name: "Other" },
} as const;

import type { ActivityKind } from "./model";

/** Route only explicitly supported intelligence events; never silently send unknown events to Other. */
export function activityTypeFor(kind: ActivityKind): string {
  switch (kind) {
    case "outlook_missing_sent": return ACTIVITY_TYPES.emailSent.id;
    case "outlook_missing_received": return ACTIVITY_TYPES.emailReceived.id;
    case "klaviyo_email_received":
    case "klaviyo_email_opened":
    case "klaviyo_email_clicked":
    case "klaviyo_guide_signup":
    case "klaviyo_newsletter_signup":
    case "klaviyo_site_activity":
      return ACTIVITY_TYPES.klaviyo.id;
  }
}

/** Keep existing commercial Quote Sent activity outside engagement reconciliation. */
export function isCommercialActivityType(id: string): boolean {
  return id === ACTIVITY_TYPES.quoteSent.id;
}
