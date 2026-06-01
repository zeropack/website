import type { ArticleSection } from "@/content/articles/types";

export type BrandGuide = {
  slug: string;
  path: string;
  title: string;
  subtitle: string;
  tagline: string;
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  pdfFilename: string;
  publishedAt: string;
  dateModified: string;
  whatsInside: readonly string[];
  sections: ArticleSection[];
  faqs: { question: string; answer: string }[];
};
