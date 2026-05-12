import type { Article } from "./types";
import { articlesPartA } from "./partA";
import { articlesPartB } from "./partB";

const all: Article[] = [...articlesPartA, ...articlesPartB];

export function getAllArticles(): Article[] {
  return all;
}

export function getArticleSlugs(): string[] {
  return all.map((a) => a.slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return all.find((a) => a.slug === slug);
}

export const articleCategories = [
  "Compostable packaging education",
  "Custom mailer design",
  "Ecommerce packaging",
  "Packaging compliance",
  "Plastic alternatives",
  "Artwork and ordering guidance",
] as const;
