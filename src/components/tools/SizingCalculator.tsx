"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import type { ToolIdentity } from "./ToolTracking";
import { trackTool } from "@/lib/tools/analytics";
import {
  DEFAULT_TUBING_CUTTER_TAIL_MM,
  MIN_TUBING_CUTTER_TAIL_MM,
  ZERO_PACK_TOLERANCE_MM,
  calculateLayflatSize,
  calculateMailerSize,
  formatDimension,
  fromMillimetres,
  toMillimetres,
  type AdhesiveType,
  type SizingUnit,
} from "@/lib/tools/sizing";

type Field = "width" | "length" | "depth";
type Inputs = Record<Field, string>;

const labels: Record<Field, string> = {
  width: "Packed product width",
  length: "Packed product length",
  depth: "Packed product depth / height",
};

function positive(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function displayValue(mm: number, unit: SizingUnit) {
  return unit === "in" ? Number(fromMillimetres(mm, unit).toFixed(2)).toString() : Number(mm.toFixed(1)).toString();
}

const CONTACT_EMAIL = "enquiries@zeropack.co";

export function SizingCalculator({ mode, tool }: { mode: "mailer" | "layflat"; tool: ToolIdentity }) {
  const [unit, setUnit] = useState<SizingUnit>("mm");
  const [inputs, setInputs] = useState<Inputs>({ width: "", length: "", depth: "" });
  const [extraRoomMm, setExtraRoomMm] = useState(0);
  const [adhesive, setAdhesive] = useState<AdhesiveType>("single");
  const [widthClearanceMm, setWidthClearanceMm] = useState(5);
  const [cutterTailMm, setCutterTailMm] = useState(DEFAULT_TUBING_CUTTER_TAIL_MM);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [resultEmail, setResultEmail] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [emailState, setEmailState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  const started = useRef(false);

  function start(resetResult = true) {
    if (!started.current) {
      started.current = true;
      trackTool("tool_start", tool.id, tool.name, tool.market, "started");
    }
    if (resetResult) setSubmitted(false);
    setError("");
  }

  function updateInput(field: Field, value: string) {
    start();
    setInputs((current) => ({ ...current, [field]: value }));
  }

  function changeUnit(next: SizingUnit) {
    if (next === unit) return;
    start();
    setInputs((current) => {
      const changed = { ...current };
      (Object.keys(changed) as Field[]).forEach((field) => {
        const parsed = positive(changed[field]);
        if (parsed !== null) changed[field] = displayValue(toMillimetres(parsed, unit), next);
      });
      return changed;
    });
    setUnit(next);
  }

  const parsed = useMemo(() => {
    const width = positive(inputs.width);
    const length = positive(inputs.length);
    const depth = positive(inputs.depth);
    if (width === null || length === null || depth === null) return null;
    return {
      widthMm: toMillimetres(width, unit),
      lengthMm: toMillimetres(length, unit),
      depthMm: toMillimetres(depth, unit),
    };
  }, [inputs, unit]);

  const result = useMemo(() => {
    if (!submitted || !parsed) return null;
    if (mode === "mailer") {
      return {
        kind: "mailer" as const,
        value: calculateMailerSize({
          productWidthMm: parsed.widthMm,
          productLengthMm: parsed.lengthMm,
          productDepthMm: parsed.depthMm,
          extraRoomMm,
          adhesive,
        }),
      };
    }
    return {
      kind: "layflat" as const,
      value: calculateLayflatSize({
        productWidthMm: parsed.widthMm,
        productLengthMm: parsed.lengthMm,
        productDepthMm: parsed.depthMm,
        widthClearanceMm,
        cutterTailMm,
      }),
    };
  }, [submitted, parsed, mode, extraRoomMm, adhesive, widthClearanceMm, cutterTailMm]);

  function calculate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!parsed) {
      setError("Enter a positive number for the packed product width, length and depth.");
      setSubmitted(false);
      return;
    }
    setError("");
    setSubmitted(true);
    trackTool("tool_complete", tool.id, tool.name, tool.market, "completed");
  }

  async function emailResult(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!result || !parsed) return;
    const email = resultEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailState("error");
      setEmailError("Enter a valid email address.");
      return;
    }

    const common = {
      email,
      tool_id: tool.id,
      tool_name: tool.name,
      market: tool.market,
      display_unit: unit,
      marketing_opt_in: marketingOptIn,
      input_width_mm: parsed.widthMm,
      input_length_mm: parsed.lengthMm,
      input_depth_mm: parsed.depthMm,
    };

    const payload = result.kind === "mailer"
      ? {
          ...common,
          recommended_width_mm: result.value.bodyWidthMm,
          recommended_length_mm: result.value.bodyLengthMm,
          flap_mm: result.value.flapMm,
          adhesive,
          extra_room_mm: extraRoomMm,
        }
      : {
          ...common,
          recommended_width_mm: result.value.layflatWidthMm,
          recommended_length_mm: result.value.overallCutLengthMm,
          sealed_length_mm: result.value.sealedLengthMm,
          overall_cut_length_mm: result.value.overallCutLengthMm,
          width_clearance_mm: widthClearanceMm,
          cutter_tail_mm: cutterTailMm,
        };

    setEmailState("sending");
    setEmailError("");
    try {
      const response = await fetch("/api/tools/result-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) throw new Error(data?.error || "Unable to send result.");
      setEmailState("sent");
      trackTool("tool_result_email_submit", tool.id, tool.name, tool.market, "completed");
      if (marketingOptIn) trackTool("tool_marketing_opt_in", tool.id, tool.name, tool.market, "completed");
    } catch (sendError) {
      setEmailState("error");
      setEmailError(sendError instanceof Error ? sendError.message : "Unable to send result.");
    }
  }

  function reset() {
    setInputs({ width: "", length: "", depth: "" });
    setExtraRoomMm(0);
    setAdhesive("single");
    setWidthClearanceMm(5);
    setCutterTailMm(DEFAULT_TUBING_CUTTER_TAIL_MM);
    setSubmitted(false);
    setError("");
    setResultEmail("");
    setMarketingOptIn(false);
    setEmailState("idle");
    setEmailError("");
    started.current = false;
  }

  const secondaryUnit: SizingUnit = unit === "mm" ? "in" : "mm";

  return <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
    <form onSubmit={calculate} noValidate className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="font-heading text-2xl font-semibold">Measure the packed product</h2>
      <p className="mt-3 text-sm leading-relaxed text-charcoal/70">Measure the product exactly as it will be packed. Use the outside width, length and finished depth / height.</p>

      <figure className="mt-6 overflow-hidden rounded-xl border border-charcoal/10 bg-stone p-3">
        <Image src="/tools/packed-product-dimensions.png" alt="Diagram showing how to measure packed product width, length and depth / height." width={640} height={360} unoptimized className="h-auto w-full rounded-lg" />
        <figcaption className="mt-2 text-xs leading-relaxed text-charcoal/60">Measure the outside dimensions of the product exactly as it will be packed.</figcaption>
      </figure>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">Measurement unit</legend>
        <div className="mt-2 flex gap-2">
          {(["mm", "in"] as SizingUnit[]).map((value) => <button key={value} type="button" onClick={() => changeUnit(value)} className={`min-h-11 rounded-lg border px-4 font-semibold ${unit === value ? "border-compost bg-mist text-compost" : "border-charcoal/20 bg-white"}`}>{value === "mm" ? "Metric (mm)" : "Imperial (in)"}</button>)}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {(Object.keys(labels) as Field[]).map((field) => <div key={field}>
          <label htmlFor={`sizing-${mode}-${field}`} className="block text-sm font-medium">{labels[field]} ({unit})</label>
          <input id={`sizing-${mode}-${field}`} type="number" inputMode="decimal" min="0" step="any" value={inputs[field]} onChange={(event) => updateInput(field, event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-charcoal/25 px-3" />
        </div>)}
      </div>

      {mode === "mailer" ? <div className="mt-7 space-y-6 border-t border-charcoal/10 pt-6">
        <div>
          <label htmlFor="mailer-extra-room" className="block text-sm font-semibold">Additional room beyond the minimum recommendation</label>
          <p className="mt-1 text-xs leading-relaxed text-charcoal/65">The default is the minimum recommended fit. Add more space if your product or packing process needs it.</p>
          <div className="mt-3 flex items-center gap-4">
            <input id="mailer-extra-room" type="range" min="0" max="50" step="5" value={Math.min(extraRoomMm, 50)} onChange={(event) => { start(false); setExtraRoomMm(Number(event.target.value)); }} className="w-full" />
            <div className="flex items-center gap-1"><input aria-label="Additional room in millimetres" type="number" min="0" step="5" value={extraRoomMm} onChange={(event) => { start(false); setExtraRoomMm(Math.max(0, Number(event.target.value) || 0)); }} className="min-h-11 w-24 rounded-lg border border-charcoal/25 px-3" /><span className="text-sm">mm</span></div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-charcoal/60"><span>Minimum</span><span>+25 mm</span><span>+50 mm</span></div>
          {extraRoomMm > 50 && <p className="mt-2 text-xs text-charcoal/65">Custom extra room selected above the slider range.</p>}
        </div>

        <div>
          <label htmlFor="mailer-adhesive" className="block text-sm font-semibold">Closure</label>
          <select id="mailer-adhesive" value={adhesive} onChange={(event) => { start(false); setAdhesive(event.target.value as AdhesiveType); }} className="mt-2 min-h-12 w-full max-w-sm rounded-lg border border-charcoal/25 bg-white px-3">
            <option value="single">Single adhesive</option>
            <option value="double">Double adhesive</option>
          </select>
        </div>
      </div> : <div className="mt-7 space-y-6 border-t border-charcoal/10 pt-6">
        <div>
          <label htmlFor="tube-clearance" className="block text-sm font-semibold">Width clearance</label>
          <p className="mt-1 text-xs leading-relaxed text-charcoal/65">5 mm is the minimum recommended clearance from our physical fit testing. Increase it if you want a roomier sleeve.</p>
          <div className="mt-3 flex items-center gap-4">
            <input id="tube-clearance" type="range" min="5" max="50" step="5" value={Math.min(widthClearanceMm, 50)} onChange={(event) => { start(false); setWidthClearanceMm(Number(event.target.value)); }} className="w-full" />
            <div className="flex items-center gap-1"><input aria-label="Layflat width clearance in millimetres" type="number" min="5" step="5" value={widthClearanceMm} onChange={(event) => { start(false); setWidthClearanceMm(Math.max(5, Number(event.target.value) || 5)); }} className="min-h-11 w-24 rounded-lg border border-charcoal/25 px-3" /><span className="text-sm">mm</span></div>
          </div>
          {widthClearanceMm > 50 && <p className="mt-2 text-xs text-charcoal/65">Custom clearance selected above the slider range.</p>}
        </div>

        <div>
          <label htmlFor="tube-cutter-tail" className="block text-sm font-semibold">Cutter tail</label>
          <p className="mt-1 text-xs leading-relaxed text-charcoal/65">Material left beyond the seal for your cutter or sealing setup. Minimum 5 mm. We recommend 15 mm as a practical starting point, but your equipment may need less or more.</p>
          <div className="mt-3 flex items-center gap-4">
            <input id="tube-cutter-tail" type="range" min={MIN_TUBING_CUTTER_TAIL_MM} max="50" step="5" value={Math.min(cutterTailMm, 50)} onChange={(event) => { start(false); setCutterTailMm(Number(event.target.value)); }} className="w-full" />
            <div className="flex items-center gap-1"><input aria-label="Cutter tail in millimetres" type="number" min={MIN_TUBING_CUTTER_TAIL_MM} step="5" value={cutterTailMm} onChange={(event) => { start(false); setCutterTailMm(Math.max(MIN_TUBING_CUTTER_TAIL_MM, Number(event.target.value) || MIN_TUBING_CUTTER_TAIL_MM)); }} className="min-h-11 w-24 rounded-lg border border-charcoal/25 px-3" /><span className="text-sm">mm</span></div>
          </div>
        </div>
      </div>}

      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <div className="mt-7 flex flex-wrap gap-3">
        <button type="submit" className="min-h-12 rounded-xl bg-compost px-6 font-semibold text-white hover:bg-forest">Calculate size</button>
        <button type="button" onClick={reset} className="min-h-12 rounded-xl border border-charcoal/25 px-6 font-semibold hover:bg-stone">Reset</button>
      </div>
    </form>

    <aside className="self-start rounded-2xl bg-compost p-6 text-white sm:p-8" aria-live="polite">
      <h2 className="font-heading text-2xl font-semibold">{mode === "mailer" ? "Recommended mailer size" : "Recommended layflat tubing"}</h2>
      {!result ? <p className="mt-5 text-white/80">Enter your packed product measurements and calculate to see the recommendation.</p> : result.kind === "mailer" ? <div className="mt-6">
        {result.value.requiresContact ? <><p className="text-2xl font-semibold">Please contact us directly</p><p className="mt-3 text-white/85">This result falls outside the 100–1,000 mm width or length range covered by the online calculator. Email us your packed product dimensions and we’ll review the best option.</p><a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Packaging sizing enquiry")}`} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 font-semibold text-compost">Email Zero Pack</a></> : <>
          <p className="text-3xl font-semibold tabular-nums">{formatDimension(result.value.bodyWidthMm, unit)} × {formatDimension(result.value.bodyLengthMm, unit)}</p>
          <p className="mt-2 text-sm text-white/75">{formatDimension(result.value.bodyWidthMm, secondaryUnit)} × {formatDimension(result.value.bodyLengthMm, secondaryUnit)}</p>
          <dl className="mt-6 space-y-3 border-t border-white/25 pt-5 text-sm">
            <div className="border-b border-white/15 pb-2 font-semibold"><dt>Bag body</dt><dd className="sr-only">Recommended bag body dimensions</dd></div>
            <div className="flex justify-between gap-4"><dt>Body width</dt><dd className="text-right font-semibold">{formatDimension(result.value.bodyWidthMm, unit)}</dd></div>
            <div className="flex justify-between gap-4"><dt>Body length</dt><dd className="text-right font-semibold">{formatDimension(result.value.bodyLengthMm, unit)}</dd></div>
            <div className="flex justify-between gap-4"><dt>Adhesive flap</dt><dd className="text-right font-semibold">{result.value.flapMm} mm · {adhesive === "double" ? "double" : "single"} adhesive</dd></div>
            <div className="flex justify-between gap-4"><dt>Extra room selected</dt><dd className="text-right font-semibold">{extraRoomMm} mm</dd></div>
          </dl>
          <figure className="mt-6 overflow-hidden rounded-xl bg-white p-3 text-charcoal">
            <Image src="/tools/mailer-dimensions.png" alt="Diagram showing mailer body width, body length and the separate adhesive flap." width={480} height={640} unoptimized className="mx-auto h-auto max-h-[520px] w-auto max-w-full rounded-lg" />
            <figcaption className="mt-2 text-xs leading-relaxed text-charcoal/65">
              Use the diagram to match the recommended body dimensions and closure flap to the finished mailer. Quoted body dimensions exclude the adhesive flap.
            </figcaption>
          </figure>
        </>}
      </div> : <div className="mt-6">
        {result.value.requiresContact ? <><p className="text-2xl font-semibold">Please contact us directly</p><p className="mt-3 text-white/85">This result falls outside the online range: 100–1,000 mm layflat width or 100–10,000 mm overall cut length. Email us your packed product dimensions and details of your sealing setup and we’ll review the best option.</p><a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Layflat tubing sizing enquiry")}`} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 font-semibold text-compost">Email Zero Pack</a></> : <>
        <p className="text-3xl font-semibold tabular-nums">{formatDimension(result.value.layflatWidthMm, unit)} wide</p>
        <p className="mt-1 text-xl font-semibold tabular-nums">Overall cut length {formatDimension(result.value.overallCutLengthMm, unit)}</p>
        <p className="mt-2 text-sm text-white/75">{formatDimension(result.value.layflatWidthMm, secondaryUnit)} wide · overall cut length {formatDimension(result.value.overallCutLengthMm, secondaryUnit)}</p>
        <dl className="mt-6 space-y-3 border-t border-white/25 pt-5 text-sm">
          <div className="flex justify-between gap-4"><dt>Sealed length</dt><dd className="font-semibold">{formatDimension(result.value.sealedLengthMm, unit)}</dd></div>
          <div className="flex justify-between gap-4"><dt>Cutter tail</dt><dd className="font-semibold">{formatDimension(cutterTailMm, unit)}</dd></div>
          <div className="flex justify-between gap-4 border-t border-white/15 pt-3"><dt>Overall cut length</dt><dd className="font-semibold">{formatDimension(result.value.overallCutLengthMm, unit)}</dd></div>
          <div className="flex justify-between gap-4"><dt>Width clearance</dt><dd className="font-semibold">{formatDimension(widthClearanceMm, unit)}</dd></div>
        </dl>
        <p className="mt-4 text-sm text-white/80">Overall cut length = sealed length + cutter tail.</p>
        <figure className="mt-6 overflow-hidden rounded-xl bg-white p-3 text-charcoal">
          <Image src="/tools/layflat-tubing-dimensions.png" alt="Diagram showing layflat width, sealed length, seal position, cutter tail and overall cut length." width={640} height={427} unoptimized className="h-auto w-full rounded-lg" />
          <figcaption className="mt-2 text-xs leading-relaxed text-charcoal/65">
            Use the diagram to match each calculated dimension to the finished tubing piece.
          </figcaption>
        </figure>
        </>}
      </div>}
      {result && !result.value.requiresContact && <div className="mt-8 border-t border-white/25 pt-6">
        <h3 className="font-heading text-xl font-semibold">Email me these measurements</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/80">Send yourself this sizing result so you have it when you are ready to request a quote.</p>
        {emailState === "sent" ? <div className="mt-4 rounded-lg bg-white/10 p-4 text-sm"><p className="font-semibold">Result requested.</p><p className="mt-1 text-white/80">Check your inbox shortly. {marketingOptIn ? "We’ve also recorded your request for Zero Pack packaging tips." : ""}</p></div> : <form onSubmit={emailResult} className="mt-4 space-y-3">
          <label className="block text-sm font-semibold" htmlFor={`tool-result-email-${mode}`}>Email address</label>
          <input id={`tool-result-email-${mode}`} type="email" autoComplete="email" value={resultEmail} onChange={(event) => { setResultEmail(event.target.value); setEmailState("idle"); setEmailError(""); }} placeholder="you@company.com" className="min-h-12 w-full rounded-lg border border-white/25 bg-white px-3 text-charcoal placeholder:text-charcoal/45" />
          <label className="flex items-start gap-3 text-sm leading-relaxed text-white/80">
            <input type="checkbox" checked={marketingOptIn} onChange={(event) => setMarketingOptIn(event.target.checked)} className="mt-1 h-4 w-4 shrink-0" />
            <span>Also send me practical packaging tips and the Zero Pack Packaging Guide. I can unsubscribe at any time.</span>
          </label>
          {emailState === "error" && <p role="alert" className="rounded-lg bg-white/10 p-3 text-sm">{emailError}</p>}
          <button type="submit" disabled={emailState === "sending"} className="min-h-11 rounded-lg bg-white px-5 font-semibold text-compost disabled:opacity-60">{emailState === "sending" ? "Sending…" : "Email my result"}</button>
          <p className="text-xs leading-relaxed text-white/60">Requesting your result does not subscribe you to marketing. The optional checkbox above is separate consent.</p>
        </form>}
      </div>}
      <div className="mt-8 border-t border-white/25 pt-5 text-sm leading-relaxed text-white/85">
        <p className="font-semibold">Measure twice, order once.</p>
        <p className="mt-2">This is a recommended starting size. Flexible packaging can vary slightly during manufacture (typically around ±{ZERO_PACK_TOLERANCE_MM} mm). Before custom production, confirm the final fit with a physical sample or mock-up if sizing is uncertain.</p>
      </div>
    </aside>
  </div>;
}
