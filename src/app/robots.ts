import type { MetadataRoute } from "next";
import { MARKET_ROUTES } from "@/lib/marketRouting";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${MARKET_ROUTES.global.canonicalOrigin}/sitemap.xml`,
  };
}
