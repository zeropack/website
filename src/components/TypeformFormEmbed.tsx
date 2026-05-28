"use client";

import { useEffect, useRef } from "react";

const TYPEFORM_LIVE_ID = "01KS44H50J41Y5X1M9QPVS9JB1";
const TYPEFORM_EMBED_SRC = "https://embed.typeform.com/next/embed.js";

declare global {
  interface Window {
    tf?: {
      load?: () => void;
    };
  }
}

let embedScriptPromise: Promise<void> | null = null;

function ensureTypeformEmbedScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  if (window.tf?.load) return Promise.resolve();

  if (embedScriptPromise) return embedScriptPromise;

  embedScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TYPEFORM_EMBED_SRC}"]`);

    const finish = () => resolve();

    if (existing) {
      if (existing.dataset.loaded === "true" || window.tf?.load) {
        finish();
        return;
      }
      existing.addEventListener("load", finish, { once: true });
      existing.addEventListener("error", () => reject(new Error("Typeform embed failed to load")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = TYPEFORM_EMBED_SRC;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      finish();
    };
    script.onerror = () => reject(new Error("Typeform embed failed to load"));
    document.body.appendChild(script);
  });

  return embedScriptPromise;
}

export function TypeformFormEmbed({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;

    const mount = () => {
      host.replaceChildren();
      const target = document.createElement("div");
      target.setAttribute("data-tf-live", TYPEFORM_LIVE_ID);
      host.appendChild(target);
      window.tf?.load?.();
    };

    void ensureTypeformEmbedScript()
      .then(() => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          if (!cancelled) mount();
        });
      })
      .catch(() => {
        /* embed unavailable — host stays empty */
      });

    return () => {
      cancelled = true;
      host.replaceChildren();
    };
  }, []);

  return <div ref={hostRef} className={className} />;
}
