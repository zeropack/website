import Link from "next/link";
import { globalHome } from "@/content/global/home";
import { globalHomeFaqs } from "@/content/global/faqs";
import { HeroSection } from "@/components/HeroSection";
import { TrustStrip } from "@/components/TrustStrip";
import { RegionSelector } from "@/components/RegionSelector";
import { FeatureGrid } from "@/components/FeatureGrid";
import { BenefitCards } from "@/components/BenefitCards";
import { CertificationExplainer } from "@/components/CertificationExplainer";
import { ProcessSteps } from "@/components/ProcessSteps";
import { CustomerShowcaseGrid } from "@/components/CustomerShowcaseGrid";
import { LeadMagnetBlock } from "@/components/LeadMagnetBlock";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { getRegionConfig } from "@/lib/regions";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";

const showcaseStudies = [
  ...getRegionConfig("au").caseStudies,
  ...getRegionConfig("uk").caseStudies,
].slice(0, 4);

export function GlobalHome() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom compostable mailers",
    serviceType: "Custom packaging manufacturing (made to order)",
    areaServed: ["AU", "GB"],
    url: absoluteUrl("/custom-compostable-mailers/"),
    provider: { "@type": "Organization", name: "Zero Pack" },
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <FAQSchema items={globalHomeFaqs} />
      <div className="zp-home-climate">
      <HeroSection
        variant="climate"
        labelPill={globalHome.hero.labelPill}
        title={globalHome.hero.headline}
        subtitle={globalHome.hero.subheading}
        primaryCta={{ label: globalHome.hero.primaryCta, href: "/quote/" }}
        secondaryCta={{ label: globalHome.hero.secondaryCta, href: "/custom-compostable-mailers/" }}
        softCta={{ label: globalHome.hero.softCta, href: globalHome.hero.softCtaHref }}
      />
      <TrustStrip items={globalHome.trustStrip} variant="climate" />
      <RegionSelector sectionClassName="border-y border-slate-200/50 bg-gradient-to-b from-[#f1f6f8] to-[#f7faf9] py-14 sm:py-20" />

      <section className="border-b border-slate-200/40 bg-gradient-to-b from-white to-[#f4f8fb] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
            {globalHome.problem.heading}
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-lg text-charcoal/75">
            {globalHome.problem.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50/80 py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
              Custom compostable mailers
            </h2>
            <p className="mt-4 text-charcoal/75">
              Zero Pack is built around made-to-order{" "}
              <Link className="font-semibold text-air hover:underline" href="/custom-compostable-mailers/">
                custom compostable mailers
              </Link>{" "}
              for ecommerce brands. Secondary formats exist for brands scaling a cohesive packaging system — without
              competing with the core offer.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-charcoal/75">
              <li>
                <span className="font-semibold text-charcoal">Also available:</span> custom compostable shopping bags,
                garment bags and campaign packaging (available via quote).
              </li>
              <li>
                <span className="font-semibold text-charcoal">Model:</span> no generic stock holding, quote-based
                sales, MOQ typically from around 2,000 units.
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-lg bg-leaf px-5 py-3 text-sm font-semibold text-charcoal hover:bg-[#6fa01f]"
                href="/quote/"
              >
                Get a Custom Quote
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-compost/30 bg-white px-5 py-3 text-sm font-semibold text-compost hover:bg-mist"
                href="/custom-compostable-packaging/"
              >
                Explore broader packaging
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm shadow-slate-300/20">
            <p className="text-sm font-semibold uppercase tracking-wide text-compost">Why Zero Pack</p>
            <p className="mt-3 font-heading text-xl font-semibold text-charcoal">{globalHome.positioningLine}</p>
            <p className="mt-4 text-sm text-charcoal/70">
              Serious packaging for brands that ship often: custom print, sizing support, and clear guidance on
              compostable options and certification — built for ecommerce fulfilment teams, not retail impulse buys.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">Why compostable mailers</h2>
          <p className="mt-4 max-w-3xl text-charcoal/75">
            Compostable mailers can help brands reduce reliance on conventional plastic while keeping a mailer workflow
            that fulfilment teams already understand — when specified correctly for weight, handling and delivery
            conditions.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Customer expectations",
                d: "Many shoppers notice packaging. Clear claims and disposal guidance build trust more than vague eco labels.",
              },
              {
                t: "Operational practicality",
                d: "Mailers are fast to pack, easy to store and predictable in fulfilment — if sizing is disciplined.",
              },
              {
                t: "Brand presentation",
                d: "Custom print turns a functional object into a consistent brand touchpoint.",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl border border-slate-100 bg-gradient-to-br from-mist/90 to-white p-6 shadow-sm shadow-slate-200/30"
              >
                <h3 className="font-heading text-lg font-semibold text-compost">{x.t}</h3>
                <p className="mt-2 text-sm text-charcoal/75">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BenefitCards variant="climate" />

      <FeatureGrid
        variant="climate"
        title="What you get with custom mailers"
        features={[
          {
            title: "Waterproof and durable",
            description: "Designed for practical ecommerce shipping — specification matched to your risk profile.",
          },
          {
            title: "Strong adhesive closure",
            description: "Reduces in-transit failures when applied consistently in fulfilment.",
          },
          {
            title: "Custom printed",
            description: "Logo-only through to fuller artwork — print affects lead time and pricing in predictable ways.",
          },
          {
            title: "Made to order",
            description: "No generic stock model — production aligns to your brand specification.",
          },
          {
            title: "Practical MOQ options",
            description: "Typically from around 2,000 units — sized for growing ecommerce brands shipping regularly.",
          },
          {
            title: "Quote-based pricing",
            description: "Clear drivers: size, quantity tiers, print complexity, material specification and freight.",
          },
        ]}
      />

      <CertificationExplainer
        variant="climate"
        paragraphs={[
          "Compostable and biodegradable mean different things. Certification ties claims to test conditions and intended disposal routes — your quote should match the specification you actually buy.",
          "We explain compostable vs biodegradable vs oxo-degradable in plain language, and what your customers can reasonably be told about disposal in your markets.",
        ]}
        bullets={[
          "Request documentation before you repeat supplier claims in your own packaging or marketing.",
          "If you reference home or industrial composting, align wording to the certification and local collection reality.",
        ]}
      />

      <ProcessSteps
        variant="climate"
        title="How the process works"
        steps={[
          { title: "Tell us what you need", body: "Share sizes, volumes, print intent and timeline — estimates are fine." },
          { title: "Get a custom quote", body: "We respond with guidance, questions and pricing drivers." },
          { title: "Confirm specification", body: "Size, print and artwork are aligned to production requirements." },
          { title: "Approve production details", body: "Nothing starts without written confirmation of the spec." },
          { title: "Production and shipping", body: "Timelines depend on region, quantity and print — confirmed up front." },
          { title: "Reorder when ready", body: "Most brands run on a rhythm — we support repeat production planning." },
        ]}
        footerNote="Production and delivery timelines depend on region, order quantity, print specification and freight method. Zero Pack confirms expected timing before production begins."
      />

      <section className="border-y border-slate-200/35 bg-[#fafcfd] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">Customer showcase</h2>
              <p className="mt-2 max-w-2xl text-charcoal/70">
                Examples of custom compostable mailers and related packaging for ecommerce-led brands.
              </p>
            </div>
            <Link className="text-sm font-semibold text-air hover:underline" href="/customer-showcase/">
              View showcase
            </Link>
          </div>
          <div className="mt-10">
            <CustomerShowcaseGrid studies={showcaseStudies} />
          </div>
        </div>
      </section>

      <LeadMagnetBlock variant="climate" />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <CTASection
            variant="climate"
            title="Built for brands shipping regularly — not one-off tiny runs"
            description="If you need 50 to 100 units, instant stock dispatch, or the cheapest possible commodity mailer, we are probably not the right fit — and that is okay. If you want custom print, credible materials guidance and a practical MOQ, request a quote."
            primary={{ label: "Get a Custom Quote", href: "/quote/" }}
            secondary={{ label: "Download the guide", href: "/packaging-guide/" }}
          />
        </div>
      </section>

      <section className="border-t border-slate-200/40 bg-slate-50/90 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">FAQ</h2>
          <p className="mt-2 text-charcoal/70">Answers to common questions about mailers, MOQs, timelines and quotes.</p>
          <div className="mt-8 max-w-3xl">
            <FAQAccordion items={globalHomeFaqs} />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:pb-24 sm:pt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <CTASection
            variant="climate"
            title="Ready for quote guidance?"
            description="Tell us what you know. We will help with the rest — including artwork requirements and sizing discipline."
            primary={{ label: "Get a Custom Quote", href: "/quote/" }}
            secondary={{ label: "See custom mailers", href: "/custom-compostable-mailers/" }}
          />
        </div>
      </section>
      </div>
    </>
  );
}
