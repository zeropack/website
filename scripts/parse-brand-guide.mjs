/**
 * parse-brand-guide.mjs
 *
 * Reads tmp-brand-guide-structured.json (produced by extract-brand-guide.mjs)
 * and writes src/content/guides/brandGuide.ts.
 *
 * Mapping rules:
 *   H2 → new top-level section (id + heading)
 *   H3 → subsection within the current section
 *   paragraph → paragraphs[] of current section or subsection
 *   bullet → bullets[] of current section or subsection
 *   table → table field of current section or subsection
 *
 * After structural mapping, hardcoded metadata, FAQs, whatsInside, and
 * internal article links are merged in.
 *
 * Usage:
 *   node scripts/parse-brand-guide.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const structuredPath = path.join(root, "tmp-brand-guide-structured.json");
if (!fs.existsSync(structuredPath)) {
  console.error(
    "tmp-brand-guide-structured.json not found. Run extract-brand-guide.mjs first.",
  );
  process.exit(1);
}

const items = JSON.parse(fs.readFileSync(structuredPath, "utf8"));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

/**
 * The known section titles let us correctly identify H2s that belong to the
 * guide body vs any other H2s in the document (cover, appendix, etc.).
 * Matching is done by checking if the item text *starts with* the title.
 */
const SECTION_TITLES = [
  "1. Introduction",
  "2. Why Brands Are Moving Away",
  "3. What Is Custom Compostable Packaging",
  "4. Custom Compostable Mailers",
  "5. Other Custom Compostable Packaging Options",
  "6. Which Packaging Type Is Right",
  "7. When Is the Right Time",
  "8. The Commercial Case",
  "9. The Sustainability Case",
  "10. Certification and Avoiding Greenwashing",
  "11. Cost, MOQ",
  "12. Artwork, Size",
  "13. Lead Times",
  "14. How to Choose Your First",
  "15. Decision Checklist",
  "16. Common Mistakes",
  "17. Frequently Asked Questions",
  "18. Ready to Replace",
];

function isSectionHeading(text) {
  return SECTION_TITLES.some((t) => text.startsWith(t));
}

// ---------------------------------------------------------------------------
// Build the section tree
// ---------------------------------------------------------------------------

/**
 * A "target" is either a section or a subsection.
 * We keep a reference to the current target so paragraphs/bullets/tables
 * are added to the right place.
 */

const sections = [];
let currentSection = null;
let currentSubsection = null;

function currentTarget() {
  return currentSubsection ?? currentSection;
}

function addToTarget(field, value) {
  const t = currentTarget();
  if (!t) return;
  if (field === "table") {
    // Only store the first table per target; additional tables become
    // subsequent subsections automatically from H3 structure in most cases.
    // If a second table arrives without a new heading, append it as a
    // table2 key (the template can render both).
    if (!t.table) {
      t.table = value;
    } else if (!t.table2) {
      t.table2 = value;
    }
  } else if (field === "note") {
    // note is a single string — overwrite if a second callout appears
    t.note = value;
  } else {
    if (!t[field]) t[field] = [];
    t[field].push(value);
  }
}

for (const item of items) {
  // Section headings are H1 in the Word doc (numbered 1. Introduction, etc.)
  if (item.type === "heading" && item.level === 1) {
    if (!isSectionHeading(item.text)) continue; // skip non-section H1s
    currentSubsection = null;
    currentSection = {
      id: slugify(item.text),
      heading: item.text,
      paragraphs: [],
    };
    sections.push(currentSection);
    continue;
  }

  if (!currentSection) continue; // skip content before first recognised section

  // Skip Section 17 body — FAQ is handled separately
  if (currentSection.id.startsWith("frequently-asked-questions")) continue;

  // Sub-headings within sections are H2 in the Word doc
  if (item.type === "heading" && item.level === 2) {
    currentSubsection = {
      heading: item.text,
      paragraphs: [],
    };
    if (!currentSection.subsections) currentSection.subsections = [];
    currentSection.subsections.push(currentSubsection);
    continue;
  }

  if (item.type === "heading" && item.level === 3) {
    // Treat H3 as bold intro text within current subsection paragraphs
    addToTarget("paragraphs", item.text);
    continue;
  }

  if (item.type === "paragraph") {
    addToTarget("paragraphs", item.text);
    continue;
  }

  if (item.type === "bullet") {
    addToTarget("bullets", item.text);
    continue;
  }

  if (item.type === "table") {
    // Single-column tables are Word callout/note boxes — store as note field
    if (item.rows[0].length === 1) {
      const text = item.rows.map((r) => r[0]).join(" ").trim();
      if (text) addToTarget("note", text);
      continue;
    }
    // Convert to { headers, rows } shape
    const [headers, ...rows] = item.rows;
    addToTarget("table", { headers, rows });
    continue;
  }
}

// ---------------------------------------------------------------------------
// Post-processing: clean empty arrays, enforce minimum shape
// ---------------------------------------------------------------------------

for (const section of sections) {
  if (section.paragraphs.length === 0) delete section.paragraphs;
  if (section.subsections) {
    for (const sub of section.subsections) {
      if (sub.paragraphs.length === 0) delete sub.paragraphs;
    }
  }
}

// ---------------------------------------------------------------------------
// Hardcoded additions: internal links, answer boxes, extra tables
// ---------------------------------------------------------------------------

/**
 * After structural parsing, we patch specific sections to add:
 * - answerBox fields
 * - internal links appended to the first paragraph of a section
 * - new tables that don't exist in the Word doc yet (certification, readiness, mistakes)
 *
 * Find a section by matching the start of its heading.
 */
function findSection(prefix) {
  return sections.find((s) => s.heading.startsWith(prefix));
}

// Gated tables — data rows blurred with download CTA overlay on the live site
function findSubsection(sectionPrefix, headingFragment) {
  return findSection(sectionPrefix)?.subsections?.find((sub) =>
    sub.heading.includes(headingFragment)
  );
}

const s6 = findSection("6.");
if (s6?.table) s6.table.gated = true;

const s3MaterialSub = findSubsection("3.", "Material Options");
if (s3MaterialSub?.table) s3MaterialSub.table.gated = true;

const s9EcoSub = findSubsection("9.", "Not All");
if (s9EcoSub?.table) s9EcoSub.table.gated = true;

const s10CertSub = findSubsection("10.", "Certification Standards");
if (s10CertSub?.table) s10CertSub.table.gated = true;

const s12ChecklistSub = findSubsection("12.", "Before You Request");
if (s12ChecklistSub?.table) s12ChecklistSub.table.gated = true;

const s15 = findSection("15.");
if (s15?.table) s15.table.gated = true;

// Section 17 — FAQ intro line (body is skipped during parsing; FAQs render via accordion)
const s17 = findSection("17.");
if (s17) s17.paragraphs = ["See below for FAQ listings."];

// Answer boxes
const s3 = findSection("3.");
if (s3) s3.answerBox = "Custom compostable packaging is made-to-order packaging designed to replace conventional plastic while improving brand presentation.";

const s7 = findSection("7.");
if (s7) s7.answerBox = "Switching to custom compostable packaging is not the right move for every business at every stage — use the signals below to assess where you are.";

const s10 = findSection("10.");
if (s10) s10.answerBox = "Compostable packaging claims are only credible when they are specific, certified, and matched to accurate disposal instructions.";


// Internal links — append a link sentence to a named paragraph, or add one
function appendLink(sectionPrefix, linkMarkdown) {
  const s = findSection(sectionPrefix);
  if (!s) return;
  const target = s.subsections?.[0] ?? s;
  if (!target.paragraphs) target.paragraphs = [];
  // Append to last paragraph
  const last = target.paragraphs[target.paragraphs.length - 1];
  if (last) {
    target.paragraphs[target.paragraphs.length - 1] = last + " " + linkMarkdown;
  } else {
    target.paragraphs.push(linkMarkdown);
  }
}

appendLink("1.", "For a deeper look at packaging strategy, see [why packaging matters for ecommerce brands](/articles/why-packaging-matters-for-ecommerce-brands/) and [how branded packaging improves customer experience](/articles/how-branded-packaging-improves-customer-experience/).");
appendLink("2.", "See also: [branded mailers for ecommerce](/articles/branded-mailers-for-ecommerce/) and the [ecommerce mailers guide](/articles/ecommerce-mailers-guide/).");
appendLink("3.", "Read more: [compostable vs biodegradable packaging](/articles/compostable-vs-biodegradable-packaging/) and the full [compostable packaging guide](/articles/compostable-packaging-guide/).");
appendLink("4.", "For the full process, see [how custom compostable mailers work](/articles/how-custom-compostable-mailers-work/) and the [custom compostable mailers guide](/articles/custom-compostable-mailers-guide/).");
appendLink("5.", "See the [custom compostable packaging guide](/articles/custom-compostable-packaging-guide/) and [compostable mailers guide](/articles/compostable-mailers-guide/) for format-specific detail.");
appendLink("6.", "Compare options in detail: [eco friendly packaging guide](/articles/eco-friendly-packaging-guide/) and [compostable mailers vs recycled plastic mailers](/articles/compostable-mailers-vs-recycled-plastic-mailers/).");
appendLink("7.", "Related: [what MOQ means in custom packaging](/articles/what-moq-means-in-custom-packaging/) and [what to ask before ordering custom packaging](/articles/what-to-ask-before-ordering-custom-packaging/).");
appendLink("8.", "See: [branded mailers for ecommerce](/articles/branded-mailers-for-ecommerce/) and [how branded packaging improves customer experience](/articles/how-branded-packaging-improves-customer-experience/).");
appendLink("9.", "Further reading: [eco friendly mailers guide](/articles/eco-friendly-mailers-guide/) and [compostable vs biodegradable packaging](/articles/compostable-vs-biodegradable-packaging/).");
appendLink("10.", "Deep dives: [home compostable vs industrial compostable packaging](/articles/home-compostable-vs-industrial-compostable-packaging/), [what is AS5810](/articles/what-is-as5810-home-compostable-certification/), and [how to reduce plastic packaging in ecommerce](/articles/how-to-reduce-plastic-packaging-in-ecommerce/).");
appendLink("11.", "Related: [what MOQ means in custom packaging](/articles/what-moq-means-in-custom-packaging/).");
appendLink("12.", "See: [how to prepare artwork for custom mailers](/articles/how-to-prepare-artwork-for-custom-mailers/) and [what to ask before ordering custom packaging](/articles/what-to-ask-before-ordering-custom-packaging/).");
appendLink("13.", "Related: [how custom compostable mailers work](/articles/how-custom-compostable-mailers-work/).");
appendLink("14.", "Related: [how to prepare artwork for custom mailers](/articles/how-to-prepare-artwork-for-custom-mailers/) and the [ecommerce mailers guide](/articles/ecommerce-mailers-guide/).");
appendLink("15.", "See also: [what to ask before ordering custom packaging](/articles/what-to-ask-before-ordering-custom-packaging/).");
appendLink("16.", "Related: [eco friendly mailers guide](/articles/eco-friendly-mailers-guide/) and [compostable vs biodegradable packaging](/articles/compostable-vs-biodegradable-packaging/).");

// ---------------------------------------------------------------------------
// FAQs (hardcoded — already correct in original file)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Build the TypeScript output
// ---------------------------------------------------------------------------

/**
 * Serialise a section (or subsection) to TypeScript object literal.
 * We use JSON.stringify for individual string values to handle escaping.
 */
function serialiseTarget(t, indent = "    ") {
  const lines = [];
  const i2 = indent + "  ";

  if (t.answerBox !== undefined) {
    lines.push(`${indent}answerBox: ${JSON.stringify(t.answerBox)},`);
  }
  if (t.paragraphs?.length) {
    lines.push(`${indent}paragraphs: [`);
    for (const p of t.paragraphs) lines.push(`${i2}${JSON.stringify(p)},`);
    lines.push(`${indent}],`);
  }
  if (t.bullets?.length) {
    lines.push(`${indent}bullets: [`);
    for (const b of t.bullets) lines.push(`${i2}${JSON.stringify(b)},`);
    lines.push(`${indent}],`);
  }
  if (t.table) {
    lines.push(`${indent}table: {`);
    lines.push(`${i2}headers: ${JSON.stringify(t.table.headers)},`);
    lines.push(`${i2}rows: [`);
    for (const row of t.table.rows) lines.push(`${i2}  ${JSON.stringify(row)},`);
    lines.push(`${i2}],`);
    if (t.table.footnote) lines.push(`${i2}footnote: ${JSON.stringify(t.table.footnote)},`);
    if (t.table.gated) lines.push(`${i2}gated: true,`);
    lines.push(`${indent}},`);
  }
  // table2 if present
  if (t.table2) {
    lines.push(`${indent}table2: {`);
    lines.push(`${i2}headers: ${JSON.stringify(t.table2.headers)},`);
    lines.push(`${i2}rows: [`);
    for (const row of t.table2.rows) lines.push(`${i2}  ${JSON.stringify(row)},`);
    lines.push(`${i2}],`);
    if (t.table2.footnote) lines.push(`${i2}footnote: ${JSON.stringify(t.table2.footnote)},`);
    if (t.table2.gated) lines.push(`${i2}gated: true,`);
    lines.push(`${indent}},`);
  }
  if (t.note !== undefined) {
    lines.push(`${indent}note: ${JSON.stringify(t.note)},`);
  }
  return lines.join("\n");
}

function serialiseSections(sections) {
  const parts = [];
  for (const s of sections) {
    const lines = ["  {"];
    lines.push(`    id: ${JSON.stringify(s.id)},`);
    lines.push(`    heading: ${JSON.stringify(s.heading)},`);
    const body = serialiseTarget(s, "    ");
    if (body) lines.push(body);
    if (s.subsections?.length) {
      lines.push("    subsections: [");
      for (const sub of s.subsections) {
        lines.push("      {");
        lines.push(`        heading: ${JSON.stringify(sub.heading)},`);
        const subBody = serialiseTarget(sub, "        ");
        if (subBody) lines.push(subBody);
        lines.push("      },");
      }
      lines.push("    ],");
    }
    lines.push("  },");
    parts.push(lines.join("\n"));
  }
  return "[\n" + parts.join("\n") + "\n]";
}

const out = `import type { BrandGuide } from "./types";

export const brandGuide: BrandGuide = {
  slug: "packaging-guide",
  path: "/packaging-guide/",
  title: "The 2026 Branded & Eco Friendly Packaging Guide",
  subtitle: "By Zero Pack — for ecommerce brands switching to custom compostable packaging",
  tagline: "A practical guide for ecommerce brands, retailers and organisations ready to replace conventional plastic packaging.",
  answerBox: "Custom compostable packaging is made-to-order packaging designed to replace conventional plastic while improving brand presentation.",
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
  dateModified: "2026-06-01",
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
  sections: ${serialiseSections(sections)},
  faqs: ${JSON.stringify(faqs, null, 2)},
};
`;

const outPath = path.join(root, "src/content/guides/brandGuide.ts");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out);

console.log(
  `Wrote brandGuide.ts — ${sections.length} sections, ${sections.reduce((n, s) => n + (s.subsections?.length ?? 0), 0)} subsections, ${faqs.length} FAQs`,
);
