import type { Metadata } from "next";
import { CTAButton } from "@/components/CTAButton";
import { ArticleCard } from "@/components/ArticleCard";
import { RegionalArticlesPage } from "@/components/RegionalArticlesPage";
import { getGlobalArticles } from "@/content/articles";
import { brandGuide } from "@/content/guides/brandGuide";
import { QUOTE_FORM_HREF } from "@/lib/site";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();

  if (market === "au") {
    return buildMarketPageMetadata({
      market,
      title: "Australia Articles | Packaging Guides & Market Updates",
      description:
        "Australian packaging guidance, regulation and market updates from Zero Pack, plus global guides relevant to ecommerce and packaging teams.",
      path: "/articles/",
    });
  }

  if (market === "uk") {
    return buildMarketPageMetadata({
      market,
      title: "UK Articles | Packaging Guides & Market Updates",
      description:
        "UK packaging guidance, regulation and market updates from Zero Pack, plus global guides relevant to ecommerce and packaging teams.",
      path: "/articles/",
    });
  }

  return buildMarketPageMetadata({
    market: "global",
    title: "Articles | Compostable Packaging & Branded Packaging Guides",
    description:
      "Education on branded packaging, eco friendly packaging, custom compostable mailers, fulfilment, compliance and artwork — built for B2B buyers.",
    path: "/articles/",
  });
}

export default async function Page() {
  const market = await getRequestMarket();

  if (market === "au") return <RegionalArticlesPage market="AU" marketName="Australia" />;
  if (market === "uk") return <RegionalArticlesPage market="UK" marketName="United Kingdom" />;

  const articles = getGlobalArticles();
  const startingSlugs = [
    "what-to-ask-before-ordering-custom-packaging",
    "compostable-packaging-guide",
    "how-to-prepare-artwork-for-custom-mailers",
  ];
  const startingArticles = startingSlugs
    .map((slug) => articles.find((article) => article.slug === slug))
    .filter((article): article is (typeof articles)[number] => Boolean(article));
  const moreArticles = articles.filter((article) => !startingSlugs.includes(article.slug));

  return (
    <>
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Packaging resources</p>
            <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
              Packaging decisions, explained properly
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-charcoal/70 sm:text-xl">
              Straightforward guidance on choosing, designing and ordering custom compostable packaging — including
              the questions worth asking before production begins.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stone py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-3xl border border-air/20 bg-white p-8 shadow-[0_18px_55px_rgba(17,24,39,0.06)] lg:grid-cols-[1.2fr_auto] lg:items-center lg:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Start with the complete guide</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
                {brandGuide.title}
              </h2>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-charcoal/70">{brandGuide.tagline}</p>
            </div>
            <CTAButton href={brandGuide.path} variant="primary">
              Read the Packaging Guide
            </CTAButton>
          </div>

          <div className="mt-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Good places to start</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
              What do you need help with?
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {startingArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Articles and explainers</p>
          <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
            Explore more packaging guidance
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-charcoal/70">
            Browse practical guidance on packaging choices, compostability, artwork, ordering and ecommerce
            fulfilment. Market-specific updates appear on the relevant regional Zero Pack site.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moreArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
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
