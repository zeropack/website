import {
  reconcileKlaviyoMonday,
  type ReconcileMode,
  type ReconcileOptions,
} from "./reconcile";
import {
  recoverApprovedInboundProfiles,
  recoverRecentOutboundProfiles,
} from "./acquisition-runtime";

export type { ReconcileMode } from "./reconcile";

export type ReconcileWithAcquisitionOptions = ReconcileOptions & {
  profileSyncCutoverAt?: string | null;
};

export async function reconcileKlaviyoMondayWithAcquisition(
  options: ReconcileWithAcquisitionOptions = {},
) {
  const mode: ReconcileMode = options.mode === "apply" ? "apply" : "preview";

  // Preserve the already commissioned consent/suppression/lifecycle reconciler as the
  // first execution stage. Acquisition recovery is additive and never changes consent.
  const core = await reconcileKlaviyoMonday(options);

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
      inbound,
      outbound,
      outboundEnabled: Boolean(options.profileSyncCutoverAt),
    },
  };
}
