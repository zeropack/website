# Zero Pack Reorder Review

Staff-only monday board-view app with canonical CRM previews, human approval, snooze/skip/pause and one separately gated controlled native Sequence send path. Customer and synthetic QA views remain preview/approval only. Quote Manager and the public website are unchanged.

## Run and build

Node 24: `npm ci`, `npm run check`, `npx playwright install chromium`, `npm run test:e2e`. Default mode is an in-memory synthetic demonstration using example.invalid recipients. `npm run build:monday` produces the SDK-connected app; it fails closed outside Customer Reorder Profiles. No backend credentials or mailbox tokens are embedded.

Installed app 12498152, stable feature key `zeropack_reorderreview::reorderreview`, board view 57940141. Phase 3 v5 version 19277295, feature 127301676, completed the controlled test. Phase 3.1 v6 version 19277710, feature 127302621, updates the product variable only. API version 2026-07. Current staff permissions remain authoritative. Source is on draft PR91, based on feature/zero-pack-quote-manager; no merge was requested.

## Canonical data and review

Profiles board 5032104596; operational Reorder Management table view 57934808. Templates board 5032105285 has stable keys reorder.stock_check, reorder.due, reorder.overdue and reorder.18_month, plus shared.zeropack.signature. Canonical recipient resolution always follows current Company → current Primary Contact → current Contact email. Copied email/name fields are validation targets, never recipient authority. Normal Company-match validation remains intact.

`Product / Packaging` (`long_text_mm8f81pb`) is the detailed internal specification and continues to identify the paired reorder profile and its history. `Email - Product Name` (`text_mm8gb0g7`) is the short customer-facing description. `{{product_name}}` in the backup Email Automation Templates, and the native `pulse.text_mm8gb0g7` Sequence variable, both refer to the latter. The app displays both fields separately. It never falls back to the internal specification in email copy; blank customer-facing wording blocks preview, approval and Send with “Customer-facing product name required.”

Generate merges current contact and customer-facing product name. Per-instance edits revoke approval without changing shared templates. Approval stores reviewer/time, rendered recipient/content, template versions and SHA-256 source fingerprint; approval never enrolls or sends. The fingerprint includes both product fields, so changing the email name marks an existing draft Needs Refresh and requires regeneration. Source, contact, product, project, timing or template changes also invalidate the preview. Pause persists until manually reactivated; snooze and skipped/sent cycles hold sending. Active projects and newer unreconciled completed projects block review. Confidence and product/fulfilment history are never overwritten.

Snapshots use versioned UTF-8/base64 JSON to preserve HTML in monday Text fields. Preview HTML is escaped and sandboxed. Board writes use updated_at preconditions and exact readback; board editing itself has a narrow concurrency race. Independent sending uses a durable version-conditional app-global storage lock.

Excluded synthetic fixture 2889840324 remains reset, disabled and unlinked to customer sources. It cannot enroll or send. Existing Phase2 installed lifecycle QA was retained, not rebuilt.

## Controlled physical send

The architecture is **application pre-send validation + monday-native unsubscribe enforcement at Sequence execution + post-enrollment run-state verification**. There is no supported app-level native global unsubscribe precheck. The Contact Subscribed field is not authoritative. Both native global and sequence unsubscribe controls stay enabled. Never override or retry Stopped/suppressed runs.

Only the physical Send handler calls enrollment. Polling, refresh, dates, statuses, approval and Sequence activation never enroll. This release permits only the exact controlled Code Black identity and cycle, with a pinned Sequence revision and expiring configuration. The test-specific Company-match/timing exception does not alter canonical relations, fulfilment history, cadence, confidence or actual next-review date; every other profile retains normal validation. Direct email/name/company variables must equal current canonical CRM immediately before enrollment. Native content is pinned to its verified template; instance editing is disabled for this fixed-content test.

Idempotency is Profile ID + Review Cycle + Sequence ID, retaining the approved fingerprint. App-global SDK storage uses previous_version conditional writes. A non-sending bootstrap v3 proved installed concurrent/stale-version exclusion before provisioning the ledger. The final build has no provisioning/reset UI. A durable Sending / Enrollment Pending claim precedes final CRM/Sequence revalidation and the sole enrollment call. Accepted enrollment becomes Enrolled only. Any uncertain response becomes Send status requires review and stays locked. Every attempted cycle remains locked across refresh, reopen and major app versions.

Native journeys are inspected through supported monday native/connector tools. An authorised operator records run ID, state, reason and email/activity evidence as nativeRun in Last Reminder Result. App refresh reconciles this observation into the durable receipt; reconciliation cannot enroll, clear a lock or retry. Unsubscribe/permission/suppression becomes Blocked by monday; unknown termination requires review. Sent requires explicit email-sent evidence. Review Status is never set Sent solely on accepted enrollment.

## Verified release outcome

52 unit/adapter/codec tests, TypeScript/build, all six desktop/mobile browser flows and Monday build passed in GitHub run40271866106. Tests cover concurrent claims, duplicate/ambiguous attempts, stale variables, narrow exception expiry and a stubbed native Stopped unsubscribe result that remains durably locked. Installed global-storage contention and stale-version checks passed.

Exactly one authorised physical Send produced one completed native automatic-email run, one CRM email activity and one received internal message. Canonical first name, paired-product variables, approved sender, native signature image and unsubscribe link were verified. Repeat Send was blocked after refresh, full reload, reopening and final app-version upgrade. No real mailbox was unsubscribed for testing. Private identities, run/activity IDs and restoration details are recorded in the operational Phase2/3 runbook.

The controlled profile's reminder/review/draft/last-reminder fields were restored. Verified send audit and refreshed canonical contact caches remain. Temporary Primary Contact was unchanged. Other six customer profiles and excluded QA fixture exactly matched their captured baselines. Stock Check was deactivated after completion. Due, Overdue and18 Month Sequences were configured with the approved sender/recipient, native signature and both unsubscribe controls, but never activated or enrolled. All four are inactive; Stock Check has one completed enrollment and the other three have zero.

Phase 3 installed v5 ZIP SHA-256: `77596935665ad2c8ac942529aa8199bd70d4bdac7b99ab1b6659e53a38b85b50`.

## Phase 3.1 product-name cleanup

All seven current `Email - Product Name` values were read from the live board and retained exactly. Dimple and Code Black remain one paired profile each, with their full specifications untouched. The Stock Check backup template and native Sequence add only “your” before the short product name, so Code Black renders: “How are your stock levels looking for your black compostable mailers?” The other three backup templates kept their approved wording. All four native Sequence bodies now reference `pulse.text_mm8gb0g7` instead of `pulse.long_text_mm8f81pb`; their signature and unsubscribe nodes were preserved. The Sequences remain inactive, with no Phase 3.1 enrollment or email.

The 56 non-sending tests cover the seven values, blank/changed wording, stale approval and Send gating, paired internal specifications and existing duplicate/suppression controls. The controlled test ledger and sole physical enrollment path were not reset or changed. The source is ready for CI and installed preview verification.

The authorised controlled test is complete. No additional customer email or enrollment is authorised without explicit user approval.


## Multiple Company Primary Contacts — 27 October 2026

The review adapter now validates all current Company primaries and shows every resolved name/email. Multiplicity alone is valid. Any invalid or mismatched selected contact holds the complete cohort; a shared mailbox is deduplicated case-insensitively by email after validation. A single Company/product profile and purchase cycle remain intact.

Generate stores one personalised subject/body/HTML per distinct recipient in the existing snapshot. The recipient selector displays each email; instance edits affect only that recipient and revoke the cohort approval. The fingerprint covers the complete sorted contact identity/name/email list. Added, removed, renamed or changed contacts invalidate approval; relation ordering does not. Existing single-recipient snapshots load but require regeneration because the fingerprint now covers the set. Native monday `pulse` variables in current backup templates are rendered through the same supported token mapping.

Daily refresh accepts multiple primaries. The single Contact Email compatibility field holds only the first sorted Contact ID's email after ALL primaries pass, solely to keep existing queue formulas working; it is never a full recipient list or send authority. Company primaries and optional deprecated relation caches are not modified.

Customer mode remains preview/approval only. The existing controlled single-recipient test transport explicitly rejects multiple contacts before claiming or enrolling. This release does not implement production per-recipient native enrollment. Before that transport is released, each unique recipient needs isolated native suppression, recipient-bound variables, a durable Profile+Cycle+Sequence+normalized-email attempt lock, independent outcome evidence and no retry after uncertain/blocked attempts; legacy profile-level attempts must still prevent replay. Never rotate a shared row's recipient variables between active native runs. No sequence activation or email is authorized by this change.
