import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { GuideTemplate } from "@/components/GuideTemplate";
import { brandGuide } from "@/content/guides/brandGuide";

export const metadata: Metadata = buildMetadata({
  title: "Branded Packaging Guide | Eco Friendly Packaging",
  description:
    "The 2026 Branded & Eco Friendly Packaging Guide for ecommerce brands — custom compostable mailers, certification, MOQ, artwork, and quote-ready checklists by Zero Pack.",
  path: brandGuide.path,
  openGraphType: "article",
});

export default function Page() {
  return <GuideTemplate />;
}
