import type { LeadTier } from "./types";

export type QuoteScoreInput = {
  quantity: string;
  timeline: string;
  website: string;
  artwork: string;
  currentPackaging: string;
  hasCompany: boolean;
};

export function scoreQuoteLead(input: QuoteScoreInput): LeadTier {
  const qty = input.quantity;
  const hotQty = qty === "5000" || qty === "10000" || qty === "25000" || qty === "50000+";
  const warmQty = qty === "2000" || hotQty;
  const hotTime = input.timeline === "ASAP" || input.timeline === "4-8";
  const warmTime = input.timeline === "8-12" || hotTime;
  const hasSite = input.website.trim().length > 5;
  const artworkReady = input.artwork === "yes";
  const plastic =
    input.currentPackaging === "plastic" || input.currentPackaging === "recycled-plastic";

  if (
    hotQty &&
    hotTime &&
    hasSite &&
    artworkReady &&
    plastic &&
    input.hasCompany
  ) {
    return "hot";
  }

  if (warmQty && warmTime && input.hasCompany) {
    return "warm";
  }

  return "cold";
}
