import { CTAButton } from "./CTAButton";
import { ProductMockupGallery } from "./ProductMockupGallery";

export function HeroSection({
  variant = "default",
  labelPill,
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  softCta,
}: {
  variant?: "default" | "climate";
  labelPill?: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  softCta?: { label: string; href: string };
}) {
  const isClimate = variant === "climate";

  return (
    <section
      className={
        isClimate
          ? "relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-br from-[#f4f7fb] via-white to-[#e8f3f8]"
          : "relative overflow-hidden bg-white"
      }
    >
      {isClimate ? (
        <>
          <div
            className="pointer-events-none absolute -right-24 -top-32 h-[min(420px,50vh)] w-[min(520px,55vw)] rounded-full bg-[radial-gradient(closest-side,rgba(0,168,243,0.14),transparent_72%)] blur-[2px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-40 -left-24 h-[min(380px,45vh)] w-[min(440px,50vw)] rounded-full bg-[radial-gradient(closest-side,rgba(131,185,37,0.12),transparent_70%)] blur-[2px]"
            aria-hidden
          />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--eco-mist),_transparent_55%)]" />
      )}
      <div
        className={
          isClimate
            ? "relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 lg:py-24"
            : "relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24"
        }
      >
        <div>
          {labelPill && isClimate ? (
            <p className="inline-flex max-w-full items-center rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-slate-600 shadow-sm shadow-slate-200/40 backdrop-blur-sm">
              {labelPill}
            </p>
          ) : null}
          {eyebrow ? (
            <p
              className={
                labelPill && isClimate
                  ? "mt-4 text-sm font-semibold uppercase tracking-wide text-compost/80"
                  : "text-sm font-semibold uppercase tracking-wide text-compost/80"
              }
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={
              isClimate
                ? "mt-3 font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-charcoal text-balance sm:text-5xl lg:text-[3.35rem]"
                : "mt-2 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-5xl"
            }
          >
            {title}
          </h1>
          <p
            className={
              isClimate
                ? "mt-5 max-w-xl text-lg text-slate-600 sm:text-xl"
                : "mt-5 max-w-xl text-lg text-charcoal/75"
            }
          >
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CTAButton href={primaryCta.href} variant="primary">
              {primaryCta.label}
            </CTAButton>
            {secondaryCta ? (
              <CTAButton href={secondaryCta.href} variant="secondary">
                {secondaryCta.label}
              </CTAButton>
            ) : null}
          </div>
          {softCta ? (
            <p className="mt-6 text-sm text-charcoal/70">
              <a className="font-medium text-air underline-offset-4 hover:underline" href={softCta.href}>
                {softCta.label}
              </a>
            </p>
          ) : null}
        </div>
        <ProductMockupGallery tone={isClimate ? "climate" : "default"} />
      </div>
    </section>
  );
}
