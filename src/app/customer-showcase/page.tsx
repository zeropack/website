import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { CTAButton } from "@/components/CTAButton";
import { CustomerShowcaseGallery } from "@/components/CustomerShowcaseGallery";
import { ShowcaseHeroHeadline } from "@/components/ShowcaseHeroHeadline";
import { SiteImage } from "@/components/SiteImage";
import { LeadMagnetBlock } from "@/components/LeadMagnetBlock";
import { customerShowcaseBrands, customerShowcaseWhy } from "@/content/customerShowcase";
import { QUOTE_FORM_HREF } from "@/lib/site";
import heroPackaging from "@/content/images/custom/Zero Waste Co branded bold custom compostable packaging.webp";

export const metadata: Metadata = buildMetadata({
  title: "Customer Showcase | Zero Pack",
  description:
    "See how brands use custom compostable mailers and packaging from Zero Pack — real examples with custom print, sizing and specification.",
  path: "/customer-showcase/",
});

export default function Page() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200/40 bg-gradient-to-br from-[#f4f7fb] via-white to-[#e8f3f8] py-14 sm:py-20">
        <div
          className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(0,168,243,0.12),transparent_72%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-compost">Customer showcase</p>
            <div className="mt-3">
              <ShowcaseHeroHeadline />
            </div>
            <p className="mt-5 text-lg text-charcoal/75">
              Stand out from the crowd with packaging designed how you want it — custom print, sizing and specification
              for ecommerce brands that care what they send out.
            </p>
            <p className="mt-3 text-sm font-semibold text-compost">From only 2,000 pieces, fully customised.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton href={QUOTE_FORM_HREF} variant="primary">
                Get a Custom Quote
              </CTAButton>
              <CTAButton href="/packaging-guide/" variant="secondary">
                Get the Guide
              </CTAButton>
            </div>
          </div>
          <div className="zp-hover-lift overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 shadow-lg shadow-slate-300/20 ring-1 ring-slate-200/60">
            <SiteImage
              src={heroPackaging}
              alt="Zero Pack branded bold custom compostable packaging"
              width={heroPackaging.width}
              height={heroPackaging.height}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="h-auto w-full rounded-xl object-contain"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
            Our fellow waste warrior legends
          </h2>
          <p className="mt-3 max-w-3xl text-charcoal/75">
            A selection of brands shipping with custom compostable packaging from Zero Pack.
          </p>
          <div className="mt-10">
            <CustomerShowcaseGallery brands={customerShowcaseBrands} />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/40 bg-slate-50/80 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
            {customerShowcaseWhy.heading}
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-charcoal/75">{customerShowcaseWhy.intro}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {customerShowcaseWhy.benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="zp-hover-lift rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-300/20"
              >
                <h3 className="font-heading text-lg font-semibold text-compost">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/70 bg-mist/60 p-8">
              <h2 className="font-heading text-xl font-semibold text-charcoal sm:text-2xl">
                Ready for a quote on your packaging?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
                Share as much detail as you can and we will provide an accurate quote for your custom compostable
                packaging. Not sure on requirements yet?{" "}
                <a className="font-semibold text-air hover:underline" href="/contact/">
                  Contact us
                </a>{" "}
                to speak with the team.
              </p>
              <div className="mt-6">
                <CTAButton href={QUOTE_FORM_HREF} variant="primary">
                  Get a Custom Quote
                </CTAButton>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-charcoal sm:text-2xl">
                Not ready to go fully customised?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
                If your business is not yet at the stage to reach our MOQs, you can still show customers your dedication
                to sustainability. Start with our guide while you compare options and plan your next move.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <CTAButton href="/packaging-guide/" variant="secondary">
                  Download the guide
                </CTAButton>
                <CTAButton href="/custom-compostable-packaging/" variant="ghost">
                  Explore packaging formats
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LeadMagnetBlock variant="climate" />
    </>
  );
}
