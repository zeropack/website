export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Article = {
  slug: string;
  title: string;
  category: string;
  description: string;
  publishedAt: string;
  sections: ArticleSection[];
  faqs: { question: string; answer: string }[];
};
