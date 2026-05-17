import Link from "next/link";
import { getRegionConfig } from "@/lib/regions";
import type { RegionCode } from "@/lib/types";
import { HeroSection } from "@/components/HeroSection";
import { TrustStrip } from "@/components/TrustStrip";
import { ProcessSteps } from "@/components/ProcessSteps";
import { LeadMagnetBlock } from "@/components/LeadMagnetBlock";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { CTASection } from "@/components/CTASection";
import { globalHome } from "@/content/global/home";

const heroByRegion: Record<
  RegionCode,
  { title: string; sub: string; trust: string[] }
> = {
  au: {
    title: "Custom compostable mailers for brands shipping across Australia",
    sub:
      "Made-to-order mailers for ecommerce brands that want stronger presentation and a more considered alternative to conventional plastic — with practical MOQs from around 2,000 units.",
    trust: [
      "Australian owned",
      "Local quoting and delivery language for AU brands",
      "Suitable for Australian ecommerce brands",
      "Clear certification guidance",
      "Delivery timelines confirmed during quote",
      "Practical MOQ options",
    ],
  },
  uk: {
    title: "Custom compostable mailers for UK ecommerce brands",
    sub:
      "Factory-direct style custom mailers for growing brands that want better packaging without industrial-only buying motions — practical MOQs from around 2,000 units, made to order.",
    trust: [
      "MOQ from around 2,000",
      "Custom printed",
      "Waterproof and durable",
      "Strong adhesive",
      "Made to order",
      "Clear certification guidance",
    ],
  },
  us: {
    title: "Zero Pack US (coming soon)",
    sub: "Tell us your US shipping needs and timeline — we will confirm feasibility as the US route opens.",
    trust: ["Custom quotes", "Made to order", "Regional expansion"],
  },
  eu: {
    title: "Zero Pack EU (coming soon)",
    sub: "Tell us your primary EU shipping country and volumes — we will confirm next steps as the EU route expands.",
    trust: ["Custom quotes", "Made to order", "Regional expansion"],
  },
};

export function RegionalHome({ region }: { region: RegionCode }) {
  const cfg = getRegionConfig(region);
  const hero = heroByRegion[region];
  const mailersHref = `/${region}/custom-compostable-mailers/`;
  const quoteHref = `/quote/?region=${region}`;

  return (
    <>
      <FAQSchema items={cfg.faqs.slice(0, 10)} />
      <HeroSection
        title={hero.title}
        subtitle={hero.sub}
        primaryCta={{ label: cfg.defaultCTA, href: quoteHref }}
        secondaryCta={{ label: "See mailers", href: mailersHref }}
        softCta={{
          label: globalHome.hero.softCta,
          href: "/articles/what-to-ask-before-ordering-custom-packaging/",
        }}
      />
      <TrustStrip items={hero.trust} />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
                {globalHome.packagingContext.heading}
              </h2>
              <div className="mt-6 space-y-4 text-charcoal/75">
                {globalHome.packagingContext.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-black/5 bg-stone p-8">
              <p className="text-sm font-semibold text-compost">Working in {cfg.regionName}</p>
              <p className="mt-3 text-sm text-charcoal/75">
                Quotes and production notes are tailored to this region — including currency, delivery language, lead
                times and compliance context where relevant.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-charcoal/75">
                <li>
                  <span className="font-semibold text-charcoal">Currency:</span> {cfg.currency} (shown on your quote)
                </li>
                <li>
                  <span className="font-semibold text-charcoal">MOQ guidance:</span> {cfg.moqNotes}
                </li>
                <li>
                  <span className="font-semibold text-charcoal">Lead times:</span> {cfg.leadTimeNotes}
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  className="inline-flex items-center justify-center rounded-lg bg-leaf px-5 py-3 text-sm font-semibold text-charcoal hover:bg-[#6fa01f]"
                  href={mailersHref}
                >
                  View regional mailers page
                </Link>
                <Link className="text-sm font-semibold text-air hover:underline" href="/">
                  Back to global homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProcessSteps
        title="How it works"
        steps={[
          { title: "Tell us what you ship", body: "Sizes, volumes, print intent — estimates are fine." },
          { title: "Get quote guidance", body: "We confirm details and explain pricing drivers." },
          { title: "Approve specification", body: "Artwork and production details confirmed in writing." },
          { title: "Produce and deliver", body: cfg.leadTimeNotes },
        ]}
      />

      <LeadMagnetBlock quoteHref={quoteHref} />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <CTASection
            title="Request a quote for this region"
            description={cfg.legalDisclaimer}
            primary={{ label: cfg.defaultCTA, href: quoteHref }}
            secondary={{ label: "Download the guide", href: "/packaging-guide/" }}
          />
        </div>
      </section>

      <section className="bg-stone py-14 sm:pb-24 sm:pt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">Regional FAQ</h2>
          <div className="mt-8 max-w-3xl">
            <FAQAccordion items={cfg.faqs.slice(0, 10)} />
          </div>
        </div>
      </section>
    </>
  );
}
