import type { Article } from "./types";
import { articlesPartA } from "./partA";
import { articlesPartB } from "./partB";
import { spokeGuides } from "./spokeGuides";

const all: Article[] = [...articlesPartA, ...articlesPartB, ...spokeGuides];

export function getAllArticles(): Article[] {
  return all;
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

export function getArticleBySlug(slug: string): Article | undefined {
  return all.find((a) => a.slug === slug);
}

export const articleCategories = [
  "Packaging guides",
  "Compostable packaging education",
  "Custom mailer design",
  "Ecommerce packaging",
  "Packaging compliance",
  "Plastic alternatives",
  "Artwork and ordering guidance",
] as const;
