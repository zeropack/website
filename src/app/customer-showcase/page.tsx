import type { Metadata } from "next";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { CustomerShowcaseGallery } from "@/components/CustomerShowcaseGallery";
import { SiteImage } from "@/components/SiteImage";
import {
  customerShowcaseBrands,
  customerShowcaseFaqs,
  customerShowcaseProof,
  featuredShowcaseProjects,
  portfolioShowcaseProjects,
} from "@/content/customerShowcase";
import { QUOTE_FORM_HREF } from "@/lib/site";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";
import heroPackaging from "@/content/images/custom/Zero Waste Co branded bold custom compostable packaging.webp";

const path = "/customer-showcase/";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  const description =
    market === "uk"
      ? "Explore real custom compostable packaging projects produced by Zero Pack, with examples of mailers, flexible bags and retail carry bags."
      : "Explore real custom compostable packaging projects produced by Zero Pack, with branded mailers, flexible bags and retail carry bags made for different applications.";

  return buildMarketPageMetadata({
    market,
    title: "Custom Compostable Packaging Examples | Zero Pack",
    description,
    path,
  });
}

export default async function Page() {
  const market = await getRequestMarket();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: customerShowcaseFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative overflow-hidden border-b border-slate-200/40 bg-gradient-to-br from-[#f4f7fb] via-white to-[#e8f3f8] py-14 sm:py-20">
        <div
          className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(0,168,243,0.12),transparent_72%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-compost">Customer showcase</p>
            <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-5xl">
              Real custom compostable packaging, made for real brands
            </h1>
            <p className="mt-5 text-lg text-charcoal/75">
              Explore packaging produced by Zero Pack for ecommerce, retail, healthcare, food, fashion and other
              applications. Each project combines custom print with packaging developed around the brand and the job it
              needs to do.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton href={QUOTE_FORM_HREF} variant="primary">
                Start Your Packaging Project
              </CTAButton>
              <CTAButton href="/how-it-works/" variant="secondary">
                See How It Works
              </CTAButton>
            </div>
          </div>
          <div className="zp-hover-lift overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 shadow-lg shadow-slate-300/20 ring-1 ring-slate-200/60">
            <SiteImage
              src={heroPackaging}
              alt="A collection of custom compostable packaging produced by Zero Pack"
              width={heroPackaging.width}
              height={heroPackaging.height}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="h-auto w-full rounded-xl object-contain"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/50 bg-white py-10">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
          <div className="rounded-2xl bg-mist/60 p-5">
            <p className="font-heading text-2xl font-semibold text-compost">750,000+</p>
            <p className="mt-1 text-sm text-charcoal/70">Custom bags produced</p>
          </div>
          <div className="rounded-2xl bg-mist/60 p-5">
            <p className="font-heading text-2xl font-semibold text-compost">{customerShowcaseBrands.length}</p>
            <p className="mt-1 text-sm text-charcoal/70">Customer packaging examples in this showcase</p>
          </div>
          <div className="rounded-2xl bg-mist/60 p-5">
            <p className="font-heading text-2xl font-semibold text-compost">Made to order</p>
            <p className="mt-1 text-sm text-charcoal/70">Custom sizing, print and specification</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-compost">Featured applications</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
              Different brands. Different packaging jobs.
            </h2>
            <p className="mt-4 text-lg text-charcoal/75">
              These projects show how custom compostable packaging can be developed for different sectors, products and
              visual identities without forcing every customer into the same look.
            </p>
          </div>

          {market === "uk" ? (
            <p className="mt-6 max-w-3xl rounded-xl border border-slate-200/70 bg-stone p-4 text-sm text-charcoal/70">
              This portfolio currently shows work produced across Zero Pack&apos;s established markets. UK customer stories
              will be added as local projects are completed and approved for publication.
            </p>
          ) : null}

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {featuredShowcaseProjects.map((project) => (
              <article
                key={project.name}
                className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm shadow-slate-300/20"
              >
                <div className="grid h-full sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <div className="relative min-h-72 bg-gradient-to-br from-[#f4f7fb] via-white to-[#e8f3f8] sm:min-h-full">
                    {project.image ? (
                      <SiteImage
                        src={project.image}
                        alt={project.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 28vw"
                        className="object-contain p-4"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-wide text-compost">{project.sector}</p>
                    <h3 className="mt-2 font-heading text-xl font-semibold text-charcoal">{project.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-charcoal/65">{project.packagingType}</p>
                    <p className="mt-4 text-sm leading-relaxed text-charcoal/75">{project.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/40 bg-slate-50/80 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
            What these custom packaging projects show
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-charcoal/75">
            A strong result starts with the application, then brings the packaging and brand details together.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {customerShowcaseProof.map((proof) => (
              <div
                key={proof.title}
                className="zp-hover-lift rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-300/20"
              >
                <h3 className="font-heading text-lg font-semibold text-compost">{proof.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{proof.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-charcoal/70">
            Want to understand the process before you enquire?{" "}
            <Link className="font-semibold text-air hover:underline" href="/how-it-works/">
              See how custom packaging moves from idea to production.
            </Link>
          </p>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">More customer packaging</h2>
          <p className="mt-3 max-w-3xl text-charcoal/75">
            Browse more custom compostable mailers and bags produced for organisations across different industries and
            brand styles.
          </p>
          <div className="mt-10">
            <CustomerShowcaseGallery brands={portfolioShowcaseProjects} />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/40 bg-mist/60 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-compost">Common questions</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
            About the projects in this showcase
          </h2>
          <div className="mt-8 divide-y divide-slate-200/80 rounded-2xl border border-slate-200/70 bg-white px-6 shadow-sm sm:px-8">
            {customerShowcaseFaqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="cursor-pointer list-none pr-8 font-heading text-lg font-semibold text-charcoal marker:content-none">
                  {faq.question}
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/75">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-2xl bg-compost px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <h2 className="font-heading text-2xl font-semibold sm:text-3xl">What could your packaging look like?</h2>
                <p className="mt-4 max-w-3xl text-white/80">
                  Bring us an idea, a product, a photo or your current packaging. We&apos;ll help you explore a custom
                  compostable solution and work through the size, print, material and next step.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <CTAButton href={QUOTE_FORM_HREF} variant="secondary">
                  Start Your Packaging Project
                </CTAButton>
                <Link
                  className="text-center text-sm font-semibold text-white underline-offset-4 hover:underline"
                  href="/packaging-guide/"
                >
                  Read the Packaging Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
