import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CTAButton } from "@/components/CTAButton";
import { ProcessSteps } from "@/components/ProcessSteps";
import { LeadMagnetBlock } from "@/components/LeadMagnetBlock";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { globalHomeFaqs } from "@/content/global/faqs";

export const metadata: Metadata = buildMetadata({
  title: "Custom Compostable Packaging | Zero Pack",
  description:
    "Broader custom compostable packaging beyond mailers: shopping bags, garment bags and campaign packaging — always quoted to order, with mailers as the main range.",
  path: "/custom-compostable-packaging/",
});

const faqs = globalHomeFaqs.slice(0, 6);

export default function Page() {
  return (
    <>
      <FAQSchema items={faqs} />
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-compost">Custom compostable packaging</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
            A wider range — without competing with mailers
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-charcoal/75">
            Zero Pack is built around{" "}
            <a className="font-semibold text-air hover:underline" href="/custom-compostable-mailers/">
              custom compostable mailers
            </a>{" "}
            for ecommerce shipping. Secondary formats exist for brands that want a cohesive system as they scale.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/quote/" variant="primary">
              Get a Custom Quote
            </CTAButton>
            <CTAButton href="/custom-compostable-mailers/" variant="secondary">
              View mailers (hero product)
            </CTAButton>
          </div>
        </div>
      </section>

      <section className="bg-stone py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">Secondary offers</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                t: "Custom compostable shopping bags",
                d: "Retail-facing formats for brands that want consistency with their shipping packaging story.",
              },
              {
                t: "Custom compostable garment bags",
                d: "Apparel workflows often need both mailers and internal garment protection — specified together.",
              },
              {
                t: "Custom compostable campaign packaging",
                d: "Limited runs and launches — feasibility depends on specification, print and timeline.",
              },
              {
                t: "Mailers remain the core",
                d: "If you are new to Zero Pack, start with mailers. Everything else should support the same brand standard.",
              },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-black/5 bg-white p-6">
                <h3 className="font-heading text-lg font-semibold text-compost">{x.t}</h3>
                <p className="mt-2 text-sm text-charcoal/75">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSteps
        title="Same quoting process"
        steps={[
          { title: "Tell us formats", body: "Mailers first, then secondary formats if needed." },
          { title: "Align specification", body: "Each format has its own MOQ and print constraints." },
          { title: "Quote and approve", body: "Nothing starts without written confirmation." },
        ]}
      />

      <LeadMagnetBlock />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal">FAQ</h2>
          <div className="mt-6">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
