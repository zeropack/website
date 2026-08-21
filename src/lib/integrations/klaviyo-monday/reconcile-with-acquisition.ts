import {
  reconcileKlaviyoMonday,
  type ReconcileMode,
  type ReconcileOptions,
} from "./reconcile";
import { recoverRecentOutboundProfiles } from "./acquisition-runtime";
import {
  recoverStandardInboundProfiles,
  recoverTypeformRfqEvents,
  TYPEFORM_RFQ_PRODUCTION_CUTOVER_AT,
} from "./inbound-recovery";

export type { ReconcileMode } from "./reconcile";

export type ReconcileWithAcquisitionOptions = ReconcileOptions & {
  profileSyncCutoverAt?: string | null;
  typeformRfqCutoverAt?: string | null;
};

export async function reconcileKlaviyoMondayWithAcquisition(
  options: ReconcileWithAcquisitionOptions = {},
) {
  const mode: ReconcileMode = options.mode === "apply" ? "apply" : "preview";

  // Typeform is RFQ-only. Recover the Klaviyo Filled Out Form event first so
  // the canonical Monday Contact can move to RFQ Requested before the already
  // commissioned lifecycle reconciler runs. That lets the same execution push
  // Lifecycle Stage / RFQ Requested back to Klaviyo without Typeform owning
  // commercial lifecycle or marketing consent.
  const typeformRfq = await recoverTypeformRfqEvents(mode, {
    lookbackHours: 168,
    cutoverAt: options.typeformRfqCutoverAt || TYPEFORM_RFQ_PRODUCTION_CUTOVER_AT,
  });

  // Preserve the commissioned consent/suppression/lifecycle reconciler as the
  // canonical state reconciliation stage. It remains the only owner of the
  // Monday commercial lifecycle -> Klaviyo lifecycle property/event write.
  const core = await reconcileKlaviyoMonday(options);

  // Standard Klaviyo acquisition sources remain profile-based and are routed
  // through the existing Contact Us intake path. Typeform is deliberately not
  // included here; it is handled only by the event-specific RFQ recovery above.
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
