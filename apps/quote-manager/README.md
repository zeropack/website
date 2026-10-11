# Zero Pack Quote Manager

Staff-only React/Vite application. Source imported from the supplied v0.2.2 ZIP and maintained in `zeropack/website`, branch `feature/zero-pack-quote-manager`. Monday remains the business database. No public website route, customer portal, issuing workflow or QuickBooks integration is added.

## Development

Node 24:

```sh
npm ci
npm run dev
npm run check
npx playwright install chromium
npm run test:e2e
```

Default mode is **synthetic demo**. Demo writes exist only in browser memory and reset on page reload. Live CRM records, supplier prices and credentials must never be added to fixtures or committed to this public repository.

`npm run build:monday` builds the Monday SDK mode with writes disabled. It must be opened as the installed board view for private board `5031824429`; standalone browsers cannot authenticate a Monday user session. The existing app is `12360227`, live version v5 (`18763492`), feature `zeropack_quotemanager::quotebuilder`. No app upload, release or promotion is automated.

An approved staff draft release explicitly sets `VITE_APP_MODE=monday` and `VITE_MONDAY_WRITES_ENABLED=true`. This is a capability flag, not an authorization mechanism. Monday's active user session and board permissions remain authoritative. Never set a Monday token as a Vite variable or add a token-based server proxy to the demo.

## Components and ownership

- `src/schema.ts`: existing prototype field mapping; no board schema edits.
- `src/adapter.ts`: injected GraphQL transport, typed column decoding, complete cursor paging, private-board validation, managed-field omissions, status locks and optimistic update check.
- `src/monday.ts`: Monday SDK transport pinned to the verified stable API version `2026-07` and board-context guard.
- `src/costing.ts`: reusable decimal arithmetic derived from `Form_subQuotes` in the original Access object report.
- `src/customer.ts`: country-aware description generator and customer DTO allowlist.
- `src/components/`: reusable editor fields and customer description view.
- `src/mock.ts`: synthetic test data only.
- `tests/` and `e2e/`: unit/adapter/calculation and desktop/mobile browser coverage.

Reference lists request only `contact_account` and company `status` values. Inaccessible boards, API errors, repeated cursors and a paging budget exhaustion stop loading rather than silently presenting incomplete lists. Dropdown settings use `name` or `label` and omit deactivated options. Connected-board IDs are read through `BoardRelationValue.linked_item_ids`; generic `value` can be null.

## Access calculation basis

User confirmed **legacy USD bank fees** on 10 October 2026. The existing Monday field title says Bank Fees AUD. This prototype stores the legacy USD input in that existing field, labels it USD in the application and records pricing version `quote-v3-insurance-minimum-20261011` (retaining the v2 USD bank/plate interpretation). No canonical schema is renamed. Other readers of the existing numeric field MUST use this pricing version to interpret it. Older records without a pricing version remain unverified.

The calculation retains the Access rounding and quantity rules, with the user-approved USD plate-fee correction from 11 October 2026:

1. Supplier AUD unit = USD unit × saved AUD-per-USD FX.
2. Total USD = supplier USD unit × sell quantity + plate fee USD. Total AUD and product cost = Total USD × saved FX. The plate fee is included exactly once. The existing Monday Transaction Fee AUD column is reused without a schema rename; this pricing version identifies its new USD interpretation. Pre-v2 stored plate amounts must be verified in USD before recalculation.
3. Insurance candidate = 0.3% × Total USD (including plate fee) when shipping USD is positive, otherwise zero. Access declares `shipins` as Integer, so half-to-even integer rounding applies. When shipping is positive, insurance is at least USD 30 regardless of a blank/zero historical insurance field. Zero shipping means zero insurance. Overflow now stops with an actionable error instead of silently retaining stale results.
4. Freight/import = (shipping USD + calculated insurance USD + bank USD) × FX + customs fee AUD + duty AUD.
5. Product sell unit = half-to-even rounding to four decimal places of product cost × (1 + markup / 100) ÷ sell quantity. Access stores markup as a fraction; the new UI explicitly accepts percent.
6. Product selling total = rounded product sell unit × sell quantity.
7. Access all-in unit reference = (product selling total + freight/import) ÷ supplier quantity. Supplier and sell quantities are deliberately distinct, matching the original form.

`landed` stores combined product and freight/import costs. `sellUnit` stores the **product-only** selling unit price. All-in price is a separate reference, not a customer offer. Decimal math avoids binary floating-point drift; final currency totals display two decimals and unit prices four. Calculated price snapshots and generated descriptions are captured on every valid draft save. Incomplete drafts remain saveable without fabricated totals. New quotes default customs duty to AUD 120 and customs fees to AUD 116; existing records retain their values. New quote FX defaults to the latest published ECB USD/AUD reference rate via Frankfurter v2 multiplied by 1.05. The base reference rate and date appear beside the editable snapshot; base higher than snapshot is red, lower is green, equal neutral. Refresh updates the comparison only, never a saved or manually entered snapshot. Failure leaves manual input available. The 5% is a planning allowance, not a guaranteed bank spread. The source/date/base/allowance are retained in FX metadata. Only the currency pair is sent to the public API.

## Record safety and visibility

Customer and supplier contact selections use existing Contacts → Company links. A supplier dropdown must match exactly one existing Company to filter supplier contacts. Missing/ambiguous links stop contact assignment; the app neither creates supplier records nor infers links. One customer may have multiple draft quotes; duplication clears legacy IDs, QBO fields and public visibility.

New quotes are Private. Existing visibility and external system fields are omitted from update payloads. Issued/Accepted/Superseded or unknown original statuses cannot be edited by changing the draft's local status. Save performs an optimistic `updated_at` check immediately before the mutation; Monday does not provide an atomic compare-and-swap, so simultaneous staff editing remains a limitation. A successful create followed by failed readback retains the created ID and disables saving until refresh, preventing duplicate creation on retry. Do not authorize concurrent commercial issuance from this prototype.

The customer DTO is an explicit allowlist with reference, edited customer description, quantity, product price and artwork reference. It excludes internal costs, FX, markup, supplier identity/description and notes. It is not a security boundary for a future portal: that portal must authenticate and produce approved DTOs server-side without fetching internal drafts. Manually entered customer text still requires staff review. No customer portal is built here.

## Preview and CI

A separate Vercel project rooted at `apps/quote-manager` is the intended long-term arrangement:

- Git repository: `zeropack/website`.
- Build: `npm run check`; install: `npm ci`; output: `dist`; framework: Vite; Node: 24.
- Require Vercel Authentication for all deployments. No custom production domains or production secrets.
- Disable automatic deployment of `master`; preview uses the exact feature-branch commit.
- Leave `VITE_APP_MODE` unset for synthetic demo. Never enable Monday writes in a standalone preview.

Project creation was rejected by connected Vercel credentials (403), and the local CLI could not access the team. A one-off protected static preview on the existing project may be used with deployment-only root/build overrides if deployment permissions allow; do not change the website project's persisted settings, aliases or production domains. Check the exact returned preview URL, protection and build state before reporting deployment success.

`vercel.json` here has noindex headers, private/no-store caching and disables `master` Git deployments for the standalone app. It is separate from the website's root configuration. Website TypeScript excludes this separately installed application so its build does not inherit app-only dependencies.

`.github/workflows/quote-manager.yml` runs checks on scoped feature pushes/PRs and publishes a **read-only Monday build artifact** only after unit, type, build and browser checks succeed. No secrets, real customer records, release promotions or production deploys are in that workflow.

## Remaining acceptance gates

- Vercel project creation permission for permanent standalone protected Git previews.
- Supplier contact identities/links: all nine expected Company records exist, but targeted relation and name/company-field searches found no confirmed matching contacts. Do not fabricate or duplicate contacts.
- Commercial review of rounding, freight/customer price presentation, the existing bank-field label mismatch and representative historical totals before customer issuance.
- Explicit approval before website production merge or customer-visible release. Routine fixes to the installed private Monday app remain within the authorized staff release scope.

### Staff form layout and company autofill

The staff form follows the supplied Access layout: quote/customer/shipping header, packaging input rows, shipping/calculated totals, and supplier/customer descriptions with clipboard copy. Form inputs use 14px type; labels use 13px. Descriptions always derive from the current relevant specifications and company shipping address. Copy uses the generated text and never sends anything to QBO. Supplier generation can include the selected company's recorded shipping address; generation uses the verified mailer country/thickness certification mapping described below. Customer wording follows the supplied VBA/customer example, including the approved DDP delivery text when shipping USD is positive and an explicit AU/UK destination is recorded. This remains draft quotation wording, not a send or issuance workflow.

Company selection chooses a primary contact only when it is verified through that Contact's canonical company relation; otherwise a single linked contact can be selected, while ambiguous contacts require a selection. References read the existing Primary Contact, Shipping Address, Business Address, Company Phone and Contacts First/Last Name, Email and Phone fields. Changing company clears stale contact values. Shipping Address is displayed as Monday's complete address string, never guessed into street/suburb/state/postcode fields. A Business Address is shown separately if no Shipping Address is recorded. These are current CRM details, not quote snapshots; there is no schema change or CRM write.

Calculated Insurance USD and Insurance AUD are read-only. The hidden legacy insurance seed has been removed; the USD 30 minimum applies to every positive-shipping calculation. AUD insurance uses the saved AUD/USD exchange rate. Detailed totals distinguish product selling price from all-in selling price (product selling total plus freight/import costs divided by supplier quantity), and landed cost from selling price. Bank fees remain USD.

### Discard, edit history and approved certification descriptions

Discard restores the last saved draft without writing Monday. Undo/Redo tracks up to 100 whole-draft edit steps, including company/contact selection, calculations and description updates. A new edit clears redo; save, discard, new/duplicate/select quote and refresh clear history so it never crosses quote boundaries or reverses a persisted write.

Update regenerates the respective description from current specifications, asking before replacing manually edited text. It is separate from costing calculation and Copy, which copies exact edited text.

Certification rules use the current Drive Product & Packaging Knowledge Core and Claims & Evidence Policy (13 September 2026 approvals), plus Patrick's explicit 10 October 2026 confirmation that the country/thickness mapping is verified for this Quote Builder. For approved custom compostable mailer labels: positive thickness through 63 microns uses home compostability (Australia: AS 5810; UK: OK compost HOME); greater than 63 through 143 microns uses commercial compostability (Australia: AS 4736; UK: OK compost INDUSTRIAL). Country is identified only from an explicit supported country component in the current company Shipping Address, including country/postcode order such as Australia, 3044. An AU four-digit or UK postcode is extracted only after country verification; a city/postcode alone never implies country. Unknown destinations, missing/out-of-range thickness and other packaging formats receive no automatic named certification; existing descriptions are preserved on load; current specifications always determine generated descriptions. No manufacturer documents are bundled.

Sources:
- https://docs.google.com/document/d/1l_TQBqDTZi2lUecYPfR64hGCFSSRoUT4eG1Gz5n7Udk/edit
- https://docs.google.com/document/d/1GuqT4PUQz-vO6Q9apS4Ms3WU9QDRaX3UoFdp7YQU-SI/edit

### Layout rollback — 10 October 2026

Restored the staff form field arrangement and styling from commit 53b9f85 after layout review. Shipping amounts and insurance are separate fields, weight/CBM return above descriptions, artwork returns to Shipping details, and internal notes return to Packaging. All nine calculated totals and three saved prices remain present. Discard/Undo/Redo and Update beside Copy are retained, along with verified certification generation.

### Adjusted reference layout — 10 October 2026

The latest annotated reference moves artwork below Client project, weight/CBM above shipping charges, Apply calculation under Packaging, and notes below descriptions. Each label stays inline beside its own control, aligned to the right. Shipping amounts and both insurance outputs remain individually labeled fields. All nine calculated totals and saved price inputs remain. The green summary bar is restored below the columns with product cost, freight/import, landed cost, profit and product margin.

### Incomplete costing visibility

All nine calculated totals and the green cost summary remain visible before valid inputs are supplied and when a required input is cleared. Unavailable amounts use an em dash rather than zero or stale values. Completing inputs displays the calculated amounts. Apply remains disabled until a valid calculation exists. Browser regression coverage checks blank, populated and cleared-input states.

### Currency display and concise labels

Amount fields display currency outside focus (two decimals for totals/fees, four for unit prices). Editing shows the exact raw decimal; formatting never rounds or replaces the saved value. USD/AUD remain identified by field labels; Plate Fee is USD. Exchange Rate retains the AUD-per-USD calculation basis. Calculated total controls are 25% narrower. Shipping address fills its panel without a visible label; its accessible name remains. Removed helper text and Internal notes uses the description heading style.

### Header proportions and numeric grouping

Wide desktop header panels use 25/40/35 proportions. Numeric fields show thousands separators outside focus; editing and saves retain raw decimal strings. Re-calculate is 75% wide, aligned right. Customer-requested labels Sell Incl Shipping AUD, Margin AUD and Total selling AUD replace the longer labels without changing formulas. Sell Incl Shipping remains a four-decimal unit-price reference using supplier quantity as its divisor.

Margin AUD has a red background below AUD 500, with the usual text colour. Sell Incl Shipping AUD has a Copy button that copies the raw four-decimal number without a currency symbol or separators.

## Initial Monday release — 11 October 2026

The initial user-approved v2 release ran in the private quotation board (`5031824429`), installed Quote Builder view `57626700`. App version `18757871`, feature `126138879`; Monday-hosted bundle: `bd54b9074bf3daae6f215b69a673b395.cdn2.monday.app`. Built from source commit `5f3be9b52271df37c2a6e562ad2daccc2a849a75` with `VITE_APP_MODE=monday VITE_MONDAY_WRITES_ENABLED=true`. ZIP SHA-256: `d030e527a0c51cefd44076ec0f8b255c972eefc6c5ad332af0be530ca696520b`. Existing scopes were retained; no new permissions were granted. Unit/type/build checks passed (37 tests), with 26 desktop/mobile browser checks on this source. The public website remains unmerged; customer portal work is separate.

Embedded SDK verification passed create/read/update/read on `TEST — Monday release QA 2026-10-11`, using no CRM links. After refresh/reopen, the manual FX 1.5, USD total 1,050, landed AUD 2,036, margin AUD 473, all-in unit 0.2509, edited descriptions and notes remained intact. Live reference lists and daily FX lookup loaded in the installed view. The developer preview correctly rejects missing quotation-board context. Supplier contact verification and commercial issuance review remain open.

## First-release refinements — 11 October 2026

Quote cards show reference then canonical Company name. Supplier options retain the existing Monday dropdown value for writes while displaying the current canonical Company name through verified original-label/Company-ID mappings. Supplier contact validation uses that same ID. The refresh control beside Supplier reloads labels/companies/contacts without clearing the draft; returning to the app also refreshes references after a 60-second cooldown. No canonical record or schema is changed.

Numeric inputs accept .6250 and .0050, retain exact precision, and normalise to leading-zero decimals on editing/serialization. Insurance no longer depends on a hidden seed: positive shipping applies max(USD 30, half-even rounded 0.3% of Total USD), zero shipping applies zero. Pricing version is quote-v3-insurance-minimum-20261011; plate fees retain the v2 USD interpretation. Prior saved prices remain snapshots until Re-calculate is selected.

Customer descriptions use the multiline product/size/style/thickness/printing/certification and DDP structure in the supplied Access doc_rptObjects.txt VBA. Approved AU/UK mailer certification thresholds remain unchanged; no blanket FSC, certification or compostability claims are copied onto unrelated products. Supplier quantity and specifications regenerate supplier text. Specification changes and generated descriptions are one undoable draft edit. Manually typing in a description pauses its generator; Update restores it. Copy remains exact and performs no external communication.

Optional Autosave defaults off. Only its boolean preference is remembered locally, with no quote/customer/cost payload stored in cookies or browser storage. A new or duplicated draft must be saved manually once. Thereafter valid editable drafts save after 3 seconds without edits through the existing authenticated adapter. Timers cancel on discard, selection, duplicate, disabling or lock/read-only state. Writes are serialized; errors pause autosave until manual retry or explicit re-enable. Existing optimistic concurrency, private-board, permissions and readback-failure safeguards remain. The prototype still has no atomic Monday compare-and-swap or customer issuance workflow.

## Refinement deployment — 11 October 2026

Monday v3 (`18761450`), feature `126146266`, is live in the existing private quotation board. Bundle host: `6b7b37ec19c8cc2d11ecb852ffc02670.cdn2.monday.app`; source ZIP `17833442`. Source commit `af0fcd02c67d0950cf917a8c73aefbde39845255`, with `VITE_APP_MODE=monday VITE_MONDAY_WRITES_ENABLED=true`. ZIP SHA-256 `fb321f06f8722e7967bfd60d496617c575b86b97582e1fd4e78ce694ddbb721b`. Existing scopes and installation were retained. GitHub Actions run `38120992073` passed 43 unit checks, 36 desktop/mobile browser checks, TypeScript and both builds. Installed view confirms v0.3.1 and the current supplier Company name for the renamed Mianyang record.

Installed SDK checks on the existing synthetic `TEST — Monday release QA 2026-10-11` quotation passed: .6250 normalised to $0.6250, insurance was $30.00, explicit recalculation and manual save succeeded, and a subsequent notes edit autosaved and read back successfully. Autosave was turned off after QA. No customer quotation or CRM record was changed.

## Staff workspace refinements — v0.3.2

The company selector above quote search scopes the searchable quote list. Recoverable archive uses the authenticated SDK archive_item mutation with private-board and updated_at checks and a confirmation naming the quote; no delete mutation is exposed. Pending unsaved edits are discarded only after confirming archive. Archive and saves share the same mutex. The selected record disappears after successful readback; restoration remains available in Monday’s archive.

Copy shipping quote uses weight, CBM, supplier quantity, packaging type, canonical company name and the stored shipping address. It only writes to the clipboard and does not send to suppliers. Missing/invalid details fail with a clear message. Total landing sell AUD is product selling total plus pass-through freight/import costs (allInTotalAUD), displayed after landed cost and right of margin in the green summary. No new board schema is required.

Autosave is an accessible sliding switch in brand green. The redundant saved pricing/FX fields and insurance explanation were removed from the UI. The supplier description follows the requested single specification sentence, and both descriptions are always generated; no manual-update checkboxes remain. Saved descriptions are regenerated from current inputs on save, and valid costing snapshots are saved automatically even if Re-calculate was not clicked. Legacy release notes above describe previous versions only.

### v0.3.2 deployment record

Monday v4 (`18763024`), feature `126149515`, is live with the existing installation and scopes. Bundle host `0db4c591f5eb6cce15db6f490cc23d9e.cdn2.monday.app`, source ZIP `17833598`. Tested source commit `67a3e99d9319245d67443a34f0f09afc2d007eff`. Write-enabled ZIP SHA-256 `528fc839abf5d60298f076596b60c429598b840533709cff1093c1322e36216e`. GitHub Actions run `38123053130` passed 46 unit checks, 44 desktop/mobile browser checks (including archive, slider, shipping clipboard and footer boundary), TypeScript, demo build and the read-only Monday build. The separate write-enabled build also passed locally. No website production merge occurred.


Live SDK verification on v4 passed creation and recoverable archive of `TEST — v0.3.2 archive QA` (no CRM links), with the record absent after readback. Combined company/quote filtering returned the expected existing record, and shipping clipboard copy succeeded in the embedded view. Existing customer data was not edited. Final live QA identified Monday addresses ending with postcode before country; destination recognition now accepts explicit `3044 Australia` and `SW1A 1AA United Kingdom` forms while still rejecting country-like street names and ambiguous/unknown destinations.

### Address-format correction deployment

Monday v5 (`18763492`), feature `126150470`, uses the final v0.3.2 source `e340f13d6fc70124bfef5112c1943b83499fc255`. Bundle host `6e9f6b940f71ba702c61bf114458bec8.cdn2.monday.app`, source ZIP `17833639`. Write-enabled ZIP SHA-256 `790f0adeda44e3b5a63c06a9773d67a20184952907680a550990dca4cab3a6d8`. 47 unit checks include both explicit postcode-country formats. The previously published v4 release is superseded; existing app scopes and customer records remain unchanged.

Final source validation: GitHub Actions run `38123445713` passed 47 unit checks, 46 desktop/mobile browser checks, TypeScript and both builds. Certification wording remains within the verified mailer country/thickness mapping; country-like street names do not imply a country.

Final installed v5 read-only verification on the existing Strada quote confirmed the requested single-line supplier specification, AS 4736 customer description and full DDP block with Australia, 3044. Total landing sell AUD matched the fifth summary value. Existing customer quote values were not written during verification.
