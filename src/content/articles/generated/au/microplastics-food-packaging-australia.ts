import type { Article } from "../../types";

export const microplasticsFoodPackagingAustralia: Article = {
  slug: "microplastics-food-packaging-australia",
  title: "Microplastics in Food and Packaging: What the Evidence Says in Australia",
  metaTitle: "Microplastics in Food & Packaging: Australian Evidence",
  category: "Packaging regulation & claims",
  description:
    "What does the evidence say about microplastics in food and packaging in Australia? Learn what is known, uncertain and practical low-regret steps.",
  publishedAt: "2026-09-19",
  market: "AU",
  jurisdiction: ["Australia"],
  projectAttribution: "A Zero Pack + Zero Waste Co public information project",
  hideGuidePromo: true,
  primaryKeyword: "microplastics in food Australia",
  secondaryKeywords: [
    "microplastics in food packaging",
    "microplastics health effects",
    "plastic chemicals in food packaging",
    "FSANZ microplastics",
    "chemical migration from packaging",
    "how to reduce microplastic exposure",
  ],
  topics: [
    "Microplastics",
    "Food packaging",
    "Plastic chemicals",
    "Chemical migration",
    "Human-health evidence",
    "Australia",
  ],
  relatedSlugs: [
    "how-to-reduce-plastic-packaging-in-ecommerce",
    "compostable-vs-biodegradable-packaging",
    "eco-friendly-packaging-guide",
  ],
  answerBox:
    "Microplastics have been found in food, water, air and human samples, and some food-contact materials can release particles or chemicals during use. But detection is not proof of harm, and current evidence does not establish that everyday microplastic exposure causes a specific human disease. Sensible action can reduce some pathways and plastic pollution without overstating what science can currently prove.",
  cta: {
    title: "Keep exploring",
    text: "Browse more evidence-led packaging guidance, or explore Zero Pack’s custom compostable packaging range. These links do not imply a human-health benefit for any packaging material.",
    links: [
      { label: "Articles and guides", href: "/articles/", variant: "secondary" },
      {
        label: "Custom compostable packaging",
        href: "/custom-compostable-packaging/",
        variant: "ghost",
      },
    ],
  },
  sections: [
    {
      id: "why-this-conversation-matters",
      heading: "Why this conversation matters",
      paragraphs: [
        "Microplastics have moved from an environmental issue into everyday questions about food, packaging and health. Headlines often compress several different questions into one: Are tiny plastic particles present? Can a package shed particles? Can chemicals move from packaging into food? Does any of this cause illness in people? These questions are connected, but they are not interchangeable.",
        "This article separates the evidence into those distinct parts. It focuses on food and food-contact packaging, explains the current Australian regulatory position, and identifies practical steps that are proportionate to the evidence. It is educational information, not individual medical advice.",
      ],
    },
    {
      id: "what-are-microplastics-and-nanoplastics",
      heading: "What are microplastics and nanoplastics?",
      paragraphs: [
        "Microplastics are generally described as plastic particles smaller than 5 millimetres, although lower size limits vary between studies and authorities. Some are manufactured at a small size; others form as larger plastic items fragment, wear or degrade. Nanoplastics are smaller again, but definitions vary and reliable measurement in complex samples remains especially difficult.",
        "Important distinction. A study that measures larger microplastics cannot automatically tell us how many nanoplastics are present. Methods, size ranges and contamination controls differ, so results from different studies are often not directly comparable.",
      ],
    },
    {
      id: "plastic-is-more-than-a-polymer",
      heading: "Plastic is more than a polymer",
      paragraphs: [
        "Plastic products can contain the base polymer, additives used to create particular properties, residual substances from manufacturing, and contaminants. Chemicals may also be present in inks, coatings, adhesives or other parts of a packaging system. The presence of a chemical does not by itself establish a harmful dose, and a chemical detected in a human sample cannot usually be traced to one package or product without much stronger source evidence.",
        "[A 2024 evidence map](https://www.nature.com/articles/s41370-024-00718-2) reported human biomonitoring evidence for 3,601 of 14,402 known food-contact chemicals. That finding shows that exposure research has substantial gaps and that many food-contact chemicals have been measured in people. It does not prove that food packaging caused every detection or that every detected substance caused harm.",
      ],
    },
    {
      id: "particle-shedding-and-chemical-migration",
      heading: "Particle shedding and chemical migration are different",
      table: {
        headers: ["Mechanism", "What it means", "What it does not prove"],
        rows: [
          [
            "Particle release or shedding",
            "Physical release of plastic particles or fibres from a material.",
            "That every product sheds the same amount, or that a measured release caused disease.",
          ],
          [
            "Chemical migration",
            "Transfer of chemical constituents or contaminants from a food-contact material into food or drink.",
            "That migrated chemicals are microplastics, or that any migration is automatically harmful.",
          ],
        ],
      },
      paragraphs: [
        "[EFSA’s 2025 review](https://efsa.onlinelibrary.wiley.com/doi/10.2903/sp.efsa.2025.EN-9733) found evidence that food-contact materials can release microplastics during use, particularly under mechanical stress and from open or fibrous structures. It also found frequent study-quality problems, almost no useful nanoplastic release data, and insufficient evidence for a reliable exposure estimate. EFSA concluded that actual release is likely lower than many reported estimates.",
        "Chemical migration depends on the material, the chemical, the food, temperature, duration and conditions of use. [Australian requirements](https://www.foodstandards.gov.au/business/food-safety/food-packaging) focus on packaging being fit for its intended use and unlikely to contaminate food. FSANZ’s surveys and assessments support low dietary exposure for the chemicals and foods examined, but they do not prove zero migration or universal safety for every material and use.",
      ],
    },
    {
      id: "how-people-can-be-exposed",
      heading: "How people can be exposed",
      paragraphs: [
        "Microplastics have been reported in [drinking water](https://www.who.int/publications/i/item/9789241516198) and other exposure media, [including food and air](https://www.who.int/publications/i/item/9789240054608). The defensible conclusion is that exposure occurs. The size of population exposure, the contribution of different sources and the health significance remain uncertain.",
      ],
      bullets: [
        "Ingestion can occur through food and drinking water.",
        "Inhalation can occur through airborne particles and fibres.",
        "Food-contact materials may contribute to exposure through particle release or chemical migration, depending on the material and use conditions.",
        "Most studies cannot trace a particle detected in a person back to a particular meal, package or product.",
      ],
    },
    {
      id: "what-researchers-have-observed-in-people",
      heading: "What researchers have observed in people",
      paragraphs: [
        "Human-health research is developing, but the evidence base is still small. [A 2024 rapid systematic review](https://pubmed.ncbi.nlm.nih.gov/39692326/) identified only three human observational studies alongside 28 animal studies for selected digestive, reproductive and respiratory outcomes. Its conclusion supports concern and further research; it does not establish that ordinary microplastic exposure causes specific disease in people.",
        "[A 2024 observational study](https://www.nejm.org/doi/full/10.1056/NEJMoa2309822) reported an association between detecting micro- and nanoplastics in carotid plaque and a higher rate of a composite cardiovascular outcome. Because the study was observational, it cannot establish cause and effect. [Published correspondence](https://pubmed.ncbi.nlm.nih.gov/38718368/) also raised questions about contamination control. This is an emerging association, not proof that microplastics caused cardiovascular events.",
      ],
    },
    {
      id: "laboratory-and-animal-studies",
      heading: "What laboratory and animal studies can and cannot show",
      paragraphs: [
        "Laboratory and animal studies can identify biological mechanisms and hazards under specified conditions. They are important for deciding what to investigate next. But dose, particle type, exposure route and biological response may differ from ordinary human exposure. Animal or laboratory effects should not be translated into a claim that the same disease outcome occurs in people at everyday exposure levels.",
      ],
    },
    {
      id: "why-the-measurements-are-difficult",
      heading: "Why the measurements are difficult",
      paragraphs: [
        "Microplastic research is technically demanding. Sampling contamination, inconsistent size thresholds, polymer misidentification, incomplete recovery data and different analytical methods can all change the result. Research on human tissue needs particularly strong contamination controls and validated identification methods. [Recent work](https://pubs.acs.org/doi/10.1021/acs.est.4c12599) has described spectral interference capable of producing false-positive polymer identification in biological samples, while [researchers studying brain tissue](https://www.nature.com/articles/s41591-025-04045-3) have emphasised the need for method validation.",
        "Uncertainty is part of the evidence. It is not proof that no risk exists, and it is not a licence to turn preliminary results into certainty.",
      ],
    },
    {
      id: "what-australian-authorities-currently-say",
      heading: "What Australian authorities currently say",
      paragraphs: [
        "[Food Standards Australia New Zealand says](https://www.foodstandards.gov.au/business/food-safety/food-packaging) businesses must ensure food packaging is fit for its intended use and unlikely to contaminate food. Its work on chemical migration found assessed dietary exposures were low for the chemicals examined. [On BPA](https://www.foodstandards.gov.au/consumer/chemicals/bpa), FSANZ says small amounts may migrate and Australian dietary exposure is low and unlikely to pose a health risk, while acknowledging disagreement among international assessments of newer evidence.",
        "[FSANZ says](https://www.foodstandards.gov.au/consumer/our-safe-food-supply/microplastics) the scientific evidence on microplastics exposure and health risk is still evolving. As at 19 September 2026, its current view is that plastic contamination of the food chain is unlikely to result in immediate health risks to consumers, while further research and monitoring continue. This is a dated authority position, not a finding of zero risk or universal safety.",
        "These positions should be read within their scope. They do not mean every package is microplastic-free, chemical-free or universally safe under every condition. Equally, evidence that release or migration can occur does not prove that normal use causes illness.",
      ],
    },
    {
      id: "practical-low-regret-steps",
      heading: "Practical, low-regret steps",
      paragraphs: [
        "The following choices may reduce particular food-contact or pollution pathways. Direct evidence that they improve individual health outcomes is not established.",
        "Follow the manufacturer’s instructions. Use food-contact products within their intended temperature, appliance and reuse conditions.",
        "Use suitable glass or ceramic for heating when readily available. This avoids a plastic food-contact pathway during heating. Use containers suitable for the appliance and food.",
        "Replace heavily scratched, cracked or degraded plastic food-contact items. Damage may increase wear or make cleaning difficult. There is no universal replacement threshold or quantified health benefit.",
        "Reduce unnecessary single-use plastic. This reduces material demand and plastic-pollution pathways. Treat it primarily as a waste and pollution action, not a guaranteed medical intervention.",
        "Choose tap water where local authorities say it is safe. This may reduce packaging and some bottled-plastic contact. It does not mean tap water contains no microplastics, and local water advisories take priority.",
        "Avoid unsupported promises. Do not rely on detox or cleanse claims. Do not assume a household filter removes microplastics unless the specific product has suitable independent validation and is maintained as directed.",
      ],
    },
    {
      id: "what-businesses-can-consider",
      heading: "What businesses can consider",
      bullets: [
        "Use packaging and food-contact products within their validated intended conditions.",
        "Ask suppliers for current material, additive, food-contact and testing documentation relevant to the actual use case.",
        "Avoid broad claims such as non-toxic, chemical-free, microplastic-free or safer for health unless specific evidence and legal review support the precise claim.",
        "Keep environmental claims specific, evidence-backed and appropriately qualified.",
        "Separate pollution and end-of-life benefits from human-health claims.",
      ],
      paragraphs: [
        "A material being compostable, bio-based or paper-based does not by itself prove it is free from additives, fragments or migration under every condition. Category labels are not health evidence.",
      ],
    },
    {
      id: "what-remains-uncertain",
      heading: "What remains uncertain",
      bullets: [
        "The contribution of different foods, packaging types, water and air to total exposure.",
        "Reliable measurement of nanoplastics in complex environmental and biological samples.",
        "Whether observed human associations reflect causation, confounding or measurement limitations.",
        "Which particle properties, doses and exposure windows matter most biologically.",
        "How laboratory and animal findings translate to ordinary human exposure.",
      ],
    },
    {
      id: "from-information-to-action",
      heading: "From information to action",
      paragraphs: [
        "The companion resource at /microplastics/ will bring the evidence into one place and provide two user-controlled tools: a representative finder based on current official sources, and a message builder that helps people express their own concerns and requests. The tool will not rank representatives, target people by political profile or automatically send a message. Users will review and control the final text.",
        "Until the hub launches, the most useful action is to stay specific: reduce unnecessary plastic where practical, use food-contact items as intended, and ask businesses and decision-makers for transparent, evidence-based standards without overstating unsettled health claims.",
      ],
    },
    {
      id: "evidence-note",
      heading: "Evidence note",
      paragraphs: [
        "Evidence last reviewed 19 September 2026. Microplastics and plastic-chemical research is evolving. This article will be updated when material new authority guidance, major systematic reviews, regulatory changes or substantiated corrections change the interpretation.",
      ],
    },
    {
      id: "sources-and-further-reading",
      heading: "Sources and further reading",
      paragraphs: [
        "1. [Food Standards Australia New Zealand — Survey of chemical migration from food contact packaging materials in Australian food](https://www.foodstandards.gov.au/science-data/monitoring-safety/survey-of-chemical-migration). Updated 25 February 2025. Evidence area: Australian food-contact migration survey.",
        "2. [Food Standards Australia New Zealand — Chemicals in food packaging](https://www.foodstandards.gov.au/consumer/chemicals/foodpackaging). Current page reviewed 19 September 2026. Evidence area: Australian food-contact regulatory context and exposure assessment.",
        "3. [Food Standards Australia New Zealand — P1034 Chemical Migration from Packaging into Food](https://www.foodstandards.gov.au/food-standards-code/proposals/P1034ChemicalMigrationfromPackagingintoFood). Completed 2017. Evidence area: Australian packaging-migration regulatory project.",
        "4. [Food Standards Australia New Zealand — Bisphenol A (BPA)](https://www.foodstandards.gov.au/consumer/chemicals/bpa). Updated 2 October 2025. Evidence area: BPA migration and Australian/international authority positions.",
        "5. [Australian Government — National Plastics Plan 2021](https://www.agriculture.gov.au/sites/default/files/documents/national-plastics-plan-2021.pdf). 2021. Evidence area: Australian plastic-pollution policy.",
        "6. [World Health Organization — Microplastics in drinking-water](https://www.who.int/publications/i/item/9789241516198). 2019. Evidence area: Drinking-water occurrence, treatment, risk and evidence gaps.",
        "7. [World Health Organization — Dietary and inhalation exposure to nano- and microplastic particles](https://www.who.int/publications/i/item/9789240054608). 30 August 2022. Evidence area: Exposure and human-health evidence review.",
        "8. [European Food Safety Authority — Presence of microplastics and nanoplastics in food](https://www.efsa.europa.eu/en/efsajournal/pub/4501). 2016. Evidence area: Food occurrence, exposure and data gaps.",
        "9. [European Food Safety Authority — Review of micro- and nanoplastic release from food-contact materials](https://efsa.onlinelibrary.wiley.com/doi/10.2903/sp.efsa.2025.EN-9733). 2025. Evidence area: Food-contact particle release and measurement quality.",
        "10. [Chartres et al. — Rapid systematic review of selected health outcomes](https://pubmed.ncbi.nlm.nih.gov/39692326/). 2024. Evidence area: Human observational and animal health evidence.",
        "11. [Geueke et al. — Evidence for widespread human exposure to food-contact chemicals](https://www.nature.com/articles/s41370-024-00718-2). 17 September 2024. Evidence area: Human biomonitoring evidence map.",
        "12. [Marfella et al. — Microplastics and Nanoplastics in Atheromas and Cardiovascular Events](https://www.nejm.org/doi/full/10.1056/NEJMoa2309822). 2024. Evidence area: Emerging human observational association.",
        "13. [New England Journal of Medicine correspondence and author reply on the atheroma study](https://pubmed.ncbi.nlm.nih.gov/38718368/). 2024. Evidence area: Contamination-control limitation.",
        "14. [Monikh et al. — Challenges in studying microplastics in human brain](https://www.nature.com/articles/s41591-025-04045-3). 2025. Evidence area: Human-tissue analytical limitations.",
        "15. [Rauert et al. — Analytical limits in pyrolysis–GC–MS measurement](https://pubs.acs.org/doi/10.1021/acs.est.4c12599). 2025. Evidence area: Analytical method limitations.",
        "16. [Food Standards Australia New Zealand — Microplastics in food](https://www.foodstandards.gov.au/consumer/our-safe-food-supply/microplastics). Updated 25 February 2025; reviewed 19 September 2026. Evidence area: Australian authority position on microplastics in food and immediate health risk.",
      ],
    },
  ],
  faqs: [],
};
