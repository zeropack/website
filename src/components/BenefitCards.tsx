import { pillars } from "@/content/global/pillars";

export function BenefitCards({ variant = "default" }: { variant?: "default" | "climate" }) {
  const isClimate = variant === "climate";

  return (
    <section
      className={
        isClimate
          ? "relative overflow-hidden bg-gradient-to-br from-charcoal via-[#152a1f] to-compost py-14 text-white sm:py-20"
          : "bg-compost py-14 text-white sm:py-20"
      }
    >
      {isClimate ? (
        <div
          className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(0,168,243,0.12),transparent_70%)]"
          aria-hidden
        />
      ) : null}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">What we focus on</h2>
        <p className="mt-3 max-w-2xl text-white/80">
          Presentation, material choice, practical MOQs, performance in transit, and certification guidance — so your
          packaging matches how you ship and how you want to be seen.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {pillars.map((p) => (
            <div
              key={p.title}
              className={
                isClimate
                  ? "zp-hover-lift rounded-2xl border border-white/10 bg-white/10 p-6 shadow-lg shadow-black/20 backdrop-blur-sm hover:border-white/20"
                  : "zp-hover-lift rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 hover:ring-white/20"
              }
            >
              <h3 className="font-heading text-lg font-semibold text-leaf">{p.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/85">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
