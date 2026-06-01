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
    heroTitle: "Custom Compostable Mailers for US Ecommerce Brands",
    heroSub:
      "Made-to-order compostable mailers for brands shipping across the US that want stronger presentation and a more considered alternative to conventional plastic. Practical MOQs from around 2,000 units, clear certification guidance and delivery timelines confirmed during quoting.",
    primaryCta: "Get a Custom Quote",
    secondaryCta: "Download the Guide",
    trustStrip: [
      "Suitable for US ecommerce brands",
      "Custom quote process",
      "MOQ from around 2,000 units",
      "Delivery timelines confirmed during quote",
      "Certification and standards guidance",
      "Custom printed",
    ],
    problem: {
      heading: "Your customers notice packaging before they notice the product",
      paragraphs: [
        "If you are scaling an ecommerce brand in the US, packaging is part of how you look credible — not just how you ship cheaply.",
        "Zero Pack helps teams move away from generic plastic mailers with custom compostable mailers that are specified for real fulfilment conditions.",
      ],
    },
  },
  eu: {
    heroTitle: "Custom Compostable Mailers for European Ecommerce Brands",
    heroSub:
      "Made-to-order compostable mailers for brands shipping across Europe that want stronger presentation and a more considered alternative to conventional plastic. Practical MOQs from around 2,000 units, clear certification guidance and delivery timelines confirmed during quoting.",
    primaryCta: "Get a Custom Quote",
    secondaryCta: "Download the Guide",
    trustStrip: [
      "Suitable for EU ecommerce brands",
      "Custom quote process",
      "MOQ from around 2,000 units",
      "Delivery timelines confirmed during quote",
      "Certification and standards guidance",
      "Custom printed",
    ],
    problem: {
      heading: "Your customers notice packaging before they notice the product",
      paragraphs: [
        "If you are scaling an ecommerce brand in Europe, packaging is part of how you look credible — not just how you ship cheaply.",
        "Zero Pack helps teams move away from generic plastic mailers with custom compostable mailers that are specified for real fulfilment conditions.",
      ],
    },
  },
};
