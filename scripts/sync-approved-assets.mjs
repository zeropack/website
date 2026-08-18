import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { get, head, put } from "@vercel/blob";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REQUEST_DIR = path.join(ROOT, "asset-transfer-requests");

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function fetchDriveFile(fileId) {
  const url = new URL("https://drive.usercontent.google.com/download");
  url.searchParams.set("id", fileId);
  url.searchParams.set("export", "download");
  url.searchParams.set("confirm", "t");

  const response = await fetch(url, { redirect: "follow" });

  if (!response.ok) {
    throw new Error(`Public Google Drive download failed for ${fileId} (${response.status}): ${await response.text()}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    throw new Error(
      `Public Google Drive download for ${fileId} returned HTML instead of the approved asset; check link-sharing permissions`,
    );
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
  if (!/^[A-Za-z0-9_-]+$/.test(manifest.driveFileId)) {
    throw new Error(`${filename}: invalid driveFileId`);
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
    const message = String(error?.message || error);
    if (
      error?.name === "BlobNotFoundError" ||
      /not found/i.test(message) ||
      /does not exist/i.test(message)
    ) {
      return false;
    }
    throw error;
  }
}

async function uploadManifest(manifest, filename) {
  const source = await fetchDriveFile(manifest.driveFileId);
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

  for (const filename of files) {
    const manifest = JSON.parse(await readFile(path.join(REQUEST_DIR, filename), "utf8"));
    validateManifest(manifest, filename);

    if (await verifyExistingBlob(manifest, filename)) continue;
    await uploadManifest(manifest, filename);
  }
}

main().catch((error) => {
  console.error("ASSET_TRANSFER_BLOCKED", error);
  process.exit(1);
});
