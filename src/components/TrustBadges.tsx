import type { ReactElement } from "react";

type Badge = {
  text: string;
  description: string;
  icon: (props: { className?: string }) => ReactElement;
};

function AwardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <circle cx="12" cy="8" r="5" />
      <path d="m9 13 1.5 8L12 19l1.5 2L15 13" />
    </svg>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
      <path d="M12 21V12M3 7.5 12 12m9-4.5L12 12" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

const badges: Badge[] = [
  {
    icon: AwardIcon,
    text: "AS5810 certified",
    description: "Home compostable certification standard",
  },
  {
    icon: PackageIcon,
    text: "Made to order from 2,000 units",
    description: "Practical MOQ for growing ecommerce brands",
  },
  {
    icon: GlobeIcon,
    text: "Shipped worldwide",
    description: "Global fulfilment support for ecommerce-led brands",
  },
  {
    icon: CheckIcon,
    text: "Quote response in 48 hours",
    description: "Fast, clear guidance before production",
  },
];

export function TrustBadges({ variant = "default" }: { variant?: "default" | "climate" }) {
  const isClimate = variant === "climate";

  return (
    <section className={isClimate ? "border-y border-slate-800/80 bg-charcoal py-8 sm:py-10" : "bg-white py-8 sm:py-10"}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => (
            <div
              key={badge.text}
              className={
                isClimate
                  ? "zp-hover-lift rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition-colors hover:border-air/30 hover:bg-white/10"
                  : "zp-hover-lift rounded-2xl border border-slate-200 bg-white p-5 text-center hover:border-air/40"
              }
            >
              <div
                className={
                  isClimate
                    ? "mx-auto inline-flex rounded-full bg-air/15 p-3 text-air"
                    : "mx-auto inline-flex rounded-full bg-mist p-3 text-compost"
                }
              >
                <badge.icon className="h-6 w-6" />
              </div>
              <p className={isClimate ? "mt-3 text-sm font-semibold text-white" : "mt-3 text-sm font-semibold text-charcoal"}>
                {badge.text}
              </p>
              <p className={isClimate ? "mt-1 text-xs text-white/75" : "mt-1 text-xs text-charcoal/65"}>{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
