export type SectionTable = {
  headers: string[];
  rows: string[][];
  footnote?: string;
  gated?: boolean;
};

export type GuideSubsection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  numberedList?: string[];
  table?: SectionTable;
  table2?: SectionTable;
  note?: string;
};

export type ArticleSection = {
  id: string;
  heading: string;
  answerBox?: string;
  paragraphs?: string[];
  bullets?: string[];
  numberedList?: string[];
  table?: SectionTable;
  table2?: SectionTable;
  note?: string;
  subsections?: GuideSubsection[];
};

export type HowToStep = {
  name: string;
  text: string;
};

export type ArticleMarket = "GLOBAL" | "AU" | "UK";

export type Article = {
  slug: string;
  title: string;
  category: string;
  description: string;
  publishedAt: string;
  dateModified?: string;
  market?: ArticleMarket;
  jurisdiction?: string[];
  topics?: string[];
  heroImage?: string;
  heroAlt?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  relatedSlugs?: string[];
  pillarPath?: string;
  keyTakeaways?: string[];
  answerBox?: string;
  howToSteps?: HowToStep[];
  isSpokeGuide?: boolean;
  sections: ArticleSection[];
  faqs: { question: string; answer: string }[];
};
