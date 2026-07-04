"use client";

import Script from "next/script";

type CalendlyEmbedProps = {
  url?: string;
  className?: string;
};

export function CalendlyEmbed({
  url = "https://calendly.com/zeropackco/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=00a8f3",
  className,
}: CalendlyEmbedProps) {
  return (
    <div className={className}>
      <div
        className="calendly-inline-widget"
        data-url={url}
        style={{ minWidth: "320px", height: "1050px" }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
