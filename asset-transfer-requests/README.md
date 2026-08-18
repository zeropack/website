# Approved asset transfer manifests

This folder contains deterministic requests for moving already-approved web derivatives from the canonical private Google Drive asset store into the connected public Vercel Blob store.

The Vercel build runs `scripts/sync-approved-assets.mjs` before the Next.js build. Each `*.json` manifest is validated, checked against any existing Blob object, and uploaded only when the target object is absent.

Required manifest shape:

```json
{
  "campaignId": "ZP-AU-2026-001",
  "driveFileId": "GOOGLE_DRIVE_FILE_ID",
  "blobPathname": "articles/ZP-AU-2026-001/hero-web.webp",
  "contentType": "image/webp",
  "expectedBytes": 167224,
  "expectedSha256": "optional-64-character-lowercase-hex-digest"
}
```

Rules:

- only Agent 4-created, Agent 7-QA'd web derivatives may be referenced;
- the Google Drive file remains the canonical source and is not modified;
- target paths must remain under `articles/{Campaign ID}/`;
- Vercel Blob uploads use `addRandomSuffix: false` and `allowOverwrite: false`;
- if an existing Blob has conflicting metadata, the build fails rather than overwriting it;
- on a new upload, the script verifies Drive byte count, optional SHA-256, then reads the Blob back and confirms byte-for-byte SHA-256 equivalence;
- image processing, resizing, recompression, transcoding and cropping are prohibited in this transfer step.

Required Vercel environment variables when a new asset must be transferred:

- `BLOB_READ_WRITE_TOKEN` — supplied by the connected Vercel Blob store;
- `GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL` — a Google service account granted read-only access to the canonical article asset folder;
- `GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY` — the matching private key, stored as a Vercel encrypted/sensitive environment variable.

Local builds skip transfer automatically. Vercel builds with no `*.json` manifests also perform no transfer.
