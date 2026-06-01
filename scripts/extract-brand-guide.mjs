import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docxPath = path.join(
  __dirname,
  "../src/content/2026_Zero_Pack_Brand_Guide_Custom_Compostable_Packaging.docx",
);

async function main() {
  const buf = fs.readFileSync(docxPath);
  const zip = await import("node:buffer").then(() => null);
  // Use manual zip read via child or unzip - use AdmZip if available, else powershell approach
  const { default: AdmZip } = await import("adm-zip").catch(() => ({ default: null }));
  if (!AdmZip) {
    console.error("Install adm-zip or run manually");
    process.exit(1);
  }
  const zipFile = new AdmZip(buf);
  const xml = zipFile.readAsText("word/document.xml");
  const texts = [...xml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]);
  const full = texts.join("");
  fs.writeFileSync(path.join(__dirname, "../tmp-brand-guide-plain.txt"), full);
  console.log("Wrote plain text, length:", full.length);
}

main().catch(console.error);
