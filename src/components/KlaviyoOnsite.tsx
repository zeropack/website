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

function hasFunctionalOrAdvertisingConsent() {
  const rawCookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("_consentik_cookie="))
    ?.slice("_consentik_cookie=".length);

  if (!rawCookie) return false;

  try {
    const consent = JSON.parse(decodeURIComponent(rawCookie)) as {
      consent?: string[];
    };
    return (
      Array.isArray(consent.consent) &&
      (consent.consent.includes("functional") ||
        consent.consent.includes("advertising"))
    );
  } catch {
    return false;
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
  script.dataset.consentSource = "consentik-functional-or-advertising";
  document.body.appendChild(script);
}

export function KlaviyoOnsite() {
  useEffect(() => {
    // Initialise Klaviyo's queue/proxy contract on every page. The remote onsite
    // tracking/forms script itself remains consent-gated and is appended near the
    // end of <body>, matching Klaviyo's installation contract without bypassing
    // the site's Consentik preference boundary.
    initialiseKlaviyoObject();

    const reconcile = () => {
      if (hasFunctionalOrAdvertisingConsent()) loadKlaviyo();
    };

    reconcile();

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      reconcile();
      if (
        document.getElementById(KLAVIYO_SCRIPT_ID) ||
        Date.now() - startedAt > 120_000
      ) {
        window.clearInterval(interval);
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, []);

  return null;
}
