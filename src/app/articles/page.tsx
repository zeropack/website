import type { Metadata } from "next";
import Link from "next/link";
import { getSpokeGuides, getSupportingArticles } from "@/content/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { buildMetadata } from "@/lib/metadata";
import { brandGuide } from "@/content/guides/brandGuide";

export const metadata: Metadata = buildMetadata({
  title: "Articles | Compostable Packaging & Branded Packaging Guides",
  description:
    "Education on branded packaging, eco friendly packaging, custom compostable mailers, fulfilment, compliance and artwork — built for B2B buyers.",
  path: "/articles/",
});

export default function Page() {
  const spokeGuides = getSpokeGuides();
  const supporting = getSupportingArticles();

  return (
    <section className="bg-stone py-14 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Articles & guides</h1>
        <p className="mt-4 max-w-3xl text-lg text-charcoal/75">
          Practical guides on branded packaging, eco friendly packaging, custom compostable mailers, fulfilment,
          compliance and artwork — written for ecommerce and operations teams.
        </p>

        <div className="mt-12 rounded-2xl border border-air/25 bg-gradient-to-br from-[#f4f7fb] via-white to-[#eef6f3] p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-compost">Pillar guide</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{brandGuide.title}</h2>
          <p className="mt-3 max-w-2xl text-charcoal/75">{brandGuide.tagline}</p>
          <p className="mt-6">
            <Link
              className="inline-flex rounded-full bg-air px-5 py-2.5 text-sm font-semibold text-white hover:bg-air/90"
              href={brandGuide.path}
            >
              Read the full guide
            </Link>
          </p>
        </div>

        <div className="mt-14">
          <h2 className="font-heading text-xl font-semibold text-charcoal">Packaging guides</h2>
          <p className="mt-2 max-w-2xl text-sm text-charcoal/70">
            Practical guides on compostable packaging, branded mailers, ecommerce fulfilment and sustainability claims — for brands planning their next packaging move.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spokeGuides.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-heading text-xl font-semibold text-charcoal">Supporting articles</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {supporting.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
