import type { RegionCode, RegionConfig } from "./types";
import { regionConfig as au } from "@/content/au/region";
import { regionConfig as uk } from "@/content/uk/region";
import { regionConfig as us } from "@/content/us/region";
import { regionConfig as eu } from "@/content/eu/region";

const map: Record<RegionCode, RegionConfig> = {
  au,
  uk,
  us,
  eu,
};

export function getRegionConfig(code: RegionCode): RegionConfig {
  return map[code];
}

export const REGIONS: RegionCode[] = ["au", "uk", "us", "eu"];

export function isLaunchedRegion(code: RegionCode): boolean {
  return code === "au" || code === "uk";
}
