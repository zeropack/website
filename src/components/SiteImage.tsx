import Image, { type ImageProps } from "next/image";

/** next/image wrapper with lazy loading and low fetch priority by default. */
export function SiteImage({
  priority = false,
  loading,
  fetchPriority,
  decoding = "async",
  ...props
}: ImageProps) {
  return (
    <Image
      {...props}
      priority={priority}
      loading={priority ? undefined : (loading ?? "lazy")}
      fetchPriority={priority ? "high" : (fetchPriority ?? "low")}
      decoding={decoding}
    />
  );
}
