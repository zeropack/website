"use client";

import { useEffect, useRef, useState } from "react";
import { SiteImage } from "./SiteImage";
import { type StaticImageData } from "next/image";

type Slide = {
  image: StaticImageData;
  heading?: string;
  subheading: string;
  alt: string;
};

export function CustomMailerCarousel({
  slides,
  variant = "dark",
  priorityFirstSlide = false,
  permanentCaption = false,
}: {
  slides: Slide[];
  variant?: "dark" | "climate";
  /** Eager-load only the first slide (e.g. homepage hero LCP). */
  priorityFirstSlide?: boolean;
  /** Keep caption overlay visible instead of revealing on hover. */
  permanentCaption?: boolean;
}) {
  const isClimate = variant === "climate";
  const [index, setIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const prev = () => setIndex((current) => (current - 1 + slides.length) % slides.length);
  const next = () => setIndex((current) => (current + 1) % slides.length);

  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsInView(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.45 },
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || isHovered || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [isInView, isHovered, slides.length]);

  if (slides.length === 0) return null;

  const current = slides[index];

  const shellClass = isClimate
    ? "rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-mist/90 to-[#e3f2fa] p-3 shadow-lg shadow-slate-400/15 ring-1 ring-slate-200/70"
    : "rounded-3xl border border-white/15 bg-white/5 p-3 backdrop-blur-sm";

  const imageWrapClass = isClimate
    ? "relative overflow-hidden rounded-xl bg-gradient-to-br from-[#f4f7fb] via-white to-[#e8f3f8]"
    : "relative overflow-hidden rounded-2xl";

  const imageClass = isClimate
    ? "h-[min(380px,52vh)] w-full object-contain sm:h-[min(440px,58vh)]"
    : "h-[420px] w-full bg-[#081018] object-contain sm:h-[520px]";

  const captionClass = permanentCaption
    ? isClimate
      ? "absolute bottom-0 left-0 right-0 border-t border-slate-200/40 bg-white/50 p-4 text-center backdrop-blur-sm sm:p-5"
      : "absolute bottom-0 left-0 right-0 bg-charcoal/50 p-5 text-center backdrop-blur-sm sm:p-6"
    : isClimate
      ? "absolute bottom-0 left-0 right-0 border-t border-slate-200/40 bg-white/85 p-4 backdrop-blur-sm transition-transform duration-300 ease-out will-change-transform motion-reduce:translate-y-0 sm:p-5 [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:group-hover:translate-y-0"
      : "absolute bottom-0 left-0 right-0 bg-charcoal/75 p-5 backdrop-blur-sm transition-transform duration-300 ease-out will-change-transform motion-reduce:translate-y-0 sm:p-6 [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:group-hover:translate-y-0";

  const headingClass = isClimate
    ? "font-heading text-xl font-semibold text-charcoal sm:text-2xl"
    : "font-heading text-2xl font-semibold text-white sm:text-3xl";

  const subheadingClass = isClimate
    ? "mt-1 max-w-xl text-sm text-charcoal/75 sm:text-base"
    : "mt-2 max-w-xl text-sm text-white/85 sm:text-base";

  const navBtnClass = isClimate
    ? "inline-flex items-center justify-center rounded-lg border border-compost/25 bg-white px-3 py-2 text-sm font-semibold text-compost shadow-sm transition hover:border-compost/40 hover:bg-mist sm:px-4"
    : "inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10";

  const dotInactive = isClimate ? "bg-slate-300 hover:bg-slate-400" : "bg-white/35 hover:bg-white/55";

  return (
    <div ref={rootRef} className={shellClass}>
      <div
        className={`group ${imageWrapClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SiteImage
          src={current.image}
          alt={current.alt}
          width={current.image.width}
          height={current.image.height}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={imageClass}
          priority={priorityFirstSlide && index === 0}
        />
        <div className={captionClass}>
          {current.heading ? <p className={`${headingClass} text-center`}>{current.heading}</p> : null}
          <p
            className={
              current.heading
                ? `${subheadingClass} mx-auto text-center`
                : `${headingClass} text-center ${isClimate ? "text-charcoal/80" : "text-white/90"}`
            }
          >
            {current.subheading}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-3">
        <button type="button" onClick={prev} className={navBtnClass} aria-label="Previous slide">
          Previous
        </button>
        <div className="mx-auto flex max-w-[240px] flex-wrap items-center justify-center gap-2 sm:max-w-[360px]">
          {slides.map((slide, dotIndex) => (
            <button
              key={`${slide.alt}-${dotIndex}`}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Go to slide ${dotIndex + 1}`}
              aria-current={index === dotIndex ? "true" : undefined}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${index === dotIndex ? "bg-air" : dotInactive}`}
            />
          ))}
        </div>
        <button type="button" onClick={next} className={navBtnClass} aria-label="Next slide">
          Next
        </button>
      </div>
    </div>
  );
}