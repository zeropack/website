"use client";

import { packagingPathFlowSteps } from "@/content/packagingPathFlowDetails";
import { PackagingPathStepIcon } from "@/components/PackagingPathStepIcon";
import { Reveal } from "@/components/Reveal";

export function PackagingPathFlowchart() {
  return (
    <section className="relative overflow-hidden border-y border-slate-200/40 bg-gradient-to-b from-[#f4f7fb] via-white to-[#eef6f3] py-16 sm:py-24">
      <div
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(131,185,37,0.14),transparent_72%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(0,168,243,0.14),transparent_72%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-compost">Your packaging journey</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold text-charcoal sm:text-4xl">
              A clear path to your new branded packaging
            </h2>
            <p className="mt-4 text-lg text-charcoal/75">
              Eight connected stages from first quote to shipping with your customers. Sizes, packaging and design are
              confirmed before your final quote is produced — and nothing starts without written sign-off.
            </p>
          </div>
        </Reveal>

        <ol className="relative mt-14 lg:mt-20">
          <div
            className="pointer-events-none absolute bottom-12 left-1/2 top-12 hidden w-0.5 -translate-x-1/2 bg-gradient-to-b from-air via-leaf to-air lg:block"
            aria-hidden
          />

          {packagingPathFlowSteps.map((step, index) => {
            const isLast = index === packagingPathFlowSteps.length - 1;
            const isEven = index % 2 === 0;

            return (
              <li
                key={step.title}
                className={`relative ${isLast ? "" : "pb-12 sm:pb-16 lg:pb-20"}`}
              >
                <Reveal delayMs={Math.min(index * 60, 360)}>
                  <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] lg:items-start lg:gap-6">
                    <div className="hidden lg:col-start-1 lg:row-start-1 lg:block">
                      {isEven ? <StepCard step={step} index={index} align="right" /> : null}
                    </div>

                    <div className="relative z-10 flex flex-col items-center lg:col-start-2 lg:row-start-1">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-air/35 bg-gradient-to-br from-white via-[#f0f9fc] to-[#e8f3f8] text-air shadow-lg shadow-air/15 ring-4 ring-white">
                        <PackagingPathStepIcon kind={step.icon} className="h-7 w-7" />
                      </div>
                      <span className="mt-2 rounded-full bg-air/10 px-2.5 py-0.5 text-xs font-bold tabular-nums text-air">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {!isLast ? (
                        <div className="mt-4 flex flex-col items-center gap-1 lg:hidden" aria-hidden>
                          <span className="h-10 w-0.5 bg-gradient-to-b from-air/70 to-leaf/50" />
                          <span className="text-sm text-leaf">↓</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="hidden lg:col-start-3 lg:row-start-1 lg:block">
                      {!isEven ? <StepCard step={step} index={index} align="left" /> : null}
                    </div>

                    <div className="mt-5 lg:hidden">
                      <StepCard step={step} index={index} align="left" />
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <Reveal>
          <p className="mt-4 rounded-2xl border border-slate-200/60 bg-white/80 px-6 py-5 text-sm leading-relaxed text-charcoal/70 shadow-sm lg:mt-8">
            We do not overpromise speed. Production and delivery timelines depend on region, order quantity, print
            specification and freight method — confirmed in writing before manufacturing begins.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  align,
}: {
  step: (typeof packagingPathFlowSteps)[number];
  index: number;
  align: "left" | "right";
}) {
  return (
    <article
      className={`zp-hover-lift rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-md shadow-slate-300/15 backdrop-blur-sm sm:p-8 ${
        align === "right" ? "lg:text-right" : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-air">Step {index + 1}</p>
      <h3 className="mt-2 font-heading text-xl font-semibold text-charcoal sm:text-2xl">{step.title}</h3>
      <p className="mt-3 text-base font-medium text-compost">{step.summary}</p>
      <p className="mt-4 text-sm leading-relaxed text-charcoal/75 sm:text-base">{step.description}</p>
      <ul className={`mt-6 grid gap-2.5 sm:grid-cols-2 ${align === "right" ? "lg:justify-items-end" : ""}`}>
        {step.highlights.map((item) => (
          <li
            key={item}
            className={`flex gap-2 text-sm text-charcoal/75 ${align === "right" ? "lg:flex-row-reverse lg:text-right" : ""}`}
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
