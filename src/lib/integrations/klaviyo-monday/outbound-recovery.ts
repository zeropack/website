import { MONDAY_API_VERSION, MONDAY_CONTACTS_BOARD_ID } from "./config";
import {
  syncMondayContactsToKlaviyo,
  type AcquisitionMode,
} from "./acquisition-runtime";

const MONDAY_LEADS_BOARD_ID = 5029468201;
const LEAD_CONTACT_RELATION = "board_relation_mm5gpfwm";
const LEAD_SOURCE = "color_mkyb8krc";
const LEAD_RESEARCH_SOURCE_LABEL = "AI Agent";

type ContactPageResponse = {
  boards: Array<{
    items_page: {
      cursor: string | null;
      items: Array<{ id: string; created_at: string }>;
    };
  }>;
};

type LeadPageResponse = {
  boards: Array<{
    items_page: {
      cursor: string | null;
      items: Array<{
        id: string;
        created_at: string;
        column_values: Array<{
          id: string;
          text?: string | null;
          linked_item_ids?: string[];
        }>;
      }>;
    };
  }>;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function monday<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      Authorization: requiredEnv("MONDAY_API_TOKEN"),
      "Content-Type": "application/json",
      "API-Version": MONDAY_API_VERSION,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  const payload = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };
  if (!response.ok || !payload.data || payload.errors?.length) {
    throw new Error(
      `Monday API error: ${payload.errors?.map((e) => e.message).join("; ") || response.status}`,
    );
  }
  return payload.data;
}

async function recentCreatedContactIds(from: Date, to: Date): Promise<string[]> {
  const fromDate = from.toISOString().slice(0, 10);
  const toDate = to.toISOString().slice(0, 10);
  const query = `query RecentContacts($boardId: ID!, $cursor: String) {
    boards(ids: [$boardId]) {
      items_page(
        limit: 500,
        cursor: $cursor,
        query_params: {
          rules: [{
            column_id: "creation_log",
            compare_attribute: "CREATED_AT",
            compare_value: ["${fromDate}", "${toDate}"],
            operator: between
          }]
        }
      ) {
        cursor
        items { id created_at }
      }
    }
  }`;

  const ids: string[] = [];
  let cursor: string | null = null;
  do {
    const pageData: ContactPageResponse = await monday<ContactPageResponse>(
      query,
      { boardId: MONDAY_CONTACTS_BOARD_ID, cursor },
    );
    const page = pageData.boards[0]?.items_page;
    if (!page) break;
    for (const item of page.items) {
      const created = new Date(item.created_at);
      if (created >= from && created <= to) ids.push(String(item.id));
    }
    cursor = page.cursor;
  } while (cursor);

  return ids;
}

async function recentLeadResearchContactIds(from: Date, to: Date): Promise<string[]> {
  const query = `query RecentLeadResearch($boardId: ID!, $cursor: String) {
    boards(ids: [$boardId]) {
      items_page(limit: 500, cursor: $cursor) {
        cursor
        items {
          id
          created_at
          column_values(ids: ["${LEAD_CONTACT_RELATION}", "${LEAD_SOURCE}"]) {
            id
            text
            ... on BoardRelationValue { linked_item_ids }
          }
        }
      }
    }
  }`;

  const ids: string[] = [];
  let cursor: string | null = null;
  do {
    const pageData: LeadPageResponse = await monday<LeadPageResponse>(
      query,
      { boardId: MONDAY_LEADS_BOARD_ID, cursor },
    );

    const page = pageData.boards[0]?.items_page;
    if (!page) break;
    for (const item of page.items) {
      const created = new Date(item.created_at);
      if (created < from || created > to) continue;
      const source = item.column_values
        .find((c) => c.id === LEAD_SOURCE)
        ?.text?.trim();
      if (source !== LEAD_RESEARCH_SOURCE_LABEL) continue;
      const relation = item.column_values.find(
        (c) => c.id === LEAD_CONTACT_RELATION,
      );
      ids.push(...(relation?.linked_item_ids || []).map(String));
    }
    cursor = page.cursor;
  } while (cursor);

  return ids;
}

async function syncInChunks(
  ids: string[],
  source: "Lead Research" | "Manual CRM",
  mode: AcquisitionMode,
) {
  const unique = [...new Set(ids)];
  if (!unique.length) return null;

  const batches = [];
  for (let i = 0; i < unique.length; i += 100) {
    batches.push(
      await syncMondayContactsToKlaviyo({
        contactIds: unique.slice(i, i + 100),
        source,
        mode,
      }),
    );
  }
  return { requested: unique.length, batches };
}

export async function recoverGovernedOutboundProfiles(
  mode: AcquisitionMode,
  options: { cutoverAt: string; lookbackHours?: number },
) {
  const cutover = new Date(options.cutoverAt);
  if (Number.isNaN(cutover.getTime())) {
    throw new Error("Invalid profile sync cutover timestamp.");
  }

  const now = new Date();
  const lookback = new Date(
    now.getTime() - (options.lookbackHours ?? 72) * 60 * 60 * 1000,
  );
  const from = cutover > lookback ? cutover : lookback;

  const [createdContacts, leadResearchContacts] = await Promise.all([
    recentCreatedContactIds(from, now),
    recentLeadResearchContactIds(from, now),
  ]);

  const leadResearchSet = new Set(leadResearchContacts);
  const manualContacts = [...new Set(createdContacts)].filter(
    (id) => !leadResearchSet.has(id),
  );

  const leadResearch = await syncInChunks(
    [...leadResearchSet],
    "Lead Research",
    mode,
  );
  const manual = await syncInChunks(manualContacts, "Manual CRM", mode);

  return {
    from: from.toISOString(),
    to: now.toISOString(),
    createdContactsFound: new Set(createdContacts).size,
    leadResearchContactsFound: leadResearchSet.size,
    manualContactsFound: manualContacts.length,
    leadResearch,
    manual,
  };
}
