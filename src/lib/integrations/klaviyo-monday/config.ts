export const KLAVIYO_API_REVISION = "2026-07-15";
export const MONDAY_API_VERSION = "2026-07";

export const MONDAY_CONTACTS_BOARD_ID = 5029468199;
export const MONDAY_KLAVIYO_PROFILES_BOARD_ID = 5030718685;

export const CONTACT_COLUMNS = {
  email: "contact_email",
  firstName: "text_mm5n6d0w",
  lastName: "text_mm4pxvbs",
  lifecycleStatus: "color_mm5gwvh2",
  subscription: "color_mm69w7w7",
  region: "dropdown_mm69wb6t",
} as const;

export const KLAVIYO_PROFILE_COLUMNS = {
  email: "email_mm6c1rkp",
  contact: "board_relation_mm6cq8hc",
  profileId: "text_mm6csvbc",
  subscriptionStatus: "color_mm6cbzws",
  consentSource: "text_mm6ctsyx",
  consentDate: "date_mm6cqps6",
  suppressionReason: "text_mm6c5ts",
  suppressionDate: "date_mm6ch4h5",
  region: "color_mm6c9ad5",
  lastSync: "date_mm6cyww0",
} as const;

export const COMMERCIAL_LIFECYCLE_STATUSES = [
  "RFQ Requested",
  "RFQ Sent",
  "Won",
  "Lost",
] as const;

export type CommercialLifecycleStatus =
  (typeof COMMERCIAL_LIFECYCLE_STATUSES)[number];

export function isCommercialLifecycleStatus(
  value: string | null | undefined,
): value is CommercialLifecycleStatus {
  return COMMERCIAL_LIFECYCLE_STATUSES.includes(
    value as CommercialLifecycleStatus,
  );
}

export const KLAVIYO_LIFECYCLE_PROPERTY = "Lifecycle Stage";

export const REGION_MAP: Record<string, string> = {
  AU: "AU",
  NZ: "NZ",
  UK: "UK",
  EU: "EU",
  ASIA: "Asia",
  NA: "Global",
  SA: "Global",
  AFRICA: "Global",
};
