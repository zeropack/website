# Zero Pack Reorder Review — Phase 3 controlled test

Staff-only standalone Monday board-view application. Customer and synthetic QA views remain preview-only. The separately gated controlled Code Black test has one physical Send enrollment path. No Outlook/MailerLite/Mass Mail/Emails & Activities calls, mailbox drafts, send recipes or backend tokens. The public website and Quote Manager bundle are unchanged.

## Run and build

Node 24; `npm ci`, `npm run check`, `npx playwright install chromium`, `npm run test:e2e`.

Default mode is an in-memory synthetic demonstration. Example recipients use `example.invalid`; page reload resets decisions. No CRM records, customer fixtures, credentials or supplier information are committed.

`npm run build:monday` builds an SDK-connected static board view. It must be installed on private Customer Reorder Profiles `5032104596`. Opening the built files outside the expected Monday board context fails closed. The connected staff member's board permissions remain authoritative. API version `2026-07`; required read access covers Profiles, Templates, Companies, Contacts and Client Projects. Only profile snapshot/body/state and existing Review Status/Snooze Until/Reminder Active may be written. Confidence, product history and source boards are never written.

Register as a **new board-view feature**, not a replacement for Quote Builder. Upload the contents of `dist/` as a Monday client-side ZIP and attach the feature only to the Reorder Profiles board. Review access scopes (`boards:read`, `boards:write`, current user identity) against the actual app settings. No app feature, installed view or live Monday hosting has yet been created by this implementation. Registration/install/live SDK acceptance remain a release gate.

## Canonical configuration

- Reorder Profiles: `5032104596`; preserved operational table view **Reorder Management**: `57934808`.
- Templates: `5032105285`, four example templates plus one Signature component.
- Stable keys: `reorder.stock_check`, `reorder.due`, `reorder.overdue`, `reorder.18_month`.
- Shared signature reference: `shared.zeropack.signature`. One centrally maintained body, never four copied footers. This is a provisional preview signature using the approved four-line Patrick Kilbane signoff and Zero Pack website; the full configured mailbox footer/unsubscribe treatment must be confirmed before Phase 3 sending.
- New profile fields: Draft Body `long_text_mm8fgwnj`, Draft State `color_mm8frq0e`, Review Snapshot `text_mm8ff4xc`. All are hidden in Reorder Management. The snapshot is schema-versioned JSON encoded as UTF-8/base64 with `zp-review-v1:` prefix. Encoding preserves HTML against Monday Text display normalization; it is **not encryption**. Body <=2,000 characters, snapshot raw JSON <=24KB, encoded <=33KB. Native Monday roundtrip was verified with a >4KB synthetic snapshot, then the QA row cleared.
- Source IDs and template columns are defined in `src/schema.ts`; live adapter validates required types before actions.

## Controls and consistency

Current Company → Primary Contact → current Contact email is fetched on every load and again immediately before generation/approval. Missing/multiple contacts, conflicting Contact Company links, inaccessible records or incomplete paging block actions. Preview UI shows one current contact name/email; legacy Resolved Contact and Linked Contact Email are deprecated display caches, retained without deletion. Phase 1 Contact Email/Contact Checked remain because formulas and the daily refresh depend on them; Phase 2 ignores those caches for recipient resolution.

Sibotest/Second Skin/Flash Graphics remain without fulfilment dates while their relevant project is incomplete. Any linked incomplete project blocks generation; a different active Company project also conservatively blocks pending relevance confirmation. No new history/profile import, cadence changes, confidence recalculation or paired-product splitting occurs. Confirmed Dimple and Code Black paired sets remain one profile each.

Template selection: Soon Due → Stock Check; Due → Due; Overdue/Lapsed → Overdue. The 18-calendar-month fallback/cap takes precedence. Not Due, paused/disabled, future/missing fulfilment, skipped/sent cycles, incomplete projects and blocking data/contact issues produce no draft. Expired snooze can re-enter if otherwise eligible; future/missing snooze date holds.

Supported tokens: first_name (fallback `there`), company_name, product_name, last_quantity, last_fulfilment_date, expected_reorder_date. Missing quantity says `not recorded`; no invented value. Unknown/unresolved tokens, duplicate/inactive templates and missing shared signature block rendering. Body authoring accepts paragraphs, newlines, **bold**, HTTPS/HTTP/mailto links. Raw HTML is escaped. Rendering uses a sandboxed iframe with restrictive CSP and no scripts, forms or remote assets.

Generation saves a complete rendered preview. Edit changes only that customer's snapshot/body, not the template, and revokes old approval. Approve stores current staff ID, ISO timestamp, recipient, subject/body/HTML, template/footer keys/versions and a SHA-256 source fingerprint. It only sets Approved; it never sets Sent. Snooze holds until a future date; Skip suppresses current cycle without disabling the profile; Pause sets Reminder Active No and needs manual reactivation.

The fingerprint covers Company/name, product/key/quantity, fulfilment/cadence/cycle, project relations/statuses, current contact/email, confidence, reminder activation/snooze, source blockers and full template/footer configuration. Time-based template changes invalidate previews too. Refresh/focus/30-second polling (suspended while editing) visibly marks Needs Refresh; approval performs another live check. Polling does not rewrite snapshots. **Phase 3 must revalidate; a stored Approved/Draft State alone is insufficient.**

Optimistic `updated_at` checks before mutation and exact readback protect staff edits. Monday has no atomic compare-and-swap: a narrow concurrent-update race remains. No blind retry follows an uncertain write. Independent approval/send locking and immutable send/activity logs belong in Phase 3.

## Validation and release limits

42 unit/adapter/codec tests; six desktop/mobile browser flows. Coverage includes selection/18-month cap, disabled/incomplete records, canonical recipient changes, stale approvals, merge tokens/paired products, HTML safety, per-draft editing, Snooze/Skip/Pause, approval metadata, write allowlist, concurrent edits and API errors. Browser flows assert no external requests in demo and footer/content alignment at 1440px and 390px. Native excluded QA item tested encoded snapshot save/readback and was cleared. Customer confidence/history/reminder settings are preserved.

The Monday app feature registration, upload and installed-context SDK acceptance are pending. Local browser QA and native connector snapshot storage tests are not proof of installed-app success. Do not report Phase 2 fully live before that gate.

Phase 3 proposal only: a human-triggered send handler must re-resolve current recipient, compare exact approved fingerprint/snapshot, check newer orders/projects, reminder/snooze/skip/pause and contact eligibility/suppression, enforce idempotency and log provider message ID/result. Historical Phase 2 release note; superseded by the controlled Phase 3 implementation below.

## 26 October — installed mutation QA preparation

Phase 2 v1 is installed on Customer Reorder Profiles, view `57940141`.
This change adds an explicit Internal QA mode, separate from customer lists. It accepts only the existing fixture `2889840324`, still labelled QA and unlinked to Company/Project records. QA previews use synthetic packaging/dates and the current signed-in staff email, restricted to `zeropack.co`. This is visibly disclosed and does not replace canonical customer contact resolution. Start/reset actions write only the six existing review-state fields on that fixture. Reset clears the draft and approval, turns Reminder Active off and restores Not Ready. Customer mode continues to exclude QA. There is no email/enrollment code.

Validation: 45 unit/adapter/codec tests pass, including the complete QA prepare/generate/edit/approve/readback/snooze/skip/pause/reset lifecycle and refusal of other fixture IDs, linked customers/projects and external staff emails. TypeScript and Monday build pass. Local browser test launch is unavailable (default Chromium missing; historical binary not executable), so the six browser tests have not been rerun successfully for this change.

Release: Monday v2 `19273688`, feature `127293484`, is live after direct user approval. The exact ZIP SHA-256 is `2bde66f315afa3f2d91f7e10cf399f21a61ac8ed36bc5e9dedbaa097c924f828`. Installed generate/edit/readback/approve/approval-after-page-refresh/Snooze/Skip/Pause/Reset checks passed using only the excluded fixture. Pause persisted through app refresh. The final fixture is QA, Reminder Active No, Review Status Not Ready, Draft State Empty, with blank body/snapshot/snooze. Seven real customer profiles and all shared templates exactly matched their captured baselines. No email or Sequence enrollment occurred. GitHub run 40242567107 passed unit/build, all six desktop/mobile browser flows and the Monday build; this supersedes the local browser-launch limitation for independent automated verification.

Phase 3 remains gated. The inspected public Sequence type exposes metadata only; it has no live email content/recipient-column or per-recipient suppression/eligibility fields. Enrollment exists from API 2026-04, but metadata visibility is not proof of email eligibility or content parity. Do not implement or enable enrollment by assuming those checks pass. Investigate a supported native validation mechanism before any internal Send test. Edited instance text also needs an explicit native Sequence binding before the approved preview can be treated as operational sending content. No custom sender, signature or unsubscribe mechanism was created.


## Phase 3 — authoritative controlled-send architecture (26 October 2026)

Application pre-send validation + monday-native unsubscribe enforcement at Sequence execution + post-enrollment run-state verification. There is no supported app-level native global-unsubscribe eligibility precheck. Contact Subscribed is not authoritative. Both native unsubscribe controls remain enabled. Never override or retry a Stopped/suppressed run.

Only the physical Send handler calls enrollment. No effects, polling, dates, statuses, approvals or activation initiate enrollment. Test identity is the Code Black profile, its current canonical Company Primary Contact, a pinned Sequence revision and the controlled review cycle. The Company-match exception only accepts this exact identity and expires after two hours. It also permits a controlled Stock Check preview while preserving the actual fulfilment date, cadence, confidence and 18-month next-review date. Instance edits are disabled for this native fixed-content test. Direct recipient/name/company variables must match canonical CRM immediately before enrollment.

Durable idempotency uses app-global SDK storage and version-conditional writes, keyed by Profile ID + Review Cycle + Sequence ID with approved SHA-256 fingerprint. A non-sending bootstrap build proves concurrent/stale-version exclusion on installed storage before creating the ledger. A subsequent build removes provisioning UI and cannot reset the ledger. A durable Sending / Enrollment Pending claim precedes live revalidation and the sole enrollment call. Accepted enrollment remains Enrolled, never Sent. Ambiguous outcomes become Send status requires review and remain locked. All existing attempts, including blocked ones, prevent further enrollment across refresh/reopen.

The native contact journey is inspected using monday's supported native/connector interface. An authorised operator records its run ID, status, reason and email/activity evidence on Last Reminder Result as nativeRun. On refresh the app reconciles that observation into the durable receipt; this path cannot enroll, clear a lock or retry. Unsubscribe/permission/suppression results become Blocked by monday. Unknown terminations require review. Sent requires explicit email-sent evidence. Review Status must never be set Sent solely on enrollment acceptance. No API for journey inspection or native eligibility is fabricated.

52 unit/adapter/codec tests pass, including durable concurrent lock contention, duplicate prevention, ambiguous enrollment, stale variables, narrow exception expiry and a stubbed Stopped unsubscribe reconciliation which stays locked. TypeScript and the Monday production build pass. Live controlled-send evidence is maintained in the Phase 2/3 operational runbook. Bootstrap v3 installed CAS proof passed; no customer email was sent by provisioning.
