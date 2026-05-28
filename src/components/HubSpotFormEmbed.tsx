"use client";

import Script from "next/script";

type HubSpotFormEmbedProps = {
  formId: string;
  portalId?: string;
  region?: string;
  className?: string;
};

export function HubSpotFormEmbed({
  formId,
  portalId = "443168549",
  region = "ap1",
  className,
}: HubSpotFormEmbedProps) {
  return (
    <div className={className}>
      <Script
        src={`https://js-${region}.hsforms.net/forms/embed/${portalId}.js`}
        strategy="afterInteractive"
      />
      <div
        className="hs-form-frame"
        data-region={region}
        data-form-id={formId}
        data-portal-id={portalId}
      />
    </div>
  );
}
