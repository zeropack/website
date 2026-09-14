export type CertificationFaqMarket = "global" | "au" | "uk";

export const PFAS_BPA_FAQ_ANSWER =
  "Yes. All Zero Pack compostable packaging is PFAS-free and BPA-free.\n\nAdditionally, our home-compostable packaging certified to AS 5810 undergoes worm-toxicity testing as part of the certification requirements, providing further assurance that it can compost without leaving harmful residues that are toxic to earthworms or compost.";

export const CERTIFICATION_FAQ_ANSWERS: Record<CertificationFaqMarket, string> = {
  global:
    "Yes. All Zero Pack compostable packaging is certified.\n\nOur compostable packaging is available with recognised home- and industrial-compostability certification, including AS 5810 and OK compost HOME for home compostability, and AS 4736 and OK compost INDUSTRIAL for industrial compostability.\n\nThe Australian standards are verified through the Australasian Bioplastics Association (ABA), while the OK compost certification schemes are administered by TÜV Austria.\n\nThe exact certification depends on the material and type of packaging being produced, and we’ll confirm the relevant certification for your project.",
  au:
    "Yes. All Zero Pack compostable packaging is certified.\n\nFor Australia, our home-compostable packaging is certified to AS 5810, while our industrial-compostable packaging is certified to AS 4736, with certification verified through the Australasian Bioplastics Association (ABA).\n\nThe exact certification depends on the material and type of packaging being produced, and we’ll confirm the relevant certification for your project.",
  uk:
    "Yes. All Zero Pack compostable packaging is certified.\n\nFor the UK, our home-compostable packaging is certified to both OK compost HOME and AS 5810, while our industrial-compostable packaging is certified to OK compost INDUSTRIAL.\n\nThis gives UK customers the reassurance of TÜV Austria’s OK compost certification alongside the additional requirements of the Australian AS 5810 home-compostability standard.\n\nThe exact certification depends on the material and type of packaging being produced, and we’ll confirm the relevant certification for your project.",
};
