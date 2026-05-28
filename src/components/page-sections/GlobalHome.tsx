import Link from "next/link";
import { SiteImage } from "@/components/SiteImage";
import { Fragment } from "react";
import { globalHome } from "@/content/global/home";
import { globalHomeFaqs } from "@/content/global/faqs";
import { HeroSection } from "@/components/HeroSection";
import { TrustBadges } from "@/components/TrustBadges";
import { FeatureGrid } from "@/components/FeatureGrid";
import { BenefitCards } from "@/components/BenefitCards";
import { PackagingPathSteps } from "@/components/PackagingPathSteps";
import { LeadMagnetBlock } from "@/components/LeadMagnetBlock";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, QUOTE_FORM_HREF } from "@/lib/site";
import { Reveal } from "@/components/Reveal";
import { PrimasoyPackagingShowcase } from "@/components/PrimasoyPackagingShowcase";
import { YoutubeVideoPlaceholder } from "@/components/YoutubeVideoPlaceholder";
import { HomeCompostableProblemSolution } from "@/components/HomeCompostableProblemSolution";
import { HubSpotFormEmbed } from "@/components/HubSpotFormEmbed";
import cartridgesDirectCloseup from "@/content/images/zero_pack_cartridges_direct_blob_closeup.png";

const WHAT_WE_DO_HUBSPOT_FORM_ID = "750eab93-2236-4bb9-a2b3-f2016dcd916f";


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
          primaryCta={{ label: globalHome.hero.primaryCta, href: QUOTE_FORM_HREF }}
          secondaryCta={{ label: globalHome.hero.secondaryCta, href: "/packaging-guide/" }}
          softCta={{ label: globalHome.hero.softCta, href: globalHome.hero.softCtaHref }}
        />
        <TrustBadges variant="climate" />

        <Reveal>
          <section className="border-b border-slate-200/40 bg-white py-14 sm:py-20">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12">
              <YoutubeVideoPlaceholder
                videoId={globalHome.whoWeAre.youtubeVideoId || undefined}
                title="About Zero Pack"
              />
              <div>
                <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{globalHome.whoWeAre.heading}</h2>
                <div className="mt-6 space-y-4 text-lg text-charcoal/75">
                  {globalHome.whoWeAre.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
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
            <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{globalHome.packagingContext.heading}</h2>
                <div className="mt-6 space-y-4 text-lg text-charcoal/75">
                  {globalHome.packagingContext.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
              <PrimasoyPackagingShowcase />
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
                  {globalHome.whatWeDo.bullets.map((b, i) => (
                    <Fragment key={b.title}>
                      <li className="zp-hover-lift rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm">
                        <span className="font-semibold text-charcoal">{b.title}:</span> {b.text}
                      </li>
                      {i === 0 ? (
                        <li className="zp-hover-lift overflow-hidden rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm">
                          <p className="font-bold text-charcoal">High Quality Printing</p>
                          <SiteImage
                            src={cartridgesDirectCloseup}
                            alt="Cartridges Direct custom compostable mailer close-up"
                            width={cartridgesDirectCloseup.width}
                            height={cartridgesDirectCloseup.height}
                            className="mx-auto mt-4 h-auto w-full max-w-sm object-contain"
                            sizes="(max-width: 1024px) 100vw, 24rem"
                          />
                        </li>
                      ) : null}
                    </Fragment>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    className="inline-flex items-center justify-center rounded-lg bg-air px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0096d6]"
                    href={QUOTE_FORM_HREF}
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
              <div className="space-y-8">
                <div className="zp-hover-lift rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm shadow-slate-300/20">
                  <p className="mt-3 font-heading text-xl font-semibold text-charcoal">{globalHome.positioningLine}</p>
                  <p className="mt-4 text-sm text-charcoal/70">
                    We are not a generic stock shop: specification, print and freight are confirmed before production starts.
                  </p>
                </div>
                <div className="zp-hover-lift rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-300/20 sm:p-8">
                  <HubSpotFormEmbed formId={WHAT_WE_DO_HUBSPOT_FORM_ID} />
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delayMs={40}>
          <HomeCompostableProblemSolution />
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
                description: "Designed to protect your products during transit.",
              },
              {
                title: "Strong adhesive closure",
                description: "Available in single or double adhesive options.",
              },
              {
                title: "Custom printed",
                description: "Logo-only through to fuller more complex artwork.",
              },
              {
                title: "Made to order",
                description: "No generic stock model — production aligns to your brand requirements.",
              },
              {
                title: "Practical MOQ options",
                description: "From as low as 2,000 units — sized for growing ecommerce brands shipping regularly.",
              },
              {
                title: "Quote-based pricing",
                description: "Clear drivers: size, quantity tiers, print complexity, material specification and freight.",
              },
            ]}
          />
        </Reveal>

        <Reveal>
          <PackagingPathSteps variant="dark" standalone />
        </Reveal>

        <Reveal>
          <section className="border-t border-slate-200/40 bg-slate-50/90 py-14 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">FAQ</h2>
              <p className="mt-2 text-charcoal/70">Answers to common questions about mailers, MOQs, timelines and quotes.</p>
              <div className="mt-8">
                <FAQAccordion items={globalHomeFaqs} />
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delayMs={40}>
          <LeadMagnetBlock variant="climate" />
        </Reveal>
      </div>
    </>
  );
}
