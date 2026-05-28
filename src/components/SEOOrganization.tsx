import { JsonLd } from "./JsonLd";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export function SEOOrganization() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description:
      "Zero Pack supplies made-to-order custom compostable packaging for ecommerce brands, with a primary focus on custom compostable mailers.",
    areaServed: "Worldwide",
  };
  return <JsonLd data={data} />;
}
