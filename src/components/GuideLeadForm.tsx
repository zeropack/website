"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { captureUtmFromUrl, persistAttribution, readStoredAttribution } from "@/lib/attribution";
import { pushDataLayer } from "@/lib/tracking";
import { CTAButton } from "./CTAButton";

export function GuideLeadForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    company: "",
    country: "",
    packaging: "",
    volume: "",
    consent: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.consent) {
      setError("Please confirm consent.");
      return;
    }
    const utm = captureUtmFromUrl();
    persistAttribution(utm);
    const stored = readStoredAttribution();
    pushDataLayer("guide_download_submit", { country: form.country });
    setBusy(true);
    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, utm, stored }),
      });
      if (!res.ok) throw new Error("fail");
      router.push("/packaging-guide/thank-you/");
    } catch {
      setError("Could not submit. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <Field label="First name" required>
        <input
          required
          className="w-full rounded-lg border border-black/10 px-3 py-2"
          value={form.firstName}
          onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
          onFocus={() => pushDataLayer("guide_download_start", {})}
        />
      </Field>
      <Field label="Email" required>
        <input
          required
          type="email"
          className="w-full rounded-lg border border-black/10 px-3 py-2"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </Field>
      <Field label="Company name" required>
        <input
          required
          className="w-full rounded-lg border border-black/10 px-3 py-2"
          value={form.company}
          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
        />
      </Field>
      <Field label="Country or region" required>
        <input
          required
          className="w-full rounded-lg border border-black/10 px-3 py-2"
          value={form.country}
          onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
        />
      </Field>
      <Field label="Current packaging type">
        <input
          className="w-full rounded-lg border border-black/10 px-3 py-2"
          value={form.packaging}
          onChange={(e) => setForm((f) => ({ ...f, packaging: e.target.value }))}
        />
      </Field>
      <Field label="Estimated monthly order volume">
        <input
          className="w-full rounded-lg border border-black/10 px-3 py-2"
          value={form.volume}
          onChange={(e) => setForm((f) => ({ ...f, volume: e.target.value }))}
        />
      </Field>
      <label className="flex items-start gap-3 text-sm text-charcoal/80">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
          required
        />
        <span>I agree to receive the guide and related emails from Zero Pack.</span>
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <CTAButton type="submit" variant="primary" className="w-full sm:w-auto">
        {busy ? "Submitting…" : "Get the Free Guide"}
      </CTAButton>
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
        {required ? " *" : null}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
