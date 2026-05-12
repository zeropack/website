import type { LeadTier } from "@/lib/types";

/** Optional UI for post-submit or internal previews — tier is also sent to dataLayer / webhook */
export function LeadScoreResult({ tier }: { tier: LeadTier }) {
  const copy: Record<LeadTier, string> = {
    hot: "High-intent lead — fast follow-up recommended.",
    warm: "Qualified lead — confirm specification and timeline.",
    cold: "Early-stage — nurture or guide-led path may fit better.",
  };
  return (
    <p className="rounded-lg bg-mist px-4 py-3 text-sm text-charcoal/80">
      <span className="font-semibold capitalize">{tier}</span>: {copy[tier]}
    </p>
  );
}
