import type { RegionConfig } from "@/lib/types";

export const regionConfig: RegionConfig = {
  regionName: "United States",
  countryCode: "US",
  locale: "en-US",
  currency: "USD",
  defaultCTA: "Get a Custom Quote",
  quoteEmail: process.env.NEXT_PUBLIC_QUOTE_EMAIL_US ?? "quotes@zeropack.com",
  certificationNotes: [
    "US-specific certification and labelling guidance will be added as the US route launches.",
  ],
  shippingNotes: ["US fulfilment details will be confirmed during onboarding."],
  moqNotes:
    "Expected to align with global guidance: from around 2,000 units for custom production — final confirmation at launch.",
  leadTimeNotes: "Timelines will be confirmed per specification at launch.",
  legalDisclaimer:
    "Regional compliance and claims requirements vary. US customers should confirm local rules for environmental marketing claims.",
  testimonials: [],
  caseStudies: [],
  faqs: [
    {
      question: "Is Zero Pack available in the US yet?",
      answer:
        "We are preparing a US route. Submit a contact or quote enquiry and we will confirm feasibility for your timeline.",
    },
  ],
  seo: {
    home: {
      title: "Zero Pack US (Coming Soon) | Custom Compostable Mailers",
      description:
        "US enquiries for custom compostable mailers — contact us for timelines and feasibility as the US route opens.",
      canonicalPath: "/us/",
    },
    mailers: {
      title: "Custom Compostable Mailers US (Coming Soon) | Zero Pack",
      description:
        "Placeholder page for US custom compostable mailers — content will localise at launch.",
      canonicalPath: "/us/custom-compostable-mailers/",
    },
  },
};
