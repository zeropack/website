import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { SEOOrganization, SEOWebSite } from "@/components/SEOOrganization";
import { GA_MEASUREMENT_ID, SITE_NAME } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Custom Compostable Mailers for Ecommerce Brands`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Custom compostable packaging, made for brands that care what they send out. Made-to-order mailers for ecommerce brands worldwide — quotes, certification guidance, and practical MOQs.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${manrope.variable} ${plusJakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        <SEOOrganization />
        <SEOWebSite />
        <Shell>{children}</Shell>
      </body>
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
