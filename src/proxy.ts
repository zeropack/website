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

function rewriteRegionalRoute(request: NextRequest, region: "au" | "uk") {
  const pathname = withoutTrailingSlash(request.nextUrl.pathname);
  if (!REGIONAL_PUBLIC_ROUTES.has(pathname)) return null;

  const target = request.nextUrl.clone();
  target.pathname = pathname === "/" ? `/${region}/` : `/${region}${pathname}/`;
  return NextResponse.rewrite(target);
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

  // Keep the public regional URL clean while reusing the existing internal regional pages.
  if (AU_HOSTS.has(host)) {
    return rewriteRegionalRoute(request, "au") ?? NextResponse.next();
  }

  if (UK_HOSTS.has(host)) {
    return rewriteRegionalRoute(request, "uk") ?? NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2)$).*)",
  ],
};
