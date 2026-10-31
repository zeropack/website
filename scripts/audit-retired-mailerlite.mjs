// Manual, read-only recovery/retention audit. Never imported by website runtime.
// Run explicitly with --audit in an authorised environment that already has the
// retained Blob/encryption/CRM credentials. Never print keys, emails or records.
import { createDecipheriv } from "node:crypto";
import { pathToFileURL } from "node:url";
import { get, list } from "@vercel/blob";

function decrypt(text, key) {
  if (!/^[a-f0-9]{64}$/i.test(key || "")) throw new Error("audit_key_unavailable");
  const row = JSON.parse(text);
  if (row.v !== 1) throw new Error("audit_ciphertext_version");
  const cipher = createDecipheriv("aes-256-gcm", Buffer.from(key, "hex"), Buffer.from(row.iv, "base64"));
  cipher.setAuthTag(Buffer.from(row.tag, "base64"));
  return JSON.parse(Buffer.concat([cipher.update(Buffer.from(row.data, "base64")), cipher.final()]).toString("utf8"));
}

export async function auditLedger({ listBlobs, readBlob, readContact, key }) {
  const report = { pending: 0, receipts: 0, quarantined: 0, locks: 0, health: 0, unknown: 0, unreadable: 0, unreflected: 0, verified: 0 };
  for (const environment of ["production", "preview"]) {
    const prefix = `internal/mailerlite/${environment}/`;
    let cursor;
    const seen = new Set();
    do {
      const page = await listBlobs({ prefix, limit: 1000, ...(cursor ? { cursor } : {}) });
      for (const entry of page.blobs) {
        if (!entry.pathname.startsWith(prefix)) throw new Error("audit_prefix_mismatch");
        const kind = entry.pathname.slice(prefix.length).split("/")[0];
        if (kind === "health.json") { report.health++; continue; }
        if (kind === "locks") { report.locks++; continue; }
        if (!["pending", "receipts"].includes(kind)) { report.unknown++; continue; }
        report[kind]++;
        try {
          const value = decrypt(await readBlob(entry.pathname), key);
          if (value.outcome === "identity_mismatch") report.quarantined++;
          const event = value.event;
          if (!event || !/^\d+$/.test(event.contactId) || !["unsubscribed", "spam", "bounced"].includes(event.reason)) throw new Error("audit_event_invalid");
          const contact = await readContact(event.contactId);
          const identity = contact && contact.boardId === "5029468199" && contact.email?.trim().toLowerCase() === event.email?.trim().toLowerCase();
          const suppressed = event.reason === "bounced"
            ? ["Bounced Email", "Invalid Email", "Do Not Contact"].includes(contact?.outreach)
            : contact?.outreach === "Do Not Contact";
          if (identity && suppressed) report.verified++;
          else report.unreflected++;
        } catch { report.unreadable++; }
      }
      if (!page.hasMore) break;
      if (!page.cursor || seen.has(page.cursor) || seen.size >= 100) throw new Error("audit_pagination_incomplete");
      seen.add(page.cursor); cursor = page.cursor;
    } while (true);
  }
  return { ...report, ready: report.pending === 0 && report.quarantined === 0 && report.unknown === 0 && report.unreadable === 0 && report.unreflected === 0 };
}

async function main() {
  if (!process.argv.includes("--audit")) throw new Error("Explicit --audit flag required; no changes are performed");
  const key = process.env.MAILERLITE_EVENT_ENCRYPTION_KEY;
  const token = process.env.MONDAY_API_TOKEN;
  if (!key || !token) throw new Error("audit_credentials_unavailable");
  const report = await auditLedger({ key, listBlobs: list,
    async readBlob(pathname) {
      const result = await get(pathname, { access: "public", useCache: false });
      if (!result || result.statusCode !== 200) throw new Error("audit_blob_unavailable");
      return new Response(result.stream).text();
    },
    async readContact(id) {
      const response = await fetch("https://api.monday.com/v2", {
        method: "POST", headers: { Authorization: token, "Content-Type": "application/json", "API-Version": "2026-07" },
        body: JSON.stringify({ query: 'query($ids:[ID!]!) { items(ids:$ids) { board { id } column_values(ids:["contact_email","color_mm6jydpn"]) { id text } } }', variables: { ids: [id] } }),
        signal: AbortSignal.timeout(12_000),
      });
      const data = await response.json();
      if (!response.ok || data.errors?.length || !Array.isArray(data.data?.items)) throw new Error("audit_crm_unavailable");
      const item = data.data.items[0];
      return item ? { boardId: item.board.id, email: item.column_values.find(x => x.id === "contact_email")?.text, outreach: item.column_values.find(x => x.id === "color_mm6jydpn")?.text } : null;
    },
  });
  console.log("MAILERLITE_RETIREMENT_AUDIT", JSON.stringify(report));
  if (!report.ready) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => { console.error("MAILERLITE_RETIREMENT_AUDIT_BLOCKED"); process.exitCode = 1; });
}
