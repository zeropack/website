import type { Metadata } from "next";
import { GuideTemplate } from "@/components/GuideTemplate";
import { brandGuide } from "@/content/guides/brandGuide";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

export async function generateMetadata(): Promise<Metadata> {
  const market = await getRequestMarket();
  const description =
    market === "uk"
      ? "Download Zero Pack's free guide to choosing, planning and briefing custom compostable packaging for UK brands, retailers and organisations."
      : market === "au"
        ? "Download Zero Pack's free guide to choosing, planning and briefing custom compostable packaging for Australian brands, retailers and organisations."
        : "Download Zero Pack's free guide to choosing, planning and briefing custom compostable packaging for brands, retailers and organisations.";

  return buildMarketPageMetadata({
    market,
    title: "Custom Compostable Packaging Guide | Free Download",
    description,
    path: brandGuide.path,
  });
}

export default async function Page() {
  const market = await getRequestMarket();
  return <GuideTemplate market={market} />;
}
