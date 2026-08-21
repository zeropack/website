import {
  reconcileKlaviyoMonday,
  type ReconcileMode,
  type ReconcileOptions,
} from "./reconcile";
import {
  recoverApprovedInboundProfiles,
  recoverRecentOutboundProfiles,
} from "./acquisition-runtime";
import { recoverWebsiteRfqProfilesSinceCutover } from "./rfq-recovery";

export type { ReconcileMode } from "./reconcile";

export type ReconcileWithAcquisitionOptions = ReconcileOptions & {
  profileSyncCutoverAt?: string | null;
};

export async function reconcileKlaviyoMondayWithAcquisition(
  options: ReconcileWithAcquisitionOptions = {},
) {
  const mode: ReconcileMode = options.mode === "apply" ? "apply" : "preview";

  // Preserve the commissioned consent/suppression/lifecycle reconciler as the first stage.
  const core = await reconcileKlaviyoMonday(options);

  // RFQ intake runs first. On apply it stamps Monday Contact ID onto handled profiles,
  // which prevents the legacy generic inbound recovery from creating a second CRM path.
  const rfq = await recoverWebsiteRfqProfilesSinceCutover(mode);
  const inbound = await recoverApprovedInboundProfiles(mode);

  let outbound: Awaited<ReturnType<typeof recoverRecentOutboundProfiles>> | null = null;
  if (options.profileSyncCutoverAt) {
    outbound = await recoverRecentOutboundProfiles(mode, {
      cutoverAt: options.profileSyncCutoverAt,
      lookbackHours: options.lifecycleLookbackHours ?? 72,
    });
  }

  return {
    ...core,
    acquisitionRecovery: {
      rfq,
      inbound,
      outbound,
      rfqEnabled: rfq.enabled,
      outboundEnabled: Boolean(options.profileSyncCutoverAt),
    },
  };
}
