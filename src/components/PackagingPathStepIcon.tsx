import type { PackagingPathStepIcon as IconKind } from "@/content/packagingPathSteps";

export function PackagingPathStepIcon({
  kind,
  className = "h-7 w-7",
}: {
  kind: IconKind;
  className?: string;
}) {
  switch (kind) {
    case "quote":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <path d="M4 5h16v14H4z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      );
    case "accept":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <path d="m8.5 12.5 2.3 2.3 4.7-5.1" />
        </svg>
      );
    case "design":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <path d="M4 16l8-8 4 4-8 8H4z" />
          <path d="M13 7l2-2 4 4-2 2" />
        </svg>
      );
    case "production":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <path d="M4 12h16M7 12V8h10v4M7 12v4h10v-4" />
        </svg>
      );
    case "confirm":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <path d="M12 3 4 7v6c0 4 3 6.8 8 8 5-1.2 8-4 8-8V7z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "ship":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
          <circle cx="7" cy="17" r="1.5" />
          <circle cx="18" cy="17" r="1.5" />
        </svg>
      );
    case "receive":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <path d="M12 3v10M8.5 9.5 12 13l3.5-3.5" />
          <path d="M4 16h16v5H4z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
          <path d="M3 12h18M12 3l9 9-9 9" />
        </svg>
      );
  }
}
