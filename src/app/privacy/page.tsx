import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Zero Pack",
  description: "How Zero Pack collects, uses, stores and protects personal information.",
  path: "/privacy/",
});

const updated = "19 August 2026";

export default function Page() {
  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Privacy policy</h1>
        <p className="mt-3 text-sm text-charcoal/60">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-charcoal/80">
          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">About this policy</h2>
            <p className="mt-3">
              Zero Pack respects your privacy and aims to handle personal information openly and responsibly. Where the
              Australian Privacy Principles apply to us, we handle personal information in accordance with those principles
              and applicable Australian privacy law.
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
              newsletter sign-ups, email, phone or other business communications. We may also receive information from service
              providers that support those interactions.
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
              Australia, including in the United States and other countries in which those providers or their sub-processors
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

          <section>
            <h2 className="font-heading text-xl font-semibold text-charcoal">Access, correction and privacy requests</h2>
            <p className="mt-3">
              You may contact us to ask about personal information we hold about you, request access or correction, update your
              marketing preferences, or raise a privacy concern. We may need to verify your identity before acting on a request.
            </p>
            <p className="mt-3">
              Email us at{" "}
              <a className="font-medium text-sky-600 underline-offset-2 hover:underline" href="mailto:hello@zeropack.co">
                hello@zeropack.co
              </a>
              . We will consider privacy enquiries and complaints and respond within a reasonable period. If you are not satisfied
              with our response and Australian privacy law applies, you may also contact the Office of the Australian Information
              Commissioner.
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
