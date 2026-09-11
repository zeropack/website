import { JsonLd } from "./JsonLd";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { buildMarketUrl } from "@/lib/marketRouting";
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
    logo: buildMarketUrl("global", "/og/default.png"),
    email: CONTACT_EMAIL,
    foundingDate: "2018",
    description:
      "Zero Pack supplies made-to-order custom compostable packaging for ecommerce brands, with a primary focus on custom compostable mailers.",
    areaServed: "Worldwide",
    sameAs: [
      "https://www.zeropack.co",
      "https://www.zeropack.au",
      "https://www.zeropack.co.uk",
    ],
  };
  return <JsonLd data={data} />;
}
