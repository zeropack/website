import type { Metadata } from "next";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { CustomPackagingProofBar } from "@/components/CustomPackagingProofBar";
import { CustomerShowcaseGallery } from "@/components/CustomerShowcaseGallery";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/FAQSchema";
import { SiteImage } from "@/components/SiteImage";
import {
  customerShowcaseFaqs,
  featuredShowcaseProjects,
  portfolioShowcaseProjects,
} from "@/content/customerShowcase";
import { QUOTE_FORM_HREF } from "@/lib/site";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";
import heroPackaging from "@/content/images/custom/Zero Waste Co branded bold custom compostable packaging.webp";

const path = "/customer-showcase/";
const consultationUrl = "https://calendly.com/zeropackco/30min";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  const description =
    market === "uk"
      ? "See custom compostable packaging created by Zero Pack for real brands, from standout mailers to flexible bags and retail carry bags."
      : "See custom compostable packaging created by Zero Pack for real brands, from standout mailers to flexible bags and retail carry bags.";

  return buildMarketPageMetadata({
    market,
    title: "Custom Compostable Packaging Examples | Zero Pack",
    description,
    path,
  });
}

export default async function Page() {
  const market = await getRequestMarket();

  return (
    <>
      <FAQSchema items={customerShowcaseFaqs} />

      <section className="relative overflow-hidden bg-charcoal py-14 text-white sm:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(0,168,243,0.2),transparent_72%)]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">
              Customer showcase
            </p>
            <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Custom compostable packaging made to stand out
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/80">
              Meet the bags, mailers and packaging we have created with brands
              across retail, ecommerce, healthcare, food and more — each one
              made for the product, shaped by the brand and designed to be
              noticed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton href={QUOTE_FORM_HREF} variant="primary">
                Get a Custom Quote
              </CTAButton>
              <a
                href={consultationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-air/50 hover:bg-white/10"
              >
                Book a Packaging Consultation
              </a>
            </div>
          </div>
          <div className="zp-hover-lift overflow-hidden rounded-3xl border border-white/10 bg-white p-3 shadow-2xl shadow-black/20">
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

      <CustomPackagingProofBar />

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">
              Made for the brand
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
              Different products. Different personalities. Packaging that feels
              unmistakably theirs.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/75">
              Bold, minimal, playful, clinical or premium — the right packaging
              looks different for every business. These projects show what
              happens when the product, purpose and brand lead the design.
            </p>
          </div>

          {market === "uk" ? (
            <p className="mt-6 max-w-3xl rounded-xl border border-slate-200/70 bg-stone p-4 text-sm text-charcoal/70">
              This showcase features Zero Pack projects from across our
              established markets. UK-specific projects will appear here as they
              are completed and approved for publication.
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
                    <p className="text-xs font-semibold uppercase tracking-wide text-compost">
                      {project.sector}
                    </p>
                    <h3 className="mt-2 font-heading text-xl font-semibold text-charcoal">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-charcoal/65">
                      {project.packagingType}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
                      {project.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/40 bg-mist/60 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">
            More customer work
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
            More brands. More ways to make an impression.
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-charcoal/75">
            From fashion and fitness to coffee, healthcare, homewares and
            technology, custom packaging gives every brand room to show up in
            its own way.
          </p>
          <div className="mt-10">
            <CustomerShowcaseGallery brands={portfolioShowcaseProjects} />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">
            Planning your packaging
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-charcoal/75">
            A few useful answers for turning inspiration into packaging of your
            own.
          </p>
          <div className="mt-8 shadow-sm">
            <FAQAccordion items={customerShowcaseFaqs} />
          </div>
        </div>
      </section>

      <section className="bg-mist/60 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl bg-compost px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#79d6a7]">
                  Your brand could be next
                </p>
                <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">
                  Ready to make packaging worth remembering?
                </h2>
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/80">
                  Tell us what you are packaging, what matters to your brand and
                  where it needs to go. We will help you turn it into custom
                  compostable packaging made for the job — and made to look like
                  yours.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <CTAButton href={QUOTE_FORM_HREF} variant="secondary">
                  Get a Custom Quote
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
