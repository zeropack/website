import {
  reconcileKlaviyoMonday,
  type ReconcileMode,
  type ReconcileOptions,
} from "./reconcile";
import { recoverRecentOutboundProfiles } from "./acquisition-runtime";
import { recoverStandardInboundProfiles } from "./inbound-recovery";
import {
  recoverTypeformRfqEventsV2,
  TYPEFORM_RFQ_PRODUCTION_CUTOVER_AT,
} from "./typeform-event-rfq";

export type { ReconcileMode } from "./reconcile";

export type ReconcileWithAcquisitionOptions = ReconcileOptions & {
  profileSyncCutoverAt?: string | null;
  typeformRfqCutoverAt?: string | null;
  standardInboundEnabled?: boolean;
};

export async function reconcileKlaviyoMondayWithAcquisition(
  options: ReconcileWithAcquisitionOptions = {},
) {
  const mode: ReconcileMode = options.mode === "apply" ? "apply" : "preview";

  // Typeform is RFQ-only and has completed its separate production commissioning.
  // It is therefore safe to run independently of the broader acquisition/profile
  // sync gate. Every completed RFQ is recovered from Klaviyo's native Filled Out
  // Form event before the core lifecycle stage.
  const typeformRfq = await recoverTypeformRfqEventsV2(mode, {
    lookbackHours: 168,
    cutoverAt:
      options.typeformRfqCutoverAt || TYPEFORM_RFQ_PRODUCTION_CUTOVER_AT,
  });

  // The commissioned consent/suppression/lifecycle reconciler remains the
  // canonical state reconciliation stage and the sole owner of the Monday
  // commercial lifecycle -> Klaviyo lifecycle property/event write.
  const core = await reconcileKlaviyoMonday(options);

  // Standard acquisition sources remain separately gated until their own
  // commissioning is complete. Typeform never enters this profile-based path.
  const standardInboundEnabled = options.standardInboundEnabled !== false;
  const inbound = standardInboundEnabled
    ? await recoverStandardInboundProfiles(mode)
    : null;

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
      typeformRfq,
      inbound,
      standardInboundEnabled,
      outbound,
      outboundEnabled: Boolean(options.profileSyncCutoverAt),
    },
  };
}
