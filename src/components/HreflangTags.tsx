/**
 * App Router: prefer `metadata.alternates.languages` via `buildMetadata()` in `src/lib/metadata.ts`.
 * This helper keeps hreflang construction consistent across pages.
 */
export function hreflangLanguages(map: Record<string, string>) {
  return map;
}
