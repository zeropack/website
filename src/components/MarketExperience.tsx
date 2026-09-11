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
    const current = marketFromHostname(window.location.hostname);
    setCurrentMarket(current);

    const url = new URL(window.location.href);
    const explicitMarket = url.searchParams.get("market");

    // Cross-domain selectors use this short-lived query bridge so an explicit
    // user choice can be persisted independently on the destination domain.
    if (isPublicMarket(explicitMarket)) {
      savePreference(explicitMarket);
      url.searchParams.delete("market");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }

    // Legal/policy pages provide their own stronger market-version warning.
    // We still process the explicit market bridge above so a manual legal-page
    // choice is remembered without showing a second GEO suggestion.
    if (isLegalMarketPage(window.location.pathname)) return;

    if (isPublicMarket(explicitMarket)) return;

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
        // GEO suggestion is progressive enhancement only.
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
      className="fixed left-3 right-3 top-[calc(var(--site-header-height)+0.75rem)] z-40 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950 shadow-xl sm:left-1/2 sm:right-auto sm:w-[50vw] sm:max-w-3xl sm:-translate-x-1/2 sm:p-6"
      aria-label="Regional website suggestion"
      role="status"
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">It looks like you may be in {suggested.label}.</p>
          <p className="mt-2 text-sm leading-relaxed text-amber-900/85">
            You are currently viewing the {MARKET_DETAILS[currentMarket].label} site. Switch to {suggested.label} for localised content and market information, or stay here if this is the site you intended to use.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-amber-900/70">
            Location detection can be wrong when using a VPN, travelling or connecting through a corporate network.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={visitSuggestedMarket}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Visit {suggested.label}
            </button>
            <button
              type="button"
              onClick={stayHere}
              className="rounded-md border border-amber-400 bg-white px-4 py-2 text-sm font-semibold text-charcoal transition hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
            >
              Stay here
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={stayHere}
          aria-label="Dismiss regional website suggestion"
          className="rounded-md p-1 text-amber-950/50 transition hover:bg-amber-100 hover:text-amber-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
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
