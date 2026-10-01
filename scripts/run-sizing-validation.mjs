#!/usr/bin/env node

import {
  ZERO_PACK_MANUFACTURING_TOLERANCE_MM,
  generateMailerMatrix,
  generateLayflatMatrix,
  physicalMailerCases,
  physicalLayflatCases,
  summariseFlags,
} from "../src/lib/tools/sizingValidation.mjs";

function parseArgs(argv) {
  const args = { format: "summary", product: "all" };
  for (const arg of argv) {
    if (arg.startsWith("--format=")) args.format = arg.split("=")[1];
    if (arg.startsWith("--product=")) args.product = arg.split("=")[1];
  }
  return args;
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows, fields) {
  return [
    fields.join(","),
    ...rows.map((row) => fields.map((field) => csvEscape(row[field])).join(",")),
  ].join("\n");
}

function flagged(rows) {
  return rows.filter((row) => (row.flags ?? []).length > 0);
}

function printSummary(name, rows) {
  const flaggedRows = flagged(rows);
  console.log(`\n=== ${name} ===`);
  console.log(`Rows: ${rows.length}`);
  console.log(`Flagged rows: ${flaggedRows.length}`);
  const counts = summariseFlags(rows);
  if (Object.keys(counts).length) {
    console.log("Flag counts:");
    for (const [flag, count] of Object.entries(counts)) console.log(`  - ${flag}: ${count}`);
  }
  if (flaggedRows.length) {
    console.log("\nRepresentative flagged cases:");
    for (const row of flaggedRows.slice(0, 12)) console.log("  ", JSON.stringify(row));
  }
}

const args = parseArgs(process.argv.slice(2));
const mailers = generateMailerMatrix();
const tubing = generateLayflatMatrix();

if (args.format === "json") {
  const payload = {
    physicalMailerCases,
    physicalLayflatCases,
  };
  if (args.product === "all" || args.product === "mailer") payload.mailers = mailers;
  if (args.product === "all" || args.product === "tubing") payload.tubing = tubing;
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

if (args.format === "csv") {
  if (args.product === "mailer") {
    console.log(toCsv(mailers, [
      "productWidthMm","productLengthMm","productDepthMm","extraRoomMm",
      "rawWidthMm","rawLengthMm","bodyWidthMm","bodyLengthMm",
      "adhesive","flapMm","manufacturingToleranceMm","flags"
    ]));
    process.exit(0);
  }
  if (args.product === "tubing") {
    console.log(toCsv(tubing, [
      "productWidthMm","productLengthMm","productDepthMm","widthClearanceMm",
      "cutterTailMm","rawWidthMm","rawCutLengthMm","layflatWidthMm",
      "cutLengthMm","manufacturingToleranceMm","flags"
    ]));
    process.exit(0);
  }
  console.error("CSV output requires --product=mailer or --product=tubing.");
  process.exit(1);
}

console.log("Zero Pack packaging sizing validation harness");
console.log("Mirrors the approved customer-facing mailer and layflat rules.");
console.log(`Manufacturing tolerance caveat: ±${ZERO_PACK_MANUFACTURING_TOLERANCE_MM} mm.`);
console.log(`Physical mailer references: ${physicalMailerCases.length}`);
console.log(`Physical layflat references: ${physicalLayflatCases.length}`);

if (args.product === "all" || args.product === "mailer") printSummary("Mailer validation matrix", mailers);
if (args.product === "all" || args.product === "tubing") printSummary("Layflat validation matrix", tubing);

console.log("\nCommands:");
console.log("  npm run validate:sizing");
console.log("  npm run validate:sizing -- --format=json");
console.log("  npm run validate:sizing -- --format=csv --product=mailer");
console.log("  npm run validate:sizing -- --format=csv --product=tubing");
