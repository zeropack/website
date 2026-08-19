type HubSpotFormEmbedProps = {
  formId: string;
  portalId?: string;
  region?: string;
  className?: string;
};

/**
 * Legacy compatibility shim.
 *
 * HubSpot is no longer part of the Zero Pack website stack. This component is
 * intentionally inert so any remaining historical render sites cannot load
 * HubSpot scripts, forms, cookies or telemetry while the dead UI reference is
 * removed in a follow-up cleanup.
 */
export function HubSpotFormEmbed(_props: HubSpotFormEmbedProps) {
  return null;
}
