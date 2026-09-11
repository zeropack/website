"use client";

import { useEffect, useState } from "react";

type PublicMarket = "global" | "au" | "uk";

type StoredPreference = {
  market: PublicMarket;
  expiresAt: number;
};

const STORAGE_KEY = "zp-market-preference-v1";
const PREFERENCE_TTL_MS = 180 * 24 * 60 * 60 * 1000;

const MARKET_DETAILS: Record<PublicMarket, { label: string; origin: string }> = {
  au: { label: "Australia", origin: "https://www.zeropack.au" },
  uk: { label: "United Kingdom", origin: "https://www.zeropack.co.uk" },
  global: { label: "Global", origin: "https://www.zeropack.co" },
};

const LEGAL_PATHS = ["/terms/", "/terms-of-sale/", "/terms-of-use/", "/shipping/", "/refunds/", "/privacy/"];

function isPublicMarket(value: string | null): value is PublicMarket {
  return value === "global" || value === "au" || value === "uk";
}

function marketFromHostname(hostname: string): PublicMarket {
  const host = hostname.toLowerCase();
  if (host === "zeropack.au" || host === "www.zeropack.au" || host === "zeropack.com.au" || host === "www.zeropack.com.au") return "au";
  if (host === "zeropack.co.uk" || host === "www.zeropack.co.uk") return "uk";
  return "global";
}

function isLegalMarketPage(pathname: string): boolean {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return LEGAL_PATHS.includes(normalized);
}

function readPreference(): StoredPreference | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredPreference>;
    if (!isPublicMarket(parsed.market ?? null) || typeof parsed.expiresAt !== "number") return null;
    if (parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed as StoredPreference;
  } catch {
    return null;
  }
}

function savePreference(market: PublicMarket) {
  try {
    const preference: StoredPreference = {
      market,
      expiresAt: Date.now() + PREFERENCE_TTL_MS,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
  } catch {
    // Preference storage is optional; the site remains fully usable without it.
  }
}

function suggestionFromCountry(country: string | null): PublicMarket | null {
  if (country === "AU") return "au";
  if (country === "GB") return "uk";
  return null;
}

export function MarketExperience() {
  const [suggestedMarket, setSuggestedMarket] = useState<PublicMarket | null>(null);
  const [currentMarket, setCurrentMarket] = useState<PublicMarket>("global");

  useEffect(() => {
    // Legal/policy pages provide their own stronger market-version warning and selector.
    if (isLegalMarketPage(window.location.pathname)) return;

    const current = marketFromHostname(window.location.hostname);
    setCurrentMarket(current);

    const url = new URL(window.location.href);
    const explicitMarket = url.searchParams.get("market");

    if (isPublicMarket(explicitMarket)) {
      savePreference(explicitMarket);
      url.searchParams.delete("market");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      return;
    }

    const saved = readPreference();
    if (saved) return;

    let cancelled = false;
    fetch("/api/market", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { country?: string | null } | null) => {
        if (cancelled) return;
        const suggestion = suggestionFromCountry(payload?.country ?? null);
        if (!suggestion || suggestion === current) return;
        setSuggestedMarket(suggestion);
      })
      .catch(() => {
        // Geo suggestion is progressive enhancement only.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!suggestedMarket) return null;

  const activeSuggestedMarket = suggestedMarket;
  const suggested = MARKET_DETAILS[activeSuggestedMarket];

  function stayHere() {
    savePreference(currentMarket);
    setSuggestedMarket(null);
  }

  function visitSuggestedMarket() {
    savePreference(activeSuggestedMarket);
    const currentUrl = new URL(window.location.href);
    const target = new URL(currentUrl.pathname, suggested.origin);

    for (const [key, value] of currentUrl.searchParams.entries()) {
      if (key !== "market") target.searchParams.append(key, value);
    }
    target.searchParams.set("market", activeSuggestedMarket);
    target.hash = currentUrl.hash;

    window.location.assign(target.toString());
  }

  return (
    <aside
      className="fixed left-4 right-4 top-[calc(var(--site-header-height)+1rem)] z-30 rounded-xl border border-black/10 bg-white p-4 shadow-lg sm:left-auto sm:right-6 sm:max-w-md"
      aria-label="Regional website suggestion"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-compost">Zero Pack {suggested.label}</p>
          <p className="mt-1 text-sm leading-relaxed text-charcoal/75">
            It looks like you may be in {suggested.label}. Visit the regional site for localised content and market information.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={visitSuggestedMarket}
              className="rounded-md bg-air px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0096d6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-air"
            >
              Visit {suggested.label}
            </button>
            <button
              type="button"
              onClick={stayHere}
              className="rounded-md border border-black/10 px-3 py-2 text-xs font-semibold text-charcoal transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-compost"
            >
              Stay here
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={stayHere}
          aria-label="Dismiss regional website suggestion"
          className="rounded-md p-1 text-charcoal/50 transition hover:bg-black/5 hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-compost"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
