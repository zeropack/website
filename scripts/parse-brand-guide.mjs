import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const plain = fs
  .readFileSync(path.join(root, "tmp-brand-guide-plain.txt"), "utf8")
  .replace(/&amp;/g, "&")
  .replace(/\r?\n/g, "");

const SECTION_TITLES = [
  "1. Introduction: Why Packaging Matters More Than Most Brands Realise",
  "2. Why Brands Are Moving Away From Conventional Plastic Packaging",
  "3. What Is Custom Compostable Packaging?",
  "4. Custom Compostable Mailers: The Primary Product",
  "5. Other Custom Compostable Packaging Options",
  "6. Which Packaging Type Is Right for Your Brand?",
  "7. When Is the Right Time to Switch?",
  "8. The Commercial Case for Custom Compostable Packaging",
  "9. The Sustainability Case",
  "10. Certification and Avoiding Greenwashing",
  "11. Cost, MOQ, and Value",
  "12. Artwork, Size, and Specification",
  "13. Lead Times and Reorder Planning",
  "14. How to Choose Your First Custom Mailer",
  "15. Decision Checklist: Are You Ready for Custom Compostable Packaging?",
  "16. Common Mistakes to Avoid",
  "17. Frequently Asked Questions",
  "18. Ready to Replace Conventional Plastic Packaging?",
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function normalizeText(text) {
  return text.replace(/([.!?])([A-Z])/g, "$1 $2").replace(/\s+/g, " ").trim();
}

function splitParagraphs(body) {
  const normalized = normalizeText(body);
  if (!normalized) return [];
  return normalized
    .split(/(?<=[.!?])\s+(?=[A-Z"'(✓□•])/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);
}

const introEnd = plain.indexOf(SECTION_TITLES[0]);
const preamble = plain.slice(0, introEnd);

const sections = [];
for (let i = 0; i < SECTION_TITLES.length; i++) {
  const start = plain.indexOf(SECTION_TITLES[i]);
  const end = i + 1 < SECTION_TITLES.length ? plain.indexOf(SECTION_TITLES[i + 1]) : plain.length;
  if (start === -1) continue;
  const content = plain.slice(start + SECTION_TITLES[i].length, end).trim();
  sections.push({
    id: slugify(SECTION_TITLES[i]),
    heading: SECTION_TITLES[i],
    paragraphs: splitParagraphs(content),
  });
}

const faqs = [
  {
    question: "What is custom compostable packaging?",
    answer:
      "Custom compostable packaging is packaging made from plant-based materials designed to break down under composting conditions, produced to your brand's specifications — your logo, colours, size, and print design. Rather than ordering generic stock packaging, you receive packaging made specifically for your brand and your products.",
  },
  {
    question: "What is the minimum order quantity?",
    answer:
      "For most custom compostable mailers, the starting point is around 2,000 units. The exact MOQ can vary depending on the packaging type, size, and specification. Zero Pack can provide guidance on the most practical quantity for your order during the quoting process.",
  },
  {
    question: "Are compostable mailers strong enough for ecommerce shipping?",
    answer:
      "Yes — when produced to appropriate specifications. Zero Pack's compostable mailers are designed for real ecommerce use. Depending on the specification chosen, they can be waterproof, durable, and finished with a strong adhesive closure. The specific product being shipped and the required level of protection should always be confirmed before quoting.",
  },
  {
    question: "Can I print my logo and brand colours?",
    answer:
      "Yes. Custom compostable mailers from Zero Pack can be printed with your logo, brand colours, artwork, or campaign design. The print specification — number of colours, print area, artwork format — will be confirmed as part of the quoting process.",
  },
  {
    question: "Is compostable packaging more expensive than conventional plastic?",
    answer:
      "On a per-unit basis, yes. Custom compostable packaging typically costs more than generic conventional plastic mailers. The value difference comes from the custom branding, the material quality, the better alignment with customer expectations, and the reduction in conventional plastic use — all of which have commercial and brand implications beyond the unit cost.",
  },
  {
    question: "Is home compostable better than industrial compostable?",
    answer:
      "Not automatically. Home compostable packaging can be disposed of in more accessible conditions — a domestic compost bin — but it may have different material performance characteristics. Industrial compostable packaging typically requires specific facility conditions but may offer different material properties. The right choice depends on your specific product needs and what disposal guidance you can provide customers. Zero Pack can advise on the options available.",
  },
  {
    question: "Can compostable packaging go in the recycling bin?",
    answer:
      "Generally, no. Compostable packaging is not the same as recyclable packaging and should not be placed in standard recycling bins. It is designed for composting conditions, not the recycling waste stream. Always include clear disposal instructions on or with your packaging.",
  },
  {
    question: "How long does custom packaging take?",
    answer:
      "Custom packaging is made to order and requires production lead time. Depending on your location it can take between eight to twelve weeks to receive delivery. The exact lead time will depend on the order size, print complexity, and production schedule. This is confirmed during the quoting process.",
  },
  {
    question: "What products are compostable mailers best suited for?",
    answer:
      "Custom compostable mailers work best for soft, lightweight, non-fragile goods. Fashion and apparel, beauty and skincare, wellness products, books, stationery, accessories, gifts, and lifestyle items are common fits. Products that are fragile, sharp, heavy, or require rigid protection may need a different packaging format.",
  },
  {
    question: "What do I need before requesting a quote?",
    answer:
      "Ideally: your logo files, brand colour references, a preferred mailer size or product dimensions, estimated quantity, delivery country, and a rough sense of your artwork or design direction. If you are missing some of these, Zero Pack can help you work through them. You do not need everything finalised before making initial contact.",
  },
  {
    question: "Should a small business switch to custom compostable packaging?",
    answer:
      "It depends on where the business is. If you are shipping several hundred orders per month, have consistent branding, and can meet a practical MOQ, custom packaging can make strong commercial sense. If you are at an earlier stage — lower volumes, evolving branding, no consistent product range — it is worth building those foundations first and revisiting when the time is right.",
  },
  {
    question: "How do I avoid greenwashing with compostable packaging?",
    answer:
      "Be specific in your claims. Know whether your packaging is home compostable or industrial compostable. Know what certification it carries. Provide clear disposal instructions. Avoid vague language like '100% eco-friendly' or 'completely guilt-free'. A specific, supported claim is always more credible than a broad environmental statement.",
  },
  {
    question: "What packaging format should I choose?",
    answer:
      "Start with the format that fits the majority of your products. For most ecommerce brands shipping soft goods, a custom compostable mailer is the most practical and commercially effective starting point. For retail carry bags, garment bags, or products requiring extra protection, other formats may be more appropriate. Zero Pack can help you identify the right option for your product range.",
  },
  {
    question: "Can I use compostable packaging with a 3PL?",
    answer:
      "Yes, in most cases. Third-party logistics providers can typically handle custom compostable mailers as they would any other mailer format. It is worth checking your 3PL's specific requirements — particularly around packaging dimensions, closure type, and any labelling needs — before finalising your order specification.",
  },
];

// Trim FAQ content out of section 17 body for cleaner display
const faqIdx = sections.findIndex((s) => s.id.startsWith("17-"));
if (faqIdx !== -1) {
  sections[faqIdx].paragraphs = [
    "Below are the most common questions ecommerce brands ask when evaluating custom compostable packaging. For the full guide including checklists and decision frameworks, work through each section above.",
  ];
}

const whatsInside = [
  "What custom compostable packaging is — and how it works",
  "Why growing brands are moving away from conventional plastic mailers",
  "How to choose the right packaging format for your products",
  "When a business is ready to switch — and when it is not",
  "How to avoid greenwashing and vague packaging claims",
  "The commercial case for better branded packaging",
  "How to plan your first order: MOQ, artwork, size, and lead times",
  "A decision checklist, FAQ, and quote-ready prompt",
];

const out = `import type { BrandGuide } from "./types";

export const brandGuide: BrandGuide = {
  slug: "packaging-guide",
  path: "/packaging-guide/",
  title: "The 2026 Branded & Eco Friendly Packaging Guide",
  subtitle: "By Zero Pack — for ecommerce brands switching to custom compostable packaging",
  tagline: "A practical guide for ecommerce brands, retailers and organisations ready to replace conventional plastic packaging.",
  primaryKeyword: "branded packaging",
  secondaryKeywords: [
    "eco friendly packaging",
    "custom compostable packaging",
    "compostable packaging",
    "compostable mailers",
    "custom compostable mailers",
    "branded mailers",
    "ecommerce mailers",
    "eco friendly mailers",
  ],
  pdfFilename: "2026-branded-packaging-eco-friendly-packaging-guide-by-zero-pack.pdf",
  publishedAt: "2026-03-01",
  dateModified: "2026-03-01",
  whatsInside: [
    "What custom compostable packaging is — and how it works",
    "Why growing brands are moving away from conventional plastic mailers",
    "How to choose the right packaging format for your products",
    "When a business is ready to switch — and when it is not",
    "How to avoid greenwashing and vague packaging claims",
    "The commercial case for better branded packaging",
    "How to plan your first order: MOQ, artwork, size, and lead times",
    "A decision checklist, FAQ, and quote-ready prompt",
  ],
  sections: ${JSON.stringify(sections, null, 2)},
  faqs: ${JSON.stringify(faqs, null, 2)},
};
`;

fs.mkdirSync(path.join(root, "src/content/guides"), { recursive: true });
if (!fs.existsSync(path.join(root, "src/content/guides/types.ts"))) {
  fs.writeFileSync(
    path.join(root, "src/content/guides/types.ts"),
    `import type { ArticleSection } from "@/content/articles/types";

export type BrandGuide = {
  slug: string;
  path: string;
  title: string;
  subtitle: string;
  tagline: string;
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  pdfFilename: string;
  publishedAt: string;
  dateModified: string;
  whatsInside: readonly string[];
  sections: ArticleSection[];
  faqs: { question: string; answer: string }[];
};
`,
  );
}
fs.writeFileSync(path.join(root, "src/content/guides/brandGuide.ts"), out);
console.log("Sections:", sections.length, "FAQs:", faqs.length, "Chars:", out.length);
