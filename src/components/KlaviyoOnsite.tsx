"use client";

import { useEffect } from "react";

const KLAVIYO_SCRIPT_ID = "klaviyo-onsite";
const KLAVIYO_SRC =
  "https://static.klaviyo.com/onsite/js/RAUuib/klaviyo.js?company_id=RAUuib";

declare global {
  interface Window {
    klaviyo?: unknown;
    _klOnsite?: unknown[];
  }
}

function initialiseKlaviyoObject() {
  if (window.klaviyo) return;

  window._klOnsite = window._klOnsite || [];

  try {
    window.klaviyo = new Proxy(
      {},
      {
        get(_target, property) {
          if (property === "push") {
            return (...args: unknown[]) => {
              window._klOnsite?.push(...args);
            };
          }

          return (...args: unknown[]) => {
            const callback =
              typeof args[args.length - 1] === "function"
                ? (args.pop() as (value: unknown) => void)
                : undefined;

            return new Promise((resolve) => {
              window._klOnsite?.push([
                property,
                ...args,
                (value: unknown) => {
                  callback?.(value);
                  resolve(value);
                },
              ]);
            });
          };
        },
      },
    );
  } catch {
    const fallback: unknown[] & { push: (...args: unknown[]) => number } = [] as unknown as unknown[] & {
      push: (...args: unknown[]) => number;
    };
    fallback.push = (...args: unknown[]) => {
      window._klOnsite = window._klOnsite || [];
      return window._klOnsite.push(...args);
    };
    window.klaviyo = fallback;
  }
}

function loadKlaviyo() {
  if (document.getElementById(KLAVIYO_SCRIPT_ID)) return;

  initialiseKlaviyoObject();

  const script = document.createElement("script");
  script.id = KLAVIYO_SCRIPT_ID;
  script.async = true;
  script.type = "text/javascript";
  script.src = KLAVIYO_SRC;
  script.dataset.purpose = "klaviyo-forms-and-onsite";
  document.body.appendChild(script);
}

export function KlaviyoOnsite() {
  useEffect(() => {
    // Embedded Klaviyo forms are an explicit user-facing site function and must
    // remain available even when optional cookie/tracking consent is declined.
    // Consentik remains responsible for optional tracking-cookie controls; do
    // not gate the Klaviyo forms renderer itself behind a consent category.
    initialiseKlaviyoObject();
    loadKlaviyo();
  }, []);

  return null;
}
