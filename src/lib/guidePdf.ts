const repository = "zeropack/website";

function previewCommitSha(): string | null {
  if (process.env.VERCEL_ENV !== "preview") return null;

  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  return sha && /^[0-9a-f]{40}$/i.test(sha) ? sha : null;
}

export function getGuidePdfDownloadHref(filename: string): string {
  const sha = previewCommitSha();
  if (!sha) return `/${filename}`;

  return `https://raw.githubusercontent.com/${repository}/${sha}/public/${filename}`;
}

export function getGuidePdfBrowserHref(filename: string): string {
  const sha = previewCommitSha();
  if (!sha) return `/${filename}`;

  return `https://github.com/${repository}/blob/${sha}/public/${filename}`;
}

export function isGuidePreviewBuild(): boolean {
  return previewCommitSha() !== null;
}
