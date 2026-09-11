import type { Article, ArticleMarket } from "./types";
import { articlesPartA } from "./partA";
import { articlesPartB } from "./partB";
import { spokeGuides } from "./spokeGuides";
import { generatedArticles } from "./generated";
import { buildMarketUrl } from "@/lib/marketRouting";

const historical: Article[] = [...articlesPartA, ...articlesPartB, ...spokeGuides];
const all: Article[] = [...historical, ...generatedArticles];

export function getArticleMarket(article: Article): ArticleMarket {
  return article.market ?? "GLOBAL";
}

export function getAllArticles(): Article[] {
  return all;
}

export function getGlobalArticles(): Article[] {
  return all.filter((article) => getArticleMarket(article) === "GLOBAL");
}

export function getArticlesForMarket(market: Exclude<ArticleMarket, "GLOBAL">): Article[] {
  return all.filter((article) => {
    const articleMarket = getArticleMarket(article);
    return articleMarket === "GLOBAL" || articleMarket === market;
  });
}

export function getArticlesByCategory(category: string, market?: Exclude<ArticleMarket, "GLOBAL">): Article[] {
  const source = market ? getArticlesForMarket(market) : getGlobalArticles();
  return source.filter((article) => article.category === category);
}

export function getArticlesByTopic(topic: string, market?: Exclude<ArticleMarket, "GLOBAL">): Article[] {
  const source = market ? getArticlesForMarket(market) : getGlobalArticles();
  return source.filter((article) => article.topics?.includes(topic));
}

export function getSpokeGuides(): Article[] {
  return spokeGuides;
}

export function getSupportingArticles(): Article[] {
  return [...articlesPartA, ...articlesPartB];
}

export function getArticleSlugs(): string[] {
  return all.map((a) => a.slug);
}

export function getGlobalArticleSlugs(): string[] {
  return getGlobalArticles().map((article) => article.slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return all.find((a) => a.slug === slug);
}

/** Legacy/internal route path retained for compatibility with the regional route files. */
export function getArticlePath(article: Article): string {
  const market = getArticleMarket(article);
  if (market === "AU") return `/au/articles/${article.slug}/`;
  if (market === "UK") return `/uk/articles/${article.slug}/`;
  return `/articles/${article.slug}/`;
}

/** Public canonical URL. Regional articles live on their canonical domain without /au or /uk prefixes. */
export function getArticleCanonicalUrl(article: Article): string {
  const path = `/articles/${article.slug}`;
  const market = getArticleMarket(article);
  if (market === "AU") return buildMarketUrl("au", path);
  if (market === "UK") return buildMarketUrl("uk", path);
  return buildMarketUrl("global", path);
}

export function getMarketArticleSlugs(market: Exclude<ArticleMarket, "GLOBAL">): string[] {
  return all.filter((article) => getArticleMarket(article) === market).map((article) => article.slug);
}

export const articleCategories = [
  "Packaging guides",
  "Compostable packaging",
  "Packaging regulation & claims",
  "Ecommerce packaging",
  "Custom packaging & design",
  "Industry & market updates",
] as const;
