import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CTAButton } from "@/components/CTAButton";
import { HubSpotFormEmbed } from "@/components/HubSpotFormEmbed";
import { QUOTE_FORM_HREF } from "@/lib/site";

const PACKAGING_GUIDE_HUBSPOT_FORM_ID = "fbbf0c51-3c65-4c5f-868d-5a2d8e9bcc5a";

export const metadata: Metadata = buildMetadata({
  title: "The Brand’s Guide to Switching to Compostable Packaging | Zero Pack",
  description:
    "A practical guide for ecommerce brands comparing plastic, recycled plastic, paper and compostable mailers — what to check and which claims to question.",
  path: "/packaging-guide/",
});

export default function Page() {
  return (
    <section className="bg-white py-14 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
            The Brand’s Guide to Switching to Compostable Packaging
          </h1>
          <p className="mt-2 text-sm text-charcoal/60">Includes mailer-specific checklists for ecommerce brands.</p>
          <p className="mt-6 text-lg text-charcoal/75">
            If you are not ready for a quote yet, start here. The guide walks through what to check when you compare
            plastic, recycled plastic, paper and compostable mailers — and how to prepare for a custom order.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-charcoal/75">
            <li>What to verify before you change materials</li>
            <li>Which claims deserve scrutiny</li>
            <li>How to prepare for a custom packaging quote</li>
            <li>And much, much more</li>
          </ul>
          <div className="mt-8">
            <CTAButton href={QUOTE_FORM_HREF} variant="secondary">
              Ready to price your packaging? Request a custom quote
            </CTAButton>
          </div>
        </div>
        <div className="rounded-2xl border border-black/5 bg-stone p-8">
          <h2 className="font-heading text-xl font-semibold text-charcoal">Get the Free Guide</h2>
          <div className="mt-6">
            <HubSpotFormEmbed formId={PACKAGING_GUIDE_HUBSPOT_FORM_ID} />
          </div>
        </div>
      </div>
    </section>
  );
}
