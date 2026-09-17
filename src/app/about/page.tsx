import type { Metadata } from "next";
import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";
import { CustomPackagingProofBar } from "@/components/CustomPackagingProofBar";
import { FounderStorySection } from "@/components/FounderStorySection";
import { aboutZeroPack } from "@/content/about/about";
import packagingCollage from "@/content/images/custom/Zero Pack Collage - 1024 x 1024.png";
import { QUOTE_FORM_HREF } from "@/lib/site";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const path = "/about/";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  return buildMarketPageMetadata({
    market,
    title: "About Zero Pack | Custom Compostable Packaging Specialists",
    description:
      "Meet Zero Pack, the team helping businesses develop made-to-order certified compostable packaging around their products, brand and requirements.",
    path,
  });
}

export default function Page() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal py-16 text-white sm:py-24 lg:py-28">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(0,168,243,0.18),transparent_72%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(131,185,37,0.16),transparent_72%)]"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)] lg:gap-16 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-air sm:text-sm">
              {aboutZeroPack.hero.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {aboutZeroPack.hero.heading}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-white/75 sm:text-xl">
              {aboutZeroPack.hero.body}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <CTAButton href={QUOTE_FORM_HREF} variant="primary">
                Get a Custom Quote
              </CTAButton>
              <CTAButton
                href="/custom-compostable-packaging/"
                variant="secondary"
                className="border-white/35 bg-white/5 text-white hover:bg-white/10"
              >
                Explore Custom Packaging
              </CTAButton>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rotate-3 rounded-[2rem] border border-air/25 bg-air/10" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white p-5 shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:p-7">
              <Image
                src={packagingCollage}
                alt="A selection of custom compostable packaging produced for Zero Pack customers"
                className="h-auto w-full"
                priority
                sizes="(min-width: 1024px) 42vw, 90vw"
              />
            </div>
          </div>
        </div>
      </section>

      <CustomPackagingProofBar />

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">{aboutZeroPack.breadth.eyebrow}</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
              {aboutZeroPack.breadth.heading}
            </h2>
          </div>
          <div>
            <div className="space-y-5 text-lg leading-relaxed text-charcoal/70">
              {aboutZeroPack.breadth.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <CTAButton href="/custom-compostable-packaging/" variant="secondary">
                Explore Custom Packaging
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      <FounderStorySection />

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">{aboutZeroPack.approach.eyebrow}</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
              {aboutZeroPack.approach.heading}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/70">{aboutZeroPack.approach.intro}</p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {aboutZeroPack.approach.items.map((item) => (
              <article
                key={item.number}
                className="zp-hover-lift rounded-3xl border border-slate-200/80 bg-stone p-7 shadow-[0_14px_40px_rgba(17,24,39,0.05)] transition-transform sm:p-8"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-air/10 text-sm font-bold text-air">
                  {item.number}
                </span>
                <h3 className="mt-6 font-heading text-xl font-semibold text-charcoal">{item.heading}</h3>
                <p className="mt-3 leading-relaxed text-charcoal/70">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eaf5ec] py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">{aboutZeroPack.audience.eyebrow}</p>
          <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
            {aboutZeroPack.audience.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-charcoal/70">
            {aboutZeroPack.audience.body}
          </p>
          <div className="mt-8">
            <CTAButton href="/customer-showcase/" variant="secondary">
              See Customer Work
            </CTAButton>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-white sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">{aboutZeroPack.finalCta.eyebrow}</p>
          <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-5xl">
            {aboutZeroPack.finalCta.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/70">
            {aboutZeroPack.finalCta.body}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <CTAButton href={QUOTE_FORM_HREF} variant="primary">
              Get a Custom Quote
            </CTAButton>
            <CTAButton
              href="/how-it-works/"
              variant="secondary"
              className="border-white/35 bg-white/5 text-white hover:bg-white/10"
            >
              See How It Works
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
