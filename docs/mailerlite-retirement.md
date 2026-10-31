# MailerLite website integration retirement

Status: prepared for review on 31 October 2026; production merge is not authorised.

## Scope

Remove the legacy recovery hook from the authenticated Klaviyo/Monday scheduled
reconciliation GET. Delete MailerLite clients, polling/storage adapters, encryption
writer, workers and their old runtime tests. Keep explicit, inert HTTP 410 responses
at the two old routes so callers are told the service is retired rather than being
given a false acknowledgement. These handlers do not inspect bodies or credentials,
call providers, schedule work, or access Blob.

Klaviyo/Monday reconciliation, authentication, acquisition/lifecycle behavior and
schedules stay unchanged. Outlook checkpoint logic, Klaviyo event claims, public
assets and the approved asset-sync script are unchanged. There was no separate
MailerLite package dependency; `@vercel/blob` remains necessary for unrelated uses.

PR #92's MailerLite write coalescing is superseded by retirement. Its unrelated
Outlook optimization is not included in this change; retain current production
Outlook behavior. Do not merge #92 alongside this retirement.

## Live dependency audit

- Three MailerLite campaigns were returned on the only result page. All are sent,
  finished and not currently sending; none is queued/ready or draft.
- No MailerLite automation is present.
- Two website suppression webhooks exist; both were already disabled. Neither was
  enabled or deleted by this task.
- No popup, embedded or promotion forms were returned.
- No enabled ChatGPT task references MailerLite. The one old verification task is
  already inactive. No automation was changed.
- Cloudflare calls the canonical Klaviyo/Monday GET twice hourly, with a daily
  Vercel fallback. These callers remain required for Klaviyo/Monday and stay intact.
  The current GitHub fallback is manual-only. Retirement removes only the secondary
  MailerLite hook from their target.
- Production and preview still have `MAILERLITE_SYNC_ENABLED=true`, account 2716838,
  `MAILERLITE_SYNC_MODE=internal`, API keys, signing secret and encryption key. The
  final website code never reads those flags or API/signing credentials. Leave all
  credentials intact pending explicit removal/retention approval.
- Existing API capabilities do not expose a complete account-level active-import
  job/integration inventory. No importer or MailerLite sender exists in the website
  code. The account owner must confirm no external importer/service uses the retained
  keys; absence of an API view is not proof of universal absence.

## Suppression reconciliation and evidence

Current provider snapshot: five unsubscribed, one currently listed bounced, zero
junk/complaints. Historical production campaign 201454007886022634 additionally
reports two hard bounces and three soft bounces. One historical hard-bounce subscriber
is no longer retrievable by the current subscriber endpoint; campaign evidence remains.

All ten distinct affected Contacts were checked by exact provider-to-Monday Contact ID,
Contacts board and current email identity. Four missing Outreach Result values were
set to Do Not Contact under the user's explicit retirement instruction. Five unsubscribe
Contacts are now Do Not Contact. Existing Bounced Email and Invalid Email protections
were preserved. The three soft-bounce Contacts remain Risky Email, requiring an approved
current eligibility decision before retrying outreach; a soft bounce was not relabelled
as permanent invalidity. Dated provider evidence is retained in Monday item updates;
the original controlled-test audit was preserved without fabricating a new automatic run.

Readbacks verified marketing Subscription, email identity and commercial lifecycle
were unchanged. No Klaviyo profile, subscription, suppression or send was changed.
No MailerLite subscriber/campaign was deleted, reactivated or resubscribed.
Personal details, subscriber links and secrets must not be committed to this repository.

## Blob retention and recovery

The manual script `scripts/audit-retired-mailerlite.mjs --audit` can enumerate both
`internal/mailerlite/production/` and `internal/mailerlite/preview/` namespaces, decrypt
historical pending/receipt records in memory, and verify existing Monday suppression
state. It reports aggregate counts only. It cannot write/delete Blob or change CRM.
It is not a cron, API route, build step or recurring job in the final implementation.
Pending, quarantined, unreadable, unknown or unreflected records block readiness.
The exact one-off ledger audit result is recorded in the PR once available.

Retain every historical encrypted queue/receipt/lock/health object and its encryption
key, as well as Monday audit notes, source subscriber statuses and sent-campaign
reports. Do not choose a deletion/retention deadline without a separate review.
Original implementation/format reference is archived at
`docs/retired/mailerlite-suppression-sync.md` and in Git history.

Do not restore a retired worker merely to replay an ambiguous record. Use authorised
read-only recovery, exact identity checks and a separately approved manual suppression
decision. A future recovery tool must retain authenticated encryption and fail closed.

## Remaining cutover dependencies

Sent emails still contain provider-hosted unsubscribe links. Do not delete the
MailerLite account, campaign evidence or subscriber suppressions. Once automatic
recovery stops, later opt-outs will not be mirrored automatically to Monday. The
owner must approve and own a manual provider opt-out review/reconciliation process
for the historical-mail tail, or commission a separately governed replacement that
does not use recurring Blob polling. This dependency must be resolved before
production retirement approval; it is not concealed by an empty pending queue.

Immediately before an approved cutover, refresh current and campaign-level suppression
snapshots, reconcile any new cases, and rerun the bounded ledger audit. Preserve
any stronger existing restriction and all marketing/direct-outreach separation rules.
Do not use marketing consent or a successful old delivery as permission to clear a block.

Old immutable preview deployments may retain the prior runtime; they are not the
scheduled production target. Do not invoke old processing URLs. Retained credentials
and later deployment/credential cleanup require separate approval; this PR neither
removes keys nor claims to disable unrelated external services.

## Operations estimate

After approved deployment, recurring MailerLite Blob operations in this website are
zero: no pending listing, health overwrite, polling, queue write, receipt write or
lease work is reachable. Each former idle recovery run used one `list()` and one
health `put()`. At 48 Cloudflare calls plus one daily fallback, retirement removes
about 98 Advanced Operations/day, or 2,940 per 30 days, plus event-driven MailerLite
writes. This is a code/cadence estimate, not independently verified billing attribution.

Unrelated usage remains: normal asset metadata checks (Simple Operations), genuinely
new approved asset uploads, Klaviyo event claims and current Outlook checkpoint work.
Assuming enabled successful daily Outlook recovery, its unchanged checkpoint list/write
baseline is about 60 Advanced Operations per 30 days, plus event/manual activity.
The task's one-off audit itself performs bounded list/read operations; these are not
recurring runtime work and must not be represented as zero investigation usage.

## Verification and publication gate

Run `npm run test:integration-retirement`, the existing activity tests, targeted lint,
TypeScript and the production build. Tests invoke the real scheduled route with only
the canonical service transport mocked, verifying successful apply, error handling,
production/auth gates, manual preview options and no retired side work. Both tombstones
must return 410 even while legacy flags/keys are still configured, without reading input.
Ledger-audit tests verify decryption, redacted output, identity/state checks and pagination.

Preview checks must verify the 410 routes and public asset/article delivery without
running authenticated production reconciliation or sending email. The canonical
Klaviyo/Monday implementation and schedule files should be byte-for-byte unchanged,
apart from removing the route's MailerLite import/hook.

Do not merge, publish, remove credentials, disable provider services or delete storage
without explicit approval. No authorised production publishing is implied by completed
suppression housekeeping or a successful preview. Record all remaining cutover gates
in the PR and obtain user approval before production release.
