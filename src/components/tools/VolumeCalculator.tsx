"use client";

import { useRef, useState, type FormEvent } from "react";
import type { ToolIdentity } from "./ToolTracking";
import { trackTool } from "@/lib/tools/analytics";
import { convertDimension, formatVolume, rectangularVolume, wholeQuantity, type Dimensions, type Unit } from "@/lib/tools/calculations";

type Row = Dimensions & { id: number; quantity: string };
type RowResult = { id: number; quantity: number; perCarton: number; subtotal: number };
const empty = (id: number): Row => ({ id, length: "", width: "", height: "", quantity: "1" });
const dimensions = ["length", "width", "height"] as const;
const unitLabels: Record<Unit, string> = { mm: "Millimetres (mm)", cm: "Centimetres (cm)", m: "Metres (m)", in: "Inches (in)" };

export function VolumeCalculator({ mode, tool }: { mode: "box" | "cbm"; tool: ToolIdentity }) {
  const [unit, setUnit] = useState<Unit>("cm");
  const [rows, setRows] = useState<Row[]>([empty(1)]);
  const [result, setResult] = useState<{ metresCubed: number; cartonCount: number; rows: RowResult[] } | null>(null);
  const [error, setError] = useState("");
  const [invalidField, setInvalidField] = useState<string | null>(null);
  const started = useRef(false);
  const nextId = useRef(2);

  function markStarted() {
    if (!started.current) {
      started.current = true;
      trackTool("tool_start", tool.id, tool.name, tool.market, "started");
    }
    setResult(null);
    setError("");
    setInvalidField(null);
  }

  function update(id: number, field: keyof Row, value: string) {
    markStarted();
    setRows((current) => current.map((row) => row.id === id ? { ...row, [field]: value } : row));
  }

  function changeUnit(next: Unit) {
    if (next === unit) return;
    markStarted();
    setRows((current) => current.map((row) => ({
      ...row,
      length: convertDimension(row.length, unit, next),
      width: convertDimension(row.width, unit, next),
      height: convertDimension(row.height, unit, next),
    })));
    setUnit(next);
  }

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let sum = 0;
    let count = 0;
    const rowResults: RowResult[] = [];
    for (const row of rows) {
      const invalidDimension = dimensions.find((field) => {
        const value = Number(row[field]);
        return !Number.isFinite(value) || value <= 0;
      });
      const invalidQuantity = mode === "cbm" && wholeQuantity(row.quantity) === null;
      if (invalidDimension || invalidQuantity) {
        const field = invalidDimension ?? "quantity";
        const inputId = `volume-${row.id}-${field}`;
        const label = invalidDimension ? `${field} (${unit})` : "number of cartons";
        setInvalidField(inputId);
        setError(`Enter a positive ${invalidDimension ? "number" : "whole number"} for ${label}${mode === "cbm" ? ` in carton size ${rows.indexOf(row) + 1}` : ""}.`);
        setResult(null);
        document.getElementById(inputId)?.focus();
        return;
      }
      const volume = rectangularVolume(row, unit);
      const quantity = mode === "cbm" ? wholeQuantity(row.quantity) : 1;
      if (volume === null || quantity === null) {
        setError("Enter a positive number for every dimension and a positive whole number for each carton quantity.");
        setResult(null);
        return;
      }
      sum += volume * quantity;
      count += quantity;
      rowResults.push({ id: row.id, quantity, perCarton: volume, subtotal: volume * quantity });
    }
    if (!Number.isFinite(sum) || sum <= 0 || !Number.isSafeInteger(count)) {
      setError("These values are too large to calculate. Please enter smaller numbers.");
      setResult(null);
      return;
    }
    setError("");
    setInvalidField(null);
    setResult({ metresCubed: sum, cartonCount: count, rows: rowResults });
    trackTool("tool_complete", tool.id, tool.name, tool.market, "completed");
  }

  function reset() {
    setRows([empty(nextId.current++)]);
    setUnit("cm");
    setResult(null);
    setError("");
    setInvalidField(null);
    started.current = false;
  }

  return <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
    <form onSubmit={calculate} noValidate className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="font-heading text-2xl font-semibold">{mode === "box" ? "Enter the space to measure" : "Enter packed carton dimensions"}</h2>
      <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{mode === "box" ? "Measure the length, width and height of the same rectangular space. Use internal measurements if you want the available interior space." : "Use the outside length, width and height of each packed shipping carton. Add a row for each carton size."}</p>
      <div className="mt-6 max-w-xs"><label htmlFor="volume-unit" className="block text-sm font-semibold">Measurement unit</label><select id="volume-unit" value={unit} onChange={(event) => changeUnit(event.target.value as Unit)} className="mt-2 min-h-12 w-full rounded-lg border border-charcoal/25 bg-white px-3">{(Object.keys(unitLabels) as Unit[]).map((value) => <option key={value} value={value}>{unitLabels[value]}</option>)}</select><p className="mt-2 text-xs text-charcoal/65">Changing units converts dimensions already entered.</p></div>
      <div className="mt-6 space-y-6">{rows.map((row, index) => <fieldset key={row.id} className="min-w-0 rounded-xl border border-charcoal/15 p-4 sm:p-5">
        <legend className="px-1 font-semibold">{mode === "box" ? "Dimensions" : `Carton size ${index + 1}`}</legend>
        <div className="grid gap-4 sm:grid-cols-3">{dimensions.map((field) => <div key={field}><label htmlFor={`volume-${row.id}-${field}`} className="block text-sm font-medium capitalize">{field} ({unit})</label><input id={`volume-${row.id}-${field}`} type="number" inputMode="decimal" min="0" step="any" required value={row[field]} aria-invalid={invalidField === `volume-${row.id}-${field}`} aria-describedby={invalidField === `volume-${row.id}-${field}` ? "volume-error" : undefined} onChange={(event) => update(row.id, field, event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-charcoal/25 px-3" /></div>)}</div>
        {mode === "cbm" && <div className="mt-4 flex flex-wrap items-end gap-4"><div><label htmlFor={`volume-${row.id}-quantity`} className="block text-sm font-medium">Number of cartons</label><input id={`volume-${row.id}-quantity`} type="number" inputMode="numeric" min="1" step="1" required value={row.quantity} aria-invalid={invalidField === `volume-${row.id}-quantity`} aria-describedby={invalidField === `volume-${row.id}-quantity` ? "volume-error" : undefined} onChange={(event) => update(row.id, "quantity", event.target.value)} className="mt-2 min-h-12 w-36 rounded-lg border border-charcoal/25 px-3" /></div>{rows.length > 1 && <button type="button" onClick={() => { markStarted(); setRows((current) => current.filter((item) => item.id !== row.id)); }} className="min-h-12 rounded-lg px-4 font-semibold text-compost underline">Remove row {index + 1}</button>}</div>}
      </fieldset>)}</div>
      {mode === "cbm" && <button type="button" onClick={() => { markStarted(); setRows((current) => [...current, empty(nextId.current++)]); }} className="mt-5 min-h-12 rounded-lg border border-compost/30 px-5 font-semibold text-compost hover:bg-mist">+ Add another carton size</button>}
      {error && <p id="volume-error" role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <div className="mt-7 flex flex-wrap gap-3"><button type="submit" className="min-h-12 rounded-xl bg-compost px-6 font-semibold text-white hover:bg-forest">Calculate {mode === "box" ? "volume" : "CBM"}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-charcoal/25 px-6 font-semibold hover:bg-stone">Reset</button></div>
    </form>
    <aside className="self-start rounded-2xl bg-compost p-6 text-white sm:p-8" aria-live="polite" aria-atomic="true">
      <h2 className="font-heading text-2xl font-semibold">{mode === "box" ? "Box volume" : "Combined carton CBM"}</h2>
      {result ? <div className="mt-6"><p className="text-4xl font-semibold tabular-nums break-words">{formatVolume(result.metresCubed)} m³</p>{mode === "box" ? <dl className="mt-6 space-y-3 border-t border-white/25 pt-5"><div className="flex justify-between gap-3"><dt>Cubic centimetres</dt><dd className="font-semibold tabular-nums">{formatVolume(result.metresCubed * 1_000_000)} cm³</dd></div><div className="flex justify-between gap-3"><dt>Litres</dt><dd className="font-semibold tabular-nums">{formatVolume(result.metresCubed * 1_000)} L</dd></div></dl> : <><p className="mt-4 text-white/85">Combined external carton volume for {formatVolume(result.cartonCount)} carton{result.cartonCount === 1 ? "" : "s"}.</p><div className="mt-6 space-y-4 border-t border-white/25 pt-5">{result.rows.map((row, index) => <div key={row.id} className="rounded-lg bg-white/10 p-4"><h3 className="font-semibold">Carton size {index + 1}</h3><dl className="mt-2 space-y-1 text-sm text-white/85"><div className="flex justify-between gap-3"><dt>Per carton</dt><dd className="text-right tabular-nums">{formatVolume(row.perCarton)} m³</dd></div><div className="flex justify-between gap-3"><dt>{formatVolume(row.quantity)} carton{row.quantity === 1 ? "" : "s"}</dt><dd className="text-right font-semibold tabular-nums">{formatVolume(row.subtotal)} m³</dd></div></dl></div>)}</div></>}</div> : <p className="mt-5 text-white/80">Enter your measurements and calculate to see the result here.</p>}
      <p className="mt-8 border-t border-white/25 pt-5 text-sm leading-relaxed text-white/80">{mode === "box" ? "This is a geometric volume, not a packaging size or fit recommendation." : "This is the sum of carton volumes. Pallets, spaces between cartons and carrier chargeable volume are not included."}</p>
    </aside>
  </div>;
}
