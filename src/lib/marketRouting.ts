export type MarketCode = "global" | "au" | "uk" | "us" | "eu" | "ca";

export type MarketRouteConfig = {
  code: MarketCode;
  label: string;
  locale: string;
  currency: string;
  canonicalOrigin: string;
  publicPathPrefix: string;
  canonicalHosts: string[];
  legacyHosts?: string[];
  launched: boolean;
};

export const MARKET_ROUTES: Record<MarketCode, MarketRouteConfig> = {
  global: {
    code: "global",
    label: "Global",
    locale: "en",
    currency: "USD",
    canonicalOrigin: "https://www.zeropack.co",
    publicPathPrefix: "",
    canonicalHosts: ["zeropack.co", "www.zeropack.co"],
    launched: true,
  },
  au: {
    code: "au",
    label: "Australia",
    locale: "en-AU",
    currency: "AUD",
    canonicalOrigin: "https://www.zeropack.au",
    publicPathPrefix: "",
    canonicalHosts: ["zeropack.au", "www.zeropack.au"],
    legacyHosts: ["zeropack.com.au", "www.zeropack.com.au"],
    launched: true,
  },
  uk: {
    code: "uk",
    label: "United Kingdom",
    locale: "en-GB",
    currency: "GBP",
    canonicalOrigin: "https://www.zeropack.co.uk",
    publicPathPrefix: "",
    canonicalHosts: ["zeropack.co.uk", "www.zeropack.co.uk"],
    launched: true,
  },
  us: {
    code: "us",
    label: "United States",
    locale: "en-US",
    currency: "USD",
    canonicalOrigin: "https://www.zeropack.co",
    publicPathPrefix: "/us",
    canonicalHosts: [],
    launched: false,
  },
  eu: {
    code: "eu",
    label: "Europe",
    locale: "en",
    currency: "EUR",
    canonicalOrigin: "https://www.zeropack.co",
    publicPathPrefix: "/eu",
    canonicalHosts: [],
    launched: false,
  },
  ca: {
    code: "ca",
    label: "Canada",
    locale: "en-CA",
    currency: "CAD",
    canonicalOrigin: "https://www.zeropack.co",
    publicPathPrefix: "/ca",
    canonicalHosts: [],
    launched: false,
  },
};

function cleanPath(path: string): string {
  const pathname = path.startsWith("/") ? path : `/${path}`;
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}

function cleanPrefix(prefix: string): string {
  if (!prefix || prefix === "/") return "";
  return `/${prefix.replace(/^\/+|\/+$/g, "")}`;
}

export function normalizeHost(host: string | null | undefined): string {
  return (host ?? "").toLowerCase().split(":")[0];
}

export function getMarketRoute(code: MarketCode): MarketRouteConfig {
  return MARKET_ROUTES[code];
}

export function buildMarketPath(code: MarketCode, path = "/"): string {
  const prefix = cleanPrefix(MARKET_ROUTES[code].publicPathPrefix);
  const pathname = cleanPath(path);
  if (!prefix) return pathname === "/" ? "/" : `${pathname}/`;
  if (pathname === "/") return `${prefix}/`;
  return `${prefix}${pathname}/`;
}

export function buildMarketUrl(code: MarketCode, path = "/"): string {
  const route = MARKET_ROUTES[code];
  return `${route.canonicalOrigin}${buildMarketPath(code, path)}`;
}

export function getMarketFromHost(host: string | null | undefined): MarketCode | null {
  const hostname = normalizeHost(host);
  if (!hostname) return null;

  for (const code of Object.keys(MARKET_ROUTES) as MarketCode[]) {
    const route = MARKET_ROUTES[code];
    if (route.canonicalHosts.includes(hostname) || route.legacyHosts?.includes(hostname)) {
      return code;
    }
  }

  return null;
}

export function getMarketFromGlobalPath(pathname: string): MarketCode | null {
  const firstSegment = cleanPath(pathname).split("/").filter(Boolean)[0]?.toLowerCase();
  if (firstSegment === "us" || firstSegment === "eu" || firstSegment === "ca") return firstSegment;
  return null;
}

export function resolveMarket(host: string | null | undefined, pathname: string): MarketCode {
  const hostMarket = getMarketFromHost(host);
  if (hostMarket && hostMarket !== "global") return hostMarket;

  if (hostMarket === "global") {
    return getMarketFromGlobalPath(pathname) ?? "global";
  }

  return "global";
}

export function marketAlternates(path = "/"): Record<string, string> {
  return {
    "en-AU": buildMarketUrl("au", path),
    "en-GB": buildMarketUrl("uk", path),
    "en-US": buildMarketUrl("us", path),
    "en-CA": buildMarketUrl("ca", path),
    en: buildMarketUrl("eu", path),
    "x-default": buildMarketUrl("global", path),
  };
}
