"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { scoreQuoteLead } from "@/lib/leadScore";
import { fireOptionalPixels, pushDataLayer } from "@/lib/tracking";
import { readStoredAttribution, captureUtmFromUrl } from "@/lib/attribution";
import type { RegionCode } from "@/lib/types";
import { CTAButton } from "./CTAButton";

type Step = 1 | 2 | 3 | 4 | 5;

const initial = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  country: "",
  product: "mailers",
  size: "",
  quantity: "2000",
  ordersPerMonth: "",
  artwork: "not-sure",
  printStyle: "not-sure",
  timeline: "research",
  currentPackaging: "plastic",
  priority: "not-sure",
  message: "",
  consent: false,
};

const productLabel: Record<string, string> = {
  mailers: "Custom compostable mailers",
  bags: "Custom compostable shopping bags",
  garment: "Custom compostable garment bags",
  campaign: "Custom compostable campaign packaging",
  unsure: "Not sure yet",
};
const timelineLabel: Record<string, string> = {
  ASAP: "ASAP",
  "4-8": "4 to 8 weeks",
  "8-12": "8 to 12 weeks",
  research: "Researching for future order",
};
const qtyLabel: Record<string, string> = {
  "under-2000": "Under 2,000",
  "2000": "2,000",
  "5000": "5,000",
  "10000": "10,000",
  "25000": "25,000",
  "50000+": "50,000+",
  "not-sure": "Not sure",
};
const artworkLabel: Record<string, string> = {
  yes: "Yes",
  no: "No",
  help: "We need help",
  "not-sure": "Not sure",
};

export function QuoteFormMultiStep({ defaultRegion }: { defaultRegion?: RegionCode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("region");
  const allowed: RegionCode[] = ["au", "uk", "us", "eu"];
  const regionParam: RegionCode =
    raw && (allowed as string[]).includes(raw) ? (raw as RegionCode) : defaultRegion ?? "au";

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState(initial);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const started = useRef(false);

  function next() {
    setError(null);
    pushDataLayer("quote_form_step_complete", { step });
    setStep((s) => (Math.min(5, s + 1) as Step));
  }

  function back() {
    setError(null);
    setStep((s) => (Math.max(1, s - 1) as Step));
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.consent) {
      setError("Please confirm consent to proceed.");
      return;
    }

    const scored = scoreQuoteLead({
      quantity: form.quantity,
      timeline: form.timeline,
      website: form.website,
      artwork: form.artwork,
      currentPackaging: form.currentPackaging,
      hasCompany: form.company.trim().length > 1,
    });

    const utm = captureUtmFromUrl();
    const stored = readStoredAttribution();

    const payload = {
      ...form,
      region: regionParam,
      tier: scored,
      utm,
      first_touch: stored.first,
      last_touch: stored.last,
      artworkFileName: fileName,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submit failed");
      pushDataLayer("quote_form_submit", { tier: scored, region: regionParam });
      if (scored === "hot") pushDataLayer("quote_form_hot_lead", { region: regionParam });
      if (scored === "warm") pushDataLayer("quote_form_warm_lead", { region: regionParam });
      if (scored === "cold") pushDataLayer("quote_form_cold_lead", { region: regionParam });
      fireOptionalPixels("quote_form_submit", { tier: scored });
      pushDataLayer("quote_form_step_complete", { step: 5 });

      const params = new URLSearchParams({
        productType: productLabel[form.product] ?? form.product,
        quantity: qtyLabel[form.quantity] ?? form.quantity,
        region: regionParam,
        timeline: timelineLabel[form.timeline] ?? form.timeline,
        artwork: artworkLabel[form.artwork] ?? form.artwork,
        tier: scored,
      });
      router.push(`/quote/success/?${params.toString()}`);
    } catch {
      setError("Something went wrong. Please try again or email us.");
    } finally {
      setSubmitting(false);
    }
  }

  const lowQty =
    form.quantity === "under-2000" ||
    form.quantity === "not-sure";

  return (
    <form
      className="space-y-8"
      onSubmit={onSubmit}
      onFocusCapture={() => {
        if (!started.current) {
          started.current = true;
          pushDataLayer("quote_form_start", { region: regionParam });
        }
      }}
    >
      <div className="flex items-center justify-between text-sm font-semibold text-compost">
        <span>
          Step {step} of 5
        </span>
        <span className="text-charcoal/60">Region: {regionParam.toUpperCase()}</span>
      </div>

      {step === 1 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required>
            <input
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </Field>
          <Field label="Email" required>
            <input
              type="email"
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </Field>
          <Field label="Phone">
            <input
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
          <Field label="Company name" required>
            <input
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              required
            />
          </Field>
          <Field label="Website">
            <input
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              placeholder="https://"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </Field>
          <Field label="Country / region" required>
            <select
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              required
            >
              <option value="">Select</option>
              <option>Australia</option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>European Union</option>
              <option>Other</option>
            </select>
          </Field>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4">
          <Field label="Product type" required>
            <select
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.product}
              onChange={(e) => update("product", e.target.value)}
            >
              <option value="mailers">Custom compostable mailers</option>
              <option value="bags">Custom compostable shopping bags</option>
              <option value="garment">Custom compostable garment bags</option>
              <option value="campaign">Custom compostable campaign packaging</option>
              <option value="unsure">Not sure yet</option>
            </select>
          </Field>
          <Field label="Approximate size required">
            <input
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              placeholder="e.g. A4 flat, 350x450mm internal — estimates are fine"
              value={form.size}
              onChange={(e) => update("size", e.target.value)}
            />
          </Field>
          <Field label="Quantity" required>
            <select
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.quantity}
              onChange={(e) => update("quantity", e.target.value)}
            >
              <option value="under-2000">Under 2,000</option>
              <option value="2000">2,000</option>
              <option value="5000">5,000</option>
              <option value="10000">10,000</option>
              <option value="25000">25,000</option>
              <option value="50000+">50,000+</option>
              <option value="not-sure">Not sure</option>
            </select>
          </Field>
          {lowQty ? (
            <p className="rounded-lg bg-mist p-4 text-sm text-charcoal/80">
              Custom production usually becomes practical from around 2,000 units. If you are not ready for that
              yet, download the guide or request advice and we can point you in the right direction.
            </p>
          ) : null}
          <Field label="How many orders do you ship per month?">
            <input
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.ordersPerMonth}
              onChange={(e) => update("ordersPerMonth", e.target.value)}
            />
          </Field>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-4">
          <Field label="Do you have artwork ready?">
            <select
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.artwork}
              onChange={(e) => update("artwork", e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="help">We need help</option>
              <option value="not-sure">Not sure</option>
            </select>
          </Field>
          <Field label="Print style">
            <select
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.printStyle}
              onChange={(e) => update("printStyle", e.target.value)}
            >
              <option value="logo">Logo only</option>
              <option value="one">One colour</option>
              <option value="multi">Multiple colours</option>
              <option value="full">Full custom artwork</option>
              <option value="not-sure">Not sure</option>
            </select>
          </Field>
          <Field label="Upload artwork or logo (optional)">
            <input
              type="file"
              className="w-full text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFileName(f?.name ?? null);
                if (f) pushDataLayer("artwork_upload", { name: f.name });
              }}
            />
          </Field>
          <p className="text-sm text-charcoal/70">
            Not sure about size, artwork or quantity? That is fine. Tell us what you know and we will help work
            through the best option.
          </p>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="grid gap-4">
          <Field label="When do you need packaging?">
            <select
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.timeline}
              onChange={(e) => update("timeline", e.target.value)}
            >
              <option value="ASAP">ASAP</option>
              <option value="4-8">4 to 8 weeks</option>
              <option value="8-12">8 to 12 weeks</option>
              <option value="research">Researching for future order</option>
            </select>
          </Field>
          <Field label="Current packaging">
            <select
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.currentPackaging}
              onChange={(e) => update("currentPackaging", e.target.value)}
            >
              <option value="plastic">Plastic mailers</option>
              <option value="recycled-plastic">Recycled plastic mailers</option>
              <option value="paper">Paper mailers</option>
              <option value="compostable">Compostable mailers</option>
              <option value="boxes">Boxes</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="What matters most?">
            <select
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.priority}
              onChange={(e) => update("priority", e.target.value)}
            >
              <option value="price">Price</option>
              <option value="brand">Brand presentation</option>
              <option value="compost">Compostability</option>
              <option value="delivery">Delivery time</option>
              <option value="moq">MOQ</option>
              <option value="quality">Quality</option>
              <option value="not-sure">Not sure</option>
            </select>
          </Field>
          {form.timeline === "research" ? (
            <p className="rounded-lg bg-mist p-4 text-sm text-charcoal/80">
              If you are researching for a future order, we will still respond with helpful guidance and can include
              you in a short nurture sequence — no pressure.
            </p>
          ) : null}
        </div>
      ) : null}

      {step === 5 ? (
        <div className="grid gap-4">
          <Field label="Anything else we should know?">
            <textarea
              className="min-h-[120px] w-full rounded-lg border border-black/10 bg-white px-3 py-2"
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
            />
          </Field>
          <label className="flex items-start gap-3 text-sm text-charcoal/80">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => update("consent", e.target.checked)}
              required
            />
            <span>I agree to Zero Pack contacting me about this enquiry.</span>
          </label>
        </div>
      ) : null}

      {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {step > 1 ? (
            <CTAButton type="button" variant="secondary" onClick={back}>
              Back
            </CTAButton>
          ) : null}
        </div>
        <div className="flex gap-3">
          {step < 5 ? (
            <CTAButton
              type="button"
              variant="primary"
              onClick={() => {
                if (step === 1 && (!form.name || !form.email || !form.company || !form.country)) {
                  setError("Please complete required fields.");
                  return;
                }
                next();
              }}
            >
              Continue
            </CTAButton>
          ) : (
            <CTAButton type="submit" variant="primary" className="min-w-[200px]">
              {submitting ? "Submitting…" : "Request My Custom Quote"}
            </CTAButton>
          )}
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-charcoal">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
