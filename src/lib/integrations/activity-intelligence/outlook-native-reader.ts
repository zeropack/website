import { MONDAY_API_VERSION } from "@/lib/integrations/klaviyo-monday/config";
import type { MailSummary } from "./model";

type Entry = { id?: string; content?: string | null; custom_activity_id?: string | null; type?: string | null; title?: string | null; created_at?: string | null };
type Page = { cursor?: string | null; timeline_items?: Entry[] };
type Result = { data?: { timeline?: { timeline_items_page?: Page } }; errors?: Array<{ message: string }> };

const query = `query($id: ID!) { timeline(id: $id) { timeline_items_page { cursor timeline_items { id content custom_activity_id type title created_at } } } }`;

/**
 * Read native Monday timeline entries for a single existing Contact.
 * Any native activity without comparable RFC message identity makes the
 * correspondence inventory uncertain; the importing side must HOLD.
 */
export async function readMondayNativeMail(contactId: string): Promise<{
  complete: boolean; messages: MailSummary[]; reason?: string;
}> {
  if (!/^\d+$/.test(contactId)) throw new Error("Invalid Contact ID");
  if (!process.env.MONDAY_API_TOKEN) throw new Error("Missing Monday API token");
  const response = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: { Authorization: process.env.MONDAY_API_TOKEN, "Content-Type": "application/json", "API-Version": MONDAY_API_VERSION },
    body: JSON.stringify({ query, variables: { id: contactId } }), cache: "no-store",
  });
  if (!response.ok) throw new Error(`Monday read failed: HTTP ${response.status}`);
  const data = await response.json() as Result;
  if (data.errors?.length) throw new Error("Monday timeline GraphQL error");
  const page = data.data?.timeline?.timeline_items_page;
  if (!page || !Array.isArray(page.timeline_items)) return { complete: false, messages: [], reason: "Native Monday timeline unavailable" };
  if (page.cursor) return { complete: false, messages: [], reason: "Native Monday timeline pagination incomplete" };
  const messages: MailSummary[] = [];
  let opaque = false;
  // These are existing production E&A activity types, not new schema.
  const recoveredTypes = new Set([
    "5596cef2-66b3-4dfe-8cce-c366d66cd4f2", // Email Received
    "8b6c4544-b271-4cc6-a9fc-40811d6f8e9c", // Email Sent
  ]);
  for (const item of page.timeline_items) {
    const text = item.content || "";
    if (item.custom_activity_id) {
      if (!recoveredTypes.has(item.custom_activity_id) || !item.title?.startsWith("Recovered Outlook:")) continue;
      const marker = /Original Outlook Message ID:\s*([^<\s]+)/i.exec(text);
      if (!marker) { opaque = true; continue; }
      messages.push({
        providerMessageId: marker[1], direction: item.custom_activity_id === "8b6c4544-b271-4cc6-a9fc-40811d6f8e9c" ? "sent" : "received",
        from: "", to: [], subject: item.title, occurredAt: item.created_at || "",
      });
      continue;
    }
    // Notes, meetings and calls are not native email duplicates.
    if (item.type && item.type !== "email") continue;
    // Native Monday E&A GraphQL does not expose sender/recipient metadata.
    // A native message can be positively matched by an embedded RFC ID;
    // otherwise it must remain opaque, never proof of absence.
    const idMatch = /(?:internet[- ]?message[- ]?id|message[- ]?id)\s*:\s*(<[^>]+>|[^\s<]+)/i.exec(text);
    messages.push({
      internetMessageId: idMatch?.[1],
      direction: "received", from: "", to: [], subject: item.title || "", occurredAt: item.created_at || "",
    });
    if (!idMatch) opaque = true;
  }
  // A fully paginated timeline is complete even when native emails omit RFC IDs.
  // Opaque entries remain in messages for best-effort comparison.
  return { complete: true, messages, reason: opaque ? "Some native email IDs unavailable; best-effort duplicate check" : undefined };
}
