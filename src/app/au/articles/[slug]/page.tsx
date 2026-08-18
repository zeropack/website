import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticleMarket, getArticlePath, getMarketArticleSlugs } from "@/content/articles";
import { ArticleTemplate } from "@/components/ArticleTemplate";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getMarketArticleSlugs("AU").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || getArticleMarket(article) !== "AU") return {};
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: getArticlePath(article),
    openGraphType: "article",
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || getArticleMarket(article) !== "AU") notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Australia", href: "/au/" },
          { name: "Articles", href: "/au/articles/" },
          { name: article.title, href: getArticlePath(article) },
        ]}
      />
      <ArticleTemplate article={article} />
    </>
  );
}
