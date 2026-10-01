export type SizingUnit = "mm" | "in";
export type AdhesiveType = "single" | "double";

export const MM_PER_INCH = 25.4;
export const ZERO_PACK_TOLERANCE_MM = 5;
export const MIN_RECOMMENDED_DIMENSION_MM = 100;
export const MAX_RECOMMENDED_DIMENSION_MM = 1000;
export const DEFAULT_MAILER_WIDTH_CLEARANCE_MM = 5;
export const DEFAULT_MAILER_LENGTH_CLEARANCE_MM = 15;
export const DEFAULT_TUBING_WIDTH_CLEARANCE_MM = 5;
export const MIN_TUBING_CUTTER_TAIL_MM = 5;
export const DEFAULT_TUBING_CUTTER_TAIL_MM = 15;

export function toMillimetres(value: number, unit: SizingUnit): number {
  return unit === "in" ? value * MM_PER_INCH : value;
}

export function fromMillimetres(value: number, unit: SizingUnit): number {
  return unit === "in" ? value / MM_PER_INCH : value;
}

export function roundUpToFiveMm(value: number): number {
  return Math.ceil(value / 5) * 5;
}

export function formatDimension(valueMm: number, unit: SizingUnit): string {
  if (unit === "in") return `${Number((valueMm / MM_PER_INCH).toFixed(2))} in`;
  return `${Number(valueMm.toFixed(1))} mm`;
}

export function mailerFlapMm(bodyLengthMm: number, adhesive: AdhesiveType): number | null {
  if (bodyLengthMm > MAX_RECOMMENDED_DIMENSION_MM) return null;
  if (adhesive === "double") return 70;
  return bodyLengthMm < 600 ? 40 : 50;
}

export function calculateMailerSize(params: {
  productWidthMm: number;
  productLengthMm: number;
  productDepthMm: number;
  extraRoomMm?: number;
  adhesive?: AdhesiveType;
}) {
  const { productWidthMm, productLengthMm, productDepthMm } = params;
  const extraRoomMm = Math.max(0, params.extraRoomMm ?? 0);
  const adhesive = params.adhesive ?? "single";
  const rawWidthMm = productWidthMm + productDepthMm + DEFAULT_MAILER_WIDTH_CLEARANCE_MM + extraRoomMm;
  const rawLengthMm = productLengthMm + productDepthMm / 2 + DEFAULT_MAILER_LENGTH_CLEARANCE_MM + extraRoomMm;
  const bodyWidthMm = roundUpToFiveMm(rawWidthMm);
  const bodyLengthMm = roundUpToFiveMm(rawLengthMm);
  const requiresContact = bodyWidthMm < MIN_RECOMMENDED_DIMENSION_MM || bodyWidthMm > MAX_RECOMMENDED_DIMENSION_MM || bodyLengthMm < MIN_RECOMMENDED_DIMENSION_MM || bodyLengthMm > MAX_RECOMMENDED_DIMENSION_MM;
  return {
    rawWidthMm,
    rawLengthMm,
    bodyWidthMm,
    bodyLengthMm,
    flapMm: requiresContact ? null : mailerFlapMm(bodyLengthMm, adhesive),
    adhesive,
    extraRoomMm,
    requiresContact,
  };
}

export function calculateLayflatSize(params: {
  productWidthMm: number;
  productLengthMm: number;
  productDepthMm: number;
  widthClearanceMm?: number;
  cutterTailMm?: number;
}) {
  const widthClearanceMm = Math.max(DEFAULT_TUBING_WIDTH_CLEARANCE_MM, params.widthClearanceMm ?? DEFAULT_TUBING_WIDTH_CLEARANCE_MM);
  const cutterTailMm = Math.max(MIN_TUBING_CUTTER_TAIL_MM, params.cutterTailMm ?? DEFAULT_TUBING_CUTTER_TAIL_MM);
  const rawWidthMm = params.productWidthMm + params.productDepthMm + widthClearanceMm;
  const rawCutLengthMm = params.productLengthMm + params.productDepthMm / 2 + cutterTailMm;
  return {
    rawWidthMm,
    rawCutLengthMm,
    layflatWidthMm: roundUpToFiveMm(rawWidthMm),
    cutLengthMm: roundUpToFiveMm(rawCutLengthMm),
    widthClearanceMm,
    cutterTailMm,
    requiresContact: roundUpToFiveMm(rawWidthMm) < MIN_RECOMMENDED_DIMENSION_MM || roundUpToFiveMm(rawWidthMm) > MAX_RECOMMENDED_DIMENSION_MM || roundUpToFiveMm(rawCutLengthMm) < MIN_RECOMMENDED_DIMENSION_MM || roundUpToFiveMm(rawCutLengthMm) > MAX_RECOMMENDED_DIMENSION_MM,
  };
}
