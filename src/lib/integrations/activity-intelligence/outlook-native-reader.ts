import { MONDAY_API_VERSION } from "@/lib/integrations/klaviyo-monday/config";
import type { MailSummary } from "./model";

type Entry = { id?: string; content?: string | null; custom_activity_id?: string | null; type?: string | null; title?: string | null; created_at?: string | null; metadata?: string | Record<string, unknown> | null };
type Page = { cursor?: string | null; timeline_items?: Entry[] };
type Result = { data?: { timeline?: { timeline_items_page?: Page } }; errors?: Array<{ message: string }> };

const query = `query($id: ID!) { timeline(id: $id) { timeline_items_page { cursor timeline_items { id content custom_activity_id type title created_at metadata } } } }`;

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
  for (const item of page.timeline_items) {
    if (item.custom_activity_id) continue;
    const raw = item.metadata;
    let metadata: Record<string, unknown> = {};
    try {
      metadata = typeof raw === "string" ? JSON.parse(raw) as Record<string, unknown>
        : raw && typeof raw === "object" ? raw : {};
    } catch { opaque = true; continue; }
    if (item.type && item.type !== "email") continue;
    const sender = typeof metadata.from === "string" ? metadata.from : "";
    const to = Array.isArray(metadata.to) ? metadata.to.filter((x): x is string => typeof x === "string") : [];
    const text = item.content || "";
    const idMatch = /(?:internet[- ]?message[- ]?id|message[- ]?id)\s*:\s*(<[^>]+>|[^\s]+)/i.exec(text);
    const stableId = idMatch?.[1];
    const direction = sender.trim().toLowerCase() === "hello@zeropack.co" ? "sent" : "received";
    messages.push({
      internetMessageId: stableId, direction, from: sender, to,
      subject: item.title || "", occurredAt: item.created_at || "",
    });
    if (!stableId) opaque = true;
  }
  return opaque ? { complete: false, messages, reason: "Native email without stable RFC identifier; only positive duplicate matches permitted" }\n    : { complete: true, messages };
}
