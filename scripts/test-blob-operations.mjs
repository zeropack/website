// Transpile the real storage adapters and substitute only the Blob transport.
// No network, production credentials, Blob files or CRM records are used.
import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const temp = await mkdtemp(join(tmpdir(), "zp-blob-tests-"));
const originalEnv = { ...process.env };
const originalNow = Date.now;
const now = Date.parse("2026-10-31T04:00:00Z");
Date.now = () => now;
process.env.VERCEL_ENV = "production";
process.env.BLOB_READ_WRITE_TOKEN = "test-only-not-a-real-token";

const mockPath = join(temp, "blob-mock.mjs");
await writeFile(mockPath, `
export class BlobNotFoundError extends Error {}
export class BlobPreconditionFailedError extends Error {}
export const state = { calls: [], value: null, error: null, putError: null, statusCode: 200 };
export async function get(path, options) {
  state.calls.push({ op: 'get', path, options });
  if (state.error) throw state.error;
  if (state.value === null) return null;
  return { statusCode: state.statusCode, stream: new Response(state.value).body, blob: { etag: 'etag' } };
}
export async function put(path, body, options) {
  state.calls.push({ op: 'put', path, body, options });
  if (state.putError) throw state.putError;
  return { etag: 'next-etag' };
}
export async function list() { throw new Error('Unexpected list operation'); }
export async function del() { throw new Error('Unexpected delete operation'); }
`);
try {
  for (const name of ["mailerlite/storage", "mailerlite/model", "activity-intelligence/outlook-checkpoint"]) {
    const source = await readFile(join(process.cwd(), "src/lib/integrations", `${name}.ts`), "utf8");
    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
      .replace(/from ["']@vercel\/blob["']/g, `from ${JSON.stringify(pathToFileURL(mockPath).href)}`)
      .replace(/from ["'](\.\/[^"']+)["']/g, (_match, p) => `from "${p}.mjs"`);
    const output = join(temp, `${name}.mjs`);
    await mkdir(dirname(output), { recursive: true }); await writeFile(output, js);
  }
  const { state, BlobNotFoundError } = await import(pathToFileURL(mockPath).href);
  const { saveHealth } = await import(pathToFileURL(join(temp, "mailerlite/storage.mjs")).href);
  const checkpoint = await import(pathToFileURL(join(temp, "activity-intelligence/outlook-checkpoint.mjs")).href);
  const summary = { enabled: true, polling: "complete", applied: 0, errors: 0 };
  function reset(value = null) {
    state.calls = []; state.value = value; state.error = null; state.putError = null; state.statusCode = 200;
    process.env.VERCEL_ENV = "production";
  }
  const puts = () => state.calls.filter(x => x.op === "put");
  const stored = (age, extra = {}) => JSON.stringify({ ...summary, ...extra, checkedAt: new Date(now - age).toISOString() });

  await test("unchanged health uses one direct read and zero writes before six-hour heartbeat", async () => {
    reset(stored(30 * 60_000)); await saveHealth({ errors: 0, applied: 0, polling: "complete", enabled: true });
    assert.equal(puts().length, 0); assert.deepEqual(state.calls, [{ op: "get", path: "internal/mailerlite/production/health.json", options: { access: "public", useCache: false } }]);
  });
  await test("health changes, including errors and recovery, persist immediately", async () => {
    for (const next of [{ ...summary, errors: 1 }, { ...summary, polling: "failed" }, { ...summary, applied: 1 }]) {
      reset(stored(1)); await saveHealth(next); assert.equal(puts().length, 1); assert.deepEqual(JSON.parse(puts()[0].body), { ...next, checkedAt: new Date(now).toISOString() });
    }
    reset(stored(1, { errors: 1 })); await saveHealth(summary); assert.equal(puts().length, 1);
  });
  await test("unchanged health refreshes at six hours and repairs invalid timestamps or content", async () => {
    for (const previous of [stored(6 * 3600_000), stored(7 * 3600_000), stored(-1), JSON.stringify({ ...summary, checkedAt: "bad" }), JSON.stringify(summary), "broken JSON", "[]", "null", null]) {
      reset(previous); await saveHealth(summary); assert.equal(puts().length, 1);
    }
  });
  await test("health read errors fall back to writing; write errors remain visible", async () => {
    reset(); state.error = new Error("read unavailable"); await saveHealth(summary); assert.equal(puts().length, 1);
    reset(); state.putError = new Error("write unavailable"); await assert.rejects(saveHealth(summary), /write unavailable/);
  });
  await test("health preserves preview namespace and overwrite options", async () => {
    reset(); process.env.VERCEL_ENV = "preview"; await saveHealth(summary);
    assert.equal(puts()[0].path, "internal/mailerlite/preview/health.json");
    assert.deepEqual(puts()[0].options, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 0 });
  });
  await test("Outlook checkpoint reads known pathname without listing, preserving timestamp fallback", async () => {
    reset(JSON.stringify({ lastSuccessfulAt: "2026-10-30T22:00:00Z" }));
    assert.deepEqual(await checkpoint.readRecoveryCheckpoint(), { lastSuccessfulAt: "2026-10-30T22:00:00Z", updatedAt: "2026-10-30T22:00:00Z" });
    assert.deepEqual(state.calls, [{ op: "get", path: "internal/outlook-recovery/production/phase2-checkpoint.json", options: { access: "public", useCache: false } }]);
  });
  await test("Outlook missing checkpoint is null; auth, status and corrupt-data failures still fail closed", async () => {
    reset(); assert.equal(await checkpoint.readRecoveryCheckpoint(), null);
    reset(); state.error = new BlobNotFoundError(); assert.equal(await checkpoint.readRecoveryCheckpoint(), null);
    reset(); state.error = new Error("Unauthorized"); await assert.rejects(checkpoint.readRecoveryCheckpoint(), /Unauthorized/);
    reset("{}"); state.statusCode = 304; await assert.rejects(checkpoint.readRecoveryCheckpoint(), /retrieval failed/);
    for (const data of ["not JSON", "null", "{}", '{"lastSuccessfulAt":"bad"}']) { reset(data); await assert.rejects(checkpoint.readRecoveryCheckpoint()); }
  });
  await test("Outlook retains preview isolation and existing save behavior", async () => {
    reset("{}"); process.env.VERCEL_ENV = "preview";
    const preview = await import(pathToFileURL(join(temp, "activity-intelligence/outlook-checkpoint.mjs")).href + "?preview");
    await assert.rejects(preview.readRecoveryCheckpoint());
    assert.equal(state.calls[0].path, "internal/outlook-recovery/preview/phase2-checkpoint.json");
    const value = { lastSuccessfulAt: "2026-10-30T22:00:00Z", updatedAt: "2026-10-30T22:00:00Z" };
    await preview.saveRecoveryCheckpoint(value); assert.equal(puts()[0].path, "internal/outlook-recovery/preview/phase2-checkpoint.json");
    assert.deepEqual(JSON.parse(puts()[0].body), value); assert.equal(puts()[0].options.allowOverwrite, true);
    await assert.rejects(preview.saveRecoveryCheckpoint({ ...value, lastSuccessfulAt: "bad" }));
  });
} finally {
  Date.now = originalNow;
  process.env = originalEnv;
  await rm(temp, { recursive: true, force: true });
}
