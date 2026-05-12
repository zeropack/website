import Link from "next/link";
import type { CaseStudyCard as CaseStudy } from "@/lib/types";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="flex flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      {/* Placeholder case study — replace copy and imagery when verified examples are available */}
      <h3 className="mt-1 font-heading text-xl font-semibold text-compost">{study.brandName}</h3>
      <p className="text-sm text-charcoal/60">
        {study.industry} · {study.packagingType}
      </p>
      {study.quantity ? (
        <p className="mt-2 text-sm text-charcoal/70">Quantity: {study.quantity}</p>
      ) : null}
      <p className="mt-4 text-sm text-charcoal/75">
        <span className="font-semibold text-charcoal">Goal: </span>
        {study.designGoal}
      </p>
      <p className="mt-2 text-sm text-charcoal/75">
        <span className="font-semibold text-charcoal">Outcome: </span>
        {study.result}
      </p>
      {study.testimonial ? (
        <blockquote className="mt-4 border-l-2 border-leaf pl-4 text-sm italic text-charcoal/80">
          {study.testimonial}
        </blockquote>
      ) : null}
      <div className="mt-6">
        <Link
          className="text-sm font-semibold text-compost underline-offset-4 hover:underline"
          href="/quote/"
        >
          Request Similar Packaging
        </Link>
      </div>
    </article>
  );
}
