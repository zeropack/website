import { listMondayContacts } from "@/lib/integrations/klaviyo-monday/clients";
import { MONDAY_API_VERSION } from "@/lib/integrations/klaviyo-monday/config";
import { graphAppToken, scanOutlookGraph, type OutlookPreviewItem } from "./outlook-graph";
import { readRecoveryCheckpoint, saveRecoveryCheckpoint } from "./outlook-checkpoint";
import { readMondayNativeMail } from "./outlook-native-reader";
import { reconcileOutlookWithMonday } from "./outlook-match";
import type { MailSummary } from "./model";

const MAILBOX = "hello@zeropack.co";
const EMAIL_RECEIVED = "5596cef2-66b3-4dfe-8cce-c366d66cd4f2";
const EMAIL_SENT = "8b6c4544-b271-4cc6-a9fc-40811d6f8e9c";
const OVERLAP_MS = 5 * 60 * 1000;
const BATCH_LIMIT = 25;

type GraphBody = { id?: string; body?: { content?: string }; bodyPreview?: string };
type TimelineMutation = { data?: { create_timeline_item?: { id?: string } }; errors?: Array<{ message: string }> };
export type SyncOptions = { mode: "incremental" | "manual"; email?: string; lookbackHours?: number; maxPages?: number; startAt?: string; endAt?: string; write: boolean };

function excludesKnownAutomation(m: OutlookPreviewItem): boolean {
  if (m.direction !== "sent") return false;
  const subject = m.subject.trim();
  // Known Monday mass-mail and order/project automation families, plus
  // marketing campaigns which already have their own source of truth.
  return /^(?:Zero Pack Order\s|Project\s+\d+\s+with Zero Pack\s|Custom packaging for\s|A useful packaging guide for\s|A quick re-introduction to Zero Pack\b|When the timing is right\b|New Typeform lead\b|New Contact Us enquiry\b)/i.test(subject)
    || /^Zero Pack (?:Lead Research|Content)\s/i.test(subject);
}
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
async function readFullMessage(m: OutlookPreviewItem, token: string): Promise<GraphBody> {
  const folder = m.direction === "sent" ? "sentitems" : "inbox";
  const url = `https://graph.microsoft.com/v1.0/users/${MAILBOX}/mailFolders/${folder}/messages/${encodeURIComponent(m.messageId)}?$select=id,body,bodyPreview`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!res.ok) throw new Error(`Outlook message body read failed: ${res.status}`);
  const body = await res.json() as GraphBody;
  if (body.id !== m.messageId) throw new Error("Outlook message identity changed");
  return body;
}
async function writeActivity(contactId: string, m: OutlookPreviewItem, html: string): Promise<string> {
  if (!process.env.MONDAY_API_TOKEN) throw new Error("Missing Monday API token");
  const query = `mutation CreateRecovered($item: ID!, $type: String!, $title: String!, $summary: String!, $content: String!, $at: ISO8601DateTime!) {
    create_timeline_item(item_id: $item, custom_activity_id: $type, title: $title, summary: $summary, content: $content, timestamp: $at) { id }
  }`;
  const content = `<p>Recovered Outlook correspondence — ${m.direction}<br>Source mailbox: ${MAILBOX}<br>From: ${escapeHtml(m.from)}<br>To: ${escapeHtml(m.to.join(", "))}<br>Original Outlook Message ID: ${escapeHtml(m.messageId)}<br>Original timestamp: ${escapeHtml(m.occurredAt)}<br>Source: Microsoft Graph mailbox recovery Phase 2</p><hr>${html}`;
  const response = await fetch("https://api.monday.com/v2", {
    method: "POST", cache: "no-store", headers: {
      Authorization: process.env.MONDAY_API_TOKEN,
      "API-Version": MONDAY_API_VERSION, "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: {
      item: contactId, type: m.direction === "sent" ? EMAIL_SENT : EMAIL_RECEIVED,
      title: `Recovered Outlook: ${m.subject}`.slice(0, 255),
      summary: "Recovered correspondence; original source and timestamp retained.",
      content, at: m.occurredAt,
    } }),
  });
  const data = await response.json() as TimelineMutation;
  const id = data.data?.create_timeline_item?.id;
  if (!response.ok || data.errors?.length || !id) throw new Error("Monday email activity write failed");
  return id;
}

/** Simple serial runner. Unmatched Contacts are ignored; failures never advance checkpoint. */
export async function syncOutlookRecovery(options: SyncOptions) {
  if (options.write && process.env.OUTLOOK_RECOVERY_WRITE_ENABLED !== "true")
    throw new Error("Recovery writes are disabled");
  const checkpoint = options.mode === "incremental" ? await readRecoveryCheckpoint() : null;
  if (options.mode === "incremental" && !checkpoint)
    throw new Error("Initial checkpoint is not configured; run a bounded manual sync first");
  const now = new Date();
  const window = options.mode === "manual" && options.startAt && options.endAt
    ? { startAt: options.startAt, endAt: options.endAt } : undefined;
  const since = window ? Date.parse(window.startAt) : checkpoint ? Date.parse(checkpoint.lastSuccessfulAt) - OVERLAP_MS : now.getTime() - (options.lookbackHours || 24) * 3600000;
  const lookbackHours = options.mode === "incremental"
    ? Math.min(168, Math.max(1, Math.ceil((now.getTime() - since) / 3600000)))
    : (options.lookbackHours || 24);
  if (checkpoint && now.getTime() - since > 168 * 3600000)
    throw new Error("Checkpoint is older than seven days; bounded manual catch-up required");
  const [scan, contacts] = await Promise.all([scanOutlookGraph(lookbackHours, options.maxPages || 5, window), listMondayContacts()]);
  const exact = new Map<string, string[]>();
  for (const c of contacts) {
    const address = c.email.trim().toLowerCase();
    if (!address) continue;
    exact.set(address, [...(exact.get(address) || []), c.id]);
  }
  const stats = { scanned: scan.scanned, ignored: 0, ambiguous: 0, duplicates: 0, eligible: 0, written: 0, failed: 0 };
  const native = new Map<string, Awaited<ReturnType<typeof readMondayNativeMail>>>();
  let token: string | null = null;
  let processed = 0;
  const eligible = scan.items.filter(m => m.disposition === "candidate" && Date.parse(m.occurredAt) >= since)
    .sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt));
  for (const m of eligible) {
    if (options.mode === "manual" && m.address.toLowerCase() !== options.email?.toLowerCase()) continue;
    if (options.mode === "incremental" && excludesKnownAutomation(m)) { stats.ignored++; continue; }
    const ids = exact.get(m.address.trim().toLowerCase()) || [];
    if (ids.length !== 1) { ids.length ? stats.ambiguous++ : stats.ignored++; continue; }
    if (processed >= BATCH_LIMIT) { stats.failed++; break; }
    const contactId = ids[0];
    try {
      // Fresh native history per write guarantees retries observe previously recovered IDs.
      const history = options.write ? await readMondayNativeMail(contactId)
        : native.get(contactId) || await readMondayNativeMail(contactId);
      if (!options.write) native.set(contactId, history);
      const summary: MailSummary = { internetMessageId: m.internetMessageId, providerMessageId: m.messageId,
        direction: m.direction, from: m.from, to: m.to, subject: m.subject, occurredAt: m.occurredAt };
      const result = reconcileOutlookWithMonday(summary, m.address, contacts, history.messages, history.complete);
      if (result.action === "duplicate") { stats.duplicates++; continue; }
      if (result.action !== "eligible") { stats.failed++; continue; }
      stats.eligible++;
      processed++;
      if (!options.write) continue;
      token ||= await graphAppToken();
      const full = await readFullMessage(m, token);
      if (!full.body?.content && !full.bodyPreview) throw new Error("Empty Outlook message content");
      await writeActivity(contactId, m, full.body?.content || escapeHtml(full.bodyPreview || ""));
      stats.written++;
    } catch (error) {
      processed++;
      stats.failed++;
      console.error("[Outlook recovery] Per-message failure", { category: error instanceof Error ? error.message : "Unknown" });
    }
  }
  // Do not advance an incremental checkpoint on partial scans, failures, or an incomplete batch.
  if (options.mode === "incremental" && options.write && stats.failed === 0) {
    await saveRecoveryCheckpoint({ lastSuccessfulAt: now.toISOString(), updatedAt: new Date().toISOString() });
  }
  return { ...stats, mode: options.mode, dryRun: !options.write, checkpointAdvanced: options.mode === "incremental" && options.write && stats.failed === 0 };
}
