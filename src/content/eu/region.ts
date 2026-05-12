import type { RegionConfig } from "@/lib/types";

export const regionConfig: RegionConfig = {
  regionName: "European Union",
  countryCode: "EU",
  locale: "en-EU",
  currency: "EUR",
  defaultCTA: "Get a Custom Quote",
  quoteEmail: process.env.NEXT_PUBLIC_QUOTE_EMAIL_EU ?? "quotes@zeropack.com",
  certificationNotes: [
    "EU market guidance will be added at launch, including relevant standards context for your specification.",
  ],
  shippingNotes: ["EU delivery details will be confirmed during onboarding."],
  moqNotes:
    "Expected to align with global guidance: from around 2,000 units for custom production — final confirmation at launch.",
  leadTimeNotes: "Timelines will be confirmed per specification at launch.",
  legalDisclaimer:
    "EU packaging and environmental claims rules vary by member state context; customers remain responsible for compliant marketing.",
  testimonials: [],
  caseStudies: [],
  faqs: [
    {
      question: "Is Zero Pack available across the EU yet?",
      answer:
        "We are preparing an EU route. Contact us with your country and requirement and we will confirm next steps.",
    },
  ],
  seo: {
    home: {
      title: "Zero Pack EU (Coming Soon) | Custom Compostable Mailers",
      description:
        "EU enquiries for custom compostable mailers — contact us for country-specific timelines as the EU route expands.",
      canonicalPath: "/eu/",
    },
    mailers: {
      title: "Custom Compostable Mailers EU (Coming Soon) | Zero Pack",
      description:
        "Placeholder page for EU custom compostable mailers — content will localise at launch.",
      canonicalPath: "/eu/custom-compostable-mailers/",
    },
  },
};
