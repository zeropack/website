import type { Article } from "./types";

export const articlesPartB: Article[] = [
  {
    slug: "how-to-reduce-plastic-packaging-in-ecommerce",
    title: "How to Reduce Plastic Packaging in Ecommerce",
    category: "Plastic alternatives",
    description:
      "A practical path for brands moving away from conventional plastic mailers without breaking fulfilment.",
    publishedAt: "2026-02-01",
    sections: [
      {
        id: "baseline",
        heading: "Start with what you ship today",
        paragraphs: [
          "Document your current mailer sizes, closure method and failure modes (tears, corner punctures, print scuffing).",
          "Replacement packaging should solve the same job, not just a sustainability checklist.",
        ],
      },
      {
        id: "options",
        heading: "Understand the trade space",
        paragraphs: [
          "Recycled plastic, paper, compostable films and hybrid approaches each have different cost curves, MOQs and customer communication needs.",
        ],
      },
      {
        id: "rollout",
        heading: "Phase your rollout instead of a single big switch",
        paragraphs: [
          "Pilot lanes, measure damages and returns impacts, then scale. Packaging changes touch warehouse labour more than marketing teams expect.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is compostable always the first step?",
        answer:
          "Not necessarily. The right step is the one that matches your volumes, claims you can support and fulfilment realities.",
      },
    ],
  },
  {
    slug: "what-to-ask-before-ordering-custom-packaging",
    title: "What to Ask Before Ordering Custom Packaging",
    category: "Artwork and ordering guidance",
    description:
      "A buyer’s checklist: specification, certification language, timelines and claim risk.",
    publishedAt: "2026-02-04",
    sections: [
      {
        id: "spec",
        heading: "Specification questions",
        paragraphs: [
          "What exact material construction is quoted?",
          "What thickness or grade assumptions are included?",
          "What print method is assumed?",
        ],
      },
      {
        id: "claims",
        heading: "Claims and certification questions",
        paragraphs: [
          "What documentation supports compostability statements for this SKU?",
          "What should customers be told about disposal?",
        ],
      },
      {
        id: "commercial",
        heading: "Commercial questions",
        paragraphs: [
          "What MOQ tiers exist?",
          "What changes if artwork is delayed?",
          "What is included in freight vs ex-works?",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the fastest way to get an accurate quote?",
        answer:
          "Share website, typical shipment contents, approximate sizes, monthly order volume and your timeline — even if some fields are estimates.",
      },
    ],
  },
  {
    slug: "compostable-mailers-vs-recycled-plastic-mailers",
    title: "Compostable Mailers vs Recycled Plastic Mailers",
    category: "Plastic alternatives",
    description:
      "Compare decision factors: claims, disposal routes, performance, MOQ and customer messaging.",
    publishedAt: "2026-02-06",
    sections: [
      {
        id: "recycled",
        heading: "Recycled plastic mailers",
        paragraphs: [
          "Recycled content can reduce virgin plastic demand while staying in a familiar material class for many fulfilment teams.",
          "Customer communication still needs clarity: recycled does not automatically mean widely recyclable in kerbside systems.",
        ],
      },
      {
        id: "compostable",
        heading: "Compostable mailers",
        paragraphs: [
          "Compostable mailers can align with brands moving away from conventional plastic entirely — but claims must match certification and local disposal realities.",
        ],
      },
      {
        id: "choose",
        heading: "How brands choose",
        paragraphs: [
          "Choose based on volumes, the claims you want to stand behind, operational constraints and total cost including damages and returns.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which option is more premium?",
        answer:
          "Premium is mostly execution: print quality, sizing discipline and consistency. Material class alone does not create premium perception.",
      },
    ],
  },
  {
    slug: "how-branded-packaging-improves-customer-experience",
    title: "How Branded Packaging Improves Customer Experience",
    category: "Ecommerce packaging",
    description:
      "Why branded mailers influence trust, clarity and repeat purchase — especially for DTC brands.",
    publishedAt: "2026-02-08",
    sections: [
      {
        id: "recognition",
        heading: "Recognition reduces anxiety",
        paragraphs: [
          "Customers want to know the parcel is genuinely yours. Clear branding reduces ‘wrong parcel’ doubt.",
        ],
      },
      {
        id: "consistency",
        heading: "Consistency signals quality",
        paragraphs: [
          "Inconsistent packaging reads as inconsistent operations. That is a CX issue even when the product is excellent.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do customers care about compostability?",
        answer:
          "Many customers care about reducing plastic where it feels credible — especially for brands with sustainability positioning. Claims must be supportable.",
      },
    ],
  },
  {
    slug: "home-compostable-vs-industrial-compostable-packaging",
    title: "Home Compostable vs Industrial Compostable Packaging",
    category: "Packaging compliance",
    description:
      "What the distinction means for customer instructions and supplier documentation.",
    publishedAt: "2026-02-10",
    sections: [
      {
        id: "industrial",
        heading: "Industrial compostable",
        paragraphs: [
          "Industrial composting typically refers to managed facilities with controlled conditions. Packaging designed only for industrial routes should not imply home compostability.",
        ],
      },
      {
        id: "home",
        heading: "Home compostable",
        paragraphs: [
          "Home compostability targets a managed home compost environment and is associated with stricter testing expectations in credible programmes.",
        ],
      },
      {
        id: "markets",
        heading: "Market realities",
        paragraphs: [
          "Disposal routes vary by region. Your customer-facing guidance should reflect what is realistic where you sell — not generic global slogans.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which is better for ecommerce brands?",
        answer:
          "Better is what matches your documentation and your customers’ disposal reality. We help you keep messaging aligned during quoting.",
      },
    ],
  },
  {
    slug: "what-is-as5810-home-compostable-certification",
    title: "What Is AS5810 Home Compostable Certification?",
    category: "Packaging compliance",
    description:
      "A plain-English overview of AS5810 as a strict Australian home compostability standard — without turning it into marketing hype.",
    publishedAt: "2026-02-12",
    sections: [
      {
        id: "context",
        heading: "Why standards exist",
        paragraphs: [
          "Compostability claims are easier to market than to prove. Standards exist to define test conditions and pass/fail criteria so buyers can compare like-for-like.",
        ],
      },
      {
        id: "as5810",
        heading: "What AS5810 is (high level)",
        paragraphs: [
          "AS5810 is an Australian standard associated with home compostability requirements for packaging materials and products. It is widely referenced as a rigorous home composting test framework in Australian supplier documentation.",
          "Important: your final customer-facing claims must match the certification documentation for the exact product specification you purchase — not a general article summary.",
        ],
      },
      {
        id: "uk",
        heading: "Why UK teams sometimes reference Australian standards",
        paragraphs: [
          "UK buyers may see Australian certification context on global supplier specs. The practical question remains the same: what disposal route is credible for your customers, and what evidence supports your packaging claims?",
        ],
      },
    ],
    faqs: [
      {
        question: "Does AS5810 automatically apply to every mailer labelled compostable?",
        answer:
          "No. Certification is product and supplier specific. Always request documentation for the exact SKU you intend to buy.",
      },
    ],
  },
];
