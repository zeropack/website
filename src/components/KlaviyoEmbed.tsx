type KlaviyoEmbedProps = {
  formId: string;
  className?: string;
};

export function KlaviyoEmbed({ formId, className = "" }: KlaviyoEmbedProps) {
  return <div className={`klaviyo-form-${formId} ${className}`.trim()} />;
}
