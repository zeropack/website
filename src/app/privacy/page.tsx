import type { Metadata } from "next";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const updated = "8 September 2026";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  return {
    ...buildMarketPageMetadata({
      market,
      title: "Privacy Policy | Zero Pack",
      description: "How Zero Pack collects, uses, stores and protects personal information across its websites and services.",
      path: "/privacy/",
    }),
    robots: { index: false, follow: true },
  };
}

export default async function Page() {
  const market = await getRequestMarket();
  const isUk = market === "uk";

  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Privacy policy</h1>
        <p className="mt-3 text-sm text-charcoal/60">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-charcoal/80">
          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">About this policy</h2>
            <p className="mt-3">
              Zero Pack respects your privacy and aims to handle personal information openly and responsibly. This policy
              explains how we handle personal information across Zero Pack websites, enquiries, quote requests, marketing and
              customer interactions.
            </p>
            <p className="mt-3">
              Where the Australian Privacy Principles apply to us, we handle personal information in accordance with those
              principles and applicable Australian privacy law. Where UK data protection law applies to an interaction with a
              person in the United Kingdom, the additional UK information below also applies.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Information we collect</h2>
            <p className="mt-3">Depending on how you interact with us, we may collect information such as:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>your name, email address, phone number, company, role and location;</li>
              <li>quote, enquiry, packaging, artwork, order and project information you choose to provide;</li>
              <li>newsletter preferences, subscription status and email engagement;</li>
              <li>website activity, device, browser, referral and campaign information where permitted by your consent choices; and</li>
              <li>correspondence and other information you provide when you contact us.</li>
            </ul>
            <p className="mt-3">
              We generally collect information directly from you, for example through website forms, quote requests,
              newsletter sign-ups, email, phone or other business communications. We may also receive business contact
              information from service providers or public professional sources where permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">How we use personal information</h2>
            <p className="mt-3">We may use personal information to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>respond to enquiries and prepare or manage quotes, projects and customer relationships;</li>
              <li>provide requested information, guides, newsletters and other communications;</li>
              <li>manage marketing subscriptions, preferences, suppressions and unsubscribes;</li>
              <li>understand website and campaign performance where analytics or advertising consent has been granted;</li>
              <li>improve our website, services, communications and customer experience;</li>
              <li>maintain business records, prevent misuse and protect our systems; and</li>
              <li>meet legal, regulatory and operational requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Website cookies and tracking</h2>
            <p className="mt-3">
              We use Consentik to manage cookie and tracking choices. Where consent is required, non-essential analytics,
              advertising and marketing technologies are held until the relevant consent is granted. You can use the cookie
              controls on the website to accept, decline or change your preferences.
            </p>
            <p className="mt-3">
              We use Google Analytics and Google Ads through Google Consent Mode to measure website and campaign performance.
              When storage consent is denied, Google may receive limited cookieless measurement signals, but analytics and
              advertising cookies are not stored by our site. When the relevant consent is granted, Google may use cookies and
              related identifiers for analytics, attribution and advertising measurement.
            </p>
            <p className="mt-3">
              We also use Klaviyo for marketing email and, where advertising consent has been granted, email-to-website activity
              tracking. Klaviyo helps us manage newsletter subscriptions, suppressions, campaigns, lifecycle email and engagement.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Forms, CRM and service providers</h2>
            <p className="mt-3">
              We use service providers to operate parts of our website, forms, CRM, hosting, analytics and email systems. These
              include services such as Typeform for selected forms and quote interactions, monday.com for CRM and business
              workflow, Klaviyo for marketing email, Google for analytics and advertising measurement, Consentik for consent
              management and Vercel for website hosting and delivery.
            </p>
            <p className="mt-3">
              These providers may process personal information on our behalf under their own security, privacy and contractual
              arrangements. Some providers operate internationally, so personal information may be processed or stored outside
              your country, including in the United States and other countries in which those providers or their sub-processors
              operate.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Marketing communications</h2>
            <p className="mt-3">
              We only send marketing communications where we have an appropriate basis to do so. Marketing emails include a way
              to unsubscribe or manage preferences. If you unsubscribe, we may retain limited information necessary to record and
              respect that choice and prevent further marketing sends to that address.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Data retention and security</h2>
            <p className="mt-3">
              We keep personal information for as long as reasonably necessary for the purpose for which it was collected, for
              legitimate business and record-keeping needs, or where retention is required by law. We take reasonable technical
              and organisational steps to protect personal information from misuse, interference, loss and unauthorised access,
              modification or disclosure.
            </p>
          </section>

          {isUk ? (
            <section className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-6 sm:p-8">
              <h2 className="font-heading text-xl font-semibold text-charcoal">Additional information for UK individuals</h2>
              <p className="mt-3">
                Where UK data protection law applies, Zero Pack processes personal data only where there is an appropriate legal
                basis. Depending on the interaction, this may include taking steps at your request before entering a contract,
                performing a contract, pursuing legitimate business interests, complying with a legal obligation, or relying on
                consent where consent is required.
              </p>
              <p className="mt-3">
                Depending on the circumstances and the legal basis being used, UK individuals may have rights including access,
                rectification, erasure, restriction, data portability and objection. Where processing is based on consent, you
                may withdraw that consent at any time without affecting processing that was lawful before withdrawal.
              </p>
              <div className="mt-4 rounded-xl border-l-4 border-compost bg-white px-4 py-3">
                <p className="font-semibold text-charcoal">Your right to object</p>
                <p className="mt-1 text-sm text-charcoal/75">
                  You may object at any time to the use of your personal data for direct marketing. If you make that request, we
                  will stop using your personal data for that purpose, subject to retaining limited suppression information needed
                  to respect your choice.
                </p>
              </div>
              <p className="mt-4">
                Some of our service providers process information outside the United Kingdom. Where UK transfer restrictions
                apply, we use an appropriate transfer mechanism or safeguard as required. You may contact us for more information
                about the safeguards relevant to your personal data.
              </p>
              <p className="mt-3">
                You may also have the right to complain to the UK Information Commissioner&apos;s Office if you are dissatisfied
                with how your personal data has been handled.
              </p>
            </section>
          ) : null}

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Access, correction and privacy requests</h2>
            <p className="mt-3">
              You may contact us to ask about personal information we hold about you, request access or correction, update your
              marketing preferences, exercise applicable privacy rights, or raise a privacy concern. We may need to verify your
              identity before acting on a request.
            </p>
            <p className="mt-3">
              Email us at{" "}
              <a className="font-medium text-sky-600 underline-offset-2 hover:underline" href="mailto:hello@zeropack.co">
                hello@zeropack.co
              </a>
              . We will consider privacy enquiries and complaints and respond within a reasonable period. If Australian privacy
              law applies and you are not satisfied with our response, you may also contact the Office of the Australian
              Information Commissioner. If UK data protection law applies, you may have the right to complain to the UK
              Information Commissioner&apos;s Office.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Changes to this policy</h2>
            <p className="mt-3">
              We may update this policy when our services, technology or legal obligations change. The current version and last
              updated date will be published on this page.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
