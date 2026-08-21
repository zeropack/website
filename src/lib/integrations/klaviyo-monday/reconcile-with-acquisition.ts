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
};

export async function reconcileKlaviyoMondayWithAcquisition(
  options: ReconcileWithAcquisitionOptions = {},
) {
  const mode: ReconcileMode = options.mode === "apply" ? "apply" : "preview";

  // Typeform is RFQ-only. The native Typeform -> Klaviyo integration emits a
  // distinct Filled Out Form event for every completed RFQ. Recover that event
  // before the core lifecycle stage so the same execution can move the Monday
  // Contact to RFQ Requested and then reflect that canonical lifecycle to Klaviyo.
  const typeformRfq = await recoverTypeformRfqEventsV2(mode, {
    lookbackHours: 168,
    cutoverAt:
      options.typeformRfqCutoverAt || TYPEFORM_RFQ_PRODUCTION_CUTOVER_AT,
  });

  // Preserve the commissioned consent/suppression/lifecycle reconciler as the
  // canonical state reconciliation stage. It remains the only owner of the
  // Monday commercial lifecycle -> Klaviyo lifecycle property/event write.
  const core = await reconcileKlaviyoMonday(options);

  // Standard Klaviyo acquisition sources remain profile-based and are routed
  // through the existing Contact Us intake path. Typeform is deliberately not
  // included here; its RFQ path is event-specific above.
  const inbound = await recoverStandardInboundProfiles(mode);

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
      outbound,
      outboundEnabled: Boolean(options.profileSyncCutoverAt),
    },
  };
}
