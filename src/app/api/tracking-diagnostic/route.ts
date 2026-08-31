import { NextResponse } from "next/server";

const KINGTRANS_ORIGIN = "https://ausdirect.kingtrans.net";

function summarizeHtml(html: string, number: string) {
  const scripts = Array.from(html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/gi), (m) => m[1]);
  const forms = Array.from(html.matchAll(/<form\b([^>]*)>/gi), (m) => m[1].trim());
  const inputs = Array.from(html.matchAll(/<input\b([^>]*)>/gi), (m) => m[1].trim());
  const attrs = Array.from(
    html.matchAll(/\b(?:sdate|place|intro|billid|transbillid|index)\s*=\s*["']([^"']*)["']/gi),
    (m) => m[0],
  );

  return {
    length: html.length,
    hasTrackingNumber: html.includes(number),
    scripts: scripts.slice(0, 10),
    forms: forms.slice(0, 10),
    inputs: inputs.slice(0, 20),
    trackingAttrs: attrs.slice(0, 40),
    tableCount: (html.match(/<table\b/gi) || []).length,
    dlCount: (html.match(/<dl\b/gi) || []).length,
    bodyTextSample: html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 2000),
    rawSample: html.slice(0, 3000),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get("number")?.trim() || "";

  if (!/^[A-Za-z0-9][A-Za-z0-9._\/-]{3,39}$/.test(number)) {
    return NextResponse.json({ ok: false, error: "Invalid number" }, { status: 400 });
  }

  const initialUrl = new URL("/WebTrack", KINGTRANS_ORIGIN);
  initialUrl.searchParams.set("bills", number);
  initialUrl.searchParams.set("language", "en");

  try {
    const initial = await fetch(initialUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-AU,en;q=0.9",
        "User-Agent": "Mozilla/5.0 (compatible; ZeroPackTrackingDiagnostic/1.0; +https://zeropack.co)",
      },
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });

    const initialHtml = await initial.text();
    const setCookies = initial.headers.getSetCookie?.() || [];
    const cookieHeader = setCookies.map((cookie) => cookie.split(";", 1)[0]).join("; ");

    const repeatUrl = new URL("/WebTrack?action=repeat", KINGTRANS_ORIGIN);
    const body = new URLSearchParams({
      index: "0",
      billid: number,
      isRepeat: "no",
      language: "en",
    });

    const repeat = await fetch(repeatUrl, {
      method: "POST",
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-AU,en;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (compatible; ZeroPackTrackingDiagnostic/1.0; +https://zeropack.co)",
        "X-Requested-With": "XMLHttpRequest",
        Referer: initial.url,
        Origin: KINGTRANS_ORIGIN,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body,
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });

    const repeatText = await repeat.text();
    const result = {
      ok: true,
      initial: {
        status: initial.status,
        finalUrl: initial.url,
        setCookieCount: setCookies.length,
        ...summarizeHtml(initialHtml, number),
      },
      repeat: {
        status: repeat.status,
        finalUrl: repeat.url,
        contentType: repeat.headers.get("content-type"),
        ...summarizeHtml(repeatText, number),
      },
    };

    console.log("[tracking-diagnostic-repeat]", JSON.stringify(result));
    return NextResponse.json(result);
  } catch (error) {
    console.error("[tracking-diagnostic-repeat]", error);
    return NextResponse.json({ ok: false, error: "Diagnostic fetch failed" }, { status: 502 });
  }
}
