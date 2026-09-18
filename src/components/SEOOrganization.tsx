import { JsonLd } from "./JsonLd";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { buildMarketUrl, MARKET_ROUTES } from "@/lib/marketRouting";
import { getRequestMarket } from "@/lib/requestMarket";

export async function SEOWebSite() {
  const market = await getRequestMarket();
  const url = buildMarketUrl(market, "/");
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url,
    description:
      "Made-to-order custom compostable packaging and mailers for ecommerce brands worldwide.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: buildMarketUrl("global", "/"),
    },
  };
  return <JsonLd data={data} />;
}

export function SEOOrganization() {
  const globalUrl = buildMarketUrl("global", "/");
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: globalUrl,
    logo: `${MARKET_ROUTES.global.canonicalOrigin}/og/default.png`,
    email: CONTACT_EMAIL,
    foundingDate: "2018",
    description:
      "Zero Pack is a specialist B2B supplier of made-to-order custom compostable packaging, helping businesses develop certified compostable alternatives to conventional plastic packaging.",
    areaServed: "Worldwide",
    sameAs: [
      "https://www.zeropack.co",
      "https://www.zeropack.au",
      "https://www.zeropack.co.uk",
    ],
  };
  return <JsonLd data={data} />;
}
