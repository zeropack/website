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

`npm run build:monday` builds the Monday SDK mode with writes disabled. It must be opened as the installed board view for private board `5031824429`; standalone browsers cannot authenticate a Monday user session. The existing app is `12360227`, version `18735087`, feature `zeropack_quotemanager:quotebuilder`. No app upload, release or promotion is automated.

A future approved staff draft build can explicitly set `VITE_APP_MODE=monday` and `VITE_MONDAY_WRITES_ENABLED=true`. This is a capability flag, not an authorization mechanism. Monday's active user session and board permissions remain authoritative. Never set a Monday token as a Vite variable or add a token-based server proxy to the demo.

## Components and ownership

- `src/schema.ts`: existing prototype field mapping; no board schema edits.
- `src/adapter.ts`: injected GraphQL transport, typed column decoding, complete cursor paging, private-board validation, managed-field omissions, status locks and optimistic update check.
- `src/monday.ts`: Monday SDK transport pinned to the verified stable API version `2026-07` and board-context guard.
- `src/costing.ts`: reusable decimal arithmetic derived from `Form_subQuotes` in the original Access object report.
- `src/customer.ts`: neutral description generator and customer DTO allowlist.
- `src/components/`: reusable editor fields and customer description view.
- `src/mock.ts`: synthetic test data only.
- `tests/` and `e2e/`: unit/adapter/calculation and desktop/mobile browser coverage.

Reference lists request only `contact_account` and company `status` values. Inaccessible boards, API errors, repeated cursors and a paging budget exhaustion stop loading rather than silently presenting incomplete lists. Dropdown settings use `name` or `label` and omit deactivated options. Connected-board IDs are read through `BoardRelationValue.linked_item_ids`; generic `value` can be null.

## Access calculation basis

User confirmed **legacy USD bank fees** on 10 October 2026. The existing Monday field title says Bank Fees AUD. This prototype stores the legacy USD input in that existing field, labels it USD in the application and records pricing version `access-v1-bank-usd-20261010`. No canonical schema is renamed. Other readers of the existing numeric field MUST use this pricing version to interpret it. Older records without a pricing version remain unverified.

The calculation preserves these Access formulas:

1. Supplier AUD unit = USD unit × saved AUD-per-USD FX.
2. Product cost = supplier AUD unit × sell quantity + transaction fee AUD.
3. Insurance candidate = 0.3% × USD unit × sell quantity when shipping USD is positive, otherwise zero. Access declares `shipins` as Integer, so half-to-even integer rounding applies. When the candidate is below USD 30 and the entered insurance seed is positive, insurance is USD 30; otherwise use the candidate. This includes the unusual original zero-shipping/minimum interaction. Overflow now stops with an actionable error instead of silently retaining stale results.
4. Freight/import = (shipping USD + calculated insurance USD + bank USD) × FX + customs fee AUD + duty AUD.
5. Product sell unit = half-to-even rounding to four decimal places of product cost × (1 + markup / 100) ÷ sell quantity. Access stores markup as a fraction; the new UI explicitly accepts percent.
6. Product selling total = rounded product sell unit × sell quantity.
7. Access all-in unit reference = (product selling total + freight/import) ÷ supplier quantity. Supplier and sell quantities are deliberately distinct, matching the original form.

`landed` stores combined product and freight/import costs. `sellUnit` stores the **product-only** selling unit price. All-in price is a separate reference, not a customer offer. Decimal math avoids binary floating-point drift; final currency totals display two decimals and unit prices four. Saved manual prices and descriptions stay unchanged until staff explicitly applies a calculation. No live FX lookup, automatic rate refresh, certification inference, delivery promises or fixed commercial fee defaults are introduced.

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
- Staff-context SDK verification in the installed draft board view, including actual app scopes and role permissions. Connector API success proves query validity, not installed-app permission.
- Supplier contact identities/links: all nine expected Company records exist, but targeted relation and name/company-field searches found no confirmed matching contacts. Do not fabricate or duplicate contacts.
- Prototype save/reopen integration test under an approved write-enabled candidate; only mock saves and read-only live queries are verified in this change.
- Commercial review of rounding, freight/customer price presentation, the existing bank-field label mismatch and representative historical totals before customer issuance.
- Explicit approval before new Monday app promotion, website production merge or customer-visible release.

### Staff form layout and company autofill

The staff form follows the supplied Access layout: quote/customer/shipping header, packaging input rows, shipping/calculated totals, and supplier/customer descriptions with clipboard copy. Form inputs use 14px type; labels use 13px. Descriptions remain explicitly generated and manually editable. Copy uses the exact edited text and never sends anything to QBO. Supplier generation can include the selected company's recorded shipping address; generation uses the verified mailer country/thickness certification mapping described below and never adds DDP claims.

Company selection chooses a primary contact only when it is verified through that Contact's canonical company relation; otherwise a single linked contact can be selected, while ambiguous contacts require a selection. References read the existing Primary Contact, Shipping Address, Business Address, Company Phone and Contacts First/Last Name, Email and Phone fields. Changing company clears stale contact values. Shipping Address is displayed as Monday's complete address string, never guessed into street/suburb/state/postcode fields. A Business Address is shown separately if no Shipping Address is recorded. These are current CRM details, not quote snapshots; there is no schema change or CRM write.

Calculated Insurance USD and Insurance AUD are read-only. The legacy insurance seed is available under Insurance calculation. AUD insurance uses the saved AUD/USD exchange rate. Detailed totals distinguish product selling price from all-in selling price (product selling total plus freight/import costs divided by supplier quantity), and landed cost from selling price. Bank fees remain USD.

### Discard, edit history and approved certification descriptions

Discard restores the last saved draft without writing Monday. Undo/Redo tracks up to 100 whole-draft edit steps, including company/contact selection, calculations and description updates. A new edit clears redo; save, discard, new/duplicate/select quote and refresh clear history so it never crosses quote boundaries or reverses a persisted write.

Update regenerates the respective description from current specifications, asking before replacing manually edited text. It is separate from costing calculation and Copy, which copies exact edited text.

Certification rules use the current Drive Product & Packaging Knowledge Core and Claims & Evidence Policy (13 September 2026 approvals), plus Patrick's explicit 10 October 2026 confirmation that the country/thickness mapping is verified for this Quote Builder. For approved custom compostable mailer labels: positive thickness through 63 microns uses home compostability (Australia: AS 5810; UK: OK compost HOME); greater than 63 through 143 microns uses commercial compostability (Australia: AS 4736; UK: OK compost INDUSTRIAL). Country is identified only from an explicit supported country at the end of the current company Shipping Address. Unknown destinations, missing/out-of-range thickness and other packaging formats receive no automatic named certification; existing edited descriptions are preserved unless Update is selected. No manufacturer documents are bundled.

Sources:
- https://docs.google.com/document/d/1l_TQBqDTZi2lUecYPfR64hGCFSSRoUT4eG1Gz5n7Udk/edit
- https://docs.google.com/document/d/1GuqT4PUQz-vO6Q9apS4Ms3WU9QDRaX3UoFdp7YQU-SI/edit

### Layout rollback — 10 October 2026

Restored the staff form field arrangement and styling from commit 53b9f85 after layout review. Shipping amounts and insurance are separate fields, weight/CBM return above descriptions, artwork returns to Shipping details, and internal notes return to Packaging. All nine calculated totals and three saved prices remain present. Discard/Undo/Redo and Update beside Copy are retained, along with verified certification generation.

### Adjusted reference layout — 10 October 2026

The latest annotated reference moves artwork below Client project, weight/CBM above shipping charges, Apply calculation under Packaging, and notes below descriptions. Each label stays inline beside its own control, aligned to the right. Shipping amounts and both insurance outputs remain individually labeled fields. All nine calculated totals and saved price inputs remain. The green summary bar is restored below the columns with product cost, freight/import, landed cost, profit and product margin.
