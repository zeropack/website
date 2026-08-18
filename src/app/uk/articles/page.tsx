import type { Metadata } from "next";
import { RegionalArticlesPage } from "@/components/RegionalArticlesPage";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "UK Articles | Packaging Guides & Market Updates",
  description:
    "UK packaging guidance, regulation and market updates from Zero Pack, plus global guides relevant to ecommerce and packaging teams.",
  path: "/uk/articles/",
});

export default function Page() {
  return <RegionalArticlesPage market="UK" marketName="United Kingdom" />;
}
