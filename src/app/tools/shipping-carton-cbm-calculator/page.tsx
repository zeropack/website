import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { VolumeCalculator } from "@/components/tools/VolumeCalculator";
import { buildMarketPageMetadata, getRequestMarket } from "@/lib/requestMarket";

const path = "/tools/shipping-carton-cbm-calculator/";
export async function generateMetadata(): Promise<Metadata> {
  return buildMarketPageMetadata({ market: await getRequestMarket(), title: "Shipping Carton / CBM Calculator", description: "Calculate combined external carton volume in cubic metres (CBM) from packed carton dimensions and quantities, with multiple carton sizes.", path });
}

export default async function Page() {
  const tool = { id: "shipping_carton_cbm", name: "Shipping Carton / CBM Calculator", market: await getRequestMarket() } as const;
  return <ToolPage title="Shipping Carton / CBM Calculator" intro="Estimate the combined external volume of packed shipping cartons in cubic metres (CBM). Enter each carton’s outside length, width and height, its quantity, and add another row for each different size." tool={tool}
    explanation={<><p>For each rectangular packed carton: length × width × height × number of cartons. Convert the dimensions to metres first, then add the volumes for all rows. CBM means cubic metres.</p><p>Example: 10 cartons, each 40 × 30 × 25 cm externally, give 10 × 0.4 × 0.3 × 0.25 = 0.3 m³.</p></>}
    limitations={<><p>The result is the sum of external carton volumes. It excludes pallets, gaps between cartons, overhang, wrapping and other space needed when cartons are stacked or loaded.</p><p>It is not a freight quote or a carrier’s chargeable volume. Carriers may use their own measurement, rounding and dimensional-weight rules; confirm shipment requirements with your provider.</p></>}
    faqs={[
      { question: "Which dimensions should I enter?", answer: "Measure the outside of each carton after it is packed and closed. Use the same unit for the length, width and height of every row." },
      { question: "Can I add cartons of different sizes?", answer: "Yes. Add a row for each carton size, enter its positive whole quantity and calculate the combined external volume." },
      { question: "Does this include pallets or empty space?", answer: "No. It sums each carton’s external rectangular volume. Pallets, spaces between cartons and loading constraints are not included." },
      { question: "Is CBM the same as chargeable volume?", answer: "No. Carrier billing may apply separate dimensional-weight, rounding or minimum-charge rules. Ask your shipping provider for the applicable calculation." },
    ]}
    related={[{ href: "/tools/box-volume-calculator/", title: "Box Volume Calculator", description: "Calculate the volume of one rectangular space in cm³, litres and m³." }, { href: "/custom-compostable-packaging/", title: "Custom packaging", description: "Explore made-to-order packaging for your project." }]}
  ><VolumeCalculator mode="cbm" tool={tool} /></ToolPage>;
}
