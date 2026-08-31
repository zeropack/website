import {
  reconcileKlaviyoMonday,
  type ReconcileMode,
  type ReconcileOptions,
} from "./reconcile";
import { recoverLifecycleProfiles } from "./lifecycle-profile-recovery";
import {
  recoverStandardInboundProfilesV2,
  STANDARD_INBOUND_PRODUCTION_CUTOVER_AT,
} from "./standard-inbound-recovery";
import {
  recoverTypeformRfqEventsV2,
  TYPEFORM_RFQ_PRODUCTION_CUTOVER_AT,
} from "./typeform-event-rfq";

export type { ReconcileMode } from "./reconcile";

export type ReconcileWithAcquisitionOptions = ReconcileOptions & {
  typeformRfqCutoverAt?: string | null;
  standardInboundCutoverAt?: string | null;
  standardInboundEnabled?: boolean;
};

export async function reconcileKlaviyoMondayWithAcquisition(
  options: ReconcileWithAcquisitionOptions = {},
) {
  const mode: ReconcileMode = options.mode === "apply" ? "apply" : "preview";

  // Typeform is RFQ-only and has completed its separate production commissioning.
  const typeformRfq = await recoverTypeformRfqEventsV2(mode, {
    lookbackHours: 168,
    cutoverAt:
      options.typeformRfqCutoverAt || TYPEFORM_RFQ_PRODUCTION_CUTOVER_AT,
  });

  // Ordinary Monday-created cold Contacts must not be created in Klaviyo.
  // The sole unattended Monday -> Klaviyo profile-creation exception is a recent,
  // still-current governed commercial lifecycle transition: RFQ Requested,
  // RFQ Sent, Won or Lost. Recovery runs before core reconciliation so a profile
  // created for that transition can receive the lifecycle property/event in the
  // same execution. Profile upsert never grants marketing consent or unsuppresses.
  const lifecycleCutoverAt =
    options.lifecycleCutoverAt ??
    process.env.MONDAY_LIFECYCLE_SYNC_CUTOVER_AT ??
    null;
  const lifecycleProfiles = lifecycleCutoverAt
    ? await recoverLifecycleProfiles(mode, {
        cutoverAt: lifecycleCutoverAt,
        lookbackHours: options.lifecycleLookbackHours ?? 72,
      })
    : null;

  // The commissioned consent/suppression/lifecycle reconciler remains canonical.
  const core = await reconcileKlaviyoMonday(options);

  // Standard inbound is independent from Typeform RFQ. It only considers the
  // approved marketing-acquisition sources after its own hard no-replay cutover.
  const standardInboundEnabled = options.standardInboundEnabled === true;
  const inbound = standardInboundEnabled
    ? await recoverStandardInboundProfilesV2(mode, {
        cutoverAt:
          options.standardInboundCutoverAt ||
          STANDARD_INBOUND_PRODUCTION_CUTOVER_AT,
      })
    : null;

  return {
    ...core,
    acquisitionRecovery: {
      typeformRfq,
      inbound,
      standardInboundEnabled,
      lifecycleProfiles,
      outbound: null,
      outboundEnabled: false,
    },
  };
}
