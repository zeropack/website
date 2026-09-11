import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getAllArticles,
  getArticleBySlug,
  getArticleCanonicalUrl,
  getArticleMarket,
} from "@/content/articles";
import { ArticleTemplate } from "@/components/ArticleTemplate";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/metadata";
import { getRequestMarket } from "@/lib/requestMarket";
import { MARKET_ROUTES } from "@/lib/marketRouting";

type Props = { params: Promise<{ slug: string }> };

type CanonicalMarket = "global" | "au" | "uk";

function canonicalMarketForArticle(slug: string): CanonicalMarket | null {
  const article = getArticleBySlug(slug);
  if (!article) return null;
  const market = getArticleMarket(article);
  if (market === "AU") return "au";
  if (market === "UK") return "uk";
  return "global";
}

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const canonicalMarket = canonicalMarketForArticle(slug);
  if (!article || !canonicalMarket) return {};

  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/articles/${article.slug}/`,
    canonicalUrl: getArticleCanonicalUrl(article),
    locale: MARKET_ROUTES[canonicalMarket].locale,
    openGraphType: "article",
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const canonicalMarket = canonicalMarketForArticle(slug);
  if (!article || !canonicalMarket) notFound();

  const requestMarket = await getRequestMarket();
  if (requestMarket !== canonicalMarket) {
    permanentRedirect(getArticleCanonicalUrl(article));
  }

  const homeName = canonicalMarket === "au" ? "Australia" : canonicalMarket === "uk" ? "United Kingdom" : "Home";

  return (
    <>
      <Breadcrumbs
        items={[
          { name: homeName, href: "/" },
          { name: "Articles", href: "/articles/" },
          { name: article.title, href: `/articles/${article.slug}/` },
        ]}
      />
      <ArticleTemplate article={article} />
    </>
  );
}
