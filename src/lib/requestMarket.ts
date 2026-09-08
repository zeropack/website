import { headers } from "next/headers";
import { buildMetadata } from "@/lib/metadata";
import {
  MARKET_ROUTES,
  buildMarketUrl,
  getMarketFromHost,
  launchedMarketAlternates,
} from "@/lib/marketRouting";

export type LaunchedMarket = "global" | "au" | "uk";

export async function getRequestMarket(): Promise<LaunchedMarket> {
  const requestHeaders = await headers();
  const market = getMarketFromHost(requestHeaders.get("host"));
  return market === "au" || market === "uk" ? market : "global";
}

export function buildMarketPageMetadata({
  market,
  title,
  description,
  path,
}: {
  market: LaunchedMarket;
  title: string;
  description: string;
  path: string;
}) {
  return buildMetadata({
    title,
    description,
    path,
    canonicalUrl: buildMarketUrl(market, path),
    hreflang: launchedMarketAlternates(path),
    locale: MARKET_ROUTES[market].locale,
  });
}
