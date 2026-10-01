import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { SizingCalculator } from "@/components/tools/SizingCalculator";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const path = "/tools/layflat-tubing-calculator/";
export async function generateMetadata(): Promise<Metadata> {
  return buildMarketPageMetadata({
    market: await getRequestMarket(),
    title: "Layflat Tubing Size Calculator",
    description: "Estimate layflat tubing width and cut length from your packed product dimensions, with adjustable width clearance and cutter-tail allowance.",
    path,
  });
}

export default async function Page() {
  const tool = { id: "layflat_tubing_size", name: "Layflat Tubing Size Calculator", market: await getRequestMarket() } as const;
  return <ToolPage
    title="Layflat Tubing Size Calculator"
    intro="Estimate the layflat tubing width and cut length you need from the dimensions of your packed product. Adjust the width clearance and the material left beyond the seal to suit your packing setup."
    tool={tool}
    explanation={<>
      <p>The tubing width starts with the packed product width plus its depth, then adds your selected clearance. The minimum recommended clearance is 5 mm.</p>
      <p>Cut length allows for the product length, half of the product depth at the sealing end, and the cutter tail you choose beyond the seal. The default cutter tail is 15 mm, with a 5 mm minimum.</p>
    </>}
    limitations={<>
      <p>The cutter-tail setting depends on your sealing and cutting equipment. Keep enough material beyond the seal for your own machine and workflow.</p>
      <p>The result is a sizing guide. Flexible products, irregular shapes and very close fits should be checked with a real sample or mock-up before a custom production run.</p>
    </>}
    faqs={[
      { question: "What does layflat width mean?", answer: "Layflat width is the width of the tubing when it is lying flat. Measure your packed product at its widest point and include its finished depth or thickness." },
      { question: "How much width clearance should I use?", answer: "The calculator starts at a 5 mm minimum clearance based on Zero Pack physical fit testing. Increase it if you want easier loading or a roomier sleeve." },
      { question: "What is the cutter tail?", answer: "It is the material left beyond the seal so your cutter or sealing setup has room to operate. The minimum is 5 mm and the default recommendation is 15 mm, but you can increase it to suit your equipment." },
      { question: "Does the result guarantee a finished fit?", answer: "No. It provides a recommended starting size. Check an uncertain or close-fitting size with your actual product and a sample or mock-up before manufacture." },
    ]}
    related={[
      { href: "/tools/mailer-size-calculator/", title: "Mailer Size Calculator", description: "Estimate a custom mailer body size from packed product dimensions." },
      { href: "/custom-compostable-packaging/", title: "Custom packaging", description: "Talk to Zero Pack about the packaging you need and your product requirements." },
    ]}
  ><SizingCalculator mode="layflat" tool={tool} /></ToolPage>;
}
