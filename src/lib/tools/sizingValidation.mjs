/**
 * Internal Zero Pack sizing-validation helpers.
 *
 * IMPORTANT:
 * These functions model candidate calculator rules for validation only.
 * They are not approved customer-facing sizing rules until the live
 * Packaging Calculator Product Capability & Ruleset marks them approved.
 */

export const MM_PER_INCH = 25.4;
export const ZERO_PACK_MANUFACTURING_TOLERANCE_MM = 5;
export const ZERO_PACK_MIN_FLEXIBLE_WIDTH_MM = 100;
export const ZERO_PACK_MAX_MAILER_BODY_LENGTH_MM = 1000;

export const FIT_LEVELS = Object.freeze({
  x: { label: "Minimum recommended", percent: 5 },
  y: { label: "More room", percent: 10 },
  z: { label: "Extra room", percent: 15 },
  aboveZ: { label: "Beyond normal recommendation", percent: 20 },
});

export function roundUpTo(value, increment = 5) {
  if (!Number.isFinite(value) || value <= 0) return null;
  if (!Number.isFinite(increment) || increment <= 0) return null;
  return Math.ceil(value / increment) * increment;
}

export function mailerFlapMm(bodyLengthMm, adhesive = "single") {
  if (!Number.isFinite(bodyLengthMm) || bodyLengthMm <= 0) return null;
  if (bodyLengthMm > ZERO_PACK_MAX_MAILER_BODY_LENGTH_MM) return null;
  if (adhesive === "double") return 70;
  // Current conservative boundary interpretation:
  // under 600 mm = 40 mm, 600 mm and above = 50 mm.
  return bodyLengthMm < 600 ? 40 : 50;
}

export function candidateMailerSize({
  productWidthMm,
  productLengthMm,
  productDepthMm,
  fitPercent,
  roundingMm = 5,
  adhesive = "single",
}) {
  const inputs = [productWidthMm, productLengthMm, productDepthMm, fitPercent];
  if (inputs.some((value) => !Number.isFinite(value) || value <= 0)) return null;

  const baseWidthMm = productWidthMm + productDepthMm;
  const baseLengthMm = productLengthMm + productDepthMm;
  const widthAllowanceMm = baseWidthMm * (fitPercent / 100);
  const lengthAllowanceMm = baseLengthMm * (fitPercent / 100);

  const calculatedWidthMm = baseWidthMm + widthAllowanceMm;
  const calculatedLengthMm = baseLengthMm + lengthAllowanceMm;

  const roundedWidthMm = roundUpTo(calculatedWidthMm, roundingMm);
  const roundedLengthMm = roundUpTo(calculatedLengthMm, roundingMm);
  if (roundedWidthMm === null || roundedLengthMm === null) return null;

  const suggestedWidthMm = Math.max(ZERO_PACK_MIN_FLEXIBLE_WIDTH_MM, roundedWidthMm);
  const suggestedLengthMm = roundedLengthMm;
  const flapMm = mailerFlapMm(suggestedLengthMm, adhesive);

  const flags = [];
  if (roundedWidthMm < ZERO_PACK_MIN_FLEXIBLE_WIDTH_MM) flags.push("raised_to_100mm_min_width");
  if (suggestedLengthMm > ZERO_PACK_MAX_MAILER_BODY_LENGTH_MM) flags.push("manual_review_over_1000mm_body_length");
  if (widthAllowanceMm <= ZERO_PACK_MANUFACTURING_TOLERANCE_MM) flags.push("width_allowance_at_or_below_5mm_tolerance");
  if (lengthAllowanceMm <= ZERO_PACK_MANUFACTURING_TOLERANCE_MM) flags.push("length_allowance_at_or_below_5mm_tolerance");
  if (fitPercent > FIT_LEVELS.z.percent) flags.push("fit_above_normal_recommendation");
  if (suggestedLengthMm === 600 && adhesive === "single") flags.push("600mm_flap_boundary_uses_50mm_candidate_rule");

  return {
    productWidthMm,
    productLengthMm,
    productDepthMm,
    fitPercent,
    baseWidthMm,
    baseLengthMm,
    widthAllowanceMm,
    lengthAllowanceMm,
    calculatedWidthMm,
    calculatedLengthMm,
    suggestedWidthMm,
    suggestedLengthMm,
    adhesive,
    flapMm,
    manufacturingToleranceMm: ZERO_PACK_MANUFACTURING_TOLERANCE_MM,
    flags,
  };
}

export function candidateRoundTubingWidth({
  productDiameterMm,
  fitPercent,
  roundingMm = 5,
}) {
  if (![productDiameterMm, fitPercent].every((value) => Number.isFinite(value) && value > 0)) return null;

  const baseLayflatWidthMm = Math.PI * productDiameterMm / 2;
  const allowanceMm = baseLayflatWidthMm * (fitPercent / 100);
  const calculatedWidthMm = baseLayflatWidthMm + allowanceMm;
  const roundedWidthMm = roundUpTo(calculatedWidthMm, roundingMm);
  if (roundedWidthMm === null) return null;

  const suggestedWidthMm = Math.max(ZERO_PACK_MIN_FLEXIBLE_WIDTH_MM, roundedWidthMm);
  const flags = [];
  if (roundedWidthMm < ZERO_PACK_MIN_FLEXIBLE_WIDTH_MM) flags.push("raised_to_100mm_min_width");
  if (allowanceMm <= ZERO_PACK_MANUFACTURING_TOLERANCE_MM) flags.push("allowance_at_or_below_5mm_tolerance");
  if (fitPercent > FIT_LEVELS.z.percent) flags.push("fit_above_normal_recommendation");

  return {
    productDiameterMm,
    fitPercent,
    baseLayflatWidthMm,
    allowanceMm,
    calculatedWidthMm,
    suggestedWidthMm,
    manufacturingToleranceMm: ZERO_PACK_MANUFACTURING_TOLERANCE_MM,
    flags,
  };
}

export function generateMailerMatrix({
  widthsMm = [75, 100, 150, 250, 400, 600],
  lengthsMm = [100, 200, 400, 590, 600, 800, 950],
  depthsMm = [5, 20, 50, 100],
  fitPercents = [5, 10, 15, 20],
  adhesive = "single",
} = {}) {
  const rows = [];
  for (const productWidthMm of widthsMm) {
    for (const productLengthMm of lengthsMm) {
      for (const productDepthMm of depthsMm) {
        for (const fitPercent of fitPercents) {
          const row = candidateMailerSize({
            productWidthMm,
            productLengthMm,
            productDepthMm,
            fitPercent,
            adhesive,
          });
          if (row) rows.push(row);
        }
      }
    }
  }
  return rows;
}

export function generateRoundTubingMatrix({
  diametersMm = [25, 50, 75, 100, 150, 250, 400],
  fitPercents = [5, 10, 15, 20],
} = {}) {
  const rows = [];
  for (const productDiameterMm of diametersMm) {
    for (const fitPercent of fitPercents) {
      const row = candidateRoundTubingWidth({ productDiameterMm, fitPercent });
      if (row) rows.push(row);
    }
  }
  return rows;
}

export function summariseFlags(rows) {
  const counts = new Map();
  for (const row of rows) {
    for (const flag of row.flags ?? []) {
      counts.set(flag, (counts.get(flag) ?? 0) + 1);
    }
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)));
}
