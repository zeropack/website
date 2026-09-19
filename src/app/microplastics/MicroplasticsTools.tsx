"use client";

import { useMemo, useRef, useState } from "react";

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

const FEDERAL_SERVICES: Service[] = [
  {
    label: "AEC electorate finder",
    href: "https://www.aec.gov.au/electorate",
    purpose: "Confirm your federal electorate using the official Australian Electoral Commission service.",
  },
  {
    label: "Australian Parliament member search",
    href: "https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results",
    purpose: "Confirm the current federal parliamentarian and official contact details.",
  },
];

const JURISDICTIONS: Jurisdiction[] = [
  {
    code: "NSW",
    name: "New South Wales",
    services: [
      { label: "Find my electorate", href: "https://elections.nsw.gov.au/elections/find-my-electorate", purpose: "State electorate finder" },
      { label: "Members and ministers", href: "https://www.parliament.nsw.gov.au/members-and-electorates/members-and-ministers", purpose: "Current state members and contact details" },
      { label: "Find your local council", href: "https://www.olg.nsw.gov.au/public/find-your-local-council", purpose: "Official local-council directory" },
    ],
  },
  {
    code: "VIC",
    name: "Victoria",
    services: [
      { label: "Which boundaries cover where I live?", href: "https://www.vec.vic.gov.au/electoral-boundaries/which-boundaries-cover-where-i-live", purpose: "State boundary finder" },
      { label: "Members of Parliament", href: "https://www.parliament.vic.gov.au/members/", purpose: "Current state members and contact details" },
      { label: "Local councils", href: "https://www.vec.vic.gov.au/electoral-boundaries/local-councils", purpose: "Official local-council information" },
    ],
  },
  {
    code: "QLD",
    name: "Queensland",
    services: [
      { label: "Where is my electorate?", href: "https://www.ecq.qld.gov.au/electoral-boundaries/where-is-my-electorate", purpose: "State electorate finder" },
      { label: "Current members", href: "https://www.parliament.qld.gov.au/Members/Current-Members/Member-list", purpose: "Current state members and contact details" },
      { label: "Find your local council", href: "https://www.getready.qld.gov.au/find-your-local-council", purpose: "Official local-council directory" },
    ],
  },
  {
    code: "WA",
    name: "Western Australia",
    services: [
      { label: "Find your electorate", href: "https://www.boundaries.wa.gov.au/electorates/find-your-electorate", purpose: "State electorate finder" },
      { label: "Current members by electorate", href: "https://www.parliament.wa.gov.au/parliament/memblist.nsf/WebCurrentMembElectorate", purpose: "Current state members and contact details" },
      { label: "Council directory", href: "https://www.mycouncil.wa.gov.au/Council-Directory", purpose: "Official local-council directory" },
    ],
  },
  {
    code: "SA",
    name: "South Australia",
    services: [
      { label: "Electoral district map", href: "https://www.ecsa.sa.gov.au/map", purpose: "State electoral district finder" },
      { label: "Search members", href: "https://www.parliament.sa.gov.au/Search/Member", purpose: "Current state members and contact details" },
      { label: "SA councils", href: "https://www.lga.sa.gov.au/sa-councils", purpose: "Official local-council directory" },
    ],
  },
  {
    code: "TAS",
    name: "Tasmania",
    services: [
      { label: "House of Assembly divisions", href: "https://www.tec.tas.gov.au/house-of-assembly/Divisions.html", purpose: "State division information" },
      { label: "House of Assembly members", href: "https://parliament.tas.gov.au/house-of-assembly/about-the-house-of-assembly/members-and-officers-of-the-house", purpose: "Current state members and contact details" },
      { label: "Tasmanian council directory", href: "https://www.justice.tas.gov.au/local-government/tasmanian-council-directory", purpose: "Official local-council directory" },
    ],
  },
  {
    code: "ACT",
    name: "Australian Capital Territory",
    services: [
      { label: "Find your electorate", href: "https://www.elections.act.gov.au/for-voters/find-your-electorate", purpose: "Territory electorate finder" },
      { label: "Legislative Assembly members", href: "https://www.parliament.act.gov.au/members", purpose: "Current territory members and contact details" },
    ],
  },
  {
    code: "NT",
    name: "Northern Territory",
    services: [
      { label: "Find my electorate", href: "https://ntec.nt.gov.au/electoral-boundaries/find-my-electorate", purpose: "Territory electorate finder" },
      { label: "Members by name", href: "https://parliament.nt.gov.au/members/by-name", purpose: "Current territory members and contact details" },
      { label: "Find your local council", href: "https://nt.gov.au/community/local-councils-remote-communities-and-homelands/find-your-local-council", purpose: "Official local-council directory" },
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

export function MicroplasticsTools() {
  const [jurisdictionCode, setJurisdictionCode] = useState("");
  const [showServices, setShowServices] = useState(false);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [requests, setRequests] = useState<string[]>([]);
  const [otherConcern, setOtherConcern] = useState("");
  const [otherRequest, setOtherRequest] = useState("");
  const [name, setName] = useState("");
  const [suburb, setSuburb] = useState("");
  const [experience, setExperience] = useState("");
  const [note, setNote] = useState("");
  const [draft, setDraft] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const draftRef = useRef<HTMLTextAreaElement>(null);

  const jurisdiction = useMemo(
    () => JURISDICTIONS.find((item) => item.code === jurisdictionCode),
    [jurisdictionCode],
  );

  const allConcerns = [...concerns, ...(otherConcern.trim() ? [otherConcern.trim()] : [])];
  const allRequests = [...requests, ...(otherRequest.trim() ? [otherRequest.trim()] : [])];
  const canGenerate = allConcerns.length > 0 && allRequests.length > 0;

  function toggleValue(value: string, values: string[], setter: (next: string[]) => void) {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  function buildDraft() {
    if (!canGenerate) return;
    const identity = name.trim() && suburb.trim()
      ? `My name is ${name.trim()}, and I live in ${suburb.trim()}.\n\n`
      : name.trim()
        ? `My name is ${name.trim()}.\n\n`
        : suburb.trim()
          ? `I live in ${suburb.trim()}.\n\n`
          : "";
    const personalExperience = experience.trim() ? `${experience.trim()}\n\n` : "";
    const personalNote = note.trim() ? `${note.trim()}\n\n` : "";
    const signoff = name.trim() ? `Kind regards,\n${name.trim()}` : "Kind regards,";

    setDraft(
      `Subject: Microplastics, food-contact materials and plastic pollution\n\nDear representative,\n\n${identity}I’m writing because I am concerned about ${allConcerns.join(", ")}.\n\nI would like you to consider ${allRequests.join(", ")}.\n\n${personalExperience}${personalNote}Evidence about microplastics, plastic-associated chemicals and human health is continuing to develop. I would welcome a response grounded in current evidence and official guidance.\n\nPlease let me know what work is underway, or what further action may be considered, within your area of responsibility.\n\n${signoff}\n\nEvidence and sources: https://www.zeropack.au/microplastics/`,
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

  const directoryHref = jurisdiction?.services[1]?.href ?? FEDERAL_SERVICES[1].href;

  return (
    <>
      <section id="official-services" className="bg-[#eef7f9] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Official sources</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">Find official services for your area</h2>
              <p className="mt-5 text-lg leading-relaxed text-charcoal/70">
                Responsibilities can sit with federal, state or territory, and local government. These links go to official services and do not rank representatives or political positions.
              </p>
              <div className="mt-6 rounded-2xl border border-air/20 bg-white/80 p-5 text-sm leading-relaxed text-charcoal/70">
                <strong className="text-charcoal">Your privacy:</strong> Your state or territory is used in this browser only to show relevant official links. It is not sent to or saved by Zero Pack or included in analytics. After you choose an official website, that government service may ask for a suburb, postcode or street address under its own privacy policy. You can also browse all official services without choosing a location.
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(17,24,39,0.08)] sm:p-8">
              <label htmlFor="jurisdiction" className="block font-heading text-lg font-semibold text-charcoal">State or territory</label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <select
                  id="jurisdiction"
                  value={jurisdictionCode}
                  onChange={(event) => {
                    setJurisdictionCode(event.target.value);
                    setShowServices(false);
                  }}
                  className="min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-charcoal"
                >
                  <option value="">Choose one</option>
                  {JURISDICTIONS.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
                </select>
                <button
                  type="button"
                  disabled={!jurisdictionCode}
                  onClick={() => setShowServices(true)}
                  className="min-h-12 rounded-xl bg-charcoal px-5 py-3 font-semibold text-white transition hover:bg-compost disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Show official lookup services
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/60">Locality and postcode boundaries can overlap. An official service may ask for your suburb, postcode or address to identify the correct area.</p>

              {showServices && jurisdiction ? (
                <div className="mt-7" aria-live="polite">
                  <h3 className="font-heading text-xl font-semibold text-charcoal">Services for {jurisdiction.name}</h3>
                  <div className="mt-4 grid gap-3">
                    {FEDERAL_SERVICES.map((service) => <ExternalLink key={service.href} service={service} />)}
                    {jurisdiction.services.map((service) => <ExternalLink key={service.href} service={service} />)}
                  </div>
                  <p className="mt-4 rounded-xl bg-stone p-4 text-sm leading-relaxed text-charcoal/70">
                    Rather than risk showing outdated information, use the current official government lookups above. Start with the boundary or electorate finder, then confirm the officeholder and contact details in the linked official directory.
                  </p>
                </div>
              ) : null}

              <details className="mt-7 border-t border-slate-200 pt-6">
                <summary className="cursor-pointer font-semibold text-air">Browse all official services</summary>
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
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-air">Your words, your choice</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">Build an editable message</h2>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/70">Choose the issues and requests that matter to you. Nothing is preselected, and the finished draft stays editable.</p>
            <div className="mt-6 rounded-2xl border border-air/20 bg-[#eef7f9] p-5 text-sm leading-relaxed text-charcoal/70">
              <strong className="text-charcoal">Before you begin:</strong> Everything you enter here stays in this browser while this page is open. It is not sent to or saved by Zero Pack and is not included in analytics. If you copy the draft, you decide where to paste or send it. Do not include health history, political preferences or other sensitive information that is not needed for your message.
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Checklist legend="What concerns you?" options={CONCERNS} values={concerns} onChange={(value) => toggleValue(value, concerns, setConcerns)} other={otherConcern} onOtherChange={setOtherConcern} />
            <Checklist legend="What would you like considered?" options={REQUESTS} values={requests} onChange={(value) => toggleValue(value, requests, setRequests)} other={otherRequest} onOtherChange={setOtherRequest} />
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-stone p-6 sm:p-8">
            <h3 className="font-heading text-xl font-semibold text-charcoal">Optional details</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/65">Add only what you want to include in your draft. These fields are not submitted to Zero Pack.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-charcoal">Name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-normal" /></label>
              <label className="block text-sm font-semibold text-charcoal">Suburb<input value={suburb} onChange={(event) => setSuburb(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-normal" /></label>
              <label className="block text-sm font-semibold text-charcoal sm:col-span-2">Personal experience<textarea value={experience} onChange={(event) => setExperience(event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-normal" /></label>
              <label className="block text-sm font-semibold text-charcoal sm:col-span-2">Personal note<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-normal" /></label>
            </div>
            <button type="button" disabled={!canGenerate} onClick={buildDraft} className="mt-7 min-h-12 rounded-xl bg-air px-6 py-3 font-semibold text-white transition hover:bg-[#008fd0] disabled:cursor-not-allowed disabled:opacity-45">Build my editable draft</button>
            {!canGenerate ? <p className="mt-3 text-sm text-charcoal/60">Choose at least one concern and one request to build a draft.</p> : null}
          </div>

          {draft ? (
            <div className="mt-10 rounded-3xl border border-compost/20 bg-[#ecf6ed] p-6 sm:p-8" aria-live="polite">
              <h3 className="font-heading text-2xl font-semibold text-charcoal">Your draft</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70"><strong>This is your draft.</strong> Review and edit it before sending. Zero Pack does not send the message on your behalf.</p>
              <label htmlFor="message-draft" className="sr-only">Editable message draft</label>
              <textarea id="message-draft" ref={draftRef} value={draft} onChange={(event) => setDraft(event.target.value)} rows={20} className="mt-6 w-full rounded-2xl border border-slate-300 bg-white p-4 text-base leading-relaxed text-charcoal" />
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" onClick={() => draftRef.current?.focus()} className="min-h-12 rounded-xl border border-charcoal/20 bg-white px-5 py-3 font-semibold text-charcoal hover:border-air">Edit message</button>
                <button type="button" onClick={copyDraft} className="min-h-12 rounded-xl bg-charcoal px-5 py-3 font-semibold text-white hover:bg-compost">Copy message</button>
                <a href={directoryHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-air/30 bg-white px-5 py-3 font-semibold text-air hover:bg-air/5">Open official contact directory ↗</a>
              </div>
              {copyStatus ? <p className="mt-3 text-sm font-medium text-compost" role="status">{copyStatus}</p> : null}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
