import Link from "next/link";
import { brandGuide } from "@/content/guides/brandGuide";
import { CTAButton } from "./CTAButton";
import { FAQAccordion } from "./FAQAccordion";
import { FAQSchema } from "./FAQSchema";
import { JsonLd } from "./JsonLd";
import { absoluteUrl, QUOTE_FORM_HREF, SITE_NAME } from "@/lib/site";

export function GuideTemplate() {
  const pdfUrl = `/${brandGuide.pdfFilename}`;

  const guideJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: brandGuide.title,
    alternativeHeadline: "Branded packaging and eco friendly packaging guide for ecommerce",
    description: brandGuide.tagline,
    datePublished: brandGuide.publishedAt,
    dateModified: brandGuide.dateModified,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    mainEntityOfPage: absoluteUrl(brandGuide.path),
    keywords: [brandGuide.primaryKeyword, ...brandGuide.secondaryKeywords].join(", "),
    encoding: {
      "@type": "MediaObject",
      contentUrl: absoluteUrl(pdfUrl),
      encodingFormat: "application/pdf",
    },
  };

  return (
    <article className="bg-stone pb-16 pt-8 sm:pb-24">
      <JsonLd data={guideJsonLd} />
      <FAQSchema items={[...brandGuide.faqs]} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-compost">Official guide</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-5xl">
              {brandGuide.title}
            </h1>
            <p className="mt-3 text-lg font-medium text-air">{brandGuide.subtitle}</p>
            <p className="mt-4 text-lg text-charcoal/75">{brandGuide.tagline}</p>
            <p className="mt-4 text-sm text-charcoal/60">
              Updated {brandGuide.dateModified} · Branded packaging · Eco friendly packaging · Custom compostable
              packaging
            </p>

            <div className="mt-8 rounded-2xl border border-compost/20 bg-white p-6">
              <p className="text-sm font-semibold text-compost">What you will find in this guide</p>
              <ul className="mt-3 space-y-2 text-sm text-charcoal/75">
                {brandGuide.whatsInside.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-label="Table of contents" className="mt-10 rounded-2xl border border-black/5 bg-white p-6">
              <p className="text-sm font-semibold text-compost">On this page</p>
              <ol className="mt-3 max-h-80 space-y-2 overflow-y-auto text-sm lg:max-h-none">
                {brandGuide.sections.map((s) => (
                  <li key={s.id}>
                    <a className="text-air hover:underline" href={`#${s.id}`}>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-12 max-w-none">
              {brandGuide.sections.map((s) => (
                <section key={s.id} id={s.id} className="mb-12 scroll-mt-28">
                  <h2 className="font-heading text-2xl font-semibold text-compost">{s.heading}</h2>
                  <div className="mt-4 space-y-4 text-charcoal/75">
                    {s.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  {s.bullets ? (
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-charcoal/75">
                      {s.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                  {s.id.startsWith("decision-checklist") && (
                    <div className="mt-8 rounded-2xl border border-leaf/30 bg-white p-6">
                      <p className="font-heading text-lg font-semibold text-charcoal">
                        Want this checklist formatted for print?
                      </p>
                      <p className="mt-2 text-sm text-charcoal/70">
                        Download the full guide and toolkit — includes the decision checklist,
                        quote-ready planning prompt, and artwork brief template, all formatted to
                        share with your team or use offline.
                      </p>
                      <div className="mt-4">
                        <CTAButton href="/packaging-guide/download/" variant="secondary">
                          Download the Guide
                        </CTAButton>
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-14">
              <h2 className="font-heading text-2xl font-semibold text-charcoal">Frequently asked questions</h2>
              <div className="mt-4">
                <FAQAccordion items={[...brandGuide.faqs]} />
              </div>
            </div>

            <div className="mt-14 rounded-2xl border border-black/5 bg-mist p-6">
              <p className="font-heading text-lg font-semibold text-charcoal">Ready for a quote?</p>
              <p className="mt-2 text-sm text-charcoal/70">
                Tell us what you ship and we will help you work through size, specification, and pricing.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <CTAButton href={QUOTE_FORM_HREF} variant="primary">
                  Get a Custom Quote
                </CTAButton>
                <CTAButton href="/customer-showcase/" variant="secondary">
                  Customer Showcase
                </CTAButton>
              </div>
            </div>

            <p className="mt-10 text-sm text-charcoal/60">
              Deep dives:{" "}
              <Link className="font-medium text-air hover:underline" href="/articles/">
                Packaging guides in Articles
              </Link>
            </p>
          </div>

          <aside className="mt-10 lg:sticky lg:top-[calc(var(--site-header-height)+1.5rem)] lg:mt-0">
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-charcoal">
                Download the 2026 Guide + Toolkit
              </h2>
              <p className="mt-3 text-sm text-charcoal/70">
                Get the full guide as a formatted PDF — plus the print-ready decision checklist,
                quote-ready planning prompt, and artwork brief template.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-charcoal/60">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                  Full guide PDF
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                  Print-ready decision checklist
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                  Quote-ready planning prompt
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                  Artwork brief template
                </li>
              </ul>
              <p className="mt-3 text-xs text-charcoal/50">
                Updated annually — subscribers notified first.
              </p>
              <div className="mt-5">
                <CTAButton href="/packaging-guide/download/" variant="primary" className="w-full justify-center">
                  Download the Guide
                </CTAButton>
              </div>
              <p className="mt-4 text-center text-xs text-charcoal/50">Free · Takes under a minute</p>
            </div>

          </aside>
        </div>
      </div>
    </article>
  );
}
