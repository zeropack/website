import { ArticleCard } from "@/components/ArticleCard";
import { CTAButton } from "@/components/CTAButton";
import { getArticleMarket, getArticlesForMarket } from "@/content/articles";
import type { ArticleMarket } from "@/content/articles/types";
import { brandGuide } from "@/content/guides/brandGuide";
import { QUOTE_FORM_HREF } from "@/lib/site";

export function RegionalArticlesPage({
  market,
  marketName,
}: {
  market: Exclude<ArticleMarket, "GLOBAL">;
  marketName: string;
}) {
  const articles = getArticlesForMarket(market);
  const regional = articles.filter((article) => getArticleMarket(article) === market);
  const global = articles.filter((article) => getArticleMarket(article) === "GLOBAL");
  const marketAdjective = market === "AU" ? "Australian" : "UK";

  return (
    <>
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Packaging resources</p>
            <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
              Packaging guidance for {marketAdjective} businesses
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal/70 sm:text-xl">
              Market-relevant updates alongside straightforward global guidance on choosing, designing and ordering
              custom compostable packaging.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stone py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {regional.length > 0 ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Regional updates</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
                Latest for {marketName}
              </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regional.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        ) : null}

          <div className={regional.length > 0 ? "mt-16" : ""}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Global guidance</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
              Packaging guides and explainers
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-charcoal/70">
              Practical guidance that applies across Zero Pack markets. Regional legal and disposal requirements
              should always be checked separately.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {global.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Need the complete picture?</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
              {brandGuide.title}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-charcoal/70">{brandGuide.tagline}</p>
          </div>
          <CTAButton href={brandGuide.path} variant="secondary">
            Read the Packaging Guide
          </CTAButton>
        </div>
      </section>

      <section className="bg-compost py-14 text-white sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Ready to make it real?</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">
              Turn the research into packaging for your brand
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">
              Explore the wider custom packaging range or tell us what you need for a tailored quote.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CTAButton href="/custom-compostable-packaging/" variant="secondary">
              Explore Custom Packaging
            </CTAButton>
            <CTAButton href={QUOTE_FORM_HREF} variant="primary">
              Get a Custom Quote
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
