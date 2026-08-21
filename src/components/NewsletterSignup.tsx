"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function NewsletterSignup() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("submitting");
    setMessage("");

    const form = new FormData(formElement);
    const email = String(form.get("email") || "").trim();
    const website = String(form.get("website") || "").trim();

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "Unable to subscribe right now.");
      }

      formElement.reset();
      setState("success");
      setMessage("You’re subscribed. Welcome to the Zero Pack newsletter.");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to subscribe right now. Please try again.",
      );
    }
  }

  return (
    <div className="text-center">
      <h2 className="font-heading text-xl font-semibold text-leaf sm:text-2xl">
        Subscribe to our newsletter.
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/90">
        By subscribing you agree to receive marketing emails from Zero Pack. You can unsubscribe at any time.
      </p>

      <form onSubmit={handleSubmit} className="mt-5" noValidate>
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="newsletter-website">Website</label>
          <input id="newsletter-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email address"
            className="min-w-0 flex-1 rounded-md border border-white bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/55 outline-none transition focus:ring-2 focus:ring-leaf"
          />
          <button
            type="submit"
            disabled={state === "submitting"}
            className="rounded-md border border-white bg-white px-6 py-3 font-semibold text-charcoal transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {state === "submitting" ? "Subscribing…" : "Subscribe"}
          </button>
        </div>
      </form>

      <p
        className={`mt-3 min-h-5 text-sm ${state === "error" ? "text-white" : "text-leaf"}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  );
}
