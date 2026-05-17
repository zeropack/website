"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    let timeoutId: number | undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (delayMs > 0) {
            timeoutId = window.setTimeout(() => setVisible(true), delayMs);
          } else {
            setVisible(true);
          }
          obs.disconnect();
          break;
        }
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [delayMs]);

  return (
    <div ref={ref} className={`zp-reveal ${visible ? "zp-reveal-visible" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}
