/**
 * Internal Zero Pack sizing-validation helpers.
 * Mirrors the approved customer-facing sizing rules.
 */

export const ZERO_PACK_MANUFACTURING_TOLERANCE_MM = 5;
export const ZERO_PACK_MIN_FLEXIBLE_WIDTH_MM = 100;
export const ZERO_PACK_MAX_MAILER_BODY_LENGTH_MM = 1000;

export function roundUpToFiveMm(value) {
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.ceil(value / 5) * 5;
}

export function mailerFlapMm(bodyLengthMm, adhesive = "single") {
  if (!Number.isFinite(bodyLengthMm) || bodyLengthMm <= 0 || bodyLengthMm > ZERO_PACK_MAX_MAILER_BODY_LENGTH_MM) return null;
  if (adhesive === "double") return 70;
  return bodyLengthMm < 600 ? 40 : 50;
}

export function calculateMailerCandidate({
  productWidthMm,
  productLengthMm,
  productDepthMm,
  extraRoomMm = 0,
  adhesive = "single",
}) {
  const values = [productWidthMm, productLengthMm, productDepthMm, extraRoomMm];
  if (values.some((value, i) => !Number.isFinite(value) || (i < 3 && value <= 0) || (i === 3 && value < 0))) return null;

  const rawWidthMm = productWidthMm + productDepthMm + 5 + extraRoomMm;
  const rawLengthMm = productLengthMm + productDepthMm / 2 + 15 + extraRoomMm;
  const bodyWidthMm = Math.max(ZERO_PACK_MIN_FLEXIBLE_WIDTH_MM, roundUpToFiveMm(rawWidthMm));
  const bodyLengthMm = roundUpToFiveMm(rawLengthMm);
  const flags = [];

  if (bodyWidthMm === ZERO_PACK_MIN_FLEXIBLE_WIDTH_MM && rawWidthMm < ZERO_PACK_MIN_FLEXIBLE_WIDTH_MM) flags.push("raised_to_100mm_min_width");
  if (bodyLengthMm > ZERO_PACK_MAX_MAILER_BODY_LENGTH_MM) flags.push("manual_review_over_1000mm_body_length");
  if (extraRoomMm > 50) flags.push("custom_extra_room_above_slider_range");

  return {
    productWidthMm, productLengthMm, productDepthMm, extraRoomMm, adhesive,
    rawWidthMm, rawLengthMm, bodyWidthMm, bodyLengthMm,
    flapMm: mailerFlapMm(bodyLengthMm, adhesive),
    manufacturingToleranceMm: ZERO_PACK_MANUFACTURING_TOLERANCE_MM,
    flags,
  };
}

export function calculateLayflatCandidate({
  productWidthMm,
  productLengthMm,
  productDepthMm,
  widthClearanceMm = 5,
  cutterTailMm = 15,
}) {
  if (![productWidthMm, productLengthMm, productDepthMm, widthClearanceMm, cutterTailMm].every(Number.isFinite)) return null;
  if (productWidthMm <= 0 || productLengthMm <= 0 || productDepthMm <= 0 || widthClearanceMm < 5 || cutterTailMm < 5) return null;

  const rawWidthMm = productWidthMm + productDepthMm + widthClearanceMm;
  const rawCutLengthMm = productLengthMm + productDepthMm / 2 + cutterTailMm;
  const layflatWidthMm = Math.max(ZERO_PACK_MIN_FLEXIBLE_WIDTH_MM, roundUpToFiveMm(rawWidthMm));
  const cutLengthMm = roundUpToFiveMm(rawCutLengthMm);
  const flags = [];

  if (layflatWidthMm === ZERO_PACK_MIN_FLEXIBLE_WIDTH_MM && rawWidthMm < ZERO_PACK_MIN_FLEXIBLE_WIDTH_MM) flags.push("raised_to_100mm_min_width");
  if (widthClearanceMm > 50) flags.push("custom_width_clearance_above_slider_range");
  if (cutterTailMm > 50) flags.push("custom_cutter_tail_above_slider_range");

  return {
    productWidthMm, productLengthMm, productDepthMm, widthClearanceMm, cutterTailMm,
    rawWidthMm, rawCutLengthMm, layflatWidthMm, cutLengthMm,
    manufacturingToleranceMm: ZERO_PACK_MANUFACTURING_TOLERANCE_MM,
    flags,
  };
}

export const physicalMailerCases = [
  { id: "small", mailer: [150, 220], product: [120, 190, 23], fit: "comfortable" },
  { id: "medium", mailer: [230, 320], product: [190, 275, 30], fit: "comfortable" },
  { id: "large", mailer: [400, 480], product: [360, 430, 40], fit: "snug" },
];

export const physicalLayflatCases = [
  { id: "205mm-roll", tubingWidthMm: 205, productWidthMm: 175, productDepthMm: 28, fit: "very snug at ~2mm spare" },
];

export function generateMailerMatrix({
  widthsMm = [75, 100, 120, 150, 190, 250, 360, 500],
  lengthsMm = [100, 190, 275, 350, 430, 590, 800, 950],
  depthsMm = [5, 20, 23, 30, 40, 60, 100],
  extraRoomValuesMm = [0, 10, 25, 50],
} = {}) {
  const rows = [];
  for (const productWidthMm of widthsMm)
    for (const productLengthMm of lengthsMm)
      for (const productDepthMm of depthsMm)
        for (const extraRoomMm of extraRoomValuesMm) {
          const row = calculateMailerCandidate({ productWidthMm, productLengthMm, productDepthMm, extraRoomMm });
          if (row) rows.push(row);
        }
  return rows;
}

export function generateLayflatMatrix({
  widthsMm = [50, 75, 100, 150, 175, 250, 400],
  lengthsMm = [100, 200, 350, 500],
  depthsMm = [10, 20, 28, 50, 100],
  widthClearancesMm = [5, 15, 30, 50],
  cutterTailsMm = [5, 15, 30],
} = {}) {
  const rows = [];
  for (const productWidthMm of widthsMm)
    for (const productLengthMm of lengthsMm)
      for (const productDepthMm of depthsMm)
        for (const widthClearanceMm of widthClearancesMm)
          for (const cutterTailMm of cutterTailsMm) {
            const row = calculateLayflatCandidate({ productWidthMm, productLengthMm, productDepthMm, widthClearanceMm, cutterTailMm });
            if (row) rows.push(row);
          }
  return rows;
}

export function summariseFlags(rows) {
  const counts = new Map();
  for (const row of rows) for (const flag of row.flags ?? []) counts.set(flag, (counts.get(flag) ?? 0) + 1);
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)));
}
