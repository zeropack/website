import type { Metadata } from "next";
import { getAllArticles, articleCategories } from "@/content/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Articles | Compostable Packaging & Ecommerce Guidance",
  description:
    "Education on compostable packaging, custom mailer design, ecommerce fulfilment, compliance and artwork preparation — built for B2B buyers.",
  path: "/articles/",
});

export default function Page() {
  const articles = getAllArticles();

  return (
    <section className="bg-stone py-14 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">Articles</h1>
        <p className="mt-4 max-w-3xl text-lg text-charcoal/75">
          Practical guides on compostable packaging, custom mailers, fulfilment, compliance and artwork — written for
          ecommerce and operations teams.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {articleCategories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-charcoal/70"
            >
              {c}
            </span>
          ))}
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
