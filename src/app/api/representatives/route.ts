const AEC_BASE_URL = "https://electorate.aec.gov.au/";
const AEC_FINDER_URL = "https://electorate.aec.gov.au/";
const HANDBOOK_API_URL = "https://handbookapi.aph.gov.au/api/individuals";
const APH_SEARCH_URL = "https://www.aph.gov.au/Senators_and_Members/Parliamentarian_Search_Results";

const STATES = new Set(["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]);
const RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
};

export const maxDuration = 45;

type LookupInput = {
  state?: unknown;
  suburb?: unknown;
  postcode?: unknown;
};

type AecElectorate = {
  name: string;
  href: string;
};

type HandbookMember = {
  PHID: string;
  GivenName: string;
  FamilyName: string;
  PreferredName: string;
  DisplayName: string;
  Electorate: string;
  StateAbbrev: string;
  MPorSenator: string[];
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: RESPONSE_HEADERS });
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function plainText(value: string) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function normalise(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function titleCase(value: string) {
  return value
    .toLocaleLowerCase("en-AU")
    .replace(/(^|[\s'-])([a-z])/g, (_, boundary: string, letter: string) => `${boundary}${letter.toUpperCase()}`);
}

function parseAecLocalityResults(html: string, state: string, suburb: string, postcode: string) {
  const table = html.match(/<table[^>]+id=["']ContentPlaceHolderBody_gridViewLocalities["'][^>]*>([\s\S]*?)<\/table>/i)?.[1];
  if (!table) return [];

  const rows = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  const electorates = new Map<string, AecElectorate>();

  for (const row of rows) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => cell[1]);
    if (cells.length < 4) continue;

    const rowState = plainText(cells[0]);
    const rowSuburb = plainText(cells[1]);
    const rowPostcode = plainText(cells[2]);
    if (normalise(rowState) !== normalise(state) || normalise(rowSuburb) !== normalise(suburb) || rowPostcode !== postcode) continue;

    for (const anchor of cells[3].matchAll(/<a[^>]+href=["']([^"']*filterby=Electorate[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      const name = plainText(anchor[2]);
      const href = new URL(decodeHtml(anchor[1]), AEC_BASE_URL).toString();
      if (name) electorates.set(normalise(name), { name, href });
    }
  }

  return [...electorates.values()];
}

function displayMemberName(member: HandbookMember) {
  const preferred = member.PreferredName?.replace(/[()]/g, "").trim();
  const given = preferred || member.GivenName?.trim();
  return `${given} ${titleCase(member.FamilyName)}`.trim();
}

function checkedDate() {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Australia/Sydney",
  }).format(new Date());
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "ZeroPackRepresentativeFinder/1.0" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Official source returned ${response.status}`);
  return response.text();
}

async function fetchHandbookMember(electorate: string, state: string) {
  const escapedElectorate = electorate.replace(/'/g, "''");
  const params = new URLSearchParams({
    "$filter": `Electorate eq '${escapedElectorate}' and StateAbbrev eq '${state}' and InCurrentParliament eq 'True'`,
    "$select": "PHID,GivenName,FamilyName,PreferredName,DisplayName,Electorate,StateAbbrev,MPorSenator",
  });
  const response = await fetch(`${HANDBOOK_API_URL}?${params}`, {
    cache: "no-store",
    headers: { Accept: "application/json", "User-Agent": "ZeroPackRepresentativeFinder/1.0" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Parliamentary source returned ${response.status}`);
  const data = (await response.json()) as { value?: HandbookMember[] };
  return data.value?.find((person) => person.MPorSenator?.includes("Member")) ?? null;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 2_048) return json({ error: "The request is too large." }, 413);

  let body: LookupInput;
  try {
    body = (await request.json()) as LookupInput;
  } catch {
    return json({ error: "Enter a valid state or territory, suburb and postcode." }, 400);
  }

  const state = typeof body.state === "string" ? body.state.trim().toUpperCase() : "";
  const suburb = typeof body.suburb === "string" ? body.suburb.trim() : "";
  const postcode = typeof body.postcode === "string" ? body.postcode.trim() : "";
  const validSuburb = suburb.length >= 2 && suburb.length <= 100 && /^[A-Za-zÀ-ÖØ-öø-ÿ'’ .-]+$/.test(suburb);

  if (!STATES.has(state) || !validSuburb || !/^\d{4}$/.test(postcode)) {
    return json({ error: "Enter a valid state or territory, suburb and four-digit postcode." }, 400);
  }

  const searchParams = new URLSearchParams({ filter: postcode, filterby: "Postcode" });
  const aecResultUrl = `${AEC_BASE_URL}LocalitySearchResults.aspx?${searchParams}`;

  try {
    const localityHtml = await fetchText(aecResultUrl);
    const electorates = parseAecLocalityResults(localityHtml, state, suburb, postcode);

    if (electorates.length === 0) {
      return json({
        status: "unresolved",
        checkedAt: checkedDate(),
        message: "We could not match that suburb and postcode in the current AEC results.",
        aecFinderUrl: AEC_FINDER_URL,
      });
    }

    if (electorates.length > 1) {
      return json({
        status: "ambiguous",
        checkedAt: checkedDate(),
        electorates: electorates.map((item) => item.name),
        message: "This suburb and postcode cross more than one federal electorate, so we cannot identify one representative without guessing.",
        aecResultUrl,
        aecFinderUrl: AEC_FINDER_URL,
      });
    }

    const selected = electorates[0];
    const handbookMember = await fetchHandbookMember(selected.name, state);

    if (!handbookMember) {
      return json({
        status: "electorate-only",
        checkedAt: checkedDate(),
        electorate: selected.name,
        message: "We confirmed the electorate, but could not verify a current House member from the Parliamentary Handbook.",
        aecProfileUrl: selected.href,
        officialDirectoryUrl: APH_SEARCH_URL,
      });
    }

    const memberName = displayMemberName(handbookMember);

    return json({
      status: "resolved",
      checkedAt: checkedDate(),
      federal: {
        electorate: selected.name,
        name: memberName,
        role: "Member of the House of Representatives",
        memberFor: `Member for ${selected.name}`,
        officialProfileUrl: handbookMember.PHID
          ? `https://www.aph.gov.au/Senators_and_Members/Parliamentarian?MPID=${encodeURIComponent(handbookMember.PHID)}`
          : APH_SEARCH_URL,
        aecProfileUrl: selected.href,
      },
      sources: [
        { label: "Australian Electoral Commission", href: selected.href },
        { label: "Australian Parliamentary Handbook", href: "https://handbook.aph.gov.au/" },
      ],
    });
  } catch {
    return json({
      status: "error",
      checkedAt: checkedDate(),
      message: "The official services did not respond, so we cannot safely show a representative right now.",
      aecFinderUrl: AEC_FINDER_URL,
      officialDirectoryUrl: APH_SEARCH_URL,
    }, 502);
  }
}
