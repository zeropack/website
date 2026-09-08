# Region Stage 3 — Page Parity & Regional Content Audit

Status: Draft implementation audit

## Immediate sequencing
- Stage 2 (`feature/market-selector-v1`, PR #42) remains draft and must not be merged before Stage 3 page parity is complete.
- Stage 3 brings AU and UK customer-facing pages onto the current shared `.co` design system, then applies regional content overrides.

## Current mismatch
- Global `/` renders `GlobalHome` (new visual system).
- AU `/` and UK `/` are hostname rewrites to `/au/` and `/uk/`, which render `RegionalHome` (legacy visual system).
- Regional `/custom-compostable-mailers/` renders `MailersLanding`, while the current global navigation sends users to `/trend-packaging-funnel/`, which uses the newer mailer visual system.

## Architecture direction
Do not maintain separate AU/UK page designs. Use one shared page implementation per page type, with a market parameter/content adapter for regional copy, metadata and claims-sensitive blocks.

### Page categories
1. Shared layout + regional copy: homepage, primary mailer landing page, quote pathway.
2. Shared page with optional regional blocks: packaging, how it works, guide, about, contact, showcase.
3. Regional content: market-specific articles, certification/regulatory guidance, delivery/lead-time content where verified.
4. Global-only until regionalised: any page where the content does not meaningfully differ and a regional canonical has not been intentionally created.

## Phase 3A — required before Stage 2 publication
1. Replace `RegionalHome` presentation with the current `GlobalHome` visual/page system.
2. Refactor the current primary mailer experience so AU/UK use the same modern mailer layout as the current `.co` experience.
3. Preserve AU and UK self-canonicals/hreflang already deployed.
4. Apply market-specific hero/meta/CTA/currency/certification/delivery wording through structured market content, not duplicated page components.
5. Remove placeholder testimonials/case studies from customer-facing regional pages.
6. Claims QA all market-specific copy before publication.
7. Verify current navigation on `.au` and `.co.uk` cannot land on a mismatched/legacy regional design.

## Phase 3B — after parity
Audit each remaining global route and decide whether it should remain global-canonical or gain an AU/UK regional variant. Regionalise only where the answer meaningfully changes by market.

## Release gate for Stage 2
PR #42 can be published only after AU and UK homepage + primary mailer journey visually match the current `.co` design system and regional copy/claims QA passes.
