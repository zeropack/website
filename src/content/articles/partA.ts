import type { Article } from "./types";

export const articlesPartA: Article[] = [
  {
    slug: "compostable-vs-biodegradable-packaging",
    title: "Compostable vs Biodegradable Packaging",
    category: "Compostable packaging education",
    description:
      "What compostable and biodegradable mean in B2B packaging — and which questions to ask before you buy.",
    publishedAt: "2026-01-10",
    sections: [
      {
        id: "why-language-matters",
        heading: "Why language matters for ecommerce brands",
        paragraphs: [
          "Customers are more likely to read what you print on a mailer than a footnote on a supplier datasheet. That makes clarity important — for trust and for commercial credibility.",
          "Compostable and biodegradable are not interchangeable. One describes an intended end-of-life route under defined conditions. The other is broader and easier to misuse.",
        ],
      },
      {
        id: "compostable",
        heading: "What compostable usually means in packaging",
        paragraphs: [
          "Compostable packaging is designed to break down under composting conditions, typically aligned to standards and testing for specific environments (for example industrial composting, and in some specifications home composting).",
          "Credibility generally comes from specification documentation and certification where applicable — not from adjectives on a website.",
        ],
        bullets: [
          "Ask which standard applies and what environment it targets.",
          "Ask what customers should do with the packaging after use.",
          "Ask what happens if the packaging enters general waste streams.",
        ],
      },
      {
        id: "biodegradable",
        heading: "Why biodegradable can be ambiguous",
        paragraphs: [
          "Biodegradable can describe a wide range of breakdown behaviours, timelines and environments. Without definition, it does not tell a buyer much.",
          "For ecommerce brands, the practical question is whether your customer can understand disposal guidance without confusion.",
        ],
      },
      {
        id: "oxo",
        heading: "A quick note on oxo-degradable claims",
        paragraphs: [
          "Oxo-degradable approaches have faced significant scrutiny in multiple markets. If a supplier leads with oxo-degradable language, ask for clarity on local regulatory positioning and what proof supports environmental claims.",
        ],
      },
      {
        id: "decision",
        heading: "How to decide what is right for your brand",
        paragraphs: [
          "Start with your fulfilment reality: weights, rough handling, weather exposure and returns.",
          "Then align packaging claims to what you can support with documentation and clear customer guidance.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is compostable always better than biodegradable?",
        answer:
          "Not as a slogan. What matters is whether the specification matches your shipping needs and whether disposal guidance is credible for your customers.",
      },
      {
        question: "Should we put composting instructions on the mailer?",
        answer:
          "If you make compostability claims customer-facing, instructions should match the certification and the routes available in your markets. We help teams keep this consistent during quoting.",
      },
    ],
  },
  {
    slug: "how-custom-compostable-mailers-work",
    title: "How Custom Compostable Mailers Work",
    category: "Ecommerce packaging",
    description:
      "A practical overview of made-to-order compostable mailers: specification, print, MOQ and timelines.",
    publishedAt: "2026-01-12",
    sections: [
      {
        id: "overview",
        heading: "Made-to-order, not off-the-shelf",
        paragraphs: [
          "Custom compostable mailers are produced against a defined specification: size, material choice, print and packing workflow assumptions.",
          "This is why MOQs exist — setup, tooling and print alignment are part of the economics.",
        ],
      },
      {
        id: "spec",
        heading: "What gets specified first",
        paragraphs: [
          "Size is driven by what you ship most often, not your largest outlier SKU.",
          "Print complexity influences cost and lead time more than many first-time buyers expect.",
        ],
        bullets: [
          "Typical dimensions and product weights",
          "Logo-only vs multi-colour vs full coverage",
          "How you seal and pack in fulfilment",
        ],
      },
      {
        id: "proof",
        heading: "Artwork, proofs and approvals",
        paragraphs: [
          "Most teams either have vector brand assets ready or need a simple print layout supported by Zero Pack’s guidance.",
          "Approval steps exist to protect brand consistency and print outcome — they are not bureaucracy for its own sake.",
        ],
      },
      {
        id: "production",
        heading: "Production and delivery",
        paragraphs: [
          "Production is made to order through manufacturing partners, with timelines confirmed before production begins.",
          "Freight method and region affect dates as much as print does.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do we need final artwork before we enquire?",
        answer:
          "No. Tell us what you have and your timeline — we can advise what is needed for an accurate quote.",
      },
    ],
  },
  {
    slug: "what-moq-means-in-custom-packaging",
    title: "What MOQ Means in Custom Packaging",
    category: "Artwork and ordering guidance",
    description:
      "Why minimum order quantities exist — and when custom mailers become commercially practical.",
    publishedAt: "2026-01-14",
    sections: [
      {
        id: "definition",
        heading: "What MOQ is",
        paragraphs: [
          "MOQ means minimum order quantity: the smallest production run a supplier can run while covering setup, print alignment and manufacturing planning.",
        ],
      },
      {
        id: "2000",
        heading: "Why around 2,000 units is a common practical threshold",
        paragraphs: [
          "Below certain volumes, setup costs dominate per-unit pricing and suppliers cannot run production efficiently.",
          "That is not a judgement on small brands — it is manufacturing reality. If you are not there yet, a guide-led approach can still help you plan.",
        ],
      },
      {
        id: "tiers",
        heading: "Why higher quantities reduce per-unit cost",
        paragraphs: [
          "As quantity increases, setup is amortised across more units and manufacturing runs become more efficient.",
          "Your quote should explain tiered pricing where applicable (for example 2k / 5k / 10k / 25k).",
        ],
      },
    ],
    faqs: [
      {
        question: "What if we are under MOQ but growing fast?",
        answer:
          "Share your growth curve and launch timeline — we can advise whether a near-term custom run makes sense or whether interim options are smarter.",
      },
    ],
  },
  {
    slug: "how-to-prepare-artwork-for-custom-mailers",
    title: "How to Prepare Artwork for Custom Mailers",
    category: "Custom mailer design",
    description:
      "Vector files, colour modes, safe zones and what suppliers need to print cleanly on mailers.",
    publishedAt: "2026-01-18",
    sections: [
      {
        id: "vectors",
        heading: "Start with vector brand assets where possible",
        paragraphs: [
          "Logos and typography reproduce most predictably from vector formats. Raster images can work for some jobs, but vector reduces surprises at print.",
        ],
      },
      {
        id: "colours",
        heading: "Colours, Pantone references and proof expectations",
        paragraphs: [
          "If brand colour accuracy matters, reference colours consistently and expect proofing as part of the workflow.",
          "Full-bleed artwork needs safe zones so critical brand elements are not clipped in conversion.",
        ],
      },
      {
        id: "placement",
        heading: "Think about the unboxing angle",
        paragraphs: [
          "Customers see packaging under warehouse lighting, courier handling and porch lighting — high-contrast layouts often read better than ultra-fine detail.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can Zero Pack help if we do not have a print-ready file?",
        answer:
          "Yes — tell us what you have (brand guidelines, PNG logo, etc.) and we will advise the best path.",
      },
    ],
  },
  {
    slug: "why-packaging-matters-for-ecommerce-brands",
    title: "Why Packaging Matters for Ecommerce Brands",
    category: "Ecommerce packaging",
    description:
      "Packaging is a touchpoint, not a container. How mailers influence perception and repeat purchase.",
    publishedAt: "2026-01-20",
    sections: [
      {
        id: "touchpoint",
        heading: "Every delivery is a brand moment",
        paragraphs: [
          "Your customer already paid. The delivery experience still shapes whether they recommend you, trust you and come back.",
          "Mailers are not glamorous — which is exactly why quality and intention stand out.",
        ],
      },
      {
        id: "consistency",
        heading: "Consistency beats one-off ‘premium’ experiments",
        paragraphs: [
          "A cohesive packaging system signals operational maturity. It also makes fulfilment training easier.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is branded packaging worth it if we compete on price?",
        answer:
          "If price is your only wedge, packaging may be deprioritised. If you compete on brand, product experience and community, packaging usually supports the story.",
      },
    ],
  },
  {
    slug: "best-packaging-options-for-fashion-brands",
    title: "Best Packaging Options for Fashion Brands",
    category: "Ecommerce packaging",
    description:
      "Practical packaging considerations for apparel and accessories shipped DTC.",
    publishedAt: "2026-01-22",
    sections: [
      {
        id: "sku",
        heading: "Fashion has more size variance than most categories",
        paragraphs: [
          "Mailer sizing should be optimised for your most common order profile, not the single biggest SKU you ever shipped.",
        ],
      },
      {
        id: "presentation",
        heading: "Presentation without overbuilding",
        paragraphs: [
          "Fashion customers notice texture, print quality and clean closures. You do not need excessive layers to feel premium.",
        ],
      },
      {
        id: "returns",
        heading: "Returns handling",
        paragraphs: [
          "If returns are common, your packaging choice should survive re-taping or re-bagging workflows without looking destroyed.",
        ],
      },
    ],
    faqs: [
      {
        question: "Mailers vs boxes for fashion?",
        answer:
          "Mailers suit many apparel shipments; structured items may need boxes. Tell us your SKU mix and we will recommend a sensible approach.",
      },
    ],
  },
];
