import type { PackagingPathStepIcon } from "@/content/packagingPathSteps";

export type PackagingPathFlowStep = {
  title: string;
  icon: PackagingPathStepIcon;
  summary: string;
  description: string;
  highlights: string[];
};

export const packagingPathFlowSteps: PackagingPathFlowStep[] = [
  {
    title: "Get Your Quote",
    icon: "quote",
    summary: "Tell us what you need — even if you only have rough estimates.",
    description:
      "Start with the quote form. Share what you know about sizes, monthly volumes, print intent and timeline. We use this to open the conversation and outline what detail is needed before sizes, packaging and design are confirmed.",
    highlights: [
      "Submit volumes, dimensions and destination market",
      "Explain print goals: logo-only through to full artwork",
      "Receive guidance on pricing drivers and MOQ feasibility",
      "No obligation to proceed until specification is locked",
    ],
  },
  {
    title: "Dimensions and Design confirmed",
    icon: "design",
    summary: "Finalise sizing, artwork and print — with free design support if needed.",
    description:
      "Before a final quote is issued, we align mailer dimensions to how you actually pack and ship. You supply artwork or work with our design team at no extra charge. Print placement, colours and finishing are confirmed and signed off in writing.",
    highlights: [
      "Confirm internal size and packing workflow fit",
      "Approve artwork proofs and brand colour intent",
      "Resolve print placement and finishing details",
      "Sign off specification before final quote is produced",
    ],
  },
  {
    title: "Quote is accepted",
    icon: "accept",
    summary: "Review the final quote, ask questions, then confirm in writing.",
    description:
      "Once sizes, packaging and design are confirmed, we produce your final quote — covering quantity tiers, print complexity, material choice and freight assumptions. Written acceptance locks the agreed scope before production begins.",
    highlights: [
      "Final quote issued against confirmed specification",
      "Review size, quantity and print breakdown",
      "Clarify lead times and freight route options",
      "Confirm payment or deposit terms and sign off in writing",
    ],
  },
  {
    title: "Production begins",
    icon: "production",
    summary: "Made-to-order manufacturing starts only after approval.",
    description:
      "Production runs against the agreed specification — not off-the-shelf stock. Material and print requirements are checked against compostable standards. We do not start manufacturing until the final quote is accepted and details are locked in.",
    highlights: [
      "Made-to-order run for your brand specification",
      "Quality checks aligned to material and print standards",
      "Manufacturing window confirmed for your order size",
      "No surprise changes without your written approval",
    ],
  },
  {
    title: "Final product confirmed",
    icon: "confirm",
    summary: "Quality verification before your order leaves the factory.",
    description:
      "Finished packaging is checked against the approved specification before dispatch is booked. You receive confirmation that the order meets the agreed standard — so what arrives matches what you signed off.",
    highlights: [
      "Pre-shipment quality review against approved spec",
      "Final confirmation before freight is released",
      "Specification match verified for print and dimensions",
      "Dispatch planning aligned to your delivery window",
    ],
  },
  {
    title: "Product Shipped",
    icon: "ship",
    summary: "Freight arranged to your region with tracking where available.",
    description:
      "Your order ships via the freight method agreed in quoting — air or sea depending on timeline, region and volume. Delivery dates depend on route and customs where applicable; we confirm expectations before dispatch.",
    highlights: [
      "Dispatch via agreed air or sea freight route",
      "Tracking shared when available for your shipment",
      "Delivery timeline confirmed for your market",
      "Import guidance for international orders where needed",
    ],
  },
  {
    title: "You receive your order",
    icon: "receive",
    summary: "Inspect on arrival and integrate into fulfilment.",
    description:
      "When cartons arrive, check quantities and condition against your purchase confirmation. Store packaging appropriately for compostable materials, then slot into your packing workflow. Contact us promptly if anything does not match specification.",
    highlights: [
      "Inspect delivery against order confirmation",
      "Store according to material handling guidance",
      "Integrate into warehouse or fulfilment process",
      "Reach out if anything differs from approved spec",
    ],
  },
  {
    title: "You start shipping!",
    icon: "go",
    summary: "Every parcel carries your brand — and your sustainability story.",
    description:
      "Your custom compostable mailers go out with every order. Most brands settle into a reorder rhythm once volumes are predictable. We support repeat planning, specification tweaks and scaling as your business grows.",
    highlights: [
      "Consistent branded unboxing for every customer",
      "Credible compostable positioning in market",
      "Reorder planning when volumes stabilise",
      "Ongoing support for repeat production runs",
    ],
  },
];
