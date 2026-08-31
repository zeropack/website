import {
  reconcileKlaviyoMonday,
  type ReconcileMode,
  type ReconcileOptions,
} from "./reconcile";
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

  // Monday-originated Contacts, including Lead Research / AI Agent Contacts, must
  // not be created or updated as Klaviyo profiles by unattended reconciliation.
  // Klaviyo profiles are created through approved consented inbound acquisition
  // routes or through the separate protected manual profile-sync endpoint when a
  // deliberate case-by-case operation is required.

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
      outbound: null,
      outboundEnabled: false,
    },
  };
}
