import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { VolumeCalculator } from "@/components/tools/VolumeCalculator";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const path = "/tools/box-volume-calculator/";
export async function generateMetadata(): Promise<Metadata> {
  return buildMarketPageMetadata({ market: await getRequestMarket(), title: "Box Volume Calculator", description: "Calculate the volume of a rectangular box or space in cubic centimetres, litres and cubic metres. Enter length, width and height in your chosen unit.", path });
}

export default async function Page() {
  const tool = { id: "box_volume", name: "Box Volume Calculator", market: await getRequestMarket() } as const;
  return <ToolPage title="Box Volume Calculator" intro="Find the geometric volume of a rectangular box or space from its length, width and height. Choose which space you are measuring, then enter all three dimensions in the same unit." tool={tool}
    explanation={<><p>For a rectangular space, volume = length × width × height. The calculator converts the dimensions to metres before multiplying them, then shows the result in m³, litres and cm³.</p><p>Example: 30 × 20 × 10 cm = 6,000 cm³ = 6 L = 0.006 m³.</p></>}
    limitations={<><p>Outside box dimensions describe the overall box. Inside dimensions describe available interior space. Neither measurement alone confirms a product will fit.</p><p>Box walls, inserts, cushioning, clearance, folding and product orientation can affect usable space. Check your actual packed product and packaging specification before ordering.</p></>}
    faqs={[
      { question: "Should I measure inside or outside the box?", answer: "Use inside dimensions when you want to estimate available rectangular space. Use outside dimensions when you need the overall external volume. State which measurements you used when discussing packaging." },
      { question: "Does this tell me which box to buy?", answer: "No. A volume calculation cannot account for product shape, orientation, protective material, tolerances or the way the box is constructed. Check fit with a sample or specification." },
      { question: "How do I convert litres to cubic metres?", answer: "Divide litres by 1,000. For example, 6 litres equals 0.006 cubic metres." },
    ]}
    related={[{ href: "/tools/shipping-carton-cbm-calculator/", title: "Shipping Carton / CBM Calculator", description: "Add packed carton sizes and quantities to estimate their combined external volume." }, { href: "/custom-compostable-packaging/", title: "Custom packaging", description: "Discuss box materials, construction and the product you need to pack." }]}
  ><VolumeCalculator mode="box" tool={tool} /></ToolPage>;
}
