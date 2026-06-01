import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CTAButton } from "@/components/CTAButton";
import { HubSpotFormEmbed } from "@/components/HubSpotFormEmbed";
import { QUOTE_FORM_HREF } from "@/lib/site";

const PACKAGING_GUIDE_HUBSPOT_FORM_ID = "fbbf0c51-3c65-4c5f-868d-5a2d8e9bcc5a";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Download The 2026 Branded & Eco Friendly Packaging Guide + Toolkit",
    description:
      "Get the full packaging guide as a formatted PDF plus the print-ready decision checklist, quote-ready planning prompt, and artwork brief template.",
    path: "/packaging-guide/download/",
  }),
  robots: { index: false, follow: true },
};

const included = [
  {
    title: "The 2026 Branded & Eco Friendly Packaging Guide (PDF)",
    description:
      "The complete 18-section guide — certification, MOQ, artwork, lead times, and more — formatted for offline reading and team sharing.",
  },
  {
    title: "Print-ready decision checklist",
    description:
      "10 yes/no questions to assess whether your brand is ready for custom compostable packaging, with a scored outcome guide.",
  },
  {
    title: "Quote-ready planning prompt",
    description:
      "A structured set of questions to gather before contacting Zero Pack — product type, dimensions, quantity, timeline, and artwork status.",
  },
  {
    title: "Artwork brief template",
    description:
      "10 requirements to share with your designer before artwork is created — file format, colour mode, bleed, fonts, and proofing sign-off.",
  },
];

export default function Page() {
  return (
    <section className="bg-stone py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-compost">
          Free download · Annual edition
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
          Download the 2026 Guide + Toolkit
        </h1>
        <p className="mt-4 text-lg text-charcoal/75">
          Fill in the short form and we will email you the full package. Takes under a minute.
        </p>

        <div className="mt-8 space-y-4">
          {included.map((item, i) => (
            <div key={i} className="flex gap-4 rounded-xl border border-black/5 bg-white px-5 py-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-xs font-bold text-compost">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-charcoal">{item.title}</p>
                <p className="mt-0.5 text-sm text-charcoal/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="font-heading text-lg font-semibold text-charcoal">
            Download the Guide and Toolkit
          </p>
          <div className="mt-5">
            <HubSpotFormEmbed formId={PACKAGING_GUIDE_HUBSPOT_FORM_ID} />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="font-heading text-xl font-semibold text-charcoal">
            Ready to go fully Customised with Branded Packaging?
          </p>
          <p className="mt-2 text-sm text-charcoal/70">
            Tell us what you ship and we will help you work through size, specification, and pricing.
          </p>
          <div className="mt-5">
            <CTAButton href={QUOTE_FORM_HREF} variant="primary">
              Get a Custom Quote
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
