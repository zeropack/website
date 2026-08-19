import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { SEOOrganization, SEOWebSite } from "@/components/SEOOrganization";
import { KlaviyoOnsite } from "@/components/KlaviyoOnsite";
import { GA_MEASUREMENT_ID, SITE_NAME } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Custom Compostable Mailers for Ecommerce Brands`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Custom compostable packaging, made for brands that care what they send out. Made-to-order mailers for ecommerce brands worldwide — quotes, certification guidance, and practical MOQs.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${manrope.variable} ${plusJakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        {/* Consentik cookie consent — beforeInteractive so consent is known before any tags fire */}
        <Script
          id="consentik-gcm"
          src="https://cmp.consentik.com/sites/5a5eb279-8e4d-4daa-ad25-277fa627d7a4/b19585841572bc5a891525b33423d9f4/gcm.js"
          strategy="beforeInteractive"
        />
        <Script
          id="consentik-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `!function(e,t,n,s,i,c){const a=t.getElementsByTagName(n)[0],d=t.createElement(n);d.id="cst-package",d.async=!0,d.src="https://cmp.consentik.com/sites/5a5eb279-8e4d-4daa-ad25-277fa627d7a4/b19585841572bc5a891525b33423d9f4/index.js?v="+(new Date().getMinutes()),a.parentNode.insertBefore(d,a)}(window,document,"script");` }}
        />
        {/* Google Tag Manager — current implementation; consent behaviour audited separately. */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NSLBNXGR');` }}
        />
        <KlaviyoOnsite />
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NSLBNXGR" height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>
        <SEOOrganization />
        <SEOWebSite />
        <Shell>{children}</Shell>
      </body>
      {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
