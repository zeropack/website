"use client";

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
  depth: "Packed product depth / thickness",
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

  function reset() {
    setInputs({ width: "", length: "", depth: "" });
    setExtraRoomMm(0);
    setAdhesive("single");
    setWidthClearanceMm(5);
    setCutterTailMm(DEFAULT_TUBING_CUTTER_TAIL_MM);
    setSubmitted(false);
    setError("");
    started.current = false;
  }

  const secondaryUnit: SizingUnit = unit === "mm" ? "in" : "mm";

  return <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
    <form onSubmit={calculate} noValidate className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="font-heading text-2xl font-semibold">Measure the packed product</h2>
      <p className="mt-3 text-sm leading-relaxed text-charcoal/70">Measure the product exactly as it will be packed. Use the outside width, length and finished depth / thickness.</p>

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
          <label htmlFor="tube-cutter-tail" className="block text-sm font-semibold">Material beyond the seal for your cutter</label>
          <p className="mt-1 text-xs leading-relaxed text-charcoal/65">Minimum 5 mm. We recommend 15 mm as a practical starting point, but your sealer or cutter may need less or more.</p>
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
            <div className="flex justify-between gap-4"><dt>Bag body</dt><dd className="text-right font-semibold">Width × length</dd></div>
            <div className="flex justify-between gap-4"><dt>Closure flap</dt><dd className="text-right font-semibold">{result.value.flapMm} mm · {adhesive === "double" ? "double" : "single"} adhesive</dd></div>
            <div className="flex justify-between gap-4"><dt>Extra room selected</dt><dd className="text-right font-semibold">{extraRoomMm} mm</dd></div>
          </dl>
        </>}
      </div> : <div className="mt-6">
        {result.value.requiresContact ? <><p className="text-2xl font-semibold">Please contact us directly</p><p className="mt-3 text-white/85">This result falls outside the 100–1,000 mm width or length range covered by the online calculator. Email us your packed product dimensions and details of your sealing setup and we’ll review the best option.</p><a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Layflat tubing sizing enquiry")}`} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 font-semibold text-compost">Email Zero Pack</a></> : <>
        <p className="text-3xl font-semibold tabular-nums">{formatDimension(result.value.layflatWidthMm, unit)} wide</p>
        <p className="mt-1 text-xl font-semibold tabular-nums">Cut length {formatDimension(result.value.cutLengthMm, unit)}</p>
        <p className="mt-2 text-sm text-white/75">{formatDimension(result.value.layflatWidthMm, secondaryUnit)} wide · cut {formatDimension(result.value.cutLengthMm, secondaryUnit)}</p>
        <dl className="mt-6 space-y-3 border-t border-white/25 pt-5 text-sm">
          <div className="flex justify-between gap-4"><dt>Width clearance</dt><dd className="font-semibold">{widthClearanceMm} mm</dd></div>
          <div className="flex justify-between gap-4"><dt>Cutter tail</dt><dd className="font-semibold">{cutterTailMm} mm</dd></div>
        </dl>
        </>}
      </div>}
      <div className="mt-8 border-t border-white/25 pt-5 text-sm leading-relaxed text-white/85">
        <p className="font-semibold">Measure twice, order once.</p>
        <p className="mt-2">This is a recommended starting size. Flexible packaging can vary slightly during manufacture (typically around ±{ZERO_PACK_TOLERANCE_MM} mm). Before custom production, confirm the final fit with a physical sample or mock-up if sizing is uncertain.</p>
      </div>
    </aside>
  </div>;
}
