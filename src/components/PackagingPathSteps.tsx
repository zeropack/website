import { packagingPathSteps, type PackagingPathStepIcon } from "@/content/packagingPathSteps";

function StepIcon({ kind }: { kind: PackagingPathStepIcon }) {
  const cls = "h-7 w-7";
  switch (kind) {
    case "quote":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M4 5h16v14H4z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      );
    case "accept":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <path d="m8.5 12.5 2.3 2.3 4.7-5.1" />
        </svg>
      );
    case "design":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M4 16l8-8 4 4-8 8H4z" />
          <path d="M13 7l2-2 4 4-2 2" />
        </svg>
      );
    case "production":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M4 12h16M7 12V8h10v4M7 12v4h10v-4" />
        </svg>
      );
    case "confirm":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M12 3 4 7v6c0 4 3 6.8 8 8 5-1.2 8-4 8-8V7z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "ship":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
          <circle cx="7" cy="17" r="1.5" />
          <circle cx="18" cy="17" r="1.5" />
        </svg>
      );
    case "receive":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M12 3v10M8.5 9.5 12 13l3.5-3.5" />
          <path d="M4 16h16v5H4z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls} aria-hidden>
          <path d="M3 12h18M12 3l9 9-9 9" />
        </svg>
      );
  }
}

export function PackagingPathSteps({
  variant = "climate",
  standalone = false,
  title = "A clear path to your new branded packaging",
}: {
  variant?: "climate" | "dark";
  /** When dark variant is used off the funnel page, renders the full gradient shell. */
  standalone?: boolean;
  title?: string;
}) {
  const isDark = variant === "dark";
  const showFunnelShell = isDark && standalone;

  return (
    <section
      className={
        showFunnelShell
          ? "relative isolate overflow-hidden border-y border-white/10 bg-[#070b12] py-14 text-slate-100 sm:py-20"
          : isDark
            ? "relative border-b border-white/10 bg-transparent py-14 sm:py-20"
            : "bg-[#f4faf7] py-14 sm:py-20"
      }
    >
      {showFunnelShell ? (
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_52%,rgba(0,168,243,0.28),transparent_46%),radial-gradient(circle_at_78%_50%,rgba(131,185,37,0.22),transparent_44%),linear-gradient(160deg,#04070d_0%,#08111d_26%,#102a21_58%,#0a1713_100%)]"
          aria-hidden
        />
      ) : null}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          className={
            isDark
              ? "max-w-4xl font-heading text-3xl font-semibold text-white sm:text-5xl"
              : "max-w-4xl font-heading text-2xl font-semibold text-charcoal sm:text-3xl lg:text-4xl"
          }
        >
          {title}
        </h2>
        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {packagingPathSteps.map((step, idx, arr) => (
            <div
              key={step.title}
              className={
                isDark
                  ? "relative rounded-2xl border border-white/15 bg-white/5 p-4"
                  : "zp-hover-lift relative rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm shadow-slate-300/20"
              }
            >
              <div className="flex items-center gap-3">
                <div
                  className={
                    isDark
                      ? "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-air/50 bg-air/15 text-air"
                      : "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-air/40 bg-air/10 text-air"
                  }
                >
                  <StepIcon kind={step.icon} />
                </div>
                <div>
                  <p
                    className={
                      isDark
                        ? "text-xs font-semibold uppercase tracking-[0.12em] text-air/80"
                        : "text-xs font-semibold uppercase tracking-[0.12em] text-air"
                    }
                  >
                    Step {idx + 1}
                  </p>
                  <p
                    className={
                      isDark ? "mt-1 text-sm font-semibold text-white/95" : "mt-1 text-sm font-semibold text-charcoal"
                    }
                  >
                    {step.title}
                  </p>
                </div>
              </div>
              {idx < arr.length - 1 ? (
                <span
                  className={
                    isDark
                      ? "pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-air/70 lg:block"
                      : "pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-air/60 lg:block"
                  }
                  aria-hidden
                >
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
