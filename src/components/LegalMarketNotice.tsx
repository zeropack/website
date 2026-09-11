import { headers } from "next/headers";
import { buildMarketUrl, MARKET_ROUTES } from "@/lib/marketRouting";
import { getRequestMarket, type LaunchedMarket } from "@/lib/requestMarket";

type Props = {
  path: string;
  noun?: string;
};

function geoMarketFromCountry(country: string | null): LaunchedMarket | null {
  if (!country) return null;
  const code = country.trim().toUpperCase();
  if (code === "AU") return "au";
  if (code === "GB" || code === "UK") return "uk";
  return null;
}

export async function LegalMarketNotice({ path, noun = "terms" }: Props) {
  const requestHeaders = await headers();
  const currentMarket = await getRequestMarket();
  const geoMarket = geoMarketFromCountry(requestHeaders.get("x-vercel-ip-country"));
  const hasMismatch = Boolean(geoMarket && geoMarket !== currentMarket);

  const currentLabel = MARKET_ROUTES[currentMarket].label;
  const suggestedLabel = geoMarket ? MARKET_ROUTES[geoMarket].label : null;

  const options: Array<{ code: LaunchedMarket; label: string }> = [
    { code: "au", label: "Australia" },
    { code: "uk", label: "United Kingdom" },
    { code: "global", label: "Global" },
  ];

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-compost">Market version</p>
            <p className="mt-1 text-lg font-semibold text-charcoal">You are viewing the {currentLabel} version of these {noun}.</p>
          </div>
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-charcoal/70">
            {currentLabel}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-charcoal/70">
          Choose the market that applies to your quotation or order. Network location is used only to suggest a relevant market and never changes the legal version automatically.
        </p>

        <div className="mt-4 flex flex-wrap gap-2" aria-label="Choose legal market version">
          {options.map((option) => {
            const active = option.code === currentMarket;
            return (
              <a
                key={option.code}
                href={buildMarketUrl(option.code, path)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-slate-300 bg-white text-charcoal hover:border-charcoal/50"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {option.label}
              </a>
            );
          })}
        </div>
      </div>

      {hasMismatch && geoMarket && suggestedLabel ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950 sm:p-6" role="alert">
          <p className="font-semibold">Your network location and selected market do not match.</p>
          <p className="mt-1">
            Your connection appears to be in {suggestedLabel}, but this page is showing the {currentLabel} version. If this quotation or order is for {suggestedLabel}, review the {suggestedLabel} version before relying on these {noun}.
          </p>
          <p className="mt-2 text-amber-900/80">
            Location detection can be wrong, including when using a VPN, travelling or connecting through a corporate network. You can always choose the correct market manually above.
          </p>
          <a
            href={buildMarketUrl(geoMarket, path)}
            className="mt-4 inline-flex rounded-full bg-charcoal px-4 py-2 font-semibold text-white transition hover:bg-charcoal/90"
          >
            View {suggestedLabel} version
          </a>
        </div>
      ) : null}
    </div>
  );
}
