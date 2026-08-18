import { createHash, createSign } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { get, head, put } from "@vercel/blob";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REQUEST_DIR = path.join(ROOT, "asset-transfer-requests");
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";

function base64Url(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function getGoogleAccessToken() {
  const clientEmail = requireEnv("GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = requireEnv("GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);

  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: GOOGLE_DRIVE_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${base64Url(signer.sign(privateKey))}`;

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google OAuth failed (${response.status}): ${await response.text()}`);
  }

  const token = await response.json();
  if (!token.access_token) throw new Error("Google OAuth response did not contain access_token");
  return token.access_token;
}

async function fetchDriveFile(fileId, accessToken) {
  const url = new URL(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`);
  url.searchParams.set("alt", "media");
  url.searchParams.set("supportsAllDrives", "true");

  const response = await fetch(url, {
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Google Drive download failed for ${fileId} (${response.status}): ${await response.text()}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function validateManifest(manifest, filename) {
  const required = ["campaignId", "driveFileId", "blobPathname", "contentType", "expectedBytes"];
  for (const key of required) {
    if (manifest[key] === undefined || manifest[key] === null || manifest[key] === "") {
      throw new Error(`${filename}: missing required field ${key}`);
    }
  }

  if (!/^ZP-[A-Z]+-\d{4}-\d+$/.test(manifest.campaignId)) {
    throw new Error(`${filename}: invalid campaignId`);
  }
  if (!/^articles\/ZP-[A-Z]+-\d{4}-\d+\/[A-Za-z0-9._/-]+$/.test(manifest.blobPathname)) {
    throw new Error(`${filename}: blobPathname must be under articles/{Campaign ID}/`);
  }
  if (!manifest.blobPathname.startsWith(`articles/${manifest.campaignId}/`)) {
    throw new Error(`${filename}: blobPathname campaign does not match campaignId`);
  }
  if (!String(manifest.contentType).startsWith("image/")) {
    throw new Error(`${filename}: contentType must be an image MIME type`);
  }
  if (!Number.isInteger(Number(manifest.expectedBytes)) || Number(manifest.expectedBytes) <= 0) {
    throw new Error(`${filename}: expectedBytes must be a positive integer`);
  }
  if (manifest.expectedSha256 && !/^[a-f0-9]{64}$/i.test(manifest.expectedSha256)) {
    throw new Error(`${filename}: expectedSha256 must be a 64-character hex digest`);
  }
}

async function verifyExistingBlob(manifest, filename) {
  try {
    const existing = await head(manifest.blobPathname);
    const size = Number(existing.size ?? existing.contentLength ?? 0);
    if (size && size !== Number(manifest.expectedBytes)) {
      throw new Error(
        `${filename}: existing Blob size ${size} does not match expected ${manifest.expectedBytes}; refusing overwrite`,
      );
    }
    if (existing.contentType && existing.contentType !== manifest.contentType) {
      throw new Error(
        `${filename}: existing Blob content type ${existing.contentType} does not match expected ${manifest.contentType}; refusing overwrite`,
      );
    }
    console.log(
      `ASSET_TRANSFER_RESULT ${JSON.stringify({
        campaignId: manifest.campaignId,
        status: "already-present",
        pathname: existing.pathname ?? manifest.blobPathname,
        url: existing.url,
        size: size || Number(manifest.expectedBytes),
      })}`,
    );
    return true;
  } catch (error) {
    if (error?.name === "BlobNotFoundError" || /not found/i.test(String(error?.message))) return false;
    throw error;
  }
}

async function uploadManifest(manifest, filename, googleToken) {
  const source = await fetchDriveFile(manifest.driveFileId, googleToken);
  const sourceSize = source.byteLength;
  const sourceSha256 = sha256(source);

  if (sourceSize !== Number(manifest.expectedBytes)) {
    throw new Error(
      `${filename}: Drive source size ${sourceSize} does not match expected ${manifest.expectedBytes}`,
    );
  }
  if (manifest.expectedSha256 && sourceSha256 !== manifest.expectedSha256.toLowerCase()) {
    throw new Error(`${filename}: Drive source SHA-256 does not match manifest`);
  }

  const uploaded = await put(manifest.blobPathname, source, {
    access: "public",
    contentType: manifest.contentType,
    addRandomSuffix: false,
    allowOverwrite: false,
  });

  const roundTrip = await get(uploaded.pathname, { access: "public", useCache: false });
  if (!roundTrip) throw new Error(`${filename}: uploaded Blob could not be read back for verification`);
  const uploadedBytes = Buffer.from(await new Response(roundTrip.stream).arrayBuffer());
  const uploadedSha256 = sha256(uploadedBytes);

  if (uploadedBytes.byteLength !== sourceSize || uploadedSha256 !== sourceSha256) {
    throw new Error(`${filename}: post-upload Blob fidelity verification failed`);
  }

  console.log(
    `ASSET_TRANSFER_RESULT ${JSON.stringify({
      campaignId: manifest.campaignId,
      status: "uploaded-and-verified",
      pathname: uploaded.pathname,
      url: uploaded.url,
      size: uploadedBytes.byteLength,
      sha256: uploadedSha256,
    })}`,
  );
}

async function main() {
  if (!process.env.VERCEL) {
    console.log("Asset sync skipped outside Vercel build environment.");
    return;
  }

  let files;
  try {
    files = (await readdir(REQUEST_DIR)).filter((name) => name.endsWith(".json")).sort();
  } catch (error) {
    if (error?.code === "ENOENT") {
      console.log("No asset-transfer-requests directory; nothing to sync.");
      return;
    }
    throw error;
  }

  if (files.length === 0) {
    console.log("No approved asset transfer manifests; nothing to sync.");
    return;
  }

  requireEnv("BLOB_READ_WRITE_TOKEN");
  let googleToken = null;

  for (const filename of files) {
    const manifest = JSON.parse(await readFile(path.join(REQUEST_DIR, filename), "utf8"));
    validateManifest(manifest, filename);

    if (await verifyExistingBlob(manifest, filename)) continue;

    if (!googleToken) googleToken = await getGoogleAccessToken();
    await uploadManifest(manifest, filename, googleToken);
  }
}

main().catch((error) => {
  console.error("ASSET_TRANSFER_BLOCKED", error);
  process.exit(1);
});
