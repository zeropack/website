"use client";

import { useEffect } from "react";

const KLAVIYO_SCRIPT_ID = "klaviyo-onsite";
const KLAVIYO_SRC = "https://static.klaviyo.com/onsite/js/RAUuib/klaviyo.js";

function hasAdvertisingConsent() {
  const rawCookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("_consentik_cookie="))
    ?.slice("_consentik_cookie=".length);

  if (!rawCookie) return false;

  try {
    const consent = JSON.parse(decodeURIComponent(rawCookie)) as {
      consent?: string[];
    };
    return Array.isArray(consent.consent) && consent.consent.includes("advertising");
  } catch {
    return false;
  }
}

function loadKlaviyo() {
  if (document.getElementById(KLAVIYO_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = KLAVIYO_SCRIPT_ID;
  script.async = true;
  script.src = KLAVIYO_SRC;
  script.dataset.consentSource = "consentik-advertising";
  document.head.appendChild(script);
}

export function KlaviyoOnsite() {
  useEffect(() => {
    const reconcile = () => {
      if (hasAdvertisingConsent()) loadKlaviyo();
    };

    reconcile();

    // Consentik writes its consent cookie after the user makes a choice. Polling is
    // intentionally short-lived and avoids depending on undocumented CMP events.
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      reconcile();
      if (document.getElementById(KLAVIYO_SCRIPT_ID) || Date.now() - startedAt > 120_000) {
        window.clearInterval(interval);
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, []);

  return null;
}
