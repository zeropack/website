import Link from "next/link";
import { globalHome } from "@/content/global/home";
import { globalHomeFaqs } from "@/content/global/faqs";
import { HeroSection } from "@/components/HeroSection";
import { TrustBadges } from "@/components/TrustBadges";
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
import { Reveal } from "@/components/Reveal";

const showcaseStudies = [...getRegionConfig("au").caseStudies, ...getRegionConfig("uk").caseStudies].slice(0, 4);

const standApartShell: Record<(typeof globalHome.standsApart.items)[number]["accent"], string> = {
  sage: "zp-hover-lift rounded-2xl border border-leaf/25 bg-gradient-to-br from-mist/95 to-white p-6 shadow-sm shadow-slate-200/30",
  air: "zp-hover-lift rounded-2xl border border-air/30 bg-gradient-to-br from-[#eef8ff] to-white p-6 shadow-sm shadow-slate-200/30",
  mist: "zp-hover-lift rounded-2xl border border-slate-200/80 bg-gradient-to-br from-stone/90 to-white p-6 shadow-sm shadow-slate-200/30",
};

const standApartDot: Record<(typeof globalHome.standsApart.items)[number]["accent"], string> = {
  sage: "bg-leaf",
  air: "bg-air",
  mist: "bg-compost/70",
};

export function GlobalHome() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom compostable mailers",
    serviceType: "Custom packaging manufacturing (made to order)",
    areaServed: "Worldwide",
    url: absoluteUrl("/custom-compostable-mailers/"),
    provider: { "@type": "Organization", name: "Zero Pack", url: absoluteUrl("/") },
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
          secondaryCta={{ label: globalHome.hero.secondaryCta, href: "/packaging-guide/" }}
          softCta={{ label: globalHome.hero.softCta, href: globalHome.hero.softCtaHref }}
        />
        <TrustBadges variant="climate" />

        <Reveal>
          <section className="border-b border-slate-200/40 bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{globalHome.whoWeAre.heading}</h2>
              <div className="mt-6 max-w-3xl space-y-4 text-lg text-charcoal/75">
                {globalHome.whoWeAre.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delayMs={40}>
          <section className="relative overflow-hidden border-b border-slate-200/40 bg-gradient-to-b from-[#f4f8fb] to-white py-14 sm:py-20">
            <div
              className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(0,168,243,0.12),transparent_72%)]"
              aria-hidden
            />
            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{globalHome.packagingContext.heading}</h2>
              <div className="mt-6 max-w-3xl space-y-4 text-lg text-charcoal/75">
                {globalHome.packagingContext.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delayMs={60}>
          <section className="bg-slate-50/80 py-14 sm:py-20">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{globalHome.whatWeDo.heading}</h2>
                <p className="mt-4 text-charcoal/75">{globalHome.whatWeDo.intro}</p>
                <ul className="mt-6 space-y-4 text-sm text-charcoal/75">
                  {globalHome.whatWeDo.bullets.map((b) => (
                    <li key={b.title} className="zp-hover-lift rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm">
                      <span className="font-semibold text-charcoal">{b.title}:</span> {b.text}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    className="inline-flex items-center justify-center rounded-lg bg-leaf px-5 py-3 text-sm font-semibold text-charcoal transition hover:bg-[#6fa01f]"
                    href="/quote/"
                  >
                    {globalHome.whatWeDo.primaryCtaLabel}
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-lg border border-compost/30 bg-white px-5 py-3 text-sm font-semibold text-compost transition hover:bg-mist"
                    href="/packaging-guide/"
                  >
                    {globalHome.whatWeDo.secondaryCtaLabel}
                  </Link>
                </div>
                <p className="mt-4 text-sm text-charcoal/65">
                  <Link className="font-semibold text-air hover:underline" href={globalHome.whatWeDo.tertiaryHref}>
                    {globalHome.whatWeDo.tertiaryLinkLabel}
                  </Link>{" "}
                  ·{" "}
                  <Link className="font-semibold text-air hover:underline" href="/custom-compostable-mailers/">
                    Custom compostable mailers
                  </Link>{" "}
                  ·{" "}
                  <Link className="font-semibold text-air hover:underline" href="/customer-showcase/">
                    Customer showcase
                  </Link>
                </p>
              </div>
              <div className="zp-hover-lift rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm shadow-slate-300/20">
                <p className="text-sm font-semibold uppercase tracking-wide text-compost">Positioning</p>
                <p className="mt-3 font-heading text-xl font-semibold text-charcoal">{globalHome.positioningLine}</p>
                <p className="mt-4 text-sm text-charcoal/70">
                  We are not a generic stock shop: specification, print and freight are confirmed before production starts.
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delayMs={40}>
          <section className="border-y border-slate-200/35 bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{globalHome.whyMailers.heading}</h2>
              <p className="mt-4 max-w-3xl text-charcoal/75">{globalHome.whyMailers.intro}</p>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {globalHome.whyMailers.cards.map((x) => (
                  <div
                    key={x.title}
                    className="zp-hover-lift rounded-2xl border border-slate-100 bg-gradient-to-br from-mist/90 to-white p-6 shadow-sm shadow-slate-200/30"
                  >
                    <h3 className="font-heading text-lg font-semibold text-compost">{x.title}</h3>
                    <p className="mt-2 text-sm text-charcoal/75">{x.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="border-y border-slate-200/40 bg-gradient-to-b from-white via-[#f7faf9] to-white py-14 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{globalHome.standsApart.heading}</h2>
              <p className="mt-3 max-w-2xl text-charcoal/70">
                Practical differentiation for brands that need packaging to be both credible and repeatable at scale.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {globalHome.standsApart.items.map((item) => (
                  <div key={item.title} className={standApartShell[item.accent]}>
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${standApartDot[item.accent]}`} aria-hidden />
                      <h3 className="font-heading text-lg font-semibold text-charcoal">{item.title}</h3>
                    </div>
                    <p className="mt-3 text-sm text-charcoal/75">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delayMs={40}>
          <div>
            <BenefitCards variant="climate" />
          </div>
        </Reveal>

        <Reveal>
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
        </Reveal>

        <Reveal delayMs={40}>
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
        </Reveal>

        <Reveal>
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
        </Reveal>

        <Reveal delayMs={40}>
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
        </Reveal>

        <Reveal>
          <LeadMagnetBlock variant="climate" />
        </Reveal>

        <Reveal delayMs={40}>
          <section className="bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <CTASection
                variant="climate"
                title={globalHome.midCta.title}
                description={globalHome.midCta.description}
                primary={{ label: "Get a Custom Quote", href: "/quote/" }}
                secondary={{ label: "Download the packaging guide", href: "/packaging-guide/" }}
              />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="border-t border-slate-200/40 bg-slate-50/90 py-14 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">FAQ</h2>
              <p className="mt-2 text-charcoal/70">Answers to common questions about mailers, MOQs, timelines and quotes.</p>
              <div className="mt-8 max-w-3xl">
                <FAQAccordion items={globalHomeFaqs} />
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delayMs={40}>
          <section className="bg-white py-14 sm:pb-24 sm:pt-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <CTASection
                variant="climate"
                title={globalHome.finalCta.title}
                description={globalHome.finalCta.description}
                primary={{ label: "Get a Custom Quote", href: "/quote/" }}
                secondary={{ label: "Download the packaging guide", href: "/packaging-guide/" }}
              />
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
