import { MONDAY_API_VERSION, MONDAY_CONTACTS_BOARD_ID } from "../klaviyo-monday/config";
import { nextOutreachResult, type Suppression } from "./model";
import type { Crm } from "./worker";

const OUTREACH_RESULT = "color_mm6jydpn";
type Contact = { id: string; board: { id: string }; column_values: Array<{ id: string; text: string | null }>; updates: Array<{ id: string; body: string }> };
async function monday<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  if (!process.env.MONDAY_API_TOKEN) throw new Error("Monday not configured");
  const response = await fetch("https://api.monday.com/v2", { method: "POST", headers: { Authorization: process.env.MONDAY_API_TOKEN, "Content-Type": "application/json", "API-Version": MONDAY_API_VERSION }, body: JSON.stringify({ query, variables }), cache: "no-store", signal: AbortSignal.timeout(12_000) });
  const data = await response.json();
  if (!response.ok || data.errors?.length || !data.data) throw new Error("Monday request failed");
  return data.data as T;
}
export const mondayCrm: Crm = {
  async apply(event: Suppression) {
    const data = await monday<{ items: Contact[] }>(`query MailerLiteContact($ids: [ID!]!) { items(ids: $ids) { id board { id } column_values(ids: ["contact_email", "${OUTREACH_RESULT}"]) { id text } updates(limit: 100) { id body } } }`, { ids: [event.contactId] });
    const item = data.items[0];
    if (!item || item.id !== event.contactId || String(item.board.id) !== String(MONDAY_CONTACTS_BOARD_ID) || item.column_values.find(x => x.id === "contact_email")?.text?.trim().toLowerCase() !== event.email) return "identity_mismatch";
    const current = item.column_values.find(x => x.id === OUTREACH_RESULT)?.text || null;
    const next = nextOutreachResult(current, event.reason);
    // Consent and commercial lifecycle columns are intentionally absent. The
    // newsletter remains governed by explicit website/Klaviyo subscription.
    if (current !== next) await monday(`mutation MailerLiteSuppress($board: ID!, $id: ID!, $values: JSON!) { change_multiple_column_values(board_id: $board, item_id: $id, column_values: $values) { id } }`, { board: String(MONDAY_CONTACTS_BOARD_ID), id: event.contactId, values: JSON.stringify({ [OUTREACH_RESULT]: { label: next } }) });
    const marker = `[ZP_MAILERLITE_SUPPRESSION:${event.id}]`;
    if (!item.updates.some(x => x.body.includes(marker))) await monday(`mutation MailerLiteAudit($id: ID!, $body: String!) { create_update(item_id: $id, body: $body) { id } }`, { id: event.contactId, body: `<p>${marker}</p><p>MailerLite ${event.reason}; series ${event.scope}; event time ${event.occurredAt}. Future governed outreach must honour this suppression. Newsletter consent and commercial lifecycle unchanged. This integration never automatically resubscribes or sends email.</p>` });
    return "applied";
  },
};

export async function listSuppressedSubscribers(status: "unsubscribed" | "bounced" | "junk", visit: (row: unknown) => Promise<void>): Promise<number> {
  const token = process.env.MAILERLITE_API_KEY;
  if (!token) throw new Error("MailerLite polling credential missing");
  let url: string | null = `https://connect.mailerlite.com/api/subscribers?filter[status]=${status}&limit=100`;
  const seen = new Set<string>(); let count = 0;
  while (url) {
    const parsed = new URL(url);
    if (parsed.origin !== "https://connect.mailerlite.com" || parsed.pathname !== "/api/subscribers" || seen.has(url) || seen.size >= 20) throw new Error("MailerLite pagination guard");
    seen.add(url);
    const response: Response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(12_000) });
    if (!response.ok) throw new Error("MailerLite polling failed");
    const data: { data?: unknown[]; links?: { next?: string | null } } = await response.json();
    if (!Array.isArray(data.data)) throw new Error("Invalid MailerLite response");
    for (const row of data.data) { await visit(row); count++; }
    url = typeof data.links?.next === "string" ? data.links.next : null;
  }
  return count;
}
