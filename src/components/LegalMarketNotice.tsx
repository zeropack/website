import { headers } from "next/headers";
import { MARKET_ROUTES } from "@/lib/marketRouting";
import { getRequestMarket, type LaunchedMarket } from "@/lib/requestMarket";
import { MarketSwitcher } from "@/components/MarketSwitcher";

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

  return (
    <div
      className={`mt-6 rounded-2xl border p-5 sm:p-6 ${
        hasMismatch ? "border-amber-300 bg-amber-50 text-amber-950" : "border-slate-200 bg-slate-50/80 text-charcoal"
      }`}
      role={hasMismatch ? "alert" : undefined}
    >
      <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${hasMismatch ? "text-amber-900/75" : "text-compost"}`}>
        Market version
      </p>
      <p className="mt-1 text-lg font-semibold">You are viewing the {currentLabel} version of these {noun}.</p>

      {hasMismatch && geoMarket && suggestedLabel ? (
        <>
          <p className="mt-3 text-sm leading-6">
            Your connection appears to be in {suggestedLabel}, but this page is showing the {currentLabel} version. If this quotation or order is for {suggestedLabel}, switch to that version before relying on these {noun}.
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-900/80">
            Location detection can be wrong, including when using a VPN, travelling or connecting through a corporate network. Your selected market and quotation or order details determine which version you should review.
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm leading-6 text-charcoal/70">
          Choose the market that applies to your quotation or order. Network location may be used to suggest a relevant market, but it never changes the legal version automatically. If you are travelling or using a VPN, select the market that applies to your order.
        </p>
      )}

      <MarketSwitcher variant="legal" initialMarket={currentMarket} pathOverride={path} />
    </div>
  );
}
