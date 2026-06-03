import type { Article } from "./types";

const PILLAR = "/packaging-guide/";

export const articlesPartB: Article[] = [
  {
    slug: "how-to-reduce-plastic-packaging-in-ecommerce",
    title: "How to Reduce Plastic Packaging in Ecommerce: A Step-by-Step Transition Guide",
    category: "Plastic alternatives",
    description:
      "How to reduce plastic packaging in ecommerce — a practical eight-step process from audit to communication, a transition checklist, what not to do when replacing plastic, and guidance on the strongest alternative materials.",
    publishedAt: "2026-02-01",
    dateModified: "2026-06-01",
    primaryKeyword: "how to reduce plastic packaging in ecommerce",
    secondaryKeywords: ["reduce plastic packaging", "eco friendly packaging", "compostable mailers"],
    pillarPath: PILLAR,
    relatedSlugs: ["compostable-mailers-vs-recycled-plastic-mailers", "eco-friendly-mailers-guide", "eco-friendly-packaging-guide"],
    howToSteps: [
      { name: "Audit your current packaging", text: "Document every packaging format you use — sizes, materials, monthly volumes, failure modes, and any carrier or 3PL constraints. This baseline determines what the replacement must achieve." },
      { name: "Identify failure points", text: "Note what is going wrong with current packaging — seal failures, moisture damage, wrong sizes, carrier damage — and ensure any replacement solves those problems first." },
      { name: "Compare alternatives", text: "Evaluate recycled plastic, paper/kraft, and certified compostable film against your product type, customer markets, claims requirements, and budget." },
      { name: "Test samples", text: "Request samples from your shortlisted supplier and test them against your actual products, pack speeds, and courier network before committing to production." },
      { name: "Confirm certification", text: "For compostable packaging, confirm the specific standard (AS5810, EN 13432 etc.), certifying body, certificate number, and whether it is home or industrial compostable." },
      { name: "Run down existing stock", text: "Place the new custom order so it arrives as existing plastic stock runs low — ideally with a small overlap. Do not dispose of usable packaging early." },
      { name: "Launch the new packaging", text: "Switch to the new packaging as existing stock depletes. Time the switch to coincide with a product launch, seasonal reset, or brand moment where possible." },
      { name: "Communicate clearly to customers", text: "Tell customers what changed, why, and exactly what to do with the new packaging — for compostable, name the certification and give specific disposal instructions." },
    ],
    keyTakeaways: [
      "Start with a clear audit of your current packaging — sizes, volumes, failure modes, and what you are claiming to customers.",
      "Replacement packaging must solve the same fulfilment job before it can add environmental benefit — protection, sealing, carrier compatibility.",
      "Phasing the transition reduces risk and allows operational problems to surface before they affect large volumes.",
      "Custom branded compostable mailers are the most direct replacement for conventional plastic poly mailers in most soft-goods categories.",
      "Running down existing plastic stock before switching avoids waste and simplifies the changeover.",
    ],
    sections: [
      {
        id: "step-by-step",
        heading: "How to reduce plastic packaging in ecommerce: eight steps",
        paragraphs: [
          "Reducing plastic packaging in ecommerce is a manageable transition when approached in a defined sequence. The eight steps below take you from understanding your current situation to communicating the change to customers — with the right decision points at each stage.",
        ],
        numberedList: [
          "Audit your current packaging — document every format, size, monthly volume, failure mode, and any carrier or 3PL constraint. This baseline defines what the replacement must do.",
          "Identify failure points — note what is going wrong with current packaging (seal failures, moisture damage, wrong sizes) and ensure any replacement solves those problems before adding environmental benefit.",
          "Compare alternatives — evaluate recycled plastic, paper/kraft, and certified compostable film against your product type, customer markets, claims requirements, and budget. For a detailed comparison, see the [Compostable Mailers vs Recycled Plastic guide](/articles/compostable-mailers-vs-recycled-plastic-mailers/).",
          "Test samples — request samples from shortlisted suppliers and test against your actual products, pack speeds, and courier conditions before committing to production.",
          "Confirm certification — for compostable packaging, confirm the specific standard (AS5810, EN 13432, ASTM D6400), certifying body, certificate number, and whether it is home or industrial compostable.",
          "Run down existing stock — place the new custom order to arrive as existing plastic stock runs low, with a small overlap. Disposing of usable packaging early is wasteful and adds cost.",
          "Launch the new packaging — switch as existing stock depletes. Time the switch to align with a product launch, seasonal reset, or rebrand moment where possible, to maximise the brand communication opportunity.",
          "Communicate clearly to customers — tell them what changed, why, and exactly what to do with the new packaging. For compostable, name the certification and give specific disposal instructions on the mailer itself.",
        ],
      },
      {
        id: "options",
        heading: "Understanding the alternatives to conventional plastic",
        paragraphs: [
          "The main alternatives to conventional plastic poly mailers for ecommerce brands are recycled plastic, paper or kraft, and compostable film. Each has a different environmental profile, different performance characteristics, and different implications for what you can claim.",
          "Recycled plastic reduces virgin plastic use and is lower cost — but remains plastic at end of life, with limited kerbside recycling available in most markets. It is a meaningful transitional step for brands where budget is the primary constraint. Paper mailers suit dry, flat, non-fragile products and markets with strong paper recycling — but their moisture resistance is limited and some paper packaging includes plastic coatings that make it non-recyclable.",
          "Certified compostable mailers are made from plant-based materials and designed to break down in composting conditions. When certified and correctly disposed of, they offer a different end-of-life pathway from any form of plastic. They are typically priced above recycled alternatives. For brands wanting a specific, defensible, customer-communicable environmental claim, compostable is the strongest available option for most soft-goods categories. For detail on evaluating eco friendly claims, see the [Eco Friendly Mailers guide](/articles/eco-friendly-mailers-guide/).",
        ],
      },
      {
        id: "what-not-to-do",
        heading: "What not to do when replacing plastic packaging",
        paragraphs: [
          "The transition from plastic packaging is straightforward when approached correctly — and predictably problematic when approached carelessly. These are the most common mistakes.",
        ],
        bullets: [
          "Do not switch material and size at the same time. Changing dimensions and material simultaneously multiplies the specification risk. Get the dimensions right first, then switch material.",
          "Do not commit to a full production run without testing samples. A compostable mailer that performs differently from conventional plastic in your packing workflow — different feel, different seal timing, different courier compatibility — is far better discovered on a sample than on arrival of 5,000 units.",
          "Do not make environmental claims before certification is confirmed. Saying 'we now use eco-friendly packaging' before you have confirmed the certification type, certifying body, and specific standard exposes you to greenwashing risk.",
          "Do not use vague disposal instructions. 'Compostable' without specifying home or industrial, without naming the certification, and without a specific disposal instruction is not useful guidance for customers — and is increasingly scrutinised by regulators.",
          "Do not dispose of existing plastic stock early. Running down current stock is the right approach — waste is waste, regardless of what material it is.",
          "Do not skip the supplier question process. Asking for the certificate number, expiry date, and certifying body is the minimum basis for a claim you can stand behind.",
        ],
      },
      {
        id: "customer-communication",
        heading: "How to communicate the switch to customers",
        paragraphs: [
          "Customers in fashion, beauty, lifestyle, and wellness categories notice packaging changes and comment on them — positively when the change is clearly explained, critically when it is not. Getting the communication right turns a packaging switch into a brand moment.",
          "The core message should be specific: what changed, why, and what customers should do with the new packaging. For certified compostable mailers: the material is plant-based, certified to AS5810 (or EN 13432, as applicable), and customers should place it in their home compost bin (or organics collection, as applicable). Include the certification mark on the packaging itself where space allows.",
          "Avoid overclaiming. 'We have switched to certified home compostable packaging to reduce our reliance on conventional plastic' is accurate and credible. 'Our packaging is now zero waste' is not. Specific and honest claims build more trust than aspirational ones that cannot be substantiated. When you are ready to begin, start with the [custom compostable mailers enquiry page](/trend-packaging-funnel/).",
        ],
      },
    ],
    faqs: [
      {
        question: "Is compostable always the best first step to reduce plastic packaging?",
        answer:
          "Not necessarily — the right first step is the one that matches your volumes, the claims you can support, and your fulfilment reality. Recycled plastic is a meaningful intermediate step for brands with tight budgets. Compostable is the strongest long-term position for brands wanting a specific, certified, customer-communicable environmental claim.",
      },
      {
        question: "Can I switch to compostable packaging without disrupting my fulfilment operation?",
        answer:
          "In most cases, yes. Well-specified compostable mailers replace conventional plastic mailers in the same workflow — same format, same closure, same courier compatibility. A pilot on a subset of orders before a full switch is a practical way to confirm this for your specific setup.",
      },
      {
        question: "Do I need to dispose of existing plastic packaging before switching?",
        answer:
          "No — run down existing stock before introducing the new packaging. Disposing of usable packaging early is wasteful. Plan the custom compostable reorder to arrive as existing stock runs low, with a small overlap to avoid gaps.",
      },
      {
        question: "How do I communicate a packaging switch to customers?",
        answer:
          "Be specific: what changed, why, and what customers should do with the new packaging. For compostable mailers: the material is plant-based, certified to a named standard, and should be placed in home compost or organics collection as applicable. Specific language builds more trust than vague sustainability claims.",
      },
      {
        question: "What is the minimum volume needed to make the switch to compostable mailers?",
        answer:
          "The practical starting point for most specifications is around 2,000 units. A brand dispatching 200 orders per month would use that in approximately 10 months; a brand at 500 per month in around four months. Zero Pack can advise on whether your current volume is at or near the threshold during an initial enquiry.",
      },
    ],
  },
  {
    slug: "what-to-ask-before-ordering-custom-packaging",
    title: "What to Ask Before Ordering Custom Packaging: A Complete Buyer's Checklist",
    category: "Artwork and ordering guidance",
    description:
      "What to ask before ordering custom packaging — a complete buyer's checklist covering specification, certification, commercial terms, and a comparison warning about how quotes often omit freight, design, and certification costs.",
    publishedAt: "2026-02-04",
    dateModified: "2026-06-01",
    primaryKeyword: "what to ask before ordering custom packaging",
    secondaryKeywords: ["custom compostable mailers", "branded packaging", "custom compostable packaging"],
    pillarPath: PILLAR,
    relatedSlugs: ["custom-compostable-mailers-guide", "how-custom-compostable-mailers-work", "what-moq-means-in-custom-packaging"],
    answerBox:
      "Before ordering custom packaging, ask about: material construction, internal dimensions, print method, compostable certification (standard, certifying body, certificate number), MOQ and tiered pricing, lead time from artwork approval, payment terms, and whether freight, design support, and certification are included in the quoted price.",
    keyTakeaways: [
      "Specification questions — size, material, print, certification — should be answered before accepting a quote.",
      "Ask for specific certification documentation, not just marketing language about eco credentials.",
      "Commercial questions — MOQ, lead time, tiered pricing, what happens if artwork is delayed — should be clarified upfront.",
      "Do not compare quotes unless you know whether freight, certification, design support, and delivery are included.",
      "You do not need final artwork or exact dimensions to start — estimates are enough for an initial conversation.",
    ],
    sections: [
      {
        id: "why-prepare",
        heading: "Why asking the right questions before ordering saves time and cost",
        paragraphs: [
          "Custom packaging is a made-to-order product. Once production begins — and certainly once artwork is approved — changes become increasingly expensive and disruptive. The time to ask questions, clarify specifications, and confirm commercial terms is before committing, not after.",
          "For first-time buyers, the unknown unknowns are the biggest risk. Not asking about home versus industrial compostable certification means you might receive packaging that does not match what your customers can do with it. Not confirming 3PL compatibility means discovering a dimension conflict after production. Not asking about lead time means planning for stock arrival three weeks earlier than reality allows.",
          "This checklist covers three categories: specification, certification, and commercial. For the full production process overview, see the [How Custom Compostable Mailers Work guide](/articles/how-custom-compostable-mailers-work/). For MOQ and volume readiness, see the [What MOQ Means in Custom Packaging guide](/articles/what-moq-means-in-custom-packaging/). This article also links from the enquiry funnel as a 'still researching?' resource — so it is designed to answer the questions buyers most often have before they are ready to commit.",
        ],
      },
      {
        id: "spec",
        heading: "Specification questions to ask your supplier",
        paragraphs: [
          "Start with the material itself. 'Compostable mailer' describes a category, not a specific material. The construction — which bio-based polymers, what thickness, what print method — affects performance, certification, and what the mailer can claim. Ask for internal dimensions, not external — internal dimensions determine whether your product fits. Ask about closure type: single adhesive strip or double-strip (for returns reuse). Ask about transit performance: moisture resistance, puncture resistance, seal strength at your product weight range.",
        ],
        bullets: [
          "What specific material construction is quoted — polymers, thickness, print method?",
          "What are the internal dimensions (not external)?",
          "Is the closure a single or double adhesive strip?",
          "What transit performance has been tested — waterproofing, seal strength, puncture resistance?",
          "Can samples be provided before the production run is committed?",
        ],
      },
      {
        id: "claims",
        heading: "Certification and claims questions",
        paragraphs: [
          "Ask for the specific compostability certification — the standard (AS5810, AS4736, EN 13432, ASTM D6400), the certifying body (ABAP, TÜV Austria, DIN CERTCO, BPI), a certificate number, and an expiry date. Ask whether it is home compostable or industrial compostable — this determines what disposal guidance you can give customers. Ask what disposal instructions you should put on the packaging, and whether there are regional infrastructure differences to consider for the markets you sell into.",
        ],
        bullets: [
          "What specific standard does the material meet, and who certified it?",
          "Is it home compostable or industrial compostable?",
          "What is the certificate number and expiry date?",
          "What disposal instructions should go on the packaging?",
          "Are there regional differences in composting infrastructure for my customer markets?",
        ],
      },
      {
        id: "commercial",
        heading: "Commercial questions to clarify before committing",
        paragraphs: [
          "Ask for tiered pricing across MOQ thresholds — not just the minimum run price. The difference between 2,000 and 10,000 units is often significant and affects your order size decision. Ask about lead time from artwork approval (not from enquiry date), and what happens to the timeline if artwork approval is delayed on your side. Ask about payment terms — deposit and balance structure. Ask whether the quoted price is ex-works or delivered.",
        ],
        bullets: [
          "What MOQ tiers exist and what is the per-unit cost at each?",
          "What is the realistic lead time from artwork approval to delivery?",
          "What happens to the timeline if artwork approval is delayed on our side?",
          "What are the payment terms — deposit, balance on delivery?",
          "Is the quoted price ex-works or delivered to our warehouse?",
        ],
      },
      {
        id: "comparison-warning",
        heading: "Do not compare quotes unless you know what each includes",
        paragraphs: [
          "A common mistake in custom packaging procurement is comparing quotes without confirming that each quote covers the same scope. The per-unit price is only part of the total cost — and it is often the part that obscures the biggest differences between suppliers.",
          "Before comparing quotes, confirm for each supplier whether the price includes: freight from the manufacturing facility to your warehouse (ex-works vs delivered); design or artwork support (some suppliers charge separately, some do not); certification documentation (included or at additional cost); and any import duties or customs fees applicable to your delivery country. A delivered price that includes design support and certification documentation from a supplier with clearly referenced certifications may represent better total value than a lower unit price that excludes all of these.",
          "The same caveat applies to lead time comparisons. A supplier quoting 6 weeks may be measuring from enquiry; another quoting 10 weeks may be measuring from artwork approval. Align the measurement before comparing.",
        ],
      },
      {
        id: "brief-preparation",
        heading: "What to have ready before getting a quote",
        paragraphs: [
          "Estimates are enough to begin — you do not need finalised artwork or exact dimensions. What helps is a clear picture of your product range, dispatch volume, timeline, and print intent. Useful information: your website URL or brand references; approximate internal dimensions based on your most common products; estimated monthly dispatch volume; print direction; delivery country; required-by date. If you use a 3PL, mention it.",
          "Useful files: vector logo if available (.ai, .eps, PDF), or a high-resolution PNG/JPG as a starting point; Pantone or HEX colour references; any brand guidelines. Zero Pack offers free design support. The starting point is the [custom compostable mailers enquiry page](/trend-packaging-funnel/).",
        ],
      },
    ],
    faqs: [
      {
        question: "What information do I need for a custom packaging quote?",
        answer:
          "Share your approximate mailer dimensions based on your most common products, estimated monthly dispatch volume, print direction (logo-only or more complex), delivery country, and required-by date. Even rough estimates in all fields produce a more accurate initial quote than a generic enquiry. A logo file and colour reference are also helpful for the artwork element.",
      },
      {
        question: "What questions should I ask a compostable packaging supplier?",
        answer:
          "Ask for: the specific compostability standard (AS5810, EN 13432, ASTM D6400 etc.), the certifying body (ABAP, TÜV Austria, BPI), a certificate number, and an expiry date. Ask whether the material is home compostable or industrial compostable. Ask what disposal instructions to give customers. And ask whether the quoted price includes freight, certification documentation, and design support.",
      },
      {
        question: "Should I ask for samples before ordering custom mailers?",
        answer:
          "Yes, if at all possible — particularly for a first order with a new specification. Samples allow you to test seal strength, waterproofing, print quality, and how the mailer handles your actual products and packing workflow. Zero Pack provides samples on request as part of the quoting process.",
      },
      {
        question: "What is the difference between ex-works and delivered pricing?",
        answer:
          "Ex-works means the price covers production only — you pay separately for freight from the manufacturing facility to your warehouse. Delivered price includes freight to a specified destination. When comparing quotes from multiple suppliers, always check whether freight is included, as this significantly affects the true total cost.",
      },
      {
        question: "How do I know if a compostable certification claim is genuine?",
        answer:
          "Ask for the specific standard, the certifying body, a certificate number, and an expiry date. A genuine certification is product-specific, time-limited, and issued by a named third-party body — not a self-declared claim in a marketing PDF. Confirm the certificate applies to the exact product specification you are buying.",
      },
    ],
  },
  {
    slug: "compostable-mailers-vs-recycled-plastic-mailers",
    title: "Compostable Mailers vs Recycled Plastic Mailers: A Direct Comparison",
    category: "Plastic alternatives",
    description:
      "Compostable mailers vs recycled plastic mailers — a side-by-side comparison table, verdict section by brand situation, budget vs brand positioning decision matrix, and balanced guidance on which choice is right for your ecommerce brand.",
    publishedAt: "2026-02-06",
    dateModified: "2026-06-01",
    primaryKeyword: "compostable mailers vs recycled plastic mailers",
    secondaryKeywords: ["compostable mailers", "recycled plastic mailers", "eco friendly mailers"],
    pillarPath: PILLAR,
    relatedSlugs: ["compostable-mailers-guide", "eco-friendly-mailers-guide", "how-to-reduce-plastic-packaging-in-ecommerce"],
    keyTakeaways: [
      "Compostable mailers vs recycled plastic mailers is not about which is inherently better — it depends on your brand positioning, budget, and customer infrastructure.",
      "Recycled plastic reduces virgin plastic use upstream; compostable offers a different disposal pathway downstream.",
      "Custom branded compostable mailers combine sustainability with full brand presentation — recycled plastic mailers offer less branding differentiation.",
      "Neither option delivers its environmental benefit automatically — both depend on customer behaviour and, for compostable, access to appropriate infrastructure.",
      "Many brands use recycled plastic as a transitional step while building to the MOQ for custom branded compostable.",
    ],
    sections: [
      {
        id: "side-by-side",
        heading: "Compostable vs recycled plastic mailers: side-by-side comparison",
        paragraphs: [
          "For ecommerce brands moving away from conventional plastic, recycled plastic and compostable film are the two most commonly considered alternatives. Both represent a genuine improvement over virgin plastic — but they are different improvements, and the choice between them affects what you can honestly claim, how the packaging performs, and what it costs.",
          "The table below compares both options across the dimensions that matter most. It is designed to be read honestly — including the limitations of each material. For the broader eco friendly mailer landscape beyond these two options, see the [Eco Friendly Mailers guide](/articles/eco-friendly-mailers-guide/). For the compostable mailer specifically — materials, certification, and specification — see the [Compostable Mailers guide](/articles/compostable-mailers-guide/).",
        ],
        table: {
          headers: ["Dimension", "Compostable mailers", "Recycled plastic mailers"],
          rows: [
            ["Material origin", "Plant-based (PLA, PBAT, or similar biopolymers)", "Post-consumer or post-industrial recycled polyethylene"],
            ["Environmental benefit", "Downstream: different end-of-life pathway (composting) when correctly disposed of", "Upstream: reduced virgin fossil-fuel plastic production"],
            ["End-of-life", "Home or industrial composting (certification dependent) — landfill if not composted", "Landfill or incineration (kerbside soft plastic recycling very limited in most markets)"],
            ["Certification", "Certifiable to named standards (AS5810, EN 13432 etc.) with independent third-party verification", "Recycled content percentage can be stated; no composting certification applicable"],
            ["Customer claim", "'Certified home compostable — place in your home compost bin' — specific, documentable", "'Made from recycled content' — meaningful but upstream only; no improved disposal instruction"],
            ["Fulfilment performance", "Comparable to conventional plastic when well-specified — same format, closure, and courier compatibility", "Comparable to conventional plastic — same format, familiar to fulfilment teams"],
            ["Brand presentation", "Full custom print available — plant-based material narrative strengthens sustainability positioning", "Full custom print available — recycled content narrative is weaker for brand-led sustainability positioning"],
            ["Unit cost", "Higher — reflects plant-based material and certification", "Lower — typically modest premium over virgin plastic"],
            ["MOQ", "Typically from ~2,000 units for custom compostable", "Typically from ~2,000 units for custom recycled"],
          ],
        },
      },
      {
        id: "verdict",
        heading: "Verdict: which should you choose?",
        paragraphs: [
          "The right choice is not universal — it depends on your brand positioning, your customers' composting access, and your budget. The verdict below is structured by situation.",
        ],
        bullets: [
          "Choose compostable mailers if: your brand has a sustainability positioning that customers engage with; your customers are in markets where home composting or organics collection is accessible; you want to make a specific, certified, customer-communicable environmental claim; and brand presentation quality matters.",
          "Choose recycled plastic mailers if: budget is the primary constraint and compostable's unit cost premium is not currently viable; your customers are primarily in markets with very limited composting infrastructure (making the compostable claim harder to support); or you are in a transitional phase while volumes build to the MOQ for custom compostable.",
          "Choose paper if: your products are dry, flat, non-fragile goods; your customer base is in markets with strong paper recycling infrastructure; and moisture performance in transit is not a concern. For most soft-goods ecommerce, paper is not the primary choice — but it suits specific product types well.",
        ],
      },
      {
        id: "budget-brand-matrix",
        heading: "Budget vs brand positioning: a decision matrix",
        paragraphs: [
          "Budget and brand positioning are the two most practical axes for this decision. The matrix below summarises the typical recommendation by brand situation.",
        ],
        table: {
          headers: ["Brand positioning", "Budget-constrained", "Budget available"],
          rows: [
            ["Sustainability-led", "Recycled plastic now; plan custom compostable as next step when volumes and budget allow", "Custom branded compostable mailers — the most coherent choice for the positioning"],
            ["Premium / quality-led", "Recycled plastic or paper as interim; custom compostable adds brand presentation to the environmental story", "Custom branded compostable mailers — closes the gap between premium product and premium packaging"],
            ["Price-led / commodity", "Recycled plastic — meaningful step at low cost premium; compostable's higher unit cost is harder to justify", "Recycled plastic — compostable's premium is unlikely to generate a measurable commercial return at this positioning"],
          ],
        },
      },
      {
        id: "performance-comparison",
        heading: "Fulfilment performance: how they compare in practice",
        paragraphs: [
          "In fulfilment terms, well-specified compostable and well-specified recycled plastic mailers perform comparably for most ecommerce soft-goods categories. Both can be produced with waterproof material, strong adhesive closures, and appropriate thickness for courier network conditions. The performance difference — damage rates, seal reliability, transit handling — is marginal when both are correctly specified.",
          "The key phrase is 'well-specified'. The quality range within both categories is wide. A poorly specified compostable mailer will underperform a well-specified recycled plastic one. The material category is not a performance guarantee; the specification is. Request samples and test them against your actual products and shipping conditions before committing to production. One difference to note: some compostable materials are more sensitive to prolonged UV exposure or sustained heat during storage than conventional plastic — raise this if your storage environment is exposed.",
        ],
      },
      {
        id: "choosing",
        heading: "Making the transition: sequential or direct?",
        paragraphs: [
          "Many brands make this decision sequentially — recycled plastic as a transitional step while volumes build to the custom compostable MOQ threshold, then custom branded compostable as the long-term position. That path is pragmatic and commercially coherent. The important thing is to be honest with customers about where you are in the journey.",
          "For brands ready to move directly to custom compostable, the starting point is the [custom compostable mailers enquiry page](/trend-packaging-funnel/). For brands evaluating the comparison in more depth, the [Compostable Mailers guide](/articles/compostable-mailers-guide/) covers certification and specification in detail.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which is more eco friendly — compostable or recycled plastic mailers?",
        answer:
          "They address different parts of the environmental impact. Recycled plastic reduces upstream virgin plastic production; compostable offers a different downstream disposal pathway. Neither is inherently better for every context — the right choice depends on your claims, your customers' composting access, and your brand positioning.",
      },
      {
        question: "Is compostable more expensive than recycled plastic?",
        answer:
          "Generally, yes. Certified compostable mailers typically carry a higher unit cost than recycled plastic alternatives. The premium reflects the plant-based material and certification. For brand-led ecommerce businesses, the return on the premium — in brand presentation, sustainability credibility, and customer perception — is usually measurable.",
      },
      {
        question: "Can recycled plastic mailers be custom branded?",
        answer:
          "Yes, recycled plastic mailers can be custom printed. However, the material itself does not carry the same brand narrative as a plant-based compostable alternative. For brands competing on sustainability positioning, branded compostable mailers typically deliver a stronger combined message.",
      },
      {
        question: "What if my customers do not have access to composting?",
        answer:
          "If your customers are in markets with limited home composting or organics collection infrastructure, the practical benefit of industrial compostable mailers is narrower. Home compostable certification is more accessible in markets where domestic composting is common. For markets with limited infrastructure, recycled plastic may be a more honest transitional choice while you work towards a credible compostable programme.",
      },
      {
        question: "Can I use recycled plastic now and switch to compostable later?",
        answer:
          "Yes — this is a common and commercially sensible transition path. Recycled plastic as a first step while volumes build to the MOQ threshold for custom compostable is a pragmatic approach. Be honest with customers about where you are in the journey at each stage.",
      },
    ],
  },
  {
    slug: "how-branded-packaging-improves-customer-experience",
    title: "How Branded Packaging Improves Customer Experience: The Post-Purchase Journey",
    category: "Ecommerce packaging",
    description:
      "How branded packaging improves customer experience — mapped across the six-stage post-purchase journey from order confirmation to reorder, with examples of customer experience improvements and evidence on perceived value and repeat purchase.",
    publishedAt: "2026-02-08",
    dateModified: "2026-06-01",
    primaryKeyword: "how branded packaging improves customer experience",
    secondaryKeywords: ["branded packaging customer experience", "branded mailers", "branded compostable packaging"],
    pillarPath: PILLAR,
    relatedSlugs: ["branded-mailers-for-ecommerce", "why-packaging-matters-for-ecommerce-brands", "eco-friendly-packaging-guide"],
    keyTakeaways: [
      "Branded packaging improves customer experience across the full post-purchase journey — not just the unboxing moment.",
      "A recognisable, well-designed mailer reduces delivery anxiety and builds confidence before the product is seen.",
      "Research consistently finds packaging aesthetics affect perceived product quality — even when the product itself is unchanged.",
      "Branded compostable packaging aligns the sustainability story a brand tells online with the physical experience customers receive.",
      "Every branded dispatch is a scalable brand impression — treat it as a recurring marketing investment, not a cost to minimise.",
    ],
    sections: [
      {
        id: "customer-journey",
        heading: "How branded packaging improves experience across the post-purchase journey",
        paragraphs: [
          "Most discussions of branded packaging focus on the unboxing moment. But packaging influences customer experience at every stage of the post-purchase journey — from the instant a customer receives their order confirmation to the moment they decide whether to reorder. Mapping branded packaging's role across this full journey reveals why it is a commercial investment, not just an aesthetic preference.",
        ],
        bullets: [
          "Order confirmation: Branded packaging set expectations. Customers who know a brand uses distinctive, premium packaging are primed to anticipate the experience before the order ships.",
          "Dispatch notification: For brands that photograph their packaging or share it in communications, dispatch can itself become a brand touchpoint — particularly when the packaging is distinctive enough to warrant showing.",
          "Parcel arrival: A recognisable branded mailer on the doorstep, in a post office, or on a parcel shelf reduces delivery anxiety. 'Is this actually my order from the brand I bought from?' is answered immediately by a clear, branded package.",
          "Opening (unboxing): The packaging is the first physical brand interaction after purchase. Packaging that looks considered and intentional primes the customer for a positive product experience. Generic packaging creates no such priming.",
          "Disposal or reuse: For compostable packaging, the disposal instruction on the pack turns end-of-life into a brand communication moment. 'Home compostable — place in your compost bin' is a clear instruction that demonstrates the brand has thought beyond the transaction.",
          "Review and reorder: Customers who feel that every element of their order — including the packaging — was considered are more likely to leave positive reviews and to return. Packaging quality is consistently mentioned in review sentiment in fashion, beauty, and lifestyle categories.",
        ],
      },
      {
        id: "recognition",
        heading: "Recognition: why a distinctive mailer matters before the product is seen",
        paragraphs: [
          "A distinctive branded mailer is immediately recognisable — on a doorstep, in a post office collection, on a building's parcel shelf. That recognition delivers a moment of confidence before the product is seen: 'this is my parcel, from the brand I trust, arriving as expected.' Plain packaging delivers no equivalent moment.",
          "For brands that have invested in visual identity, product quality, and customer communication, branded packaging completes the experience loop. Every communication the customer has had — the website, the product photography, the confirmation email — has been on-brand. The delivery should arrive on-brand too. That coherence is a form of trust, and trust is the foundation of repeat purchase.",
        ],
      },
      {
        id: "perceived-value",
        heading: "Perceived value: how branded packaging changes how customers evaluate the product",
        paragraphs: [
          "One of the most commercially significant effects of branded packaging is its influence on perceived product value. Research published in the Journal of Retailing and Consumer Services has consistently found that packaging aesthetics significantly affect how consumers evaluate the quality of the product inside — effects that hold even when the product itself is identical. Packaging is part of the product experience, not a container separate from it.",
          "For premium and mid-to-premium brands, this effect has direct financial implications. A product delivered in generic plastic packaging creates a mismatch between the price paid and the experience received — a mismatch that subtly undermines purchase satisfaction. A product delivered in quality branded packaging feels aligned with the price point, the brand, and the customer's expectations. That alignment translates into review sentiment, recommendation likelihood, and repeat purchase intent.",
        ],
      },
      {
        id: "sustainability-alignment",
        heading: "Branded compostable packaging: when values and experience align",
        paragraphs: [
          "For brands in fashion, beauty, lifestyle, and wellness — where sustainability values are part of the brand positioning — receiving an order in a certified compostable branded mailer creates an alignment between the story the brand tells and the experience it delivers. Customers who care about environmental issues notice when a brand's packaging contradicts its values. Branded compostable packaging turns the sustainability claim from a marketing assertion into a tangible customer experience.",
          "'We are committed to reducing plastic waste' is a statement. A certified home compostable mailer with disposal instructions printed on the pack is the same commitment, physically in the customer's hands. For the full overview of branded packaging's commercial and environmental case, the [2026 Branded and Eco Friendly Packaging Guide](/packaging-guide/) covers both in detail. To begin a quote for branded compostable packaging, use the [custom compostable mailers enquiry page](/trend-packaging-funnel/).",
        ],
      },
      {
        id: "social-sharing",
        heading: "Unboxing content and organic reach",
        paragraphs: [
          "Unboxing content — customers photographing and filming the experience of opening orders — is a consistently valuable organic format in fashion, beauty, and lifestyle categories. A well-designed branded mailer is the type of packaging that appears in this content. A plain plastic bag rarely does. Every customer who photographs your packaging delivers organic reach at no incremental cost.",
          "Social sharing cuts both ways. Brands whose packaging creates a mismatch — premium product in generic packaging, sustainability claim in conventional plastic — also surface in customer content, but as a negative example. Packaging that aligns with the brand removes this risk entirely and turns the delivery moment into a marketing opportunity rather than a liability.",
        ],
      },
    ],
    faqs: [
      {
        question: "How does branded packaging improve customer experience?",
        answer:
          "Branded packaging improves experience across the full post-purchase journey: it creates recognition at delivery, primes a positive product interaction during unboxing, communicates disposal guidance for sustainable packaging, and contributes to the overall quality impression that drives positive reviews and repeat purchase. It is a touchpoint the brand controls at scale.",
      },
      {
        question: "Do customers really care about branded packaging?",
        answer:
          "Yes — particularly in fashion, beauty, lifestyle, wellness, and gift categories where customers are emotionally engaged with the brands they buy from. Packaging quality consistently influences perceived product quality, purchase satisfaction, and repeat purchase intent. The effect is strongest for brands competing on positioning rather than price alone.",
      },
      {
        question: "How does branded packaging affect repeat purchase?",
        answer:
          "Branded packaging contributes to the overall quality of the customer experience — one of the primary drivers of repeat purchase. Customers who feel that every element of their order was considered, including the packaging, are more likely to return and recommend. This effect compounds across many orders.",
      },
      {
        question: "Can branded packaging also be compostable?",
        answer:
          "Yes. Custom branded compostable mailers — with your logo, colours, and artwork on certified compostable material — combine brand presentation with a credible sustainability story. This is the strongest combined option for most ecommerce brands in lifestyle, fashion, and beauty categories.",
      },
      {
        question: "What are some specific examples of branded packaging improving customer experience?",
        answer:
          "A recognisable parcel on the doorstep before the customer opens it. A premium first impression when the mailer is picked up. A clear disposal instruction ('home compostable — place in your compost bin') that turns end-of-life into a brand communication. Easier returns when the mailer has a double-adhesive closure. A shareable unboxing photo that becomes organic marketing. Each is a small moment — but together they define the post-purchase experience.",
      },
    ],
  },
  {
    slug: "home-compostable-vs-industrial-compostable-packaging",
    title: "Home Compostable vs Industrial Compostable Packaging: What the Difference Means",
    category: "Packaging compliance",
    description:
      "Home compostable vs industrial compostable packaging explained — what conditions each requires, a comparison table of certifications and customer instructions, how to choose the right type for your brand, and a short answer box for quick reference.",
    publishedAt: "2026-02-10",
    dateModified: "2026-06-01",
    primaryKeyword: "home compostable vs industrial compostable packaging",
    secondaryKeywords: ["home compostable packaging", "compostable packaging", "industrial compostable"],
    pillarPath: PILLAR,
    relatedSlugs: ["compostable-packaging-guide", "what-is-as5810-home-compostable-certification", "compostable-mailers-guide"],
    answerBox:
      "Home compostable packaging is designed for domestic compost conditions — a backyard compost bin at ambient temperatures. Industrial compostable packaging requires managed facility conditions, usually sustained temperatures above 55°C. The two types are not interchangeable: labelling industrial compostable packaging as 'home compostable' is incorrect guidance and a greenwashing risk.",
    keyTakeaways: [
      "Industrial compostable packaging requires managed facility conditions — typically above 55°C — that most domestic compost bins cannot replicate.",
      "Home compostable packaging is designed for domestic compost conditions and is generally subject to more demanding certification standards.",
      "The disposal instruction you give customers must match the specific certification of the material you are using.",
      "Neither is universally better — the right choice depends on your material needs, your customer base, and the disposal infrastructure they have access to.",
      "Mismatched claims — labelling industrial compostable packaging as home compostable — are a greenwashing risk and incorrect guidance for customers.",
    ],
    sections: [
      {
        id: "why-distinction-matters",
        heading: "Why the home vs industrial compostable distinction matters for your brand",
        paragraphs: [
          "'Compostable' as a single term covers two meaningfully different categories: home compostable and industrial compostable. The difference is not a technical footnote — it directly affects the disposal guidance you can give customers, the claims you can make in marketing, and whether the environmental benefit of the packaging is actually delivered.",
          "A brand that labels industrial compostable packaging as 'compostable — place in your home compost bin' has given customers incorrect guidance and made a claim the material's certification does not support. Most home compost bins do not reach the sustained temperatures required for industrial composting. The packaging will not break down reliably. The environmental outcome the brand paid for is not delivered.",
          "Understanding this distinction is fundamental to making compostable packaging claims that are accurate and credible. For the full certification reference — including global standards — see the [Compostable Packaging buyer's guide](/articles/compostable-packaging-guide/). For AS5810 specifically, see the [What Is AS5810 guide](/articles/what-is-as5810-home-compostable-certification/).",
        ],
      },
      {
        id: "comparison-table",
        heading: "Home compostable vs industrial compostable: a comparison",
        paragraphs: [
          "The table below compares home and industrial compostable packaging across the dimensions most relevant to ecommerce brands.",
        ],
        table: {
          headers: ["Dimension", "Home compostable", "Industrial compostable"],
          rows: [
            ["Required conditions", "Domestic compost bin — ambient temperatures, lower and more variable", "Managed composting facility — typically sustained above 55°C, controlled humidity"],
            ["Customer instruction", "'Place in your home compost bin after use'", "'Check your local organics collection or food waste service'"],
            ["Infrastructure dependency", "Low — most customers with outdoor space can compost at home", "High — depends on organics collection availability and acceptance of compostable packaging"],
            ["Certification examples (AU)", "AS5810 — certified by ABAP", "AS4736 — certified by ABAP"],
            ["Certification examples (Europe)", "OK compost HOME — certified by TÜV Austria", "EN 13432 — certified by TÜV Austria or DIN CERTCO"],
            ["Certification examples (North America)", "No standardised home compostable certification; industrial via ASTM D6400 / BPI", "ASTM D6400, D6868 — certified by BPI"],
            ["Best use case", "Markets where domestic composting is common; brands prioritising clear and accessible disposal guidance", "Markets with strong organics collection infrastructure; brands where home composting access is limited"],
            ["Misuse risk", "Lower — instruction is accessible to most customers", "Higher — instruction requires infrastructure not universally available"],
          ],
        },
      },
      {
        id: "home",
        heading: "Home compostable packaging in practice",
        paragraphs: [
          "Home compostable packaging is designed for domestic compost conditions — ambient temperatures in a backyard compost bin or heap. Because these conditions are cooler and less controlled than an industrial facility, home compostable certification is generally more demanding: the material must break down without sustained industrial heat. AS5810 in Australia and OK compost HOME in Europe set rigorous test criteria specifically for domestic environments.",
          "The customer instruction is simple and accessible: 'home compostable — place in your home compost bin after use'. This does not depend on local authority infrastructure or facility availability. For brands in markets where domestic composting is common, or where educating customers to adopt it is part of the brand story, home compostable is typically the more impactful and accessible choice.",
        ],
      },
      {
        id: "industrial",
        heading: "Industrial compostable packaging in practice",
        paragraphs: [
          "Industrial compostable packaging breaks down in managed composting facilities that sustain conditions — typically above 55°C, controlled humidity, active microbial management — that a domestic compost bin cannot replicate. The customer instruction directs customers to their local organics collection service: 'industrially compostable — check your local organics collection'. This instruction depends on infrastructure that varies significantly between regions and municipalities.",
          "For brands with customers primarily in urban markets with well-established organics collection, industrial compostable is a reasonable choice. For brands with customers across markets where organics collection is variable or limited, industrial compostable packaging may not deliver its environmental benefit for a significant proportion of customers — home compostable is typically more accessible.",
        ],
      },
      {
        id: "choosing",
        heading: "How to choose between home and industrial compostable",
        paragraphs: [
          "The right choice depends on three factors: your customers' composting access, the material performance requirements of your products, and what disposal guidance you can credibly provide. For most ecommerce brands selling to consumers across Australia, the UK, or the EU, home compostable is the more accessible choice — it does not depend on municipal infrastructure and gives customers a clear, actionable instruction.",
          "From a material performance perspective, some specifications differ between home and industrial compostable material — thickness, moisture resistance, and seal performance may vary. Discuss the performance trade-offs with your supplier before choosing. Zero Pack can advise on the material options available for your specific product and market. The starting point is the [custom compostable mailers enquiry page](/trend-packaging-funnel/). For a broader compostable packaging guide, see the [packaging guide](/packaging-guide/).",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between home compostable and industrial compostable packaging?",
        answer:
          "Home compostable packaging breaks down in a domestic compost bin at ambient temperatures — no industrial facility required. Industrial compostable packaging requires managed facility conditions, typically sustained above 55°C, which a domestic compost bin cannot replicate. The two are not interchangeable: each requires different certification and different customer disposal instructions.",
      },
      {
        question: "Which is better for ecommerce brands — home or industrial compostable?",
        answer:
          "Neither is universally better. Home compostable is more accessible for most customers because it does not depend on organics collection infrastructure. Industrial compostable suits brands in markets with strong organics collection services. The right choice depends on your customer base, market infrastructure, and the disposal guidance you can credibly provide.",
      },
      {
        question: "Can I call industrial compostable packaging 'home compostable'?",
        answer:
          "No. This gives customers incorrect disposal guidance and makes a claim the material's certification does not support. Industrial compostable packaging requires managed facility conditions that most home compost bins cannot replicate. Always match your disposal instructions to the specific certification.",
      },
      {
        question: "What happens to home compostable packaging in general waste?",
        answer:
          "In general waste, home compostable packaging goes to landfill or incineration — the same destination as conventional plastic. Compostable packaging only delivers its environmental benefit when it reaches a composting environment. Clear disposal instructions on the pack are essential.",
      },
      {
        question: "Are home compostable standards harder to meet than industrial?",
        answer:
          "Generally, yes. Home compostable certification requires packaging to break down at lower, more variable temperatures without industrial heat. AS5810 (Australia) and OK compost HOME (TÜV Austria) are among the more demanding home compostability standards globally.",
      },
    ],
  },
  {
    slug: "what-is-as5810-home-compostable-certification",
    title: "What Is AS5810? Australia's Home Compostable Certification Standard Explained",
    category: "Packaging compliance",
    description:
      "What AS5810 is, how it defines home compostability, how it compares to other global standards in a reference table, and what proof a supplier should provide — for ecommerce brands choosing certified compostable packaging.",
    publishedAt: "2026-02-12",
    dateModified: "2026-06-01",
    primaryKeyword: "AS5810 home compostable certification",
    secondaryKeywords: ["home compostable packaging", "compostable packaging certification", "AS5810"],
    pillarPath: PILLAR,
    relatedSlugs: ["home-compostable-vs-industrial-compostable-packaging", "compostable-packaging-guide", "compostable-vs-biodegradable-packaging"],
    keyTakeaways: [
      "AS5810 is Australia's home compostable certification standard — it defines conditions, timeframes, and pass/fail criteria for domestic composting environments.",
      "AS5810 certification is issued through ABAP, the recognised Australian certification body for compostable packaging.",
      "AS5810 (home compostable) and AS4736 (industrial compostable) are distinct standards — a product certified to one is not automatically certified to the other.",
      "AS5810 is one of the more demanding home compostability standards globally — 'world's highest standard' is an overstatement of a complex, multi-standard landscape.",
      "Customer-facing AS5810 claims must apply to the specific product purchased, not a general product category — always request the ABAP certificate number.",
    ],
    sections: [
      {
        id: "what-is",
        heading: "What AS5810 is and why it exists",
        paragraphs: [
          "AS5810 is the Australian Standard for home compostable packaging — developed by Standards Australia to define performance requirements for packaging intended to break down in domestic composting environments. It sits alongside AS4736 (industrial compostable) in Australia's suite of compostable materials standards. The two standards together define what manufacturers must demonstrate across different end-of-life environments.",
          "AS5810 exists because 'compostable' without qualification is not a meaningful technical claim. Industrial composting conditions — sustained high temperatures, controlled humidity — are fundamentally different from a domestic compost bin. A material that breaks down in an industrial facility may not break down in a home compost bin. The standard provides a testable, independently verifiable benchmark for home compostable claims.",
          "Standards Australia publishes AS5810 as the formal standard document. Certification and programme administration in Australia is managed by ABAP — the Australasian Bioplastics Association — which lists certified products in a publicly accessible database. For how home and industrial compostable differ in practice, see the [Home vs Industrial Compostable guide](/articles/home-compostable-vs-industrial-compostable-packaging/).",
        ],
      },
      {
        id: "global-standards-table",
        heading: "AS5810 compared to other compostable certification standards",
        paragraphs: [
          "AS5810 is one of the more demanding home compostability standards globally — this wording is accurate and defensible. The table below places it alongside other key international standards for reference.",
        ],
        table: {
          headers: ["Standard", "Type", "Market", "Certifying body / programme", "Notes"],
          rows: [
            ["AS5810", "Home compostable", "Australia", "ABAP (Australasian Bioplastics Association)", "Requires disintegration at domestic composting temperatures; ecotoxicity and composition criteria apply."],
            ["AS4736", "Industrial compostable", "Australia", "ABAP", "Requires breakdown in managed composting facility conditions — typically above 58°C."],
            ["EN 13432", "Industrial compostable", "Europe", "TÜV Austria (OK compost INDUSTRIAL), DIN CERTCO", "Dominant European standard for industrial composting; required for compostable packaging claims in many EU markets."],
            ["OK compost HOME", "Home compostable", "Europe / International", "TÜV Austria", "Widely recognised internationally; often paired with AS5810 for dual-market certification."],
            ["ASTM D6400", "Industrial compostable", "North America", "BPI (Biodegradable Products Institute)", "Primary North American industrial compostable standard. No direct equivalent home compostable standard in North America."],
            ["ASTM D6868", "Industrial compostable (coatings)", "North America", "BPI", "Covers compostable coatings and adhesives — relevant for paper-based packaging with compostable coatings."],
          ],
          footnote: "Sources: Standards Australia (AS5810/AS4736), ABAP, TÜV Austria, BPI. Verify current requirements with the relevant certifying body before making packaging claims.",
        },
      },
      {
        id: "what-it-requires",
        heading: "What AS5810 actually requires",
        paragraphs: [
          "AS5810 specifies technical requirements covering disintegration, ecotoxicity, and material composition. On disintegration, at least 90% of the packaging material — by dry weight — must pass through a 2mm sieve within a defined period when composted at temperatures representative of home composting conditions. The temperature ranges and durations reflect realistic domestic composting, not idealised laboratory or industrial conditions.",
          "On ecotoxicity, the compost produced during testing must meet plant germination and growth criteria — the resulting material must be neutral or beneficial to plant growth. Packaging that technically disintegrates but leaves phytotoxic residues will not pass. On composition, certain additives or substances harmful in a composting environment are restricted.",
          "These requirements together make AS5810 meaningful: it tests performance under conditions home compost bins actually experience, and it tests the safety of the resulting compost, not just the rate of breakdown. Because home composting environments lack the sustained heat of an industrial facility, AS5810 testing is generally considered more demanding than industrial compostable certification.",
        ],
      },
      {
        id: "abap-certification",
        heading: "How ABAP administers AS5810 certification",
        paragraphs: [
          "ABAP administers the certification programme for compostable packaging in Australia under both AS5810 (home) and AS4736 (industrial). Manufacturers submit products to third-party testing. ABAP issues certification once testing is passed and lists certified products in a publicly available database, which brands and retailers can use to verify claims independently.",
          "ABAP certification allows brands to use the seedling logo on packaging — with home compostable or industrial compostable designation — as visual evidence that the claim has been verified by a third party. For brands purchasing compostable packaging, requesting ABAP certification documentation from the supplier is the appropriate verification step. A credible supplier should provide the ABAP certificate or direct you to the public database listing, and the certificate should specify whether it is AS5810 or AS4736.",
          "Certification is product-specific. When a manufacturer certifies a specific mailer specification to AS5810, that certification applies to that specific product — its material composition, thickness, and construction. A different size or material variant is not automatically covered. Always confirm the certificate applies to the exact product you are purchasing.",
        ],
      },
      {
        id: "applying",
        heading: "What AS5810 certification means for your packaging decisions",
        paragraphs: [
          "For ecommerce brands, AS5810 certification means the home compostable claim is verifiable, documented, and backed by third-party testing. This matters commercially — retailers in sustainable product categories increasingly expect certification documentation. It matters regulatorily — the ACCC applies Australian Consumer Law to packaging claims, and unverified compostable claims are an area of active scrutiny. And it matters for customers — certification is the mechanism through which the environmental benefit is made credible.",
          "The practical implication: when purchasing compostable packaging, always request the ABAP certification number or certificate. Confirm whether it is AS5810 (home) or AS4736 (industrial). Match your disposal instructions and marketing claims to the specific certification. If a supplier cannot provide documentation, or if documentation is unclear about which standard applies, that is a significant red flag. For custom branded compostable packaging, the [custom mailers enquiry page](/trend-packaging-funnel/) is the starting point.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is AS5810 the same as home compostable?",
        answer:
          "AS5810 is Australia's certification standard for home compostable packaging. A product certified to AS5810 has passed testing confirming it breaks down in domestic composting conditions. However, not all products labelled 'home compostable' have been formally certified against AS5810 — always request ABAP certification documentation. Internationally, OK compost HOME (TÜV Austria) is the equivalent European standard.",
      },
      {
        question: "Is AS5810 recognised outside Australia?",
        answer:
          "AS5810 is an Australian standard and is directly relevant in the Australian market. It is not a formal international standard. For brands selling to European markets, OK compost HOME (TÜV Austria) is the more directly applicable certification. Some manufacturers certify packaging to both AS5810 and OK compost HOME to cover both Australian and European markets.",
      },
      {
        question: "Does AS5810 apply to every compostable mailer?",
        answer:
          "No. AS5810 applies only to products specifically tested and certified against the standard through ABAP. Many mailers described as 'compostable' in supplier catalogues have not been certified to AS5810. To confirm certification, request the ABAP certificate from the supplier, or check ABAP's publicly available certified product database directly.",
      },
      {
        question: "What proof should a supplier provide of AS5810 certification?",
        answer:
          "A supplier should provide the ABAP certification certificate for the specific product, including the ABAP registration number and confirmation of whether it is AS5810 (home) or AS4736 (industrial). You can independently verify certification via ABAP's publicly available certified product database. Do not accept claims of certification without documentation.",
      },
      {
        question: "Is AS5810 the world's highest home compostable standard?",
        answer:
          "AS5810 is one of the more demanding home compostability standards globally — this is accurate and defensible. Whether it is the 'world's highest' is difficult to assert definitively: different standards test different conditions and criteria, and other rigorous standards such as OK compost HOME (TÜV Austria) set similarly demanding requirements for their specific environments.",
      },
    ],
  },
];
