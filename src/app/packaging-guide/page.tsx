import type { Metadata } from "next";
import { GuideTemplate } from "@/components/GuideTemplate";
import { brandGuide } from "@/content/guides/brandGuide";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  const description =
    market === "uk"
      ? "The Zero Pack branded packaging guide for UK ecommerce brands — custom compostable mailers, certification, MOQ, artwork and quote-ready planning."
      : market === "au"
        ? "The Zero Pack branded packaging guide for Australian ecommerce brands — custom compostable mailers, certification, MOQ, artwork and quote-ready planning."
        : "The 2026 Branded & Eco Friendly Packaging Guide for ecommerce brands — custom compostable mailers, certification, MOQ, artwork and quote-ready checklists by Zero Pack.";

  return buildMarketPageMetadata({
    market,
    title: "Branded Packaging Guide | Eco Friendly Packaging",
    description,
    path: brandGuide.path,
  });
}

export default function Page() {
  return <GuideTemplate />;
}
