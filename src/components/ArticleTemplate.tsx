import Link from "next/link";
import type { Article } from "@/content/articles/types";
import { CTAButton } from "./CTAButton";
import { FAQAccordion } from "./FAQAccordion";
import { FAQSchema } from "./FAQSchema";
import { JsonLd } from "./JsonLd";
import { globalHomeFaqs } from "@/content/global/faqs";
import { absoluteUrl, QUOTE_FORM_HREF } from "@/lib/site";
import type { RegionCode } from "@/lib/types";

export function ArticleTemplate({
  article,
  region,
}: {
  article: Article;
  region?: RegionCode;
}) {
  const quoteHref = QUOTE_FORM_HREF;
  const mailersHref = "/customer-showcase/";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: "Zero Pack" },
    mainEntityOfPage: absoluteUrl(`/articles/${article.slug}/`),
  };

  return (
    <article className="bg-stone pb-16 pt-8 sm:pb-24">
      <JsonLd data={articleJsonLd} />
      <FAQSchema items={globalHomeFaqs} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-leaf">{article.category}</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-sm text-charcoal/60">
          Published {article.publishedAt}
        </p>
        <p className="mt-6 text-lg text-charcoal/75">{article.description}</p>

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
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-black/5 bg-mist p-6">
          <p className="font-heading text-lg font-semibold text-charcoal">Next step</p>
          <p className="mt-2 text-sm text-charcoal/70">
            If you want pricing for custom compostable mailers, request a quote. If you are still researching, get
            the guide first.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CTAButton href={quoteHref} variant="primary">
              Request a quote
            </CTAButton>
            <CTAButton href="/packaging-guide/" variant="secondary">
              Get the guide
            </CTAButton>
            <CTAButton href={mailersHref} variant="ghost">
              View mailers
            </CTAButton>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-heading text-xl font-semibold text-charcoal">FAQ</h2>
          <div className="mt-4">
            <FAQAccordion items={globalHomeFaqs} />
          </div>
        </div>

        <p className="mt-10 text-sm text-charcoal/60">
          More reading:{" "}
          <Link className="font-medium text-air hover:underline" href="/articles/">
            Articles hub
          </Link>
        </p>
      </div>
    </article>
  );
}
