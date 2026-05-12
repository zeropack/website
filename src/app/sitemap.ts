import type { MetadataRoute } from "next";
import { getArticleSlugs } from "@/content/articles";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  const staticPaths = [
    "/",
    "/au/",
    "/uk/",
    "/us/",
    "/eu/",
    "/custom-compostable-mailers/",
    "/au/custom-compostable-mailers/",
    "/uk/custom-compostable-mailers/",
    "/us/custom-compostable-mailers/",
    "/eu/custom-compostable-mailers/",
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
