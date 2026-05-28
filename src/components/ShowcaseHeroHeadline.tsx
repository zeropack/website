"use client";

import { useEffect, useState } from "react";

const words = ["Creative", "Awesome", "Beautiful", "Bold"];

export function ShowcaseHeroHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <h1 className="font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-5xl">
      Make a statement with{" "}
      <span className="inline-block min-w-[9ch] text-air transition-opacity duration-300">{words[index]}</span> packaging
    </h1>
  );
}
