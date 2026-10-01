import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { SizingCalculator } from "@/components/tools/SizingCalculator";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const path = "/tools/mailer-size-calculator/";
export async function generateMetadata(): Promise<Metadata> {
  return buildMarketPageMetadata({
    market: await getRequestMarket(),
    title: "Mailer Size Calculator",
    description: "Estimate a suitable custom mailer body size from your packed product width, length and depth, with optional extra room and flap guidance.",
    path,
  });
}

export default async function Page() {
  const tool = { id: "mailer_size", name: "Mailer Size Calculator", market: await getRequestMarket() } as const;
  return <ToolPage
    title="Mailer Size Calculator"
    intro="Estimate a practical starting size for a flat custom mailer from the dimensions of your packed product. Measure the product exactly as it will be packed, then choose whether you want any extra room beyond the minimum recommendation."
    tool={tool}
    quoteHref="/custom-compostable-mailers#quoteform"
    explanation={<>
      <p>The calculator starts with the packed product width, length and finished depth / height. It allows for the way a flat mailer wraps around that depth, then adds a small practical clearance and rounds the result upward to a production-friendly 5 mm increment.</p>
      <p>The quoted mailer body size excludes the adhesive flap. Single-adhesive flap length is shown separately, and double-adhesive mailers use a larger flap.</p>
    </>}
    limitations={<>
      <p>This is a recommended starting size, not final manufacturing approval. Product shape, compressibility, loading method and how tightly you want the mailer to sit can affect the best finished size.</p>
      <p>Flexible packaging can vary slightly during manufacture. For an uncertain or important custom size, check the fit with a physical sample or simple mock-up before production.</p>
    </>}
    faqs={[
      { question: "How should I measure my product?", answer: "Measure the product exactly as it will be packed. Record the finished width, length and maximum depth or height, including any inner packaging that will sit inside the mailer." },
      { question: "Does the calculator include the adhesive flap?", answer: "No. The recommended width and length are the usable mailer body dimensions. The closure flap is shown separately." },
      { question: "Can I add more room?", answer: "Yes. The calculator starts at Zero Pack’s minimum recommended clearance. Use the additional-room control if you want a looser fit or need more handling space." },
      { question: "Should I order straight from the calculated size?", answer: "Use the result as a starting point for your quote and specification. For custom production, especially where the fit is close, confirm the final dimensions with a sample or mock-up before manufacture." },
    ]}
    related={[
      { href: "/tools/layflat-tubing-calculator/", title: "Layflat Tubing Calculator", description: "Estimate layflat width and cut length for a packed product." },
      { href: "/custom-compostable-mailers#quoteform", title: "Custom compostable mailers", description: "Explore Zero Pack custom mailer options and request a quote." },
    ]}
  ><SizingCalculator mode="mailer" tool={tool} /></ToolPage>;
}
