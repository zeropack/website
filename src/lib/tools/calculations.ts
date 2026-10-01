export type Unit = "mm" | "cm" | "m" | "in";
export type Dimensions = { length: string; width: string; height: string };

const metresPerUnit: Record<Unit, number> = { mm: 0.001, cm: 0.01, m: 1, in: 0.0254 };

/** Preserve a typed physical dimension when switching the display unit. */
export function convertDimension(value: string, from: Unit, to: Unit): string {
  if (value.trim() === "") return value;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return value;
  return Number((parsed * metresPerUnit[from] / metresPerUnit[to]).toPrecision(12)).toString();
}

/** Returns cubic metres for positive dimensions, or null for invalid input. */
export function rectangularVolume(dimensions: Dimensions, unit: Unit): number | null {
  const values = [dimensions.length, dimensions.width, dimensions.height].map(Number);
  if (values.some((value) => !Number.isFinite(value) || value <= 0)) return null;
  const factor = metresPerUnit[unit];
  const volume = values.reduce((product, value) => product * value * factor, 1);
  return Number.isFinite(volume) && volume > 0 ? volume : null;
}

export function wholeQuantity(value: string): number | null {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export function formatVolume(value: number): string {
  if (value !== 0 && Math.abs(value) < 1e-12) return value.toExponential(3);
  return new Intl.NumberFormat("en", { maximumFractionDigits: 12 }).format(value);
}
