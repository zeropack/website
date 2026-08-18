# Approved asset transfer manifests

This folder contains deterministic requests for moving already-approved web derivatives from Zero Pack's public-delivery Google Drive folder into the connected public Vercel Blob store.

The Vercel build runs `scripts/sync-approved-assets.mjs` before the Next.js build. Each `*.json` manifest is validated, checked against any existing Blob object, and uploaded only when the target object is absent.

Google Drive source model:

- canonical MASTER and working assets remain private in the normal Article & Newsletter asset folder;
- only approved publication derivatives are copied into `Public Delivery Derivatives` (folder ID `1pGe5cwox3ZPpiln307ocEchXLlA2ACpG`);
- the public-delivery folder is link-readable so Vercel can fetch approved derivatives without Google credentials;
- public-delivery files are source-transfer objects only; the production website serves the resulting Vercel Blob URL.

Required manifest shape:

```json
{
  "campaignId": "ZP-AU-2026-001",
  "driveFileId": "PUBLIC_DELIVERY_DRIVE_FILE_ID",
  "blobPathname": "articles/ZP-AU-2026-001/hero-web.webp",
  "contentType": "image/webp",
  "expectedBytes": 167224,
  "expectedSha256": "64-character-lowercase-hex-digest"
}
```

Rules:

- only Agent 4-created, Agent 7-QA'd publication derivatives may be referenced;
- MASTER assets and unreleased candidates must never be placed in the public-delivery folder;
- the approved Drive derivative is never modified by the transfer step;
- target paths must remain under `articles/{Campaign ID}/`;
- Vercel Blob uploads use `addRandomSuffix: false` and `allowOverwrite: false`;
- if an existing Blob has conflicting metadata, the build fails rather than overwriting it;
- on a new upload, the script verifies Drive byte count and SHA-256, then reads the Blob back and confirms byte-count and SHA-256 equivalence;
- image processing, resizing, recompression, transcoding and cropping are prohibited in this transfer step;
- a Drive response that is not a downloadable binary asset blocks the build.

Required Vercel environment variable:

- `BLOB_READ_WRITE_TOKEN` — supplied by the connected Vercel Blob store.

No Google service-account credentials are required.

Local builds skip transfer automatically. Vercel builds with no `*.json` manifests also perform no transfer.
