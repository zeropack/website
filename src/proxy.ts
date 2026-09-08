import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { normalizeHost } from "@/lib/marketRouting";

const AU_HOSTS = new Set(["zeropack.au", "www.zeropack.au"]);
const AU_LEGACY_HOSTS = new Set(["zeropack.com.au", "www.zeropack.com.au"]);
const UK_HOSTS = new Set(["zeropack.co.uk", "www.zeropack.co.uk"]);
const GLOBAL_HOSTS = new Set(["zeropack.co", "www.zeropack.co"]);

const REGIONAL_PUBLIC_ROUTES = new Set(["/", "/custom-compostable-mailers"]);

function withoutTrailingSlash(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}

function redirectToOrigin(request: NextRequest, origin: string, pathname: string) {
  const target = new URL(request.url);
  target.protocol = "https:";
  target.host = new URL(origin).host;
  target.pathname = pathname;
  return NextResponse.redirect(target, 308);
}

function rewriteTo(request: NextRequest, pathname: string) {
  const target = request.nextUrl.clone();
  target.pathname = pathname;
  return NextResponse.rewrite(target);
}

function rewriteRegionalRoute(request: NextRequest, region: "au" | "uk") {
  const pathname = withoutTrailingSlash(request.nextUrl.pathname);
  if (!REGIONAL_PUBLIC_ROUTES.has(pathname)) return null;

  return rewriteTo(request, pathname === "/" ? `/${region}/` : `/${region}${pathname}/`);
}

export function proxy(request: NextRequest) {
  const host = normalizeHost(request.headers.get("host"));
  const pathname = withoutTrailingSlash(request.nextUrl.pathname);

  // Consolidate the secondary Australian ccTLD onto the chosen AU canonical domain.
  if (AU_LEGACY_HOSTS.has(host)) {
    return redirectToOrigin(request, "https://www.zeropack.au", request.nextUrl.pathname);
  }

  // Existing path-based AU/UK routes on the global domain become migration sources.
  if (GLOBAL_HOSTS.has(host) && (pathname === "/au" || pathname.startsWith("/au/"))) {
    const destinationPath = pathname.replace(/^\/au(?=\/|$)/, "") || "/";
    return redirectToOrigin(request, "https://www.zeropack.au", destinationPath);
  }

  if (GLOBAL_HOSTS.has(host) && (pathname === "/uk" || pathname.startsWith("/uk/"))) {
    const destinationPath = pathname.replace(/^\/uk(?=\/|$)/, "") || "/";
    return redirectToOrigin(request, "https://www.zeropack.co.uk", destinationPath);
  }

  if (AU_HOSTS.has(host)) {
    if (pathname === "/sitemap.xml") return rewriteTo(request, "/market-seo/au/sitemap");
    if (pathname === "/robots.txt") return rewriteTo(request, "/market-seo/au/robots");
    return rewriteRegionalRoute(request, "au") ?? NextResponse.next();
  }

  if (UK_HOSTS.has(host)) {
    if (pathname === "/sitemap.xml") return rewriteTo(request, "/market-seo/uk/sitemap");
    if (pathname === "/robots.txt") return rewriteTo(request, "/market-seo/uk/robots");
    return rewriteRegionalRoute(request, "uk") ?? NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2)$).*)",
  ],
};
