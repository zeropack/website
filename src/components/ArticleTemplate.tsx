import Link from "next/link";
import type { Article } from "@/content/articles/types";
import { getArticleBySlug } from "@/content/articles";
import { CTAButton } from "./CTAButton";
import { FAQAccordion } from "./FAQAccordion";
import { FAQSchema } from "./FAQSchema";
import { JsonLd } from "./JsonLd";
import { absoluteUrl, QUOTE_FORM_HREF, SITE_NAME } from "@/lib/site";

const PILLAR_PATH = "/packaging-guide/";

/** Parses [link text](/path/) patterns in paragraph strings into anchor elements. */
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

export function ArticleTemplate({ article }: { article: Article }) {
  const quoteHref = QUOTE_FORM_HREF;
  const mailersHref = "/trend-packaging-funnel/";
  const faqs = article.faqs.length > 0 ? article.faqs : [];
  const related = (article.relatedSlugs ?? [])
    .map((slug) => getArticleBySlug(slug))
    .filter(Boolean) as Article[];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.dateModified ?? article.publishedAt,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    mainEntityOfPage: absoluteUrl(`/articles/${article.slug}/`),
    keywords: [article.primaryKeyword, ...(article.secondaryKeywords ?? [])].filter(Boolean).join(", "),
  };

  return (
    <article className="bg-stone pb-16 pt-8 sm:pb-24">
      <JsonLd data={articleJsonLd} />
      {faqs.length > 0 ? <FAQSchema items={faqs} /> : null}
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-leaf">{article.category}</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-sm text-charcoal/60">
          Published {article.publishedAt}
          {article.dateModified && article.dateModified !== article.publishedAt
            ? ` · Updated ${article.dateModified}`
            : null}
        </p>
        <p className="mt-6 text-lg text-charcoal/75">{article.description}</p>

        {!article.isSpokeGuide ? (
          <p className="mt-4 rounded-xl border border-slate-200/60 bg-white px-4 py-3 text-sm text-charcoal/75">
            For the full picture on branded and eco friendly packaging, read the{" "}
            <Link className="font-semibold text-air hover:underline" href={PILLAR_PATH}>
              2026 Brand Guide
            </Link>
            .
          </p>
        ) : null}

        {article.isSpokeGuide ? (
          <p className="mt-4 rounded-xl border border-air/20 bg-air/5 px-4 py-3 text-sm text-charcoal/75">
            Part of the{" "}
            <Link className="font-semibold text-air hover:underline" href={article.pillarPath ?? PILLAR_PATH}>
              2026 Branded & Eco Friendly Packaging Guide
            </Link>
            . Read the full guide for checklists, decision frameworks, and FAQs.
          </p>
        ) : null}

        {article.keyTakeaways && article.keyTakeaways.length > 0 ? (
          <div className="mt-8 rounded-2xl border border-compost/20 bg-white p-6">
            <p className="text-sm font-semibold text-compost">Key takeaways</p>
            <ul className="mt-3 space-y-2 text-sm text-charcoal/75">
              {article.keyTakeaways.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <nav aria-label="Table of contents" className="mt-10 rounded-2xl border border-black/5 bg-white p-6">
          <p className="text-sm font-semibold text-compost">On this page</p>
          <ol className="mt-3 space-y-2 text-sm">
            {article.sections.map((s) => (
              <li key={s.id}>
                <a className="text-air hover:underline" href={`#${s.id}`}>
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 max-w-none">
          {article.sections.map((s) => (
            <section key={s.id} id={s.id} className="mb-12">
              <h2 className="font-heading text-2xl font-semibold text-compost">{s.heading}</h2>
              <div className="mt-4 space-y-4 text-charcoal/75">
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{renderParagraph(p)}</p>
                ))}
              </div>
              {s.bullets ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-charcoal/75">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-black/5 bg-mist p-6">
          <p className="font-heading text-lg font-semibold text-charcoal">Next step</p>
          <p className="mt-2 text-sm text-charcoal/70">
            If you want pricing for custom compostable mailers, request a quote. If you are still researching, start
            with the full Brand Guide.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <CTAButton href={quoteHref} variant="primary">
              Request a quote
            </CTAButton>
            <CTAButton href="/packaging-guide/download/" variant="secondary">
              Download the Guide
            </CTAButton>
            <CTAButton href={mailersHref} variant="ghost">
              Custom compostable mailers
            </CTAButton>
          </div>
        </div>

        {related.length > 0 ? (
          <div className="mt-14">
            <h2 className="font-heading text-xl font-semibold text-charcoal">Related guides</h2>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link className="font-medium text-air hover:underline" href={`/articles/${r.slug}/`}>
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {faqs.length > 0 ? (
          <div className="mt-14">
            <h2 className="font-heading text-xl font-semibold text-charcoal">FAQ</h2>
            <div className="mt-4">
              <FAQAccordion items={faqs} />
            </div>
          </div>
        ) : null}

        <p className="mt-10 text-sm text-charcoal/60">
          More reading:{" "}
          <Link className="font-medium text-air hover:underline" href="/articles/">
            Articles hub
          </Link>
          {" · "}
          <Link className="font-medium text-air hover:underline" href={PILLAR_PATH}>
            Brand Guide
          </Link>
        </p>
      </div>
    </article>
  );
}
