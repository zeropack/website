import Link from "next/link";
import React from "react";
import { brandGuide } from "@/content/guides/brandGuide";
import type { GuideSubsection, SectionTable } from "@/content/articles/types";
import { CTAButton } from "./CTAButton";
import { FAQAccordion } from "./FAQAccordion";
import { FAQSchema } from "./FAQSchema";
import { JsonLd } from "./JsonLd";
import { absoluteUrl, QUOTE_FORM_HREF, SITE_NAME } from "@/lib/site";

// ---------------------------------------------------------------------------
// Inline link parser — converts [text](/path/) markdown to <Link> elements
// ---------------------------------------------------------------------------
function renderParagraph(text: string): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return (
        <Link key={i} href={match[2]} className="font-medium text-air hover:underline">
          {match[1]}
        </Link>
      );
    }
    return part;
  });
}

// ---------------------------------------------------------------------------
// Sub-section content block (H3 + paragraphs / bullets / table)
// ---------------------------------------------------------------------------
function SubsectionBlock({ sub }: { sub: GuideSubsection }) {
  return (
    <div className="mt-8">
      <h3 className="font-heading text-lg font-semibold text-charcoal">{sub.heading}</h3>
      {sub.paragraphs?.length ? (
        <div className="mt-3 space-y-3 text-charcoal/75">
          {sub.paragraphs.map((p, i) => (
            <p key={i}>{renderParagraph(p)}</p>
          ))}
        </div>
      ) : null}
      {sub.bullets?.length ? (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-charcoal/75">
          {sub.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : null}
      {sub.numberedList?.length ? (
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-charcoal/75">
          {sub.numberedList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      ) : null}
      {sub.table ? <TableBlock table={sub.table} /> : null}
      {sub.table2 ? <TableBlock table={sub.table2} /> : null}
      {sub.note ? <NoteBlock text={sub.note} /> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Callout note block (dark green, rendered after tables)
// ---------------------------------------------------------------------------
function NoteBlock({ text }: { text: string }) {
  const lines = text.split("\n").filter(Boolean);
  const [title, ...body] = lines;
  return (
    <div className="mt-4 rounded-xl bg-compost px-5 py-4">
      {title ? (
        <p className="text-sm font-bold leading-snug text-white">{title}</p>
      ) : null}
      {body.length > 0 ? (
        <p className="mt-1 text-sm leading-relaxed text-white/90">{body.join(" ")}</p>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Responsive table renderer
// ---------------------------------------------------------------------------
function TableBlock({ table }: { table: SectionTable }) {
  if (table.gated) return <GatedTableBlock table={table} />;
  return (
    <>
      <div className="mt-4 overflow-x-auto rounded-xl border border-black/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-compost/8">
              {table.headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-charcoal/70"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-stone/40"}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-4 py-2.5 text-charcoal/75 ${ci === 0 ? "font-medium" : ""}`}
                  >
                    {renderParagraph(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.footnote ? (
        <p className="mt-2 text-right text-xs text-charcoal/50">{renderParagraph(table.footnote)}</p>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------
// Gated table — header visible, data rows blurred with download CTA overlay
// ---------------------------------------------------------------------------
function GatedTableBlock({ table }: { table: SectionTable }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-black/8">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-compost/8">
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-charcoal/70"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      {/* Blurred data rows with CTA overlay */}
      <div className="relative">
        <div
          className="overflow-hidden"
          style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}
          aria-hidden="true"
        >
          <table className="w-full text-sm">
            <tbody>
              {table.rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-stone/40"}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-2.5 text-charcoal/75 ${ci === 0 ? "font-medium" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Gradient fade + CTA */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-stone/60 to-stone">
          <div className="mx-auto max-w-sm rounded-2xl border border-black/8 bg-white px-6 py-5 text-center shadow-sm">
            <p className="font-heading text-base font-semibold text-charcoal">
              The full table is in the free guide
            </p>
            <p className="mt-1.5 text-sm text-charcoal/65">
              Download below to compare every option — takes under a minute.
            </p>
            <div className="mt-4">
              <CTAButton href="/packaging-guide/download/" variant="primary">
                Download the Guide
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Download CTA card (reused in two places)
// ---------------------------------------------------------------------------
function DownloadCTA({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="my-10 rounded-2xl border border-leaf/30 bg-white p-6">
        <p className="font-heading text-lg font-semibold text-charcoal">
          Want this as a formatted PDF?
        </p>
        <p className="mt-2 text-sm text-charcoal/70">
          Download the full guide and toolkit — includes the decision checklist,
          quote-ready planning prompt, and artwork brief template.
        </p>
        <div className="mt-4">
          <CTAButton href="/packaging-guide/download/" variant="secondary">
            Download the Guide
          </CTAButton>
        </div>
      </div>
    );
  }
  return (
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
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
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
            {/* Header */}
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

            {/* Quick answer box */}
            {brandGuide.answerBox ? (
              <div className="mt-6 rounded-xl border-l-4 border-leaf bg-white px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-leaf">Quick answer</p>
                <p className="mt-2 text-sm text-charcoal/80">{brandGuide.answerBox}</p>
              </div>
            ) : null}

            {/* Download CTA — early placement */}
            <div className="mt-6">
              <CTAButton href="/packaging-guide/download/" variant="secondary">
                Download the Guide (PDF)
              </CTAButton>
            </div>

            {/* What's inside */}
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

            {/* Table of contents */}
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

            {/* Sections */}
            <div className="mt-12 max-w-none">
              {brandGuide.sections.map((s) => {
                const isCertification = s.id.startsWith("certification");
                const isDecisionChecklist = s.id.startsWith("decision-checklist");

                return (
                  <section key={s.id} id={s.id} className="mb-14 scroll-mt-28">
                    {/* H2 */}
                    <h2 className="font-heading text-2xl font-semibold text-compost">{s.heading}</h2>

                    {/* Answer box */}
                    {s.answerBox ? (
                      <div className="mt-4 rounded-xl border-l-4 border-leaf bg-white px-5 py-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-leaf">Quick answer</p>
                        <p className="mt-2 text-sm text-charcoal/80">{s.answerBox}</p>
                      </div>
                    ) : null}

                    {/* Section-level paragraphs */}
                    {s.paragraphs?.length ? (
                      <div className="mt-4 space-y-4 text-charcoal/75">
                        {s.paragraphs.map((p, i) => (
                          <p key={i}>{renderParagraph(p)}</p>
                        ))}
                      </div>
                    ) : null}

                    {/* Section-level bullets */}
                    {s.bullets?.length ? (
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-charcoal/75">
                        {s.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    ) : null}

                    {/* Section-level numbered list */}
                    {s.numberedList?.length ? (
                      <ol className="mt-4 list-decimal space-y-3 pl-5 text-charcoal/75">
                        {s.numberedList.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ol>
                    ) : null}

                    {/* Section-level table */}
                    {s.table ? <TableBlock table={s.table} /> : null}
                    {s.table2 ? <TableBlock table={s.table2} /> : null}
                    {s.note ? <NoteBlock text={s.note} /> : null}

                    {/* Subsections (H3) */}
                    {s.subsections?.map((sub, i) => (
                      <SubsectionBlock key={i} sub={sub} />
                    ))}

                    {/* Second download CTA — after the certification section */}
                    {isCertification ? <DownloadCTA compact /> : null}

                    {/* Print checklist CTA — after decision checklist */}
                    {isDecisionChecklist ? <DownloadCTA /> : null}
                  </section>
                );
              })}
            </div>

            {/* FAQs */}
            <div className="mt-14">
              <h2 className="font-heading text-2xl font-semibold text-charcoal">Frequently asked questions</h2>
              <div className="mt-4">
                <FAQAccordion items={[...brandGuide.faqs]} />
              </div>
            </div>

            {/* Final CTA */}
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

          {/* Sticky sidebar */}
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
                {[
                  "Full guide PDF",
                  "Print-ready decision checklist",
                  "Quote-ready planning prompt",
                  "Artwork brief template",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                    {item}
                  </li>
                ))}
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
