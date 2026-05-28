import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/metadata";
import { QuoteFormMultiStep } from "@/components/QuoteFormMultiStep";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { globalHomeFaqs } from "@/content/global/faqs";

export const metadata: Metadata = buildMetadata({
  title: "Request a Custom Quote | Zero Pack",
  description:
    "Multi-step quote form for custom compostable mailers and packaging. Practical MOQs from around 2,000 units — tell us what you know and we will help with the rest.",
  path: "/quote/",
});

export default function Page() {
  return (
    <>
      <FAQSchema items={globalHomeFaqs} />
      <section className="bg-stone py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Get a custom quote</h1>
            <p className="mt-4 text-charcoal/75">
              Share what you know about sizes, volumes and print — even as estimates. If you are below typical MOQs or
              still researching, you can still submit and we will point you to the guide or the right next step.
            </p>
            <p className="mt-4 text-sm text-charcoal/65">
              Not sure about size, artwork or quantity? That is fine. Tell us what you know and we will help work
              through the best option.
            </p>
            <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6">
              <Suspense fallback={<p className="text-sm text-charcoal/60">Loading form…</p>}>
                <QuoteFormMultiStep />
              </Suspense>
            </div>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-charcoal">FAQ</h2>
            <div className="mt-4">
              <FAQAccordion items={globalHomeFaqs} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
