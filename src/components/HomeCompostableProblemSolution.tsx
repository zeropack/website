import { globalHome } from "@/content/global/home";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function HomeCompostableProblemSolution() {
  const { compostableTruth } = globalHome;

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

