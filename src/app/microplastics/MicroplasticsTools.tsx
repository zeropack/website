"use client";

import { type FormEvent, useRef, useState } from "react";

type Service = {
  label: string;
  href: string;
  purpose: string;
};

type Jurisdiction = {
  code: string;
  name: string;
  services: Service[];
};

type FinderResult =
  | {
      status: "resolved";
      checkedAt: string;
      federal: {
        electorate: string;
        name: string;
        role: string;
        memberFor: string;
        officialProfileUrl: string;
        aecProfileUrl: string;
      };
      sources: { label: string; href: string }[];
    }
  | {
      status: "ambiguous";
      checkedAt: string;
      electorates: string[];
      message: string;
      aecResultUrl: string;
      aecFinderUrl: string;
    }
  | {
      status: "electorate-only";
      checkedAt: string;
      electorate: string;
      message: string;
      aecProfileUrl: string;
      officialDirectoryUrl: string;
    }
  | {
      status: "unresolved" | "error";
      checkedAt: string;
      message: string;
      aecFinderUrl: string;
      officialDirectoryUrl?: string;
    };

const FEDERAL_SERVICES: Service[] = [
  {
    label: "AEC electorate finder",
    href: "https://electorate.aec.gov.au/",
    purpose: "Check your federal electorate using the Australian Electoral Commission service.",
  },
  {
    label: "Australian Parliament member search",
    href: "https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results",
    purpose: "Check current federal parliamentarians and their official contact pages.",
  },
];

const JURISDICTIONS: Jurisdiction[] = [
  {
    code: "NSW",
    name: "New South Wales",
    services: [
      { label: "Find my electorate", href: "https://elections.nsw.gov.au/elections/find-my-electorate", purpose: "State electorate finder" },
      { label: "Members and ministers", href: "https://www.parliament.nsw.gov.au/members-and-electorates/members-and-ministers", purpose: "Current state members and official contact details" },
      { label: "Find your local council", href: "https://www.olg.nsw.gov.au/public/find-your-local-council", purpose: "NSW Government local-council directory" },
    ],
  },
  {
    code: "VIC",
    name: "Victoria",
    services: [
      { label: "Which boundaries cover where I live?", href: "https://www.vec.vic.gov.au/electoral-boundaries/which-boundaries-cover-where-i-live", purpose: "State boundary finder" },
      { label: "Members of Parliament", href: "https://www.parliament.vic.gov.au/members/", purpose: "Current state members and official contact details" },
      { label: "Local councils", href: "https://www.vec.vic.gov.au/electoral-boundaries/local-councils", purpose: "Victorian Electoral Commission council information" },
    ],
  },
  {
    code: "QLD",
    name: "Queensland",
    services: [
      { label: "Where is my electorate?", href: "https://www.ecq.qld.gov.au/electoral-boundaries/where-is-my-electorate", purpose: "State electorate finder" },
      { label: "Current members", href: "https://www.parliament.qld.gov.au/Members/Current-Members/Member-list", purpose: "Current state members and official contact details" },
      { label: "Local government directory", href: "https://www.statedevelopment.qld.gov.au/local-government/for-the-community/local-government-directory", purpose: "Queensland Government council directory" },
    ],
  },
  {
    code: "WA",
    name: "Western Australia",
    services: [
      { label: "Find your electorate", href: "https://www.boundaries.wa.gov.au/electorates/find-your-electorate", purpose: "State electorate finder" },
      { label: "Current members by electorate", href: "https://www.parliament.wa.gov.au/parliament/memblist.nsf/WebCurrentMembElectorate", purpose: "Current state members and official contact details" },
      { label: "Council directory", href: "https://www.mycouncil.wa.gov.au/Council-Directory", purpose: "WA Government council directory" },
    ],
  },
  {
    code: "SA",
    name: "South Australia",
    services: [
      { label: "Electoral district map", href: "https://www.ecsa.sa.gov.au/map", purpose: "State electoral district finder" },
      { label: "Search members", href: "https://www.parliament.sa.gov.au/Search/Member", purpose: "Current state members and official contact details" },
      { label: "SA councils", href: "https://www.lga.sa.gov.au/sa-councils", purpose: "Local Government Association council directory" },
    ],
  },
  {
    code: "TAS",
    name: "Tasmania",
    services: [
      { label: "House of Assembly divisions", href: "https://www.tec.tas.gov.au/house-of-assembly/Divisions.html", purpose: "State division information" },
      { label: "House of Assembly members", href: "https://parliament.tas.gov.au/house-of-assembly/about-the-house-of-assembly/members-and-officers-of-the-house", purpose: "Current state members and official contact details" },
      { label: "Tasmanian council directory", href: "https://www.justice.tas.gov.au/local-government/tasmanian-council-directory", purpose: "Tasmanian Government council directory" },
    ],
  },
  {
    code: "ACT",
    name: "Australian Capital Territory",
    services: [
      { label: "Find your electorate", href: "https://www.elections.act.gov.au/for-voters/find-your-electorate", purpose: "Territory electorate finder" },
      { label: "Legislative Assembly members", href: "https://www.parliament.act.gov.au/members", purpose: "Current territory members and official contact details" },
    ],
  },
  {
    code: "NT",
    name: "Northern Territory",
    services: [
      { label: "Find my electorate", href: "https://ntec.nt.gov.au/electoral-boundaries/find-my-electorate", purpose: "Territory electorate finder" },
      { label: "Members by name", href: "https://parliament.nt.gov.au/members/by-name", purpose: "Current territory members and official contact details" },
      { label: "Find your local council", href: "https://nt.gov.au/community/local-councils-remote-communities-and-homelands/find-your-local-council", purpose: "Northern Territory Government council finder" },
    ],
  },
];

const CONCERNS = [
  "Microplastics in food and drinking water",
  "Plastic particles in the environment",
  "Chemicals migrating from food-contact materials",
  "Uncertainty around long-term human exposure",
  "Transparency about chemicals used in food-contact materials",
  "Research and monitoring",
  "Unnecessary conventional-plastic use",
  "Plastic pollution",
];

const REQUESTS = [
  "Further research and monitoring",
  "Clearer public reporting",
  "Greater transparency around food-contact chemicals",
  "Review of relevant food-contact requirements",
  "Measures addressing avoidable plastic pollution",
  "Consideration of packaging alternatives where appropriate",
];

function ExternalLink({ service }: { service: Service }) {
  return (
    <a
      href={service.href}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-air/50 hover:shadow-[0_12px_30px_rgba(17,24,39,0.08)]"
    >
      <span className="flex items-start justify-between gap-4">
        <span>
          <span className="block font-heading text-base font-semibold text-charcoal group-hover:text-air">{service.label}</span>
          <span className="mt-1 block text-sm leading-relaxed text-charcoal/65">{service.purpose}</span>
        </span>
        <span aria-hidden className="mt-0.5 text-air">↗</span>
      </span>
    </a>
  );
}

function Checklist({
  legend,
  options,
  values,
  onChange,
  other,
  onOtherChange,
}: {
  legend: string;
  options: string[];
  values: string[];
  onChange: (value: string) => void;
  other: string;
  onOtherChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="font-heading text-lg font-semibold text-charcoal">{legend}</legend>
      <div className="mt-4 grid gap-3">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-charcoal/80 hover:border-air/40">
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={() => onChange(option)}
              className="mt-1 h-4 w-4 accent-[#00a8f3]"
            />
            <span>{option}</span>
          </label>
        ))}
        <label className="block rounded-xl border border-slate-200 bg-white px-4 py-3">
          <span className="text-sm font-medium text-charcoal">Other — enter your own</span>
          <input
            value={other}
            onChange={(event) => onOtherChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-charcoal"
          />
        </label>
      </div>
    </fieldset>
  );
}

function lowerFirst(value: string) {
  return value ? `${value.charAt(0).toLocaleLowerCase("en-AU")}${value.slice(1)}` : value;
}

function sentenceOrList(items: string[], singularLead: string, pluralLead: string) {
  if (items.length === 1) return `${singularLead} ${lowerFirst(items[0])}.`;
  return `${pluralLead}\n\n${items.map((item) => `- ${lowerFirst(item)}`).join("\n")}`;
}

export function MicroplasticsTools() {
  const [jurisdictionCode, setJurisdictionCode] = useState("");
  const [lookupSuburb, setLookupSuburb] = useState("");
  const [postcode, setPostcode] = useState("");
  const [finderResult, setFinderResult] = useState<FinderResult | null>(null);
  const [finderError, setFinderError] = useState("");
  const [finderLoading, setFinderLoading] = useState(false);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [requests, setRequests] = useState<string[]>([]);
  const [otherConcern, setOtherConcern] = useState("");
  const [otherRequest, setOtherRequest] = useState("");
  const [name, setName] = useState("");
  const [messageSuburb, setMessageSuburb] = useState("");
  const [experience, setExperience] = useState("");
  const [note, setNote] = useState("");
  const [draft, setDraft] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const draftRef = useRef<HTMLTextAreaElement>(null);

  const jurisdiction = JURISDICTIONS.find((item) => item.code === jurisdictionCode);
  const resolvedRepresentative = finderResult?.status === "resolved" ? finderResult.federal : null;
  const allConcerns = [...concerns, ...(otherConcern.trim() ? [otherConcern.trim()] : [])];
  const allRequests = [...requests, ...(otherRequest.trim() ? [otherRequest.trim()] : [])];
  const canGenerate = allConcerns.length > 0 && allRequests.length > 0;

  function toggleValue(value: string, values: string[], setter: (next: string[]) => void) {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  async function findRepresentatives(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFinderLoading(true);
    setFinderError("");
    setFinderResult(null);

    try {
      const response = await fetch("/api/representatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: jurisdictionCode, suburb: lookupSuburb, postcode }),
      });
      const data = (await response.json()) as FinderResult | { error?: string };
      if (!response.ok && !("status" in data)) throw new Error(data.error || "The official lookup could not be completed.");
      if (!("status" in data)) throw new Error("The official lookup returned an unexpected response.");
      setFinderResult(data);
      setMessageSuburb(lookupSuburb.trim());
    } catch (error) {
      setFinderError(error instanceof Error ? error.message : "The official lookup could not be completed.");
    } finally {
      setFinderLoading(false);
    }
  }

  function buildDraft() {
    if (!canGenerate) return;
    const identity = name.trim() && messageSuburb.trim()
      ? `My name is ${name.trim()}, and I live in ${messageSuburb.trim()}.\n\n`
      : name.trim()
        ? `My name is ${name.trim()}.\n\n`
        : messageSuburb.trim()
          ? `I live in ${messageSuburb.trim()}.\n\n`
          : "";
    const personalExperience = experience.trim() ? `${experience.trim()}\n\n` : "";
    const personalNote = note.trim() ? `${note.trim()}\n\n` : "";
    const signoff = name.trim() ? `Kind regards,\n${name.trim()}` : "Kind regards,";
    const salutation = resolvedRepresentative ? `Dear ${resolvedRepresentative.name},` : "Dear representative,";
    const concernText = sentenceOrList(
      allConcerns,
      "I’m writing about",
      "I’m writing about several issues relating to plastics and food-contact materials, including:",
    );
    const requestText = sentenceOrList(
      allRequests,
      "I would appreciate your consideration of",
      "I would appreciate your consideration of:",
    );

    setDraft(
      `Subject: Microplastics, food-contact materials and plastic pollution\n\n${salutation}\n\n${identity}${concernText}\n\n${personalExperience}${requestText}\n\n${personalNote}I’d appreciate an update on any work already underway and whether further action is being considered in this area.\n\n${signoff}\n\nEvidence and sources: https://www.zeropack.au/microplastics/`,
    );
    setCopyStatus("");
    window.setTimeout(() => draftRef.current?.focus(), 0);
  }

  async function copyDraft() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      setCopyStatus("Copied to your clipboard.");
    } catch {
      draftRef.current?.select();
      setCopyStatus("Select and copy the highlighted text.");
    }
  }

  const directoryHref = resolvedRepresentative?.officialProfileUrl
    ?? jurisdiction?.services[1]?.href
    ?? FEDERAL_SERVICES[1].href;

  return (
    <>
      <section id="representative-finder" className="bg-[#eef7f9] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Official public information</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">Find your representatives</h2>
              <p className="mt-5 text-lg leading-relaxed text-charcoal/70">
                Enter your state or territory, suburb and postcode. We’ll check current official sources for your federal electorate and House of Representatives member, then point you to the right state and local services.
              </p>
              <p className="mt-5 text-sm leading-relaxed text-charcoal/65">
                Electoral boundaries can cross suburb and postcode lines. If the official data shows more than one possible electorate, we’ll say so instead of guessing.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(17,24,39,0.08)] sm:p-8">
              <form onSubmit={findRepresentatives}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label htmlFor="jurisdiction" className="block text-sm font-semibold text-charcoal sm:col-span-2">State or territory
                    <select
                      id="jurisdiction"
                      required
                      value={jurisdictionCode}
                      onChange={(event) => {
                        setJurisdictionCode(event.target.value);
                        setFinderResult(null);
                      }}
                      className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-normal text-charcoal"
                    >
                      <option value="">Choose one</option>
                      {JURISDICTIONS.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
                    </select>
                  </label>
                  <label htmlFor="finder-suburb" className="block text-sm font-semibold text-charcoal">Suburb
                    <input id="finder-suburb" required minLength={2} maxLength={100} autoComplete="address-level2" value={lookupSuburb} onChange={(event) => { setLookupSuburb(event.target.value); setFinderResult(null); }} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-normal text-charcoal" />
                  </label>
                  <label htmlFor="finder-postcode" className="block text-sm font-semibold text-charcoal">Postcode
                    <input id="finder-postcode" required inputMode="numeric" pattern="[0-9]{4}" maxLength={4} autoComplete="postal-code" value={postcode} onChange={(event) => { setPostcode(event.target.value.replace(/\D/g, "").slice(0, 4)); setFinderResult(null); }} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-normal text-charcoal" />
                  </label>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-charcoal/60">Your location is used only to find your representatives. We don’t save it.</p>
                <button type="submit" disabled={finderLoading} className="mt-5 min-h-12 w-full rounded-xl bg-charcoal px-6 py-3 font-semibold text-white transition hover:bg-compost disabled:cursor-wait disabled:opacity-60 sm:w-auto">
                  {finderLoading ? "Checking official sources…" : "Find my representatives"}
                </button>
              </form>

              {finderError ? (
                <div role="alert" className="mt-7 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-charcoal/75">
                  <p className="font-semibold text-charcoal">We couldn’t complete the lookup.</p>
                  <p className="mt-2">{finderError} Rather than risk showing the wrong person, use the official AEC finder below.</p>
                  <a href="https://electorate.aec.gov.au/" target="_blank" rel="noreferrer" className="mt-3 inline-block font-semibold text-air hover:underline">Open the AEC electorate finder ↗</a>
                </div>
              ) : null}

              {finderResult ? (
                <div className="mt-8 border-t border-slate-200 pt-7" aria-live="polite">
                  {finderResult.status === "resolved" ? (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-air">Federal</p>
                      <h3 className="mt-2 font-heading text-2xl font-semibold text-charcoal">{finderResult.federal.name}</h3>
                      <p className="mt-1 text-charcoal/75">{finderResult.federal.memberFor}</p>
                      <p className="text-sm text-charcoal/60">{finderResult.federal.role}</p>
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <a href={finderResult.federal.officialProfileUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-air px-5 py-2.5 font-semibold text-white hover:bg-[#008fd0]">Open official contact page ↗</a>
                        <a href={finderResult.federal.aecProfileUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-charcoal hover:border-air">View AEC electorate profile ↗</a>
                      </div>
                      <p className="mt-4 text-xs leading-relaxed text-charcoal/55">Checked {finderResult.checkedAt}. Sources: {finderResult.sources.map((source, index) => <span key={source.href}>{index ? ", " : ""}<a href={source.href} target="_blank" rel="noreferrer" className="underline hover:text-air">{source.label}</a></span>)}.</p>
                    </div>
                  ) : finderResult.status === "ambiguous" ? (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-charcoal/75">
                      <h3 className="font-heading text-lg font-semibold text-charcoal">More than one federal electorate is possible</h3>
                      <p className="mt-2">{finderResult.message}</p>
                      <p className="mt-2"><strong>Possible electorates:</strong> {finderResult.electorates.join(", ")}.</p>
                      <a href={finderResult.aecResultUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block font-semibold text-air hover:underline">Check this result with the AEC ↗</a>
                    </div>
                  ) : finderResult.status === "electorate-only" ? (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-charcoal/75">
                      <h3 className="font-heading text-lg font-semibold text-charcoal">Federal electorate: {finderResult.electorate}</h3>
                      <p className="mt-2">{finderResult.message} Rather than risk naming the wrong person, confirm the member in the official directory.</p>
                      <div className="mt-3 flex flex-wrap gap-4 font-semibold text-air">
                        <a href={finderResult.aecProfileUrl} target="_blank" rel="noreferrer" className="hover:underline">AEC profile ↗</a>
                        <a href={finderResult.officialDirectoryUrl} target="_blank" rel="noreferrer" className="hover:underline">Parliament member search ↗</a>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-charcoal/75">
                      <h3 className="font-heading text-lg font-semibold text-charcoal">Use the official finder</h3>
                      <p className="mt-2">{finderResult.message} Rather than risk showing the wrong person, continue with the AEC.</p>
                      <a href={finderResult.aecFinderUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block font-semibold text-air hover:underline">Open the AEC electorate finder ↗</a>
                    </div>
                  )}

                  {jurisdiction ? (
                    <div className="mt-7 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-stone p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-air">State or territory</p>
                        <p className="mt-2 text-sm leading-relaxed text-charcoal/70">Use the official boundary finder for your exact electorate, then check the current member.</p>
                        <div className="mt-3 flex flex-col items-start gap-2 text-sm font-semibold text-air">
                          {jurisdiction.services.slice(0, 2).map((service) => <a key={service.href} href={service.href} target="_blank" rel="noreferrer" className="hover:underline">{service.label} ↗</a>)}
                        </div>
                      </div>
                      {jurisdiction.services[2] ? (
                        <div className="rounded-2xl border border-slate-200 bg-stone p-5">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-air">Local government</p>
                          <p className="mt-2 text-sm leading-relaxed text-charcoal/70">Check the official council service for the local-government area covering your address.</p>
                          <a href={jurisdiction.services[2].href} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-air hover:underline">{jurisdiction.services[2].label} ↗</a>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <details className="mt-8 border-t border-slate-200 pt-6">
                <summary className="cursor-pointer font-semibold text-air">Prefer to look it up yourself? Browse official government representative and electorate services.</summary>
                <div className="mt-5 grid gap-5">
                  <div>
                    <h3 className="font-heading text-lg font-semibold">Federal</h3>
                    <div className="mt-3 grid gap-3">{FEDERAL_SERVICES.map((service) => <ExternalLink key={service.href} service={service} />)}</div>
                  </div>
                  {JURISDICTIONS.map((item) => (
                    <details key={item.code} className="rounded-2xl border border-slate-200 p-4">
                      <summary className="cursor-pointer font-semibold text-charcoal">{item.name}</summary>
                      <div className="mt-4 grid gap-3">{item.services.map((service) => <ExternalLink key={service.href} service={service} />)}</div>
                    </details>
                  ))}
                </div>
              </details>

              <div className="mt-6 border-t border-slate-200 pt-5 text-sm leading-relaxed text-charcoal/65">
                <p>Electoral boundaries, officeholders and contact details can change. Confirm current details on the linked official website before sending your message.</p>
                <a href="mailto:hello@zeropack.co?subject=Broken%20or%20outdated%20official%20link" className="mt-3 inline-block font-semibold text-air hover:underline">Report a broken or outdated official link</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="message-builder" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">{resolvedRepresentative ? `Write to ${resolvedRepresentative.name}` : "Build an editable message"}</h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/70">Choose what matters to you and what you would like considered. Nothing is preselected, every word remains editable, and you decide whether to send it.</p>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/65">Your selections and message stay in this browser while the page is open. Don’t include health history, political preferences or other sensitive information that is not needed.</p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Checklist legend="What concerns you?" options={CONCERNS} values={concerns} onChange={(value) => toggleValue(value, concerns, setConcerns)} other={otherConcern} onOtherChange={setOtherConcern} />
            <Checklist legend="What would you like to ask for?" options={REQUESTS} values={requests} onChange={(value) => toggleValue(value, requests, setRequests)} other={otherRequest} onOtherChange={setOtherRequest} />
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-stone p-6 sm:p-8">
            <h3 className="font-heading text-xl font-semibold text-charcoal">Optional details</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/65">Add only what you want included in your draft. These fields are not saved or submitted to Zero Pack.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-charcoal">Name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-normal" /></label>
              <label className="block text-sm font-semibold text-charcoal">Suburb<input value={messageSuburb} onChange={(event) => setMessageSuburb(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-normal" /></label>
              <label className="block text-sm font-semibold text-charcoal sm:col-span-2">Why this matters to you — optional
                <span className="mt-1 block font-normal leading-relaxed text-charcoal/60">Keep this brief and avoid health details or other sensitive information unless you genuinely need to include them.</span>
                <textarea value={experience} onChange={(event) => setExperience(event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-normal" />
              </label>
              <label className="block text-sm font-semibold text-charcoal sm:col-span-2">Anything else — optional<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-normal" /></label>
            </div>
            <button type="button" disabled={!canGenerate} onClick={buildDraft} className="mt-7 min-h-12 rounded-xl bg-air px-6 py-3 font-semibold text-white transition hover:bg-[#008fd0] disabled:cursor-not-allowed disabled:opacity-45">Build my editable draft</button>
            {!canGenerate ? <p className="mt-3 text-sm text-charcoal/60">Choose at least one concern and one request to build a draft.</p> : null}
          </div>

          {draft ? (
            <div className="mt-10 rounded-3xl border border-compost/20 bg-[#ecf6ed] p-6 sm:p-8" aria-live="polite">
              <h3 className="font-heading text-2xl font-semibold text-charcoal">Your draft</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70"><strong>Review and edit before sending.</strong> Zero Pack does not send the message on your behalf.</p>
              <label htmlFor="message-draft" className="sr-only">Editable message draft</label>
              <textarea id="message-draft" ref={draftRef} value={draft} onChange={(event) => setDraft(event.target.value)} rows={20} className="mt-6 w-full rounded-2xl border border-slate-300 bg-white p-4 text-base leading-relaxed text-charcoal" />
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={() => draftRef.current?.focus()} className="min-h-12 rounded-xl border border-charcoal/20 bg-white px-5 py-3 font-semibold text-charcoal hover:border-air">Edit message</button>
                <button type="button" onClick={copyDraft} className="min-h-12 rounded-xl bg-charcoal px-5 py-3 font-semibold text-white hover:bg-compost">Copy message</button>
                <a href={directoryHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-air/30 bg-white px-5 py-3 font-semibold text-air hover:bg-air/5">{resolvedRepresentative ? `Open ${resolvedRepresentative.name}’s official contact page` : "Open official contact directory"} ↗</a>
              </div>
              {copyStatus ? <p className="mt-3 text-sm font-medium text-compost" role="status">{copyStatus}</p> : null}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
