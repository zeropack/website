"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type TrackingStage = "ordered" | "in_transit" | "out_for_delivery" | "delivered";

type TrackingEvent = {
  waybill: string | null;
  trackingNumber: string | null;
  dateTime: string;
  location: string;
  details: string;
};

type PublicDestination = {
  label: string;
  locality: string | null;
  state: string | null;
  postcode: string | null;
  country: string | null;
};

type ProjectEnrichment = {
  eta: string | null;
  status: string | null;
  destination: PublicDestination | null;
};

type TrackingResponse = {
  ok: true;
  trackingNumber: string;
  carrier: string | null;
  status: { stage: TrackingStage; label: string };
  latestUpdate: string;
  latestLocation: string | null;
  project: ProjectEnrichment | null;
  events: TrackingEvent[];
};

type TrackingError = { ok: false; error: string };

const steps: Array<{ stage: TrackingStage; label: string }> = [
  { stage: "ordered", label: "Ordered" },
  { stage: "in_transit", label: "In transit" },
  { stage: "out_for_delivery", label: "Out for delivery" },
  { stage: "delivered", label: "Delivered" },
];

const stageIndex: Record<TrackingStage, number> = {
  ordered: 0,
  in_transit: 1,
  out_for_delivery: 2,
  delivered: 3,
};

function StatusIcon({ stage }: { stage: TrackingStage }) {
  if (stage === "delivered") {
    return (
      <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" aria-hidden>
        <path d="m5 12.5 4.2 4.2L19.5 6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" aria-hidden>
      <path d="M3.5 7.5h11v9h-11zM14.5 10h3l3 3v3.5h-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="7.2" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function TimelineDot({ active }: { active: boolean }) {
  return <span className={`mt-2 block h-3 w-3 rounded-full ring-4 ring-white ${active ? "bg-leaf" : "bg-charcoal/20"}`} />;
}

function prettyDateTime(value: string): { date: string; time: string } {
  const normalised = value.trim();
  const timeMatch = normalised.match(/\b(\d{1,2}:\d{2}(?::\d{2})?)\b/);
  if (!timeMatch) return { date: normalised, time: "" };
  return {
    date: normalised.replace(timeMatch[0], "").replace(/^[,\s-]+|[,\s-]+$/g, ""),
    time: timeMatch[0],
  };
}

function prettyEta(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function MapPanel({
  location,
  destination,
  events,
}: {
  location: string | null;
  destination: PublicDestination | null;
  events: TrackingEvent[];
}) {
  const currentLocation = location?.trim() || null;
  const destinationLabel = destination?.label?.trim() || null;
  const query = currentLocation || destinationLabel;
  const destinationFallback = !currentLocation && Boolean(destinationLabel);
  const mapSrc = query
    ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
    : null;
  const recentLocations = Array.from(
    new Set(events.map((event) => event.location.trim()).filter(Boolean)),
  ).slice(0, 4);

  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-[1.75rem] border border-black/10 bg-[#e9eee7] shadow-[0_24px_70px_-38px_rgba(17,24,39,0.45)] lg:min-h-[650px]">
      {mapSrc ? (
        <iframe
          title={`Map showing ${query}`}
          src={mapSrc}
          className="absolute inset-0 h-full w-full border-0 grayscale-[0.08] contrast-[0.92] saturate-[0.72]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(131,185,37,0.18),transparent_22%),linear-gradient(135deg,#edf2ea,#e3ebe0)]" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/25" />

      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-black/5 bg-white/95 px-4 py-2 text-sm font-semibold text-charcoal shadow-lg backdrop-blur">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-leaf" />
        {destinationFallback ? "Delivery destination" : "Latest tracking location"}
      </div>

      {query && (
        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur sm:right-auto sm:max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/45">
            {destinationFallback ? "On its way to" : "Latest location"}
          </p>
          <p className="mt-1 font-heading text-xl font-bold text-compost">{query}</p>

          {!destinationFallback && destinationLabel && (
            <p className="mt-2 text-sm font-medium text-charcoal/65">
              On its way to <span className="font-bold text-charcoal">{destinationLabel}</span>
            </p>
          )}

          {!destinationFallback && recentLocations.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {recentLocations.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border border-compost/10 bg-mist px-2.5 py-1 text-xs font-medium text-compost"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          <p className="mt-3 text-xs leading-5 text-charcoal/55">
            {destinationFallback
              ? "Kingtrans has not supplied a current scan location, so the map is centred on the delivery destination."
              : "Map position is based on the location text supplied in the tracking feed. It is not a live courier GPS position."}
          </p>
        </div>
      )}
    </div>
  );
}

export function TrackingLookup() {
  const [number, setNumber] = useState("");
  const [data, setData] = useState<TrackingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function lookup(value: string) {
    const trackingNumber = value.trim();
    if (!trackingNumber) return;

    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const response = await fetch(`/api/tracking?number=${encodeURIComponent(trackingNumber)}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as TrackingResponse | TrackingError;

      if (!response.ok || !payload.ok) {
        setData(null);
        setError(payload.ok ? "Unable to retrieve tracking." : payload.error);
        return;
      }

      setData(payload);
      const url = new URL(window.location.href);
      url.searchParams.set("number", trackingNumber);
      window.history.replaceState(null, "", url);
    } catch {
      setData(null);
      setError("Tracking is temporarily unavailable. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("number")?.trim();
    if (initial) {
      setNumber(initial);
      void lookup(initial);
    }
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookup(number);
  }

  const currentStage = data ? stageIndex[data.status.stage] : -1;
  const latestEvent = data?.events[0] || null;
  const destination = data?.project?.destination || null;
  const statusNote = useMemo(() => {
    if (!data || !latestEvent) return null;
    if (data.status.stage === "delivered") {
      return `Latest update: ${latestEvent.details}`;
    }
    if (!data.latestLocation && data.project?.destination?.label) {
      return `On its way to ${data.project.destination.label}`;
    }
    return latestEvent.details;
  }, [data, latestEvent]);

  async function copyTrackingNumber() {
    if (!data) return;
    await navigator.clipboard.writeText(data.trackingNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="bg-[linear-gradient(180deg,#fbfcfa_0%,#f6f4ef_48%,#f1f5ef_100%)] px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-leaf">Shipment tracking</p>
            <h1 className="font-heading text-4xl font-bold tracking-[-0.03em] text-charcoal sm:text-5xl">Track your order</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-charcoal/65 sm:text-lg">
              Enter your tracking number to see the latest delivery status and shipment updates.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex w-full max-w-xl gap-2 rounded-2xl border border-black/10 bg-white p-2 shadow-sm">
            <label htmlFor="tracking-number" className="sr-only">Tracking number</label>
            <input
              id="tracking-number"
              value={number}
              onChange={(event) => setNumber(event.target.value)}
              placeholder="Enter tracking number"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-xl px-4 py-3 text-sm font-medium text-charcoal outline-none placeholder:text-charcoal/35"
            />
            <button
              type="submit"
              disabled={loading || !number.trim()}
              className="rounded-xl bg-compost px-5 py-3 text-sm font-bold text-white transition hover:bg-forest disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Checking…" : "Track"}
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-800" role="alert">
            {error}
          </div>
        )}

        {!data && !loading ? (
          <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-[1.75rem] border border-black/10 bg-white p-7 shadow-[0_24px_70px_-45px_rgba(17,24,39,0.4)] sm:p-9">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-compost">
                <StatusIcon stage="in_transit" />
              </div>
              <h2 className="mt-6 font-heading text-2xl font-bold text-charcoal">Your delivery, clearly tracked</h2>
              <p className="mt-3 max-w-lg leading-7 text-charcoal/65">
                Tracking updates are retrieved from the carrier feed and presented here in a simpler Zero Pack view.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {steps.map((step) => (
                  <div key={step.stage} className="rounded-xl bg-stone px-3 py-3 text-center text-xs font-semibold text-charcoal/60">
                    {step.label}
                  </div>
                ))}
              </div>
            </div>
            <MapPanel location={null} destination={null} events={[]} />
          </div>
        ) : null}

        {data && (
          <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
            <div className="space-y-5">
              <div className="overflow-hidden rounded-[1.75rem] border border-compost/10 bg-white shadow-[0_24px_70px_-45px_rgba(17,24,39,0.45)]">
                <div className="bg-[radial-gradient(circle_at_88%_8%,rgba(131,185,37,0.20),transparent_30%),linear-gradient(135deg,#f2f9f1,#ffffff_62%)] p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/45">Tracking number</p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="font-heading text-xl font-bold text-charcoal sm:text-2xl">{data.trackingNumber}</p>
                        <button
                          type="button"
                          onClick={copyTrackingNumber}
                          className="rounded-lg p-2 text-charcoal/45 hover:bg-black/5 hover:text-compost"
                          aria-label="Copy tracking number"
                          title={copied ? "Copied" : "Copy tracking number"}
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                            <rect x="8" y="8" width="10" height="10" rx="2" />
                            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                          </svg>
                        </button>
                        {copied && <span className="text-xs font-semibold text-compost">Copied</span>}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-black/5 bg-white/90 px-4 py-3 shadow-sm">
                      <p className="text-xs font-semibold text-charcoal/45">Carrier</p>
                      <p className="mt-1 text-sm font-bold text-charcoal">{data.carrier || "Kingtrans"}</p>
                    </div>
                  </div>

                  <div className="mt-7 flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-leaf text-white shadow-[0_12px_32px_-16px_rgba(33,78,52,0.9)]">
                      <StatusIcon stage={data.status.stage} />
                    </div>
                    <div>
                      <h2 className="font-heading text-3xl font-bold tracking-[-0.025em] text-compost sm:text-4xl">{data.status.label}</h2>
                      {statusNote && <p className="mt-1 text-sm leading-6 text-charcoal/60">{statusNote}</p>}
                    </div>
                  </div>

                  {(data.project?.eta || destination) && (
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {destination && (
                        <div className="rounded-2xl border border-compost/10 bg-white/85 px-4 py-4 shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40">Delivering to</p>
                          <p className="mt-1 font-heading text-lg font-bold text-charcoal">{destination.label}</p>
                        </div>
                      )}
                      {data.project?.eta && (
                        <div className="rounded-2xl border border-compost/10 bg-white/85 px-4 py-4 shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40">Estimated arrival</p>
                          <p className="mt-1 font-heading text-lg font-bold text-charcoal">{prettyEta(data.project.eta)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-3">
                    {steps.map((step, index) => {
                      const complete = index <= currentStage;
                      return (
                        <div key={step.stage} className="relative text-center">
                          {index > 0 && (
                            <span className={`absolute right-1/2 top-4 h-0.5 w-full ${complete ? "bg-leaf" : "bg-charcoal/10"}`} />
                          )}
                          <span className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black ${complete ? "border-leaf bg-leaf text-white" : "border-charcoal/15 bg-white text-charcoal/30"}`}>
                            {complete ? "✓" : index + 1}
                          </span>
                          <span className={`mt-2 block text-[11px] font-semibold sm:text-xs ${complete ? "text-compost" : "text-charcoal/40"}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-[0_24px_70px_-45px_rgba(17,24,39,0.4)] sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-heading text-xl font-bold text-charcoal">Delivery timeline</h2>
                  <span className="text-xs font-semibold text-charcoal/45">{data.events.length} update{data.events.length === 1 ? "" : "s"}</span>
                </div>

                <ol className="mt-7">
                  {data.events.map((event, index) => {
                    const { date, time } = prettyDateTime(event.dateTime);
                    const active = index === 0;
                    return (
                      <li key={`${event.dateTime}-${event.location}-${index}`} className="grid grid-cols-[76px_24px_1fr] gap-2 sm:grid-cols-[105px_28px_1fr] sm:gap-3">
                        <div className="pb-7 text-right">
                          <p className="text-xs font-bold text-charcoal/75 sm:text-sm">{date || event.dateTime}</p>
                          {time && <p className="mt-1 text-xs text-charcoal/45 sm:text-sm">{time}</p>}
                        </div>
                        <div className="relative flex justify-center">
                          {index < data.events.length - 1 && <span className="absolute bottom-0 top-4 w-px bg-charcoal/10" />}
                          <TimelineDot active={active} />
                        </div>
                        <div className="pb-7">
                          {event.location && <p className="text-sm font-bold text-charcoal">{event.location}</p>}
                          <p className={`mt-0.5 text-sm leading-6 ${active ? "font-medium text-charcoal" : "text-charcoal/62"}`}>{event.details}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            <MapPanel location={data.latestLocation} destination={destination} events={data.events} />
          </div>
        )}

        <p className="mt-6 text-center text-xs leading-5 text-charcoal/45">
          Tracking events are supplied by Kingtrans. Update timing and location detail can vary during transit.
        </p>
      </div>
    </section>
  );
}
