import { CTAButton } from "./CTAButton";

export function CTASection({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  className = "",
  variant = "default",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  className?: string;
  variant?: "default" | "climate";
}) {
  const isClimate = variant === "climate";
  const shell = isClimate
    ? "rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] via-compost to-[#174a30] px-6 py-12 ring-1 ring-white/10 sm:px-10"
    : "rounded-2xl bg-compost px-6 py-12 sm:px-10";

  return (
    <section className={`${shell} text-white ${className}`}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-leaf">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-base text-white/90">{description}</p>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <CTAButton href={primary.href} variant="primary">
          {primary.label}
        </CTAButton>
        {secondary ? (
          <CTAButton href={secondary.href} variant="secondary">
            {secondary.label}
          </CTAButton>
        ) : null}
      </div>
    </section>
  );
}
