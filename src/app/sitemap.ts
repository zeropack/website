import type { MetadataRoute } from "next";
import { getArticleSlugs } from "@/content/articles";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  const staticPaths = [
    "/",
    "/trend-packaging-funnel/",
    "/custom-compostable-mailers/",
    "/custom-compostable-packaging/",
    "/how-it-works/",
    "/customer-showcase/",
    "/about/",
    "/quote/",
    "/quote/success/",
    "/packaging-guide/",
    "/packaging-guide/thank-you/",
    "/articles/",
    "/contact/",
    "/privacy/",
    "/terms/",
  ];

  const articles = getArticleSlugs().map((slug) => ({
    url: `${base}/articles/${slug}/`,
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
