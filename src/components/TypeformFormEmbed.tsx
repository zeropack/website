"use client";

import { useEffect, useRef } from "react";

const TYPEFORM_LIVE_ID = "01KS44H50J41Y5X1M9QPVS9JB1";
const TYPEFORM_EMBED_SRC = "https://embed.typeform.com/next/embed.js";

type TypeformSubmitPayload = {
  formId?: string;
  responseId?: string;
};

declare global {
  interface Window {
    tf?: {
      load?: () => void;
    };
    dataLayer?: Array<Record<string, unknown>>;
    zeroPackTypeformSubmitted?: (payload?: TypeformSubmitPayload) => void;
  }
}

let embedScriptPromise: Promise<void> | null = null;

function registerTypeformSubmitCallback(): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  window.zeroPackTypeformSubmitted = function (payload: TypeformSubmitPayload = {}) {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "typeform_quote_submit",
      form_id: payload.formId || "",
      typeform_response_id: payload.responseId || "",
      form_name: "Request a Quote",
      conversion_name: "Request quote TF",
      conversion_value: 50,
      currency: "AUD",
    });
  };
}

function ensureTypeformEmbedScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  if (window.tf?.load) return Promise.resolve();

  if (embedScriptPromise) return embedScriptPromise;

  embedScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TYPEFORM_EMBED_SRC}"]`
    );

    const finish = () => resolve();

    if (existing) {
      if (existing.dataset.loaded === "true" || window.tf?.load) {
        finish();
        return;
      }

      existing.addEventListener("load", finish, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Typeform embed failed to load")),
        { once: true }
      );
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

    // This must exist before Typeform loads and before the user submits.
    registerTypeformSubmitCallback();

    const mount = () => {
      host.replaceChildren();

      const target = document.createElement("div");

      target.setAttribute("data-tf-live", TYPEFORM_LIVE_ID);

      // Keep the form inline on mobile instead of opening a fullscreen overlay modal.
      target.setAttribute("data-tf-inline-on-mobile", "");

      // This tells Typeform to call window.zeroPackTypeformSubmitted after successful submit.
      target.setAttribute("data-tf-on-submit", "zeroPackTypeformSubmitted");

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