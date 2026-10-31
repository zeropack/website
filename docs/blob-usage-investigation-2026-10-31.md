# Vercel Blob Advanced Operations investigation — 31 October 2026

Status: investigation and proposed remediation only; production publication not authorised.

## Evidence and scope

- Account: `zero-pack-s-projects`, team `team_aTS0RKRMCSXkcEbJTwXy81MO`.
- The project inventory returned one project: `website`, `prj_mVNAMtcyJKrKOppqsvIwhofCQeUU`.
- Current `master` and the deployment serving `www.zeropack.co` both resolve to
  `05783ab749e607100fd23a201ea992da4fd6d74c`.
- Production deployment: `dpl_HGri4pGvzn8mhtofuRub5d4HdA87`, READY, with all launched
  Global/AU/UK domains assigned.
- Current live 00A, 00B, 00C, Website Management and Website Architecture specifications
  were retrieved. This task changes technical storage access only, with no copy/claims work.
- Reviewed production source, all 59 fetched remote refs, October deployments and sampled
  production/preview build logs. See historical-preview coverage and data gaps below.

## Finding

The most likely dominant source is the unattended MailerLite recovery loop, not image
delivery or repeated article uploads. The exact billing attribution is not available.

Confirmed source chain:

1. `cloudflare/klaviyo-monday-reconcile/wrangler.toml` specifies `5,35 * * * *`:
   48 calls/day to the production Klaviyo/Monday reconcile GET.
2. `src/app/api/integrations/klaviyo-monday/reconcile/route.ts` registers
   `after(safeReconcileMailerLite)` on every authenticated production GET, even if the
   independent Klaviyo reconciliation fails.
3. `src/lib/integrations/mailerlite/reconcile.ts` calls `pendingIds()` and `saveHealth()`
   on every configured run, including when no pending suppressions need processing.
4. `src/lib/integrations/mailerlite/storage.ts` lists the pending prefix once, then
   unconditionally overwrites `health.json` once. Both are Advanced Operations.
5. `vercel.json` supplies a daily additional fallback to the same route.

The current non-secret `MAILERLITE_SYNC_ENABLED` configuration is `true` for production
and preview. The production health record was fetched read-only and returned HTTP 200:
`enabled: true`, `mode: internal`, `polling: complete`, `scanned: 6`, `queued: 1`,
`applied: 0`, `quarantined: 0`, `retry: 0`, `busy: 0`, `errors: 0`,
`checkedAt: 2026-10-31T03:01:02.448Z`. These are aggregate diagnostic fields, not recipient
data. `queued` is incremented even when an existing receipt prevents a new enqueue;
it must not be treated as a count of new Blob uploads. Preview health returned 404.

The code was introduced in production by PR #88 on 16 October. With the configured
48/day caller and daily fallback, the idle baseline is 49 × 2 = **98 Advanced
Operations/day**, approximately **1,470 over 15 days**, or **2,940 over 30 days**.
That closely matches the reported approximately 1,500. The live health record confirms
execution, but the Cloudflare deployment/call count and historical billing series were
not independently available, so the numerical attribution remains a strong hypothesis.

## Stores

One configured store is confirmed from project environment metadata:

| Store | Public delivery hostname | Connected environments |
| --- | --- | --- |
| `store_GWRA1Fss97zWJqtB` | `gwra1fss97zwjqtb.public.blob.vercel-storage.com` | production, preview |

The same store ID, read/write credential binding and public asset hostname are used by
the website. The credential itself was neither decrypted nor displayed. Production and
preview therefore share the connected store and its usage; path namespaces are not quota
isolation. Existing article, activity-claim, Outlook and MailerLite code uses that binding.

This is **not a verified complete account-wide store inventory**. The connector has no
store-list operation, and its store-detail catalog endpoint returned 404 for this observed
ID. The CLI is not installed/authenticated here. Dashboard inventory is needed to rule
out unconnected stores and to confirm the store display name/region/creation history.
The observed 404 is not evidence that the serving store or its files are missing.

## Operation paths

| Source | Calls and frequency | Interpretation |
| --- | --- | --- |
| `scripts/sync-approved-assets.mjs` via `npm run build` | `head()` for each manifest; `put()` only if missing; `get()` after a new upload | Existing checks are Simple Operations, not Advanced. The two current manifests do not cause repeat uploads when present. |
| `src/lib/integrations/mailerlite/storage.ts`, `pendingIds()` | `list()` once per configured reconcile | Advanced even when the inbox is empty. Retained to preserve reliable discovery of pending suppressions. |
| Same file, `saveHealth()` | `put()` once per configured reconcile | Confirmed unconditional diagnostic write; principal avoidable recurring operation. |
| Same file, event processing | create pending; conditional pending lease updates; create/renew contact lock; create receipt; retry writes | Advanced, event-driven; durable encryption/idempotency/suppression safeguards are necessary. Reads are direct `get()`; deletes are free under current pricing. |
| `src/lib/integrations/activity-intelligence/outlook-checkpoint.ts` | `list()` before reading fixed checkpoint, `put()` on successful incremental write or initialisation | The list is unnecessary discovery. Daily enabled cron normally adds one list and one write; manual/dry-run incremental checks can also list. |
| `src/lib/integrations/activity-intelligence/event-claim.ts` | create-only `put()` for each eligible unrecorded Klaviyo event | Necessary duplicate-write protection. `monday-writer.ts` checks existing Monday keys first, so already-recorded events normally avoid this write. |
| `activity-intelligence/reconcile` route | daily configured cron, selects at most 15 candidates/run | At most 15 claim attempts per successful scheduled invocation; manual pilot activity is additional. Actual enabled value/count was not decrypted or measured. |
| `activity-intelligence/outlook-sync` route | authenticated manual initialisation/incremental runs | Dry-run incremental mode still reads the checkpoint; audit/manual scan modes do not. Writes require their existing guards. |
| `mailerlite/webhook` route and protected standalone `mailerlite/reconcile` route | genuine callbacks and authorised manual recovery | Event-driven queue/lease/receipt work or another reconcile baseline; no requests were invoked for investigation. |
| `cloudflare/klaviyo-monday-reconcile` | twice-hourly HTTP caller | Indirect source of recurring MailerLite operations; no Blob SDK in Worker. |
| `.github/workflows/klaviyo-monday-hourly-reconcile.yml` | `workflow_dispatch` only | Despite filename, no current hourly GitHub schedule. A manual dispatch can trigger the production GET and its MailerLite work. |
| Next development and existing test scripts | local asset sync skips unless `VERCEL` is set; tests use isolated/pure modules | No discovered recurring development Blob listing or store creation. New regression tests mock all Blob transport. |

No `copy()` call or Blob store-creation code was found in the reviewed application,
scripts, workflows or fetched branch heads. External dashboard/API/tool operations remain
outside repository visibility. Store creation counts one Advanced Operation per store;
there is no evidence of a store-creation loop.

## Builds, previews and spikes

The deployment API returned 196 October deployments: 17 production and 179 preview,
all READY. Calendar-day counts below use Australia/Adelaide and are deployment spikes,
**not measured Blob usage spikes**:

| Day | Production | Preview |
| --- | ---: | ---: |
| 1 October | 3 | 42 |
| 9 October | 1 | 26 |
| 10 October | 2 | 63 |
| 11 October | 0 | 15 |
| 13 October | 2 | 10 |
| 16 October | 7 | 2 |

Production build logs for `dpl_HGri4pGvzn8mhtofuRub5d4HdA87` report both current article
images as `already-present` (167,224 and 102,992 bytes). Latest reviewed preview
`dpl_A5SroYQihAiM3M7rSJbLbXsgBSX8` also reports its AU asset as `already-present`.
The older preview branch carries one manifest; current master carries two.

Neither sampled build re-uploaded those assets. Even the large deployment counts mainly
increase metadata reads, not Advanced Operations. A new image, missing target or manual
upload can add writes; multipart uploads can add several operations. The build script
does not use multipart or `copy()` and refuses overwrites.

Historical-preview coverage: all 171 distinct commit SHAs in the 196 October API
results were fetched and scanned, including histories no longer reachable through branch
heads. Storage imports occur only in the asset-sync script (171 SHAs), Klaviyo claims
(104), Outlook checkpoints (76) and MailerLite storage (6). The 59 fetched remote refs
also introduce no other Blob adapter. This inventory does not claim to cover arbitrary
tooling outside the repository or provider-internal operations.

## Dashboard and development tooling

Vercel explicitly bills Blob dashboard browsing/list refreshes/uploads/detail interactions
as operations. Therefore dashboard browsing can contribute Advanced Operations. There is
no accessible interaction audit showing that it contributed materially to the reported
1,500, so it is not the leading explanation. Similarly, manual `vercel blob list`, SDK
`list()`, upload/copy commands or an external agent can consume operations, but no such
high-volume process was established. Ordinary public image delivery is a separate
read/cache/transfer cost, not an Advanced upload/list operation.

## Proposed remediation

1. Read the existing MailerLite aggregate health directly. If its fields are unchanged
   and its persisted observation is less than six hours old, skip the overwrite. Persist
   changed results immediately and refresh unchanged results on the first completed run
   at/after six hours. Repair missing/corrupt/unreadable/future-dated health via the old
   write path. Health `checkedAt` becomes the persisted observation time, not every poll.
2. Read the fixed Outlook checkpoint with uncached `get()` instead of listing its prefix.
   Preserve missing-checkpoint handling, timestamp validation, namespaces and writes.
3. Keep asset sync, all image URLs/files, event claims, pending discovery, locks, receipts,
   retries, encryption, consent handling, schedules and configuration intact.

For unchanged health and serial runs at the configured cadence:

| Recurring baseline | Current / 30 days | Proposed / 30 days |
| --- | ---: | ---: |
| MailerLite pending listing | 1,470 | 1,470 |
| MailerLite health overwrite | 1,470 | about 120 |
| Outlook daily checkpoint listing, if enabled | 30 | 0 |
| Outlook daily checkpoint write, if enabled and successful | 30 | 30 |
| Total model | 3,000 | about 1,620 |

Expected saving: about **1,380 Advanced Operations per 30 days** in that idle model,
approximately **46%**. Health changes, event processing, concurrent runs, read failures,
dashboard activity and extra manual runs increase the total. This is a code-derived
forecast, not measured savings. Coalescing trades about 1,470 additional direct health
reads/month for fewer Advanced writes; Simple Operations/transfer should also be watched.
No durable health deduplication lock is introduced because it would add writes and alter
unrelated processing. Concurrent diagnostic writes remain possible.

Do not remove the remaining pending listing or change polling frequency merely to fit
a quota: that risks suppression delivery/recovery. Any indexed queue or storage migration
is a separate design task. Do not archive/delete assets or move their URLs to cut usage.

## Usage, exhaustion and plan suitability

The only current total available is the user's report: approximately **1,500 / 2,000
(75%)**, leaving roughly **500**. Exact usage, reporting range, daily operation types,
rolling expiry/reset and unconnected-store contributions were not exposed by the APIs.

At the unmodified MailerLite idle model alone, 500 remaining operations cover roughly
**five days**. With proposed unchanged-health coalescing, the same allowance would cover
roughly nine days of the 53/day MailerLite baseline, before other writes. These are
conditional no-expiry/no-other-activity calculations, not a predicted outage date. Do not
assume a calendar-month reset on 1 November: Vercel describes Hobby limits using a
30-day waiting window. Confirm the actual dashboard period and aging before projecting.

Hobby is not suitable for this commercial Zero Pack website under Vercel's published
non-commercial/personal-use restriction, independently of whether optimisation gets
operations below 2,000. Recommend a separately approved Pro upgrade and spending
monitoring; no plan, credential or production configuration was changed. Vercel states
Blob becomes inaccessible when Hobby limits are exceeded, which makes this more than
a cosmetic warning: article assets and the integrations share the service.

## Data gaps requiring dashboard/owner access

- Complete team Blob store inventory, including stores not linked to `website`.
- Exact current Advanced/Simple Operations, reporting window and daily/type/store series.
- Last-30-day graph around 16 October and comparison with the 98/day idle model.
- Dashboard/CLI/agent audit or provider support attribution for listing/upload/copy/store
  creation, including whether failed write attempts are billed (not assumed here).
- Actual Cloudflare trigger execution counts and manual recovery/webhook counts.

API limitations recorded: billing charges returned `404 costs_not_found`; legacy
observability schema returned `404`; account events returned `403 forbidden`; the
unversioned store-detail catalog endpoint returned `404` for the observed store ID.
The recent 30-minute runtime query returned no log groups and is not proof of no work;
successful MailerLite runs do not normally log a completion. Hobby rejects a wider
runtime window. No authenticated CLI was available. Browser fallback after these
connector errors would require user approval; it was not attempted.

## QA and release state

Eight regression scenarios exercise the real adapters with only Blob transport mocked:
unchanged health, changed counts/errors/recovery, heartbeat/invalid state, read/write
failures, preview namespace, direct checkpoint reads, fail-closed errors and saves.
The 45 existing integration tests, production build/TypeScript and targeted ESLint passed.
Only scoped adapter, test, package-script and documentation changes are proposed.
Preview deployment/PR checks are recorded in the pull request. No production endpoint
that could execute CRM writes or queue processing was invoked for QA.

## Primary platform references

- [Blob usage/pricing and dashboard operation accounting](https://vercel.com/docs/vercel-blob/usage-and-pricing)
- [Blob SDK reference](https://vercel.com/docs/vercel-blob/using-blob-sdk)
- [Hobby plan and retention](https://vercel.com/docs/plans/hobby)
- [Commercial use policy](https://vercel.com/docs/limits/fair-use-guidelines)

These sources were checked live on 31 October 2026. The API error does not establish
any different plan policy or rule, and no security/access/configuration change is implied.
