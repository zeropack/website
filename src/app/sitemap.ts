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
    "/packaging-guide/",
    "/articles/",
    "/contact/",
    "/privacy/",
    "/terms/",
    "/au/",
    "/uk/",
    "/us/",
    "/eu/",
    "/au/custom-compostable-mailers/",
    "/uk/custom-compostable-mailers/",
    "/us/custom-compostable-mailers/",
    "/eu/custom-compostable-mailers/",
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
