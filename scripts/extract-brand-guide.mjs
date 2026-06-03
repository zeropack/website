/**
 * extract-brand-guide.mjs
 *
 * Reads the .mht (MHTML) export of the Word document and outputs a structured
 * JSON representation of the document body to tmp-brand-guide-structured.json.
 *
 * Word's .mht export preserves all heading levels (h1–h6), paragraph classes
 * (MsoNormal, MsoListParagraph), and table structure as real HTML tags, making
 * it far easier to parse than raw OOXML.
 *
 * Each entry in the output array is one of:
 *   { type: "heading", level: 1|2|3|4, text: string }
 *   { type: "paragraph", text: string }
 *   { type: "bullet", text: string }
 *   { type: "table", rows: string[][] }
 *
 * Usage:
 *   node scripts/extract-brand-guide.mjs [path-to-mht]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const mhtPath =
  process.argv[2] ??
  path.join(root, "public/2026_Zero_Pack_Brand_Guide_Custom_Compostable_Packaging.mht");

// ---------------------------------------------------------------------------
// Step 1 — decode quoted-printable from the MHT
// ---------------------------------------------------------------------------

const raw = fs.readFileSync(mhtPath, "latin1");

function decodeQP(str) {
  return str
    .replace(/=\r\n/g, "")   // soft line breaks
    .replace(/=\n/g, "")
    .replace(/=([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

const html = decodeQP(raw);

// ---------------------------------------------------------------------------
// Step 2 — extract just the <body> content
// ---------------------------------------------------------------------------

const bodyStart = html.indexOf("<body");
const bodyEnd = html.indexOf("</body>");
if (bodyStart === -1 || bodyEnd === -1) {
  throw new Error("Could not find <body> in decoded MHT content");
}
const body = html.slice(bodyStart, bodyEnd);

// ---------------------------------------------------------------------------
// Step 3 — helpers
// ---------------------------------------------------------------------------

/** Decode HTML entities shared by both cleaners. */
function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8212;/g, "—")
    .replace(/&#8211;/g, "–")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#[0-9]+;/g, (e) => String.fromCharCode(parseInt(e.slice(2, -1), 10)));
}

/**
 * Strip all HTML/XML tags, conditional comments, Office elements and decode
 * entities, returning clean plain text (single line).
 */
function cleanText(fragment) {
  return decodeEntities(
    fragment
      .replace(/<!\[if [^\]]*\]>[\s\S]*?<!\[endif\]>/gi, "")
      .replace(/<!\[CDATA\[[\s\S]*?\]\]>/gi, "")
      .replace(/<o:[^>]*>[\s\S]*?<\/o:[^>]*>/gi, "")
      .replace(/<w:[^>]*>[\s\S]*?<\/w:[^>]*>/gi, "")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Like cleanText but preserves paragraph and line-break boundaries as \n.
 * Used for callout/note boxes so the title stays on its own line.
 */
function cleanTextWithBreaks(fragment) {
  const withBreaks = fragment
    .replace(/<!\[if [^\]]*\]>[\s\S]*?<!\[endif\]>/gi, "")
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/gi, "")
    .replace(/<o:[^>]*>[\s\S]*?<\/o:[^>]*>/gi, "")
    .replace(/<w:[^>]*>[\s\S]*?<\/w:[^>]*>/gi, "")
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  return decodeEntities(withBreaks)
    .replace(/[ \t]+/g, " ")          // collapse spaces/tabs
    .replace(/\n[ \t]*/g, "\n")       // trim whitespace after newlines
    .replace(/\n{2,}/g, "\n")         // collapse multiple newlines to one
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

/**
 * For MsoListParagraph, the bullet character and surrounding spans are wrapped
 * in <![if !supportLists]>...<![endif]>. Strip that prefix then clean.
 */
function bulletText(fragment) {
  // Remove the conditional-comment block that holds the bullet glyph
  const stripped = fragment.replace(/<!\[if [^\]]*\]>[\s\S]*?<!\[endif\]>/gi, "");
  return cleanText(stripped);
}

/**
 * Extract all content between an opening and closing tag, handling nesting.
 * Returns [content, endIndex] where endIndex is after the closing tag.
 */
function extractBlock(html, openPos, tagName) {
  const closeTag = `</${tagName}`;
  let depth = 1;
  let i = openPos + tagName.length + 1;
  const openPattern = new RegExp(`<${tagName}[\\s>]`, "i");

  while (i < html.length && depth > 0) {
    const nextOpen = html.search(new RegExp(`<${tagName}[\\s>]`, "i"));
    // We need positional search — use indexOf for speed
    const nextOpenIdx = html.indexOf(`<${tagName}`, i);
    const nextCloseIdx = html.indexOf(closeTag, i);

    if (nextCloseIdx === -1) break;

    if (nextOpenIdx !== -1 && nextOpenIdx < nextCloseIdx) {
      // Verify it's actually the right tag (not e.g. <tablecell> when looking for <table>)
      const afterTag = html[nextOpenIdx + tagName.length + 1];
      if (afterTag === ">" || afterTag === " " || afterTag === "\n" || afterTag === "\r") {
        depth++;
        i = nextOpenIdx + tagName.length + 1;
        continue;
      }
    }

    depth--;
    i = nextCloseIdx + closeTag.length + 1;
  }

  const endPos = html.indexOf(">", i - 2) + 1;
  const content = html.slice(openPos, i);
  return [content, i];
}

// ---------------------------------------------------------------------------
// Step 4 — walk the body and extract items
// ---------------------------------------------------------------------------

const items = [];

// Main scanner regex — matches top-level block elements
const scannerRe = /<(h[1-6]|p|table)(?:\s[^>]*)?>|<\/body>/gi;
let match;

while ((match = scannerRe.exec(body)) !== null) {
  if (match[0] === "</body>") break;

  const tagName = match[1].toLowerCase();
  const tagStart = match.index;
  const fullOpenTag = match[0];

  // --- Headings (h1–h6) ---
  if (/^h[1-6]$/.test(tagName)) {
    const level = parseInt(tagName[1], 10);
    const closeIdx = body.indexOf(`</${tagName}>`, tagStart);
    if (closeIdx === -1) continue;
    const inner = body.slice(tagStart + fullOpenTag.length, closeIdx);
    const text = cleanText(inner);
    if (text) items.push({ type: "heading", level, text });
    scannerRe.lastIndex = closeIdx + tagName.length + 3;
    continue;
  }

  // --- Tables ---
  if (tagName === "table") {
    // Find the matching </table> (handle nested tables)
    let depth = 1;
    let ti = tagStart + fullOpenTag.length;
    while (ti < body.length && depth > 0) {
      const nextOpen = body.indexOf("<table", ti);
      const nextClose = body.indexOf("</table>", ti);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        ti = nextOpen + 6;
      } else {
        depth--;
        ti = nextClose + 8;
      }
    }
    const tblContent = body.slice(tagStart, ti);
    const rows = [];

    // Extract rows — [^>]* skips attributes to find the end of the opening tag
    const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trM;
    while ((trM = trRe.exec(tblContent)) !== null) {
      const cells = [];
      const cellRe = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
      let cellM;
      while ((cellM = cellRe.exec(trM[1])) !== null) {
        cells.push(cleanText(cellM[1]));
      }
      if (cells.some((c) => c.trim())) rows.push(cells);
    }

    if (rows.length > 0) {
      // Single-column tables are Word callout boxes — use line-break-aware cleaner
      // so the bold title stays on its own line (title\nbody).
      if (rows[0].length === 1) {
        const cellRe2 = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
        const cellM2 = cellRe2.exec(tblContent);
        if (cellM2) {
          rows[0][0] = cleanTextWithBreaks(cellM2[1]);
        }
      }
      items.push({ type: "table", rows });
    }
    scannerRe.lastIndex = ti;
    continue;
  }

  // --- Paragraphs (<p>) ---
  if (tagName === "p") {
    const closeIdx = body.indexOf("</p>", tagStart + fullOpenTag.length);
    if (closeIdx === -1) continue;
    const inner = body.slice(tagStart + fullOpenTag.length, closeIdx);
    scannerRe.lastIndex = closeIdx + 4;

    // Determine paragraph class
    const classMatch = fullOpenTag.match(/class=([^\s>'"]+|'[^']*'|"[^"]*")/i);
    const pClass = classMatch ? classMatch[1].replace(/['"]/g, "") : "MsoNormal";

    // Bullet / list paragraphs
    if (pClass.includes("MsoListParagraph") || pClass.includes("MsoListBullet")) {
      const text = bulletText(inner);
      if (text) items.push({ type: "bullet", text });
      continue;
    }

    // Normal paragraph
    const text = cleanText(inner);
    if (text) items.push({ type: "paragraph", text });
    continue;
  }
}

// ---------------------------------------------------------------------------
// Step 5 — write output
// ---------------------------------------------------------------------------

const outPath = path.join(root, "tmp-brand-guide-structured.json");
fs.writeFileSync(outPath, JSON.stringify(items, null, 2));

const counts = items.reduce((acc, item) => {
  acc[item.type] = (acc[item.type] ?? 0) + 1;
  return acc;
}, {});

console.log("Wrote structured JSON to", outPath);
console.log("Element counts:", counts);
console.log("Total items:", items.length);
