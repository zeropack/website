import { classifyOutlookRecovery, type OutlookEnvelope } from "./outlook-source";

type GraphAddress = { emailAddress?: { address?: string } };
type GraphMessage = {
  id?: string; internetMessageId?: string; subject?: string;
  from?: GraphAddress; toRecipients?: GraphAddress[];
  sentDateTime?: string; receivedDateTime?: string;
  isDraft?: boolean;
};
type GraphPage = { value?: GraphMessage[]; "@odata.nextLink"?: string };

const GRAPH = "https://graph.microsoft.com";
const MAILBOX = "hello@zeropack.co";
const ALLOWED_FOLDERS = ["inbox", "sentitems"] as const;

export async function graphAppToken(): Promise<string> {
  const tenant = process.env.MS_GRAPH_TENANT_ID;
  const client = process.env.MS_GRAPH_CLIENT_ID;
  const secret = process.env.MS_GRAPH_CLIENT_SECRET;
  if (!tenant || !client || !secret || process.env.MS_GRAPH_MAILBOX?.toLowerCase() !== MAILBOX) {
    throw new Error("Scoped Outlook recovery configuration incomplete");
  }
  const body = new URLSearchParams({
    client_id: client, client_secret: secret, grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default",
  });
  const response = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`, {
    method: "POST", body, cache: "no-store",
  });
  if (!response.ok) throw new Error(`Graph token request failed: HTTP ${response.status}`);
  const payload = await response.json() as { access_token?: string };
  if (!payload.access_token) throw new Error("Graph token missing");
  return payload.access_token;
}

export type OutlookPreviewItem = {
  messageId: string; occurredAt: string; category: string; address: string;
  internetMessageId?: string | null; subject: string; direction: "sent" | "received"; from: string; to: string[];
  disposition: "candidate" | "hold"; reason: string;
};

export async function scanOutlookGraph(lookbackHours = 24, maxPages = 2) {
  if (!Number.isInteger(lookbackHours) || lookbackHours < 1 || lookbackHours > 168) throw new Error("Invalid lookback");
  if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages > 5) throw new Error("Invalid page budget");
  const token = await graphAppToken();
  const threshold = new Date(Date.now() - lookbackHours * 3600000).toISOString();
  const items: OutlookPreviewItem[] = [];
  let scanned = 0;
  for (const folder of ALLOWED_FOLDERS) {
    const stamp = folder === "inbox" ? "receivedDateTime" : "sentDateTime";
    const base = `/v1.0/users/${MAILBOX}/mailFolders/${folder}/messages`;
    const url = new URL(base, GRAPH);
    url.searchParams.set("$top", "50");
    url.searchParams.set("$select", "id,internetMessageId,subject,from,toRecipients,sentDateTime,receivedDateTime,isDraft");
    url.searchParams.set("$filter", `${stamp} ge ${threshold}`);
    let next: string | null = url.href;
    const visited = new Set<string>();
    for (let page = 0; next && page < maxPages; page++) {
      const target: URL = new URL(next);
      if (target.origin !== GRAPH || !target.pathname.startsWith(base) || visited.has(target.href)) {
        throw new Error("Unsafe or repeated Graph pagination");
      }
      visited.add(target.href);
      const res: Response = await fetch(target, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      if (!res.ok) throw new Error(`Graph mailbox read failed: HTTP ${res.status}`);
      const data = await res.json() as GraphPage;
      if (!Array.isArray(data.value)) throw new Error("Graph messages missing");
      scanned += data.value.length;
      for (const m of data.value) {
        if (m.isDraft) continue;
        const envelope: OutlookEnvelope = {
          from: m.from?.emailAddress?.address || "",
          to: (m.toRecipients || []).map(x => x.emailAddress?.address || "").filter(Boolean),
          subject: m.subject || "", internetMessageId: m.internetMessageId,
          providerMessageId: m.id,
          direction: folder === "inbox" ? "received" : "sent",
          sourceFolder: folder === "inbox" ? "inbox" : "sent",
        };
        const classified = classifyOutlookRecovery(envelope);
        // QuickBooks recovery belongs to Phase 3, never surface it as Phase 2 correspondence.
        if (classified.action === "skip") continue;
        if (classified.action === "candidate" && classified.source !== "outlook_manual") continue;
        if (!m.id || !(m.internetMessageId || m.id)) continue;
        items.push({
          messageId: m.id, internetMessageId: m.internetMessageId, subject: m.subject || "",
          direction: envelope.direction, from: envelope.from, to: envelope.to, occurredAt: (folder === "inbox" ? m.receivedDateTime : m.sentDateTime) || "",
          category: classified.action === "candidate" ? classified.category : "unclassified",
          address: classified.action === "candidate" ? classified.recipient : "",
          disposition: classified.action === "candidate" ? "candidate" : "hold",
          reason: classified.action === "candidate"
            ? "Unmatched preview only: native Monday timeline, automation origin and identity not yet reconciled"
            : classified.reason,
        });
      }
      next = data["@odata.nextLink"] || null;
    }
    if (next) throw new Error("Incomplete Graph mailbox scan; page budget exhausted");
  }
  return { scanned, items };
}

/** Restricted public shape: only opaque IDs, never parties or message body. */
export async function previewOutlookGraph(lookbackHours = 24, maxPages = 2) {
  const { scanned, items } = await scanOutlookGraph(lookbackHours, maxPages);
  return {
    mode: "dry_run" as const, mailbox: MAILBOX, scanned,
    candidateCount: items.filter(x => x.disposition === "candidate").length,
    holdCount: items.filter(x => x.disposition === "hold").length,
    items: items.map(x => ({ messageId: x.messageId, occurredAt: x.occurredAt,
      category: x.category, disposition: x.disposition, reason: x.reason })),
    warning: "Read-only mailbox scan; no canonical Monday matching, native activity deduplication, CRM writes or schedule. A candidate is NOT eligible for import.",
  };
}
