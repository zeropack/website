import assert from "node:assert/strict";
import { test } from "node:test";
import { createCipheriv, randomBytes } from "node:crypto";
import { mkdtemp, mkdir, readFile, writeFile, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { auditLedger } from "./audit-retired-mailerlite.mjs";

const temp = await mkdtemp(join(tmpdir(), "zp-retirement-tests-"));
const originalEnv = { ...process.env }, originalFetch = globalThis.fetch;
globalThis.fetch = () => { throw new Error("Unexpected real network request"); };
const routes = ["klaviyo-monday/reconcile", "mailerlite/reconcile", "mailerlite/webhook"];
try {
  const mock = join(temp, "transport.mjs");
  await writeFile(mock, `
export const state = { calls: [], error: false };
export const NextResponse = { json(body, options = {}) { return new Response(JSON.stringify(body), { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } }); } };
export async function reconcileKlaviyoMondayWithAcquisition(options) {
  state.calls.push(options);
  if (state.error) throw new Error('controlled reconciliation failure');
  return { ok: true, unchanged: true };
}
`);
  const mockUrl = pathToFileURL(mock).href;
  for (const route of routes) {
    const source = await readFile(join(process.cwd(), "src/app/api/integrations", route, "route.ts"), "utf8");
    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
      .replace(/from ["']next\/server["']/g, `from ${JSON.stringify(mockUrl)}`)
      .replace(/from ["']@\/lib\/integrations\/klaviyo-monday\/reconcile-with-acquisition["']/g, `from ${JSON.stringify(mockUrl)}`);
    const output = join(temp, route + ".mjs");
    await mkdir(dirname(output), { recursive: true }); await writeFile(output, js);
  }
  const { state } = await import(mockUrl);
  const core = await import(pathToFileURL(join(temp, "klaviyo-monday/reconcile.mjs")).href);
  function reset() {
    state.calls = []; state.error = false;
    process.env.VERCEL_ENV = "production"; process.env.CRON_SECRET = "test-cron-only"; process.env.INTERNAL_API_SECRET = "test-internal-only";
    delete process.env.MONDAY_LIFECYCLE_SYNC_CUTOVER_AT; delete process.env.MONDAY_LIFECYCLE_LOOKBACK_HOURS;
  }
  await test("authorised scheduled reconciliation still calls the canonical Klaviyo/Monday pipeline with unchanged options", async () => {
    reset();
    const response = await core.GET(new Request("https://example.test/api", { headers: { Authorization: "Bearer test-cron-only" } }));
    assert.equal(response.status, 200); assert.deepEqual(await response.json(), { ok: true, unchanged: true });
    assert.deepEqual(state.calls, [{ mode: "apply", lifecycleLookbackHours: 72, lifecycleCutoverAt: "2026-08-20T08:35:00.000Z", standardInboundEnabled: true }]);
    assert.equal(response.headers.get("cache-control"), "no-store");
  });
  await test("production authentication and preview exclusion still prevent scheduled execution", async () => {
    reset(); assert.equal((await core.GET(new Request("https://example.test"))).status, 401); assert.equal(state.calls.length, 0);
    process.env.VERCEL_ENV = "preview";
    assert.equal((await core.GET(new Request("https://example.test", { headers: { Authorization: "Bearer test-cron-only" } }))).status, 404); assert.equal(state.calls.length, 0);
  });
  await test("manual reconciliation preserves preview/apply gates and acquisition selection", async () => {
    reset(); assert.equal((await core.POST(new Request("https://example.test", { method: "POST" }))).status, 401);
    process.env.VERCEL_ENV = "preview";
    await core.POST(new Request("https://example.test", { method: "POST", headers: { "x-zp-secret": "test-internal-only" }, body: JSON.stringify({ mode: "preview", includeAcquisition: true }) }));
    assert.deepEqual(state.calls, [{ mode: "preview", lifecycleLookbackHours: 72, lifecycleCutoverAt: null, standardInboundEnabled: true }]);
  });
  await test("canonical reconciliation failure retains its existing error response and never launches a retired worker", async () => {
    reset(); state.error = true;
    const originalError = console.error; console.error = () => {};
    try { assert.equal((await core.GET(new Request("https://example.test", { headers: { Authorization: "Bearer test-cron-only" } }))).status, 500); }
    finally { console.error = originalError; }
    assert.equal(state.calls.length, 1);
  });
  await test("retired endpoints return 410 even with old credentials enabled, without reading input or making requests", async () => {
    reset(); process.env.MAILERLITE_SYNC_ENABLED = "true";
    for (const route of routes.slice(1)) {
      const handler = await import(pathToFileURL(join(temp, route + ".mjs")).href);
      const unreadableRequest = { text() { throw new Error("Retired route read input"); }, json() { throw new Error("Retired route read input"); } };
      for (const method of ["GET", "POST"]) {
        const response = await handler[method](unreadableRequest);
        assert.equal(response.status, 410); assert.equal(response.headers.get("cache-control"), "no-store");
        assert.deepEqual(await response.json(), { ok: false, retired: true });
      }
    }
    assert.equal(state.calls.length, 0);
    await assert.rejects(access(join(process.cwd(), "src/lib/integrations/mailerlite")));
  });

  const key = randomBytes(32).toString("hex");
  function encrypted(value) {
    const iv = randomBytes(12), cipher = createCipheriv("aes-256-gcm", Buffer.from(key, "hex"), iv);
    const data = Buffer.concat([cipher.update(JSON.stringify(value)), cipher.final()]);
    return JSON.stringify({ v: 1, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: data.toString("base64") });
  }
  const event = { contactId: "123", email: "private@example.test", reason: "unsubscribed" };
  function audit(entries, value, contact = { boardId: "5029468199", email: event.email, outreach: "Do Not Contact" }) {
    return auditLedger({ key, async listBlobs({ prefix }) { return { blobs: entries.filter(pathname => pathname.startsWith(prefix)).map(pathname => ({ pathname })), hasMore: false }; }, async readBlob() { return value; }, async readContact() { return contact; } });
  }
  await test("read-only retention audit validates protected receipts without returning personal data", async () => {
    const report = await audit(["internal/mailerlite/production/receipts/a.json"], encrypted({ event, outcome: "applied" }));
    assert.equal(report.ready, true); assert.equal(report.verified, 1); assert.equal(report.receipts, 1);
    assert.ok(!JSON.stringify(report).includes(event.email)); assert.ok(!JSON.stringify(report).includes(event.contactId));
  });
  await test("retention audit blocks pending, quarantined, unreadable and unreflected records", async () => {
    assert.equal((await audit(["internal/mailerlite/production/pending/a.json"], encrypted({ event }))).ready, false);
    assert.equal((await audit(["internal/mailerlite/production/receipts/a.json"], encrypted({ event, outcome: "identity_mismatch" }))).ready, false);
    assert.equal((await audit(["internal/mailerlite/production/receipts/a.json"], "corrupt")).unreadable, 1);
    assert.equal((await audit(["internal/mailerlite/production/receipts/a.json"], encrypted({ event }), { boardId: "other", email: event.email, outreach: "Do Not Contact" })).unreflected, 1);
  });
  await test("retention audit completes both namespaces and refuses incomplete pagination", async () => {
    const prefixes = [];
    await auditLedger({ key, async listBlobs({ prefix }) { prefixes.push(prefix); return { blobs: [], hasMore: false }; }, readBlob() { throw new Error("unexpected read"); }, readContact() { throw new Error("unexpected CRM read"); } });
    assert.deepEqual(prefixes, ["internal/mailerlite/production/", "internal/mailerlite/preview/"]);
    await assert.rejects(auditLedger({ key, async listBlobs() { return { blobs: [], hasMore: true }; } }), /pagination_incomplete/);
  });
} finally {
  process.env = originalEnv; globalThis.fetch = originalFetch;
  await rm(temp, { recursive: true, force: true });
}
