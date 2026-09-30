#!/usr/bin/env node

import {
  FIT_LEVELS,
  ZERO_PACK_MANUFACTURING_TOLERANCE_MM,
  generateMailerMatrix,
  generateRoundTubingMatrix,
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

function risky(rows) {
  return rows.filter((row) => (row.flags ?? []).length > 0);
}

function printSummary(name, rows) {
  const flagged = risky(rows);
  console.log(`\n=== ${name} ===`);
  console.log(`Rows: ${rows.length}`);
  console.log(`Flagged rows: ${flagged.length}`);
  console.log("Flag counts:");
  const counts = summariseFlags(rows);
  for (const [flag, count] of Object.entries(counts)) {
    console.log(`  - ${flag}: ${count}`);
  }
  console.log("\nRepresentative flagged cases:");
  for (const row of flagged.slice(0, 12)) {
    console.log("  ", JSON.stringify(row));
  }
}

const args = parseArgs(process.argv.slice(2));
const mailers = generateMailerMatrix();
const tubing = generateRoundTubingMatrix();

if (args.format === "json") {
  const payload = {};
  if (args.product === "all" || args.product === "mailer") payload.mailers = mailers;
  if (args.product === "all" || args.product === "tubing") payload.tubing = tubing;
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

if (args.format === "csv") {
  if (args.product === "mailer") {
    console.log(toCsv(mailers, [
      "productWidthMm","productLengthMm","productDepthMm","fitPercent",
      "baseWidthMm","baseLengthMm","widthAllowanceMm","lengthAllowanceMm",
      "suggestedWidthMm","suggestedLengthMm","adhesive","flapMm","manufacturingToleranceMm","flags"
    ]));
    process.exit(0);
  }
  if (args.product === "tubing") {
    console.log(toCsv(tubing, [
      "productDiameterMm","fitPercent","baseLayflatWidthMm","allowanceMm",
      "suggestedWidthMm","manufacturingToleranceMm","flags"
    ]));
    process.exit(0);
  }
  console.error("CSV output requires --product=mailer or --product=tubing.");
  process.exit(1);
}

console.log("Zero Pack packaging sizing validation harness");
console.log("Candidate rules only — not approved public sizing logic.");
console.log(`Fit references: X ${FIT_LEVELS.x.percent}%, Y ${FIT_LEVELS.y.percent}%, Z ${FIT_LEVELS.z.percent}%.`);
console.log(`Manufacturing tolerance caveat: ±${ZERO_PACK_MANUFACTURING_TOLERANCE_MM} mm.`);

if (args.product === "all" || args.product === "mailer") printSummary("Mailer candidate matrix", mailers);
if (args.product === "all" || args.product === "tubing") printSummary("Round layflat tubing candidate matrix", tubing);

console.log("\nCommands:");
console.log("  npm run validate:sizing");
console.log("  npm run validate:sizing -- --format=json");
console.log("  npm run validate:sizing -- --format=csv --product=mailer");
console.log("  npm run validate:sizing -- --format=csv --product=tubing");
