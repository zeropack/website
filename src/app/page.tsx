import type { Metadata } from "next";
import { buildMetadata, regionHomeHreflang } from "@/lib/metadata";
import { GlobalHome } from "@/components/page-sections/GlobalHome";

export const metadata: Metadata = buildMetadata({
  title: "Zero Pack | Custom Compostable Mailers for Ecommerce Brands",
  description:
    "Custom compostable packaging for businesses that ship regularly. Made-to-order mailers sold through custom quotes, with AU and UK supported today and US and EU expanding next.",
  path: "/",
  hreflang: regionHomeHreflang(),
});

export default function Page() {
  return <GlobalHome />;
}
