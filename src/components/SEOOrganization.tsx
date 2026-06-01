import { JsonLd } from "./JsonLd";
import { absoluteUrl, CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export function SEOWebSite() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description:
      "Made-to-order custom compostable packaging and mailers for ecommerce brands worldwide.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };
  return <JsonLd data={data} />;
}

export function SEOOrganization() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/og/default.png"),
    email: CONTACT_EMAIL,
    foundingDate: "2018",
    description:
      "Zero Pack supplies made-to-order custom compostable packaging for ecommerce brands, with a primary focus on custom compostable mailers.",
    areaServed: "Worldwide",
    sameAs: ["https://www.zeropack.co"],
  };
  return <JsonLd data={data} />;
}
