import Link from "next/link";
import type { Article } from "@/content/articles/types";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}/`}
      className="group flex flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-leaf">{article.category}</p>
      <h3 className="mt-2 font-heading text-lg font-semibold text-charcoal group-hover:text-compost">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-charcoal/70">{article.description}</p>
      <p className="mt-4 text-sm font-semibold text-air">Read article</p>
    </Link>
  );
}
