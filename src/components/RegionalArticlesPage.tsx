import { ArticleCard } from "@/components/ArticleCard";
import { getArticleMarket, getArticlesForMarket } from "@/content/articles";
import type { ArticleMarket } from "@/content/articles/types";

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

  return (
    <section className="bg-stone py-14 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
          {marketName} articles & guides
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-charcoal/75">
          Market-relevant packaging guidance first, followed by global Zero Pack guides that apply across regions.
        </p>

        {regional.length > 0 ? (
          <div className="mt-14">
            <h2 className="font-heading text-xl font-semibold text-charcoal">Latest for {marketName}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regional.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-14">
          <h2 className="font-heading text-xl font-semibold text-charcoal">Global packaging guides</h2>
          <p className="mt-2 max-w-2xl text-sm text-charcoal/70">
            Practical guidance that applies across Zero Pack markets. Regional legal and disposal requirements should always be checked separately.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {global.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
