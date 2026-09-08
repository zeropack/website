import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteFormMultiStep } from "@/components/QuoteFormMultiStep";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { globalHomeFaqs } from "@/content/global/faqs";
import { getRegionConfig } from "@/lib/regions";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const path = "/quote/";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  const description =
    market === "uk"
      ? "Request a UK quote for custom compostable mailers and packaging. Share your quantities, artwork and timing so Zero Pack can confirm specification, production and delivery assumptions."
      : market === "au"
        ? "Request an Australian quote for custom compostable mailers and packaging. Practical custom-production quantities with guidance on sizing, print and specification."
        : "Multi-step quote form for custom compostable mailers and packaging. Tell us what you know and we will help with the rest.";

  return buildMarketPageMetadata({ market, title: "Request a Custom Quote | Zero Pack", description, path });
}

export default async function Page() {
  const market = await getRequestMarket();
  const faqItems = market === "au" || market === "uk" ? getRegionConfig(market).faqs : globalHomeFaqs;
  const intro =
    market === "uk"
      ? "Share what you know about sizes, volumes, artwork and required timing — even as estimates. We will use that information to confirm the specification, production plan and delivery assumptions for a UK order."
      : market === "au"
        ? "Share what you know about sizes, volumes and print — even as estimates. We will help confirm the specification and practical next step for your Australian order."
        : "Share what you know about sizes, volumes and print — even as estimates. If you are below typical MOQs or still researching, you can still submit and we will point you to the guide or the right next step.";

  return (
    <>
      <FAQSchema items={faqItems} />
      <section className="bg-stone py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Get a custom quote</h1>
            <p className="mt-4 text-charcoal/75">{intro}</p>
            <p className="mt-4 text-sm text-charcoal/65">
              Not sure about size, artwork or quantity? That is fine. Tell us what you know and we will help work
              through the best option.
            </p>
            <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6">
              <Suspense fallback={<p className="text-sm text-charcoal/60">Loading form…</p>}>
                <QuoteFormMultiStep defaultRegion={market === "uk" ? "uk" : "au"} />
              </Suspense>
            </div>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-charcoal">FAQ</h2>
            <div className="mt-4">
              <FAQAccordion items={faqItems} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
