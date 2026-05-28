import { Suspense } from "react";
import Link from "next/link";
import { globalMailers } from "@/content/global/home";
import { mailersContent, type MailersVariant } from "@/content/mailersContent";
import { getRegionConfig } from "@/lib/regions";
import type { RegionCode } from "@/lib/types";
import { HeroSection } from "@/components/HeroSection";
import { TrustStrip } from "@/components/TrustStrip";
import { FeatureGrid } from "@/components/FeatureGrid";
import { CertificationExplainer } from "@/components/CertificationExplainer";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ComparisonTable } from "@/components/ComparisonTable";
import { CustomerShowcaseGrid } from "@/components/CustomerShowcaseGrid";
import { LeadMagnetBlock } from "@/components/LeadMagnetBlock";
import { QuoteFormMultiStep } from "@/components/QuoteFormMultiStep";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { CTASection } from "@/components/CTASection";
import { globalHomeFaqs } from "@/content/global/faqs";
import { QUOTE_FORM_HREF } from "@/lib/site";

function quoteHref(_region?: RegionCode) {
  return QUOTE_FORM_HREF;
}

export function MailersLanding({ variant }: { variant: MailersVariant }) {
  const copy = mailersContent[variant];
  const region = variant === "global" ? undefined : variant;
  const cfg = region ? getRegionConfig(region) : null;
  const primaryHref = quoteHref(region);
  const guideHref = "/packaging-guide/";

  return (
    <>
      <FAQSchema items={globalHomeFaqs} />
      <HeroSection
        title={copy.heroTitle}
        subtitle={copy.heroSub}
        primaryCta={{ label: copy.primaryCta, href: primaryHref }}
        secondaryCta={{ label: copy.secondaryCta, href: guideHref }}
      />
      <TrustStrip items={copy.trustStrip} />

      <section className="bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm font-semibold text-charcoal/70">{globalMailers.moqLine}</p>
        </div>
      </section>

      <section className="bg-stone py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{copy.problem.heading}</h2>
          <div className="mt-6 max-w-3xl space-y-4 text-lg text-charcoal/75">
            {copy.problem.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {copy.ukAngle ? (
            <ul className="mt-8 max-w-3xl list-disc space-y-2 pl-5 text-sm text-charcoal/75">
              {copy.ukAngle.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">What you are buying</h2>
            <p className="mt-4 text-charcoal/75">
              A made-to-order mailer specification matched to your brand print, sizing discipline and shipping
              realities. You request a quote; we confirm specification and pricing — there is no retail cart checkout.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-charcoal/75">
              <li>
                <span className="font-semibold text-charcoal">Also available:</span> custom compostable shopping bags,
                garment bags and campaign packaging for brands building a wider system — mailers stay the core product.
              </li>
              <li>
                Specialist support for brands moving off conventional plastic without giving up presentation or
                practical performance in transit.
              </li>
            </ul>
            <div className="mt-8">
              <Link className="text-sm font-semibold text-air hover:underline" href="/custom-compostable-packaging/">
                View broader custom compostable packaging
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-black/5 bg-mist p-8">
            <p className="text-sm font-semibold text-compost">Specification checklist</p>
            <ul className="mt-4 space-y-3 text-sm text-charcoal/80">
              <li>Typical order contents and weights</li>
              <li>Preferred internal dimensions (or “help me size it”)</li>
              <li>Print intent: logo-only vs full artwork</li>
              <li>Monthly shipping volumes and growth plans</li>
              <li>Timeline and any compliance constraints</li>
            </ul>
          </div>
        </div>
      </section>

      <FeatureGrid
        title="Features and benefits"
        features={[
          {
            title: "Brand presentation",
            description: "Custom print and sizing discipline so packaging matches how you want the brand to feel.",
          },
          {
            title: "Performance",
            description: "Closure strength, durability and waterproofing are matched to your shipping method and product weights.",
          },
          {
            title: "Commercial practicality",
            description: "Quote-based pricing and practical MOQs aligned to growing brands shipping regularly.",
          },
          {
            title: "Materials guidance",
            description: "Certification and claims are tied to the specification you buy — we align wording to your documentation.",
          },
        ]}
      />

      <section className="bg-stone py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">Industries served</h2>
          <p className="mt-3 max-w-3xl text-charcoal/75">
            Best-fit categories include fashion, beauty, skincare, wellness, homewares, accessories, books and
            stationery, gifts, ethical and sustainable brands, premium handmade brands and DTC Shopify brands shipping
            physical orders regularly.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "Fashion",
              "Beauty",
              "Skincare",
              "Wellness",
              "Homewares",
              "Accessories",
              "Books and stationery",
              "Gifts",
              "Ethical brands",
              "Premium handmade",
              "DTC / Shopify",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-charcoal/80"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ProcessSteps
        title="How the quote process works"
        steps={[
          { title: "Submit requirements", body: "Volumes, sizes, print intent, timeline — estimates are fine." },
          { title: "Clarify specification", body: "We ask the missing questions needed for accurate guidance." },
          { title: "Receive quote guidance", body: "Pricing drivers explained: size, quantity tiers, print, material, freight." },
          { title: "Approve artwork and production details", body: "Nothing starts without written confirmation." },
          { title: "Production and delivery", body: "Dates depend on region, approvals and freight — confirmed up front." },
        ]}
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
            Comparison: plastic vs recycled plastic vs compostable mailers
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-charcoal/70">
            The right option depends on your volumes, the claims you can support, and how you fulfil orders. Use this
            table to compare at a glance, then request a quote for the route you want to explore.
          </p>
          <div className="mt-8">
            <ComparisonTable />
          </div>
        </div>
      </section>

      <section className="bg-stone py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Placeholder case studies in data — replace with verified AU/UK examples when available */}
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">Customer showcase</h2>
          <div className="mt-8">
            <CustomerShowcaseGrid
              studies={
                cfg?.caseStudies?.length
                  ? cfg.caseStudies
                  : getRegionConfig("au").caseStudies.slice(0, 2)
              }
            />
          </div>
        </div>
      </section>

      <LeadMagnetBlock quoteHref={primaryHref} />

      <CertificationExplainer
        title="Certification and compostability education"
        paragraphs={
          variant === "uk"
            ? [
                "UK teams often need to reconcile customer-facing compostability language with real-world disposal routes. Where industrial composting access is limited, home compostability can be more practical — but only when supported by the right documentation for the exact product specification.",
                "AS5810 is an Australian home compostability standard framework often referenced in supplier documentation for strict home composting tests. Any claim on your own packaging must match the documentation for the SKU you purchase.",
              ]
            : [
                "Compostable claims should reflect test conditions and disposal routes, not marketing slogans alone.",
                "We walk through what documentation you need, what to tell customers about disposal, and what happens if packaging enters general waste streams.",
              ]
        }
        bullets={[
          "Avoid vague biodegradable language without definition.",
          "Separate industrial vs home composting routes when explaining options.",
          "Use certification claims only where supportable for the exact specification purchased.",
        ]}
      />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">Request a mailer quote</h2>
              <p className="mt-3 text-sm text-charcoal/70">
                Quote pricing depends on size, quantity and print. If you are unsure, choose “Not sure” options — we
                still respond with guidance.
              </p>
              <div className="mt-8 rounded-2xl border border-black/5 bg-stone p-6">
                <Suspense fallback={<p className="text-sm text-charcoal/60">Loading form…</p>}>
                  <QuoteFormMultiStep defaultRegion={region} />
                </Suspense>
              </div>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">FAQ</h2>
              <div className="mt-6">
                <FAQAccordion items={globalHomeFaqs} />
              </div>
              <div className="mt-10">
                <CTASection
                  title="Not ready for a quote yet?"
                  description="Download the guide if you are still comparing options, then come back when you want pricing."
                  primary={{ label: copy.secondaryCta, href: guideHref }}
                  secondary={{ label: copy.primaryCta, href: primaryHref }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
