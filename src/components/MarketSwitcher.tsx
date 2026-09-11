"use client";

import { useEffect, useId, useState } from "react";

type PublicMarket = "global" | "au" | "uk";

type Props = {
  variant?: "footer" | "legal";
  initialMarket?: PublicMarket;
  pathOverride?: string;
};

const OPTIONS: Array<{ code: PublicMarket; label: string; origin: string }> = [
  { code: "au", label: "Australia", origin: "https://www.zeropack.au" },
  { code: "uk", label: "United Kingdom", origin: "https://www.zeropack.co.uk" },
  { code: "global", label: "Global", origin: "https://www.zeropack.co" },
];

function marketFromHostname(hostname: string): PublicMarket {
  const host = hostname.toLowerCase();
  if (host === "zeropack.au" || host === "www.zeropack.au" || host === "zeropack.com.au" || host === "www.zeropack.com.au") return "au";
  if (host === "zeropack.co.uk" || host === "www.zeropack.co.uk") return "uk";
  return "global";
}

export function MarketSwitcher({ variant = "footer", initialMarket, pathOverride }: Props) {
  const selectId = useId();
  const [current, setCurrent] = useState<PublicMarket>(initialMarket ?? "global");

  useEffect(() => {
    if (!initialMarket) setCurrent(marketFromHostname(window.location.hostname));
  }, [initialMarket]);

  function switchMarket(next: PublicMarket) {
    const option = OPTIONS.find((item) => item.code === next);
    if (!option) return;

    const currentUrl = new URL(window.location.href);
    const target = new URL(pathOverride ?? currentUrl.pathname, option.origin);

    for (const [key, value] of currentUrl.searchParams.entries()) {
      if (key !== "market") target.searchParams.append(key, value);
    }
    target.searchParams.set("market", next);
    target.hash = currentUrl.hash;

    window.location.assign(target.toString());
  }

  const legal = variant === "legal";

  return (
    <div className={legal ? "mt-4 max-w-sm" : "mt-6 max-w-xs"}>
      <label
        htmlFor={selectId}
        className={legal ? "block text-xs font-semibold uppercase tracking-wide text-amber-950/70" : "block text-xs font-semibold uppercase tracking-wide text-leaf"}
      >
        {legal ? "Terms market" : "Region"}
      </label>
      <select
        id={selectId}
        value={current}
        onChange={(event) => switchMarket(event.target.value as PublicMarket)}
        className={
          legal
            ? "mt-2 w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-charcoal outline-none transition hover:border-amber-400 focus:border-charcoal focus:ring-2 focus:ring-charcoal/20"
            : "mt-2 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none transition hover:bg-white/15 focus:border-leaf focus:ring-2 focus:ring-leaf/40"
        }
        aria-label={legal ? "Choose the market version for these terms" : "Choose your Zero Pack region"}
      >
        {OPTIONS.map((option) => (
          <option key={option.code} value={option.code} className="text-charcoal">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
