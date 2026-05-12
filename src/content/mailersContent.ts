import type { RegionCode } from "@/lib/types";

export type MailersVariant = "global" | RegionCode;

export const mailersContent: Record<
  MailersVariant,
  {
    heroTitle: string;
    heroSub: string;
    primaryCta: string;
    secondaryCta: string;
    trustStrip: string[];
    problem: { heading: string; paragraphs: string[] };
    ukAngle?: string[];
  }
> = {
  global: {
    heroTitle: "Custom Branded Compostable Mailers Made for Modern Ecommerce Brands",
    heroSub:
      "Create made-to-order compostable mailers with your logo, colours, artwork and sizing requirements. Built for ecommerce shipping, brand presentation and businesses ready to reduce reliance on conventional plastic.",
    primaryCta: "Request a Mailer Quote",
    secondaryCta: "Download the Compostable Packaging Guide",
    trustStrip: [
      "Custom printed",
      "Compostable material options",
      "Waterproof and durable",
      "Strong adhesive closure",
      "Made to order",
      "Practical MOQ options",
    ],
    problem: {
      heading: "Plastic mailers are easy — which is why they became the default",
      paragraphs: [
        "The default option is not always the option that matches brand positioning, customer expectations or a credible plan to reduce plastic reliance.",
        "Custom compostable mailers exist to keep the operational simplicity of a mailer workflow while upgrading presentation and materials choice — with specification-led guidance.",
      ],
    },
  },
  au: {
    heroTitle: "Custom Compostable Mailers for Australian Ecommerce Brands",
    heroSub:
      "Australian-owned custom mailers made to order for brands that ship regularly. Practical MOQs from around 2,000 units, clear guidance on certification and delivery timelines confirmed during quoting.",
    primaryCta: "Get a Custom Quote",
    secondaryCta: "Download the Compostable Packaging Guide",
    trustStrip: [
      "Australian owned",
      "Suitable for Australian ecommerce brands",
      "Custom quote process",
      "MOQ from around 2,000 units",
      "Delivery timelines confirmed during quote",
      "Certification and standards guidance",
    ],
    problem: {
      heading: "Your customers notice packaging before they notice the product",
      paragraphs: [
        "If you are scaling an ecommerce brand in Australia, packaging is part of how you look credible — not just how you ship cheaply.",
        "Zero Pack helps teams move away from generic plastic mailers with custom compostable mailers that are specified for real fulfilment conditions.",
      ],
    },
  },
  uk: {
    heroTitle: "Custom Compostable Mailers for UK Brands Ready to Move Beyond Plastic",
    heroSub:
      "Made-to-order branded mailers for ecommerce brands that want stronger presentation, credible compostable packaging and practical order quantities from around 2,000 units.",
    primaryCta: "Get a UK Quote",
    secondaryCta: "Download the Compostable Packaging Guide",
    trustStrip: [
      "MOQ from around 2,000",
      "Custom printed",
      "Waterproof and durable",
      "Strong adhesive",
      "Made to order",
      "Certification and standards guidance",
      "Built for ecommerce brands",
    ],
    problem: {
      heading: "Many UK suppliers sit at two extremes — stockists or industrial volumes",
      paragraphs: [
        "Generic stock mailers rarely deliver brand-grade presentation. High-volume industrial suppliers can be built for a different buying motion than growing ecommerce brands.",
        "Zero Pack is positioned for UK ecommerce brands that want factory-direct style custom compostable mailers with practical MOQs — typically from around 2,000 units — and quote guidance that respects certification language.",
      ],
    },
    ukAngle: [
      "Quote guidance is often possible within 48 hours where operationally possible.",
      "Tiered pricing can be discussed at common breakpoints such as 2k, 5k, 10k and 25k where applicable.",
      "UK delivery details are confirmed in the quote.",
    ],
  },
  us: {
    heroTitle: "Custom Compostable Mailers (US route — launching next)",
    heroSub:
      "This page is structurally ready for US-specific copy, currency placeholders, compliance notes and fulfilment language. Submit an enquiry and we will confirm feasibility.",
    primaryCta: "Contact Zero Pack",
    secondaryCta: "Download the Compostable Packaging Guide",
    trustStrip: [
      "MOQ from around 2,000 (expected)",
      "Custom printed",
      "Made to order",
      "Quote-led",
      "Regional expansion",
    ],
    problem: {
      heading: "US enquiries",
      paragraphs: [
        "If you are planning a US rollout, contact us with volumes, print intent and timeline. Regional pages will localise pricing notes, compliance language and delivery expectations.",
      ],
    },
  },
  eu: {
    heroTitle: "Custom Compostable Mailers (EU route — launching next)",
    heroSub:
      "Placeholder-ready architecture for EU localisation: currency, compliance notes, delivery timelines and FAQs per member-state strategy as you scale.",
    primaryCta: "Contact Zero Pack",
    secondaryCta: "Download the Compostable Packaging Guide",
    trustStrip: [
      "MOQ from around 2,000 (expected)",
      "Custom printed",
      "Made to order",
      "Quote-led",
      "Regional expansion",
    ],
    problem: {
      heading: "EU enquiries",
      paragraphs: [
        "Tell us your primary shipping country and volumes. We will confirm what is possible as EU operations expand.",
      ],
    },
  },
};
