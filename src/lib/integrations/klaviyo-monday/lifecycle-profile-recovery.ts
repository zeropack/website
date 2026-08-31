import {
  getMondayLifecycleTransitions,
  listMondayContacts,
} from "./clients";
import {
  syncMondayContactsToKlaviyo,
  type AcquisitionMode,
} from "./acquisition-runtime";
import { isCommercialLifecycleStatus, MONDAY_API_VERSION } from "./config";

const MONDAY_LEADS_BOARD_ID = 5029468201;
const LEAD_CONTACT_RELATION = "board_relation_mm5gpfwm";
const LEAD_SOURCE = "color_mkyb8krc";
const LEAD_RESEARCH_SOURCE_LABEL = "AI Agent";

type LeadPageResponse = {
  boards: Array<{
    items_page: {
      cursor: string | null;
      items: Array<{
        id: string;
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

async function monday<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
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

async function leadResearchContactIds(): Promise<Set<string>> {
  const query = `query LeadResearchContacts($boardId: ID!, $cursor: String) {
    boards(ids: [$boardId]) {
      items_page(limit: 500, cursor: $cursor) {
        cursor
        items {
          id
          column_values(ids: ["${LEAD_CONTACT_RELATION}", "${LEAD_SOURCE}"]) {
            id
            text
            ... on BoardRelationValue { linked_item_ids }
          }
        }
      }
    }
  }`;

  const ids = new Set<string>();
  let cursor: string | null = null;
  do {
    const data: LeadPageResponse = await monday<LeadPageResponse>(query, {
      boardId: MONDAY_LEADS_BOARD_ID,
      cursor,
    });
    const page = data.boards[0]?.items_page;
    if (!page) break;

    for (const item of page.items) {
      const source = item.column_values
        .find((column) => column.id === LEAD_SOURCE)
        ?.text?.trim();
      if (source !== LEAD_RESEARCH_SOURCE_LABEL) continue;

      const relation = item.column_values.find(
        (column) => column.id === LEAD_CONTACT_RELATION,
      );
      for (const id of relation?.linked_item_ids || []) ids.add(String(id));
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
  for (let index = 0; index < unique.length; index += 100) {
    batches.push(
      await syncMondayContactsToKlaviyo({
        contactIds: unique.slice(index, index + 100),
        source,
        mode,
      }),
    );
  }

  return { requested: unique.length, batches };
}

/**
 * Ensures a Klaviyo profile exists only when a Monday Contact has a recent,
 * still-current governed commercial lifecycle transition (RFQ Requested,
 * RFQ Sent, Won or Lost). Ordinary cold Contacts never enter this path.
 *
 * Profile upsert does not grant marketing consent or remove suppressions.
 * The core lifecycle reconciler remains responsible for setting Lifecycle
 * Stage and emitting the idempotent lifecycle event after this recovery step.
 */
export async function recoverLifecycleProfiles(
  mode: AcquisitionMode,
  options: { cutoverAt: string; lookbackHours?: number },
) {
  const cutover = new Date(options.cutoverAt);
  if (Number.isNaN(cutover.getTime())) {
    throw new Error("Invalid lifecycle profile recovery cutover timestamp.");
  }

  const [contacts, transitions, leadResearchIds] = await Promise.all([
    listMondayContacts(),
    getMondayLifecycleTransitions(options.lookbackHours ?? 72),
    leadResearchContactIds(),
  ]);
  const contactsById = new Map(contacts.map((contact) => [contact.id, contact]));

  const eligible = new Set<string>();
  let stale = 0;
  let beforeCutover = 0;

  for (const transition of transitions) {
    if (new Date(transition.occurredAt) < cutover) {
      beforeCutover += 1;
      continue;
    }

    const contact = contactsById.get(transition.contactId);
    if (
      !contact ||
      !isCommercialLifecycleStatus(contact.lifecycleStatus) ||
      contact.lifecycleStatus !== transition.stage
    ) {
      stale += 1;
      continue;
    }

    eligible.add(contact.id);
  }

  const leadResearch = [...eligible].filter((id) => leadResearchIds.has(id));
  const manual = [...eligible].filter((id) => !leadResearchIds.has(id));

  const leadResearchResult = await syncInChunks(
    leadResearch,
    "Lead Research",
    mode,
  );
  const manualResult = await syncInChunks(manual, "Manual CRM", mode);

  return {
    transitionsSeen: transitions.length,
    transitionsBeforeCutover: beforeCutover,
    transitionsSkippedStale: stale,
    eligibleContacts: eligible.size,
    leadResearchContacts: leadResearch.length,
    manualContacts: manual.length,
    leadResearch: leadResearchResult,
    manual: manualResult,
  };
}
