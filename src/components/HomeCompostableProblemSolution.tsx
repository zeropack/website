import { globalHome } from "@/content/global/home";

type PublicMarket = "global" | "au" | "uk";

type CompostableTruth = typeof globalHome.compostableTruth;

const marketOverrides: Partial<Record<PublicMarket, CompostableTruth>> = {
  uk: {
    heading: "Home Compostability Needs More Than A Green Claim",
    intro:
      "UK brands need compostability language that matches the exact product documentation and the disposal routes available to customers. A recognised independent certification helps make the claim clearer without pretending every local collection or composting system works the same way.",
    problem: {
      title: "The Problem",
      items: [
        "Vague biodegradable or compostable language can be hard for customers to interpret",
        "Industrial and home composting are different end-of-life routes",
        "Local acceptance and treatment options vary across the UK",
        "High custom-production MOQs can make bespoke packaging inaccessible to growing brands",
      ],
    },
    solution: {
      title: "The Zero Pack Approach",
      items: [
        "TÜV OK compost HOME certification for the relevant home-compostable mailer specification",
        "Clear explanation of what the certification covers and where disposal limitations still apply",
        "Made-to-order custom production from around 2,000 units depending on specification",
        "Custom print and sizing designed around your brand and fulfilment requirements",
      ],
    },
  },
  au: globalHome.compostableTruth,
  global: globalHome.compostableTruth,
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function HomeCompostableProblemSolution({ market = "global" }: { market?: PublicMarket }) {
  const compostableTruth = marketOverrides[market] ?? globalHome.compostableTruth;

  return (
    <section className="border-y border-slate-200/35 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl lg:text-4xl">
          {compostableTruth.heading}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-charcoal/75">{compostableTruth.intro}</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 px-4 sm:px-6 md:grid-cols-2">
        <div className="zp-hover-lift rounded-2xl border-2 border-red-300/80 bg-gradient-to-br from-red-50/95 to-white p-6 shadow-sm shadow-red-100/30 sm:p-8">
          <h3 className="font-heading text-xl font-semibold text-charcoal sm:text-2xl">{compostableTruth.problem.title}</h3>
          <ul className="mt-5 space-y-3 text-charcoal/75">
            {compostableTruth.problem.items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 font-semibold text-red-600" aria-hidden>
                  ✗
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="zp-hover-lift rounded-2xl border-2 border-leaf/35 bg-gradient-to-br from-mist/95 to-white p-6 shadow-sm shadow-slate-200/25 sm:p-8">
          <h3 className="font-heading text-xl font-semibold text-charcoal sm:text-2xl">{compostableTruth.solution.title}</h3>
          <ul className="mt-5 space-y-3 text-charcoal/75">
            {compostableTruth.solution.items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-leaf" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
