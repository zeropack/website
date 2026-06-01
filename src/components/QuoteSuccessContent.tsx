"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CTAButton } from "./CTAButton";
import { LeadScoreResult } from "./LeadScoreResult";
import type { LeadTier } from "@/lib/types";

type Summary = {
  productType?: string;
  quantity?: string;
  region?: string;
  timeline?: string;
  artwork?: string;
  tier?: string;
};

function SuccessInner() {
  const searchParams = useSearchParams();
  const data: Summary = {
    productType: searchParams.get("productType") ?? undefined,
    quantity: searchParams.get("quantity") ?? undefined,
    region: searchParams.get("region") ?? undefined,
    timeline: searchParams.get("timeline") ?? undefined,
    artwork: searchParams.get("artwork") ?? undefined,
    tier: searchParams.get("tier") ?? undefined,
  };
  const hasSummary = data.productType || data.quantity || data.region;

  return (
    <section className="bg-stone py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-charcoal">Thanks — we’ve received your custom packaging request.</h1>
        <p className="mt-4 text-charcoal/75">
          We’ll review your packaging details and come back with the next steps. If anything is missing, we’ll ask for
          the details needed to prepare a more accurate quote.
        </p>

        {hasSummary ? (
          <div className="mt-10 rounded-2xl border border-black/5 bg-white p-6">
            <p className="text-sm font-semibold text-compost">Summary</p>
            <dl className="mt-4 space-y-2 text-sm text-charcoal/80">
              {data.productType ? (
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-charcoal">Product type</dt>
                  <dd className="text-right">{data.productType}</dd>
                </div>
              ) : null}
              {data.quantity ? (
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-charcoal">Quantity</dt>
                  <dd className="text-right">{data.quantity}</dd>
                </div>
              ) : null}
              {data.region ? (
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-charcoal">Region</dt>
                  <dd className="text-right">{data.region.toUpperCase()}</dd>
                </div>
              ) : null}
              {data.timeline ? (
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-charcoal">Timeline</dt>
                  <dd className="text-right">{data.timeline}</dd>
                </div>
              ) : null}
              {data.artwork ? (
                <div className="flex justify-between gap-4">
                  <dt className="font-medium text-charcoal">Artwork status</dt>
                  <dd className="text-right">{data.artwork}</dd>
                </div>
              ) : null}
            </dl>
            {data.tier === "hot" || data.tier === "warm" || data.tier === "cold" ? (
              <div className="mt-6">
                <LeadScoreResult tier={data.tier as LeadTier} />
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-10 rounded-2xl border border-black/5 bg-white p-6">
          <p className="text-sm font-semibold text-compost">Next steps</p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-charcoal/80">
            <li>We review your request</li>
            <li>We confirm any missing details</li>
            <li>We prepare quote guidance</li>
            <li>You approve the next step</li>
          </ol>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/packaging-guide/download/" variant="secondary">
            Download the Guide
          </CTAButton>
          <Link className="text-sm font-semibold text-air hover:underline" href="/">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}

export function QuoteSuccessContent() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-center text-sm text-charcoal/60">Loading…</p>}>
      <SuccessInner />
    </Suspense>
  );
}
