"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";

type Slide = {
  image: StaticImageData;
  heading: string;
  subheading: string;
  alt: string;
};

export function CustomMailerCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const prev = () => setIndex((current) => (current - 1 + slides.length) % slides.length);
  const next = () => setIndex((current) => (current + 1) % slides.length);

  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.45 },
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [isInView, slides.length]);

  if (slides.length === 0) return null;

  const current = slides[index];

  return (
    <div ref={rootRef} className="rounded-3xl border border-white/15 bg-white/5 p-3 backdrop-blur-sm">
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={current.image}
          alt={current.alt}
          className="h-[420px] w-full bg-[#081018] object-contain sm:h-[520px]"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <p className="font-heading text-2xl font-semibold text-white sm:text-3xl">{current.heading}</p>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{current.subheading}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <button
          type="button"
          onClick={prev}
          className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          aria-label="Previous slide"
        >
          Previous
        </button>
        <div className="mx-auto flex max-w-[240px] flex-wrap items-center justify-center gap-2 sm:max-w-[360px]">
          {slides.map((slide, dotIndex) => (
            <button
              key={`${slide.heading}-${dotIndex}`}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Go to slide ${dotIndex + 1}`}
              className={`h-2.5 w-2.5 rounded-full ${index === dotIndex ? "bg-air" : "bg-white/35 hover:bg-white/55"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          aria-label="Next slide"
        >
          Next
        </button>
      </div>
    </div>
  );
}
