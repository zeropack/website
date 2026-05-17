export function ProcessSteps({
  title,
  steps,
  footerNote,
  variant = "default",
}: {
  title: string;
  steps: { title: string; body: string }[];
  footerNote?: string;
  variant?: "default" | "climate";
}) {
  const isClimate = variant === "climate";

  return (
    <section className={isClimate ? "bg-[#f4faf7] py-14 sm:py-20" : "bg-stone py-14 sm:py-20"}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{title}</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className={
                isClimate
                  ? "zp-hover-lift rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-300/20 hover:shadow-md"
                  : "zp-hover-lift rounded-2xl border border-black/5 bg-white p-6 hover:shadow-md"
              }
            >
              <p
                className={
                  isClimate
                    ? "text-xs font-semibold uppercase tracking-wide text-air"
                    : "text-xs font-semibold uppercase tracking-wide text-leaf"
                }
              >
                Step {i + 1}
              </p>
              <h3 className="mt-2 font-heading text-lg font-semibold text-compost">{s.title}</h3>
              <p className="mt-2 text-sm text-charcoal/75">{s.body}</p>
            </li>
          ))}
        </ol>
        {footerNote ? <p className="mt-8 text-sm text-charcoal/65">{footerNote}</p> : null}
      </div>
    </section>
  );
}
