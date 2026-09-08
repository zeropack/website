import type { MetadataRoute } from "next";
import { getAllArticles, getArticlePath } from "@/content/articles";
import { MARKET_ROUTES } from "@/lib/marketRouting";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = MARKET_ROUTES.global.canonicalOrigin;
  const lastModified = new Date();

  // Global/default sitemap only. AU and UK have hostname-specific sitemaps;
  // future US/EU/CA routes stay out of discovery until those markets launch.
  const staticPaths = [
    "/",
    "/trend-packaging-funnel/",
    "/custom-compostable-mailers/",
    "/custom-compostable-packaging/",
    "/how-it-works/",
    "/customer-showcase/",
    "/about/",
    "/quote/",
    "/packaging-guide/",
    "/articles/",
    "/contact/",
    "/privacy/",
    "/terms/",
  ];

  const articles = getAllArticles()
    .filter((article) => !getArticlePath(article).startsWith("/au/") && !getArticlePath(article).startsWith("/uk/"))
    .map((article) => ({
      url: `${base}${getArticlePath(article)}`,
      lastModified,
    }));

  return [
    ...staticPaths.map((path) => ({
      url: `${base}${path}`,
      lastModified,
    })),
    ...articles,
  ];
}
