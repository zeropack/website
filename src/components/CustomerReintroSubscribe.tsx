"use client";

import { useEffect, useState } from "react";

type LookupState =
  | { status: "loading" }
  | { status: "ready"; maskedEmail: string; alreadySubscribed: boolean }
  | { status: "invalid"; message: string };

export function CustomerReintroSubscribe() {
  const [lookup, setLookup] = useState<LookupState>({ status: "loading" });
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/customer-reintro/subscribe", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json().catch(() => null)) as
          | { ok?: boolean; maskedEmail?: string; alreadySubscribed?: boolean; error?: string }
          | null;

        if (!active) return;

        if (!response.ok || !payload?.ok || !payload.maskedEmail) {
          setLookup({
            status: "invalid",
            message: payload?.error || "This subscription link is not valid. Please use the link from your email.",
          });
          return;
        }

        setLookup({
          status: "ready",
          maskedEmail: payload.maskedEmail,
          alreadySubscribed: Boolean(payload.alreadySubscribed),
        });
      })
      .catch(() => {
        if (active) {
          setLookup({
            status: "invalid",
            message: "We could not load this subscription link. Please try again.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function subscribe() {
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/customer-reintro/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; pending?: boolean; error?: string }
        | null;

      if (!response.ok && response.status !== 202) {
        throw new Error(payload?.error || "Unable to subscribe right now.");
      }
      if (!payload?.ok) {
        throw new Error(payload?.error || "Unable to subscribe right now.");
      }

      setComplete(true);
      setMessage(
        payload.pending
          ? "Thanks — Klaviyo has accepted your subscription and is finishing the update."
          : "Thanks — you’re subscribed to Zero Pack updates.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to subscribe right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (lookup.status === "loading") {
    return <p className="mt-7 text-sm text-charcoal/65">Loading your subscription…</p>;
  }

  if (lookup.status === "invalid") {
    return (
      <div className="mt-7 rounded-xl border border-black/10 bg-stone p-5">
        <p className="text-sm leading-relaxed text-charcoal/75">{lookup.message}</p>
      </div>
    );
  }

  if (lookup.alreadySubscribed || complete) {
    return (
      <div className="mt-7 rounded-xl border border-compost/20 bg-mist p-5">
        <p className="font-semibold text-charcoal">
          {complete ? "You’re subscribed." : "You’re already subscribed to Zero Pack updates."}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
          {message || "Thanks for staying in touch with Zero Pack."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-7">
      <div className="rounded-xl border border-black/10 bg-stone p-5">
        <p className="text-sm text-charcoal/70">You’re subscribing this email address:</p>
        <p className="mt-1 font-semibold text-charcoal">{lookup.maskedEmail}</p>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-charcoal/70">
        By clicking below, you agree to receive marketing emails from Zero Pack. You can unsubscribe at any time.
      </p>

      <button
        type="button"
        onClick={subscribe}
        disabled={submitting}
        className="mt-5 w-full rounded-md bg-compost px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Subscribing…" : "Subscribe me to Zero Pack"}
      </button>

      {message ? (
        <p className="mt-4 text-sm text-charcoal/70" role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </div>
  );
}
