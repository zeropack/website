export type RegionCode = "au" | "uk" | "us" | "eu";

export type SeoConfig = {
  title: string;
  description: string;
  /** Path only, e.g. /au/custom-compostable-mailers/ */
  canonicalPath: string;
  ogImagePath?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type CaseStudyCard = {
  id: string;
  brandName: string;
  industry: string;
  packagingType: string;
  quantity?: string;
  designGoal: string;
  result: string;
  /** Placeholder cards: set true; shown only in dev UI comment per spec */
  isPlaceholder?: boolean;
  testimonial?: string;
};

export type RegionConfig = {
  regionName: string;
  countryCode: string;
  locale: string;
  currency: string;
  defaultCTA: string;
  quoteEmail: string;
  phone?: string;
  certificationNotes: string[];
  shippingNotes: string[];
  moqNotes: string;
  leadTimeNotes: string;
  legalDisclaimer: string;
  testimonials: { quote: string; attribution?: string; isPlaceholder?: boolean }[];
  caseStudies: CaseStudyCard[];
  faqs: FaqItem[];
  seo: Partial<Record<string, SeoConfig>>;
};

export type LeadTier = "hot" | "warm" | "cold";

export type QuotePayload = {
  tier: LeadTier;
  region: RegionCode | "global";
  productType: string;
  quantity: string;
  timeline: string;
  artwork: string;
  website: string;
  currentPackaging: string;
  /** UTM + attribution */
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  first_touch?: string;
  last_touch?: string;
};
