# MailerLite suppression integration

MailerLite is an additional delivery platform for the approved New Home series,
`zp_zwc_reintro_2026_10`. This integration never imports, subscribes, resubscribes,
schedules or sends mail. A CRM `Pending` record, active MailerLite recipient, send,
delivery or reply is not a newsletter opt-in. The existing website subscription
link and Klaviyo remain the independent newsletter-consent path.

## Configuration

Use the existing `zeropack/website` Vercel project. Add secrets directly to the
project settings; never commit or paste keys into chat.

| Variable | Meaning |
| --- | --- |
| `MAILERLITE_SYNC_ENABLED` | `true` enables the runtime; otherwise disabled |
| `MAILERLITE_ACCOUNT_ID` | MailerLite account ID, initially `2716838` |
| `MAILERLITE_SYNC_MODE` | `internal` initially; `campaign` only after controlled QA and audience eligibility review |
| `MAILERLITE_WEBHOOK_SECRET` | Signing secret returned by the specific MailerLite webhook |
| `MAILERLITE_EVENT_ENCRYPTION_KEY` | Dedicated 32-byte random key encoded as 64 hex characters; keep stable while records exist |
| `MAILERLITE_API_KEY` | MailerLite API key for unattended suppression snapshots; plugin OAuth is not a runtime credential |

The existing `MONDAY_API_TOKEN`, Blob storage and internal/cron authentication are
reused. No Monday schema, newsletter, commercial lifecycle or signup-token fields
are changed. Internal commissioning permits only controlled Contact `2879122208`
with `zp_permission_scope=internal_test_only`. Campaign mode additionally permits
`zp_permission_scope=zp_zwc_reintro_2026_10`.

Every controlled/imported MailerLite subscriber must have the exact canonical
`monday_contact_id` custom field. Each write rereads the Contact, verifies its board
and exact email, and fails closed on identity mismatch. Unmapped and unrelated
subscribers are not auto-created in Monday. Later programmes need their own
explicit scope extension and audience review.

## Webhook

Register `https://www.zeropack.co/api/integrations/mailerlite/webhook` for
`subscriber.unsubscribed`, `subscriber.spam_reported`, and `subscriber.bounced`,
with batching disabled. The route verifies the signature over the untouched raw
body, validates account/scope/identity metadata and durably stores an encrypted
normalised event before acknowledging. Work continues with Next.js `after()`.
No personal data, tokens or keys are logged or returned by the endpoints.

The existing public Blob store contains only authenticated AES-256-GCM ciphertext
for events/receipts. Paths are hashes, and the health record contains counts only.
Conditional ETag writes provide a renewable-after-expiry processing lease.
Duplicate callbacks are idempotent. An ambiguous CRM timeout retains a retryable
event. The worker rereads the field and audit marker before retrying. Receipts are
written before removing pending records; failed identities are quarantined for
review, never silently remapped.

## Monday result and permission boundary

| MailerLite suppression | Existing Contacts `Outreach Result` |
| --- | --- |
| Unsubscribed or spam complaint | `Do Not Contact` |
| Bounced | `Bounced Email`, preserving an existing `Do Not Contact` or `Invalid Email` |

An item update records provider, subscriber ID, series, reason and event time.
`Subscription`, lifecycle, Comments/token markers, newsletter consent and unrelated
campaign fields are not written. No Klaviyo API is called by this integration.
MailerLite's account-level suppression remains authoritative for its own sends;
the integration never reverses it when a website signup occurs. A later explicit
Klaviyo opt-in does not automatically clear Monday outreach suppression.

This does not set Monday's native Email & Activities unsubscribe flag: governed
Monday outreach must continue to check `Outreach Result` before a send. Ordinary
customer/transactional correspondence is not automatically disabled.

## Recovery and monitoring

The existing authenticated Klaviyo/Monday cron GET registers independent
MailerLite recovery in `after()`, including if the Klaviyo branch fails. This
reuses the commissioned twice-hourly Cloudflare caller and daily Vercel fallback;
it does not require a ChatGPT automation or an additional scheduler. Manual
Klaviyo preview/apply POSTs do not start MailerLite writes.

The snapshot scans all `unsubscribed`, `bounced`, and `junk` subscribers,
cursor-paginates with a strict provider-host guard, filters the approved scope,
and queues missed suppressions. The pending inbox is retried independently of
API polling errors. Without `MAILERLITE_API_KEY`, webhook processing and durable
retry still operate but missed-webhook snapshot recovery reports
`credential_missing`; full commissioning is incomplete.

Aggregate recovery health is stored at
`internal/mailerlite/{production|preview}/health.json`. Counts include retries,
errors and quarantined identities. A protected manual recovery endpoint also
exists at `/api/integrations/mailerlite/reconcile`: production GET uses the
existing cron bearer secret; POST uses the existing internal secret. Both return
counts only. HTTP failures do not expose upstream bodies or recipient details.

Health persistence is coalesced: a changed aggregate result is written immediately;
an identical result is written at least every six hours on the next completed run.
`checkedAt` is the time of the persisted observation, not necessarily the last poll.
Missing, corrupt, unreadable or future-dated health is replaced by the current
result. This only reduces diagnostic writes: snapshot polling, pending-inbox
listing, processing, retries, receipts and contact locks keep their existing cadence.
Concurrent runs can still perform redundant health writes; this diagnostic record
is not a processing lock or a source of suppression authority.

## Acceptance and operation

1. Run `npm run test:mailerlite`, TypeScript checks and the production build.
2. Configure preview/internal mode and signing/encryption secrets.
3. Verify unsigned/tampered requests are rejected without a CRM write.
4. Trigger a genuine unsubscribe on the controlled MailerLite subscriber. Verify
   one `Do Not Contact` outcome and audit entry in Monday, with newsletter
   Subscription still unchanged. Verify duplicate/retry behavior.
5. Add the runtime API key securely and confirm a scheduled full snapshot.
6. Promote only after the internal checks pass; production cohort sending and
   domain verification remain separate from enabling this suppression service.
7. Before any production import, reconcile current suppressions, deduplicate,
   exclude the two recipient failures and three unresolved delivery outcomes,
   and validate current remaining counts. Never use `resubscribe=true` to clear a
   suppression. Refresh results after each campaign without treating `sent` as
   evidence of final delivery or newsletter permission.

To pause: set `MAILERLITE_SYNC_ENABLED=false` and redeploy. Do not delete signing
or encryption keys while recoverable queued events remain. To rotate encryption,
first migrate all encrypted queue/receipt data under controlled maintenance.

Provider references: [webhooks](https://developers.mailerlite.com/api/webhooks),
[subscribers](https://developers.mailerlite.com/api/subscribers),
[Vercel Blob conditional writes](https://vercel.com/docs/vercel-blob/using-blob-sdk),
and installed Next.js 16.2.6 route-handler/after documentation.
