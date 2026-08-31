import { NextResponse } from "next/server";

const KINGTRANS_ORIGIN = "https://ausdirect.kingtrans.net";

function summarizeHtml(html: string) {
  const scripts = Array.from(html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/gi), (m) => m[1]);
  const forms = Array.from(html.matchAll(/<form\b([^>]*)>/gi), (m) => m[1].trim());
  const inputs = Array.from(html.matchAll(/<input\b([^>]*)>/gi), (m) => m[1].trim());
  const links = Array.from(html.matchAll(/href=["']([^"']+)["']/gi), (m) => m[1]);
  const ajaxHints = Array.from(
    html.matchAll(/(?:fetch\(|ajax\(|axios\.|XMLHttpRequest|WebTrack|track)[\s\S]{0,180}/gi),
    (m) => m[0].replace(/\s+/g, " ").slice(0, 220),
  );

  return {
    length: html.length,
    hasTrackingNumber: /ADF8555349902/i.test(html),
    scripts: scripts.slice(0, 20),
    forms: forms.slice(0, 20),
    inputs: inputs.slice(0, 40),
    links: links.filter((v) => /track|bill|query|search/i.test(v)).slice(0, 30),
    ajaxHints: ajaxHints.slice(0, 30),
    tableCount: (html.match(/<table\b/gi) || []).length,
    rowCount: (html.match(/<tr\b/gi) || []).length,
    bodyTextSample: html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 2500),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get("number")?.trim() || "";

  if (!/^[A-Za-z0-9][A-Za-z0-9._\/-]{3,39}$/.test(number)) {
    return NextResponse.json({ ok: false, error: "Invalid number" }, { status: 400 });
  }

  const upstream = new URL("/WebTrack", KINGTRANS_ORIGIN);
  upstream.searchParams.set("bills", number);
  upstream.searchParams.set("language", "en");

  try {
    const response = await fetch(upstream, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-AU,en;q=0.9",
        "User-Agent": "Mozilla/5.0 (compatible; ZeroPackTrackingDiagnostic/1.0; +https://zeropack.co)",
      },
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });

    const html = await response.text();
    const summary = summarizeHtml(html);
    console.log("[tracking-diagnostic]", JSON.stringify({ status: response.status, finalUrl: response.url, ...summary }));

    return NextResponse.json({
      ok: response.ok,
      upstreamStatus: response.status,
      finalUrl: response.url,
      ...summary,
    });
  } catch (error) {
    console.error("[tracking-diagnostic]", error);
    return NextResponse.json({ ok: false, error: "Diagnostic fetch failed" }, { status: 502 });
  }
}
