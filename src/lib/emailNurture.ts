import { SITE_NAME } from "@/lib/site";

export const quoteNurture = [
  {
    id: "q1",
    subject: "Thanks — we received your quote request",
    body:
      "We will review your packaging details and reply with next steps. If anything is missing, we will ask for the specifics needed to prepare more accurate quote guidance.",
  },
  {
    id: "q2",
    subject: "How custom compostable mailers work",
    body:
      "Made-to-order mailers are specified for size, print and material choice, then produced against an agreed timeline. MOQs exist because setup and print alignment are part of the economics.",
  },
  {
    id: "q3",
    subject: "What affects pricing",
    body:
      "Pricing is usually driven by size, quantity tiers, print complexity, material specification and freight. Your quote should explain the trade-offs clearly.",
  },
  {
    id: "q4",
    subject: "Compostable vs biodegradable vs recycled plastic",
    body:
      "These terms are not interchangeable. Compostable should be tied to standards and disposal guidance. Recycled plastic can be the right bridge for some brands. We help you choose language you can support.",
  },
  {
    id: "q5",
    subject: "Design inspiration and practical examples",
    body:
      "Strong ecommerce packaging is consistent, legible in poor lighting and aligned to fulfilment realities. Ask for examples relevant to your category during quoting.",
  },
  {
    id: "q6",
    subject: "Ready to move forward?",
    body:
      "If you are ready, send artwork (or what you have), target sizes and preferred quantities. We will confirm production details before anything goes ahead.",
  },
] as const;

export const guideNurture = [
  {
    id: "g1",
    subject: "Your compostable packaging guide",
    body:
      "Here is the guide you requested. It is written for ecommerce operators comparing options without fluffy claims.",
  },
  {
    id: "g2",
    subject: "Why packaging is part of customer experience",
    body:
      "Packaging is a touchpoint, not a container. It influences trust, clarity and repeat purchase — especially for DTC brands.",
  },
  {
    id: "g3",
    subject: "Common compostable packaging mistakes",
    body:
      "The most expensive mistakes are usually claims you cannot support, sizing that does not match fulfilment, and print files that are not production-ready.",
  },
  {
    id: "g4",
    subject: "What MOQ means (and when custom makes sense)",
    body:
      "MOQ exists for manufacturing reasons. If you are not at volume yet, planning still saves money later.",
  },
  {
    id: "g5",
    subject: "How to prepare your brand for custom packaging",
    body:
      "Start with vector brand assets, realistic size assumptions and a clear view of what you ship most often.",
  },
  {
    id: "g6",
    subject: "Ready for pricing?",
    body:
      "When you are ready, request a custom quote. Tell us what you know — we will help fill in the gaps.",
  },
] as const;

export function nurtureSummary() {
  return { brand: SITE_NAME, quoteNurture, guideNurture };
}
