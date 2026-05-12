export function FeatureGrid({
  title,
  subtitle,
  features,
  variant = "default",
}: {
  title: string;
  subtitle?: string;
  features: { title: string; description: string }[];
  variant?: "default" | "climate";
}) {
  const isClimate = variant === "climate";

  return (
    <section className={isClimate ? "bg-[#f0f6f9] py-14 sm:py-20" : "bg-white py-14 sm:py-20"}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-3 text-charcoal/75">{subtitle}</p> : null}
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className={
                isClimate
                  ? "rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-300/25"
                  : "rounded-2xl border border-black/5 bg-stone p-6"
              }
            >
              <h3 className="font-heading text-lg font-semibold text-compost">{f.title}</h3>
              <p className="mt-2 text-sm text-charcoal/75">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
