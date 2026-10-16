import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SERIES = "zp_zwc_reintro_2026_10";
export const TEST_CONTACT_ID = "2879122208";
export type Reason = "unsubscribed" | "spam" | "bounced";
export type Suppression = {
  id: string; accountId: string; subscriberId: string; contactId: string;
  email: string; scope: string; reason: Reason; occurredAt: string;
};
export type Rules = { accountId: string; mode: "internal" | "campaign" };
type Row = Record<string, unknown>;
const object = (value: unknown): Row => value && typeof value === "object" && !Array.isArray(value) ? value as Row : {};
const identifier = (value: unknown): string => typeof value === "string" && /^\d{1,24}$/.test(value) ? value : typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? String(value) : "";
const statuses = new Map<string, Reason>([["unsubscribed", "unsubscribed"], ["bounced", "bounced"], ["junk", "spam"]]);
const events = new Map<string, Reason>([["subscriber.unsubscribed", "unsubscribed"], ["subscriber.spam_reported", "spam"], ["subscriber.bounced", "bounced"]]);
export const hash = (value: string): string => createHash("sha256").update(value).digest("hex");

export function validSignature(raw: string, signature: string | null, secret: string): boolean {
  if (!secret || !signature || !/^[a-fA-F0-9]{64}$/.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(raw).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

export function fromSubscriber(value: unknown, rules: Rules, forcedReason?: Reason): Suppression | null {
  const row = object(value), fields = object(row.fields);
  if (row.account_id != null && identifier(row.account_id) !== rules.accountId) return null;
  const subscriberId = identifier(row.id), contactId = identifier(fields.monday_contact_id);
  const email = typeof row.email === "string" ? row.email.trim().toLowerCase() : "";
  const scope = typeof fields.zp_permission_scope === "string" ? fields.zp_permission_scope : "";
  const validScope = rules.mode === "internal"
    ? scope === "internal_test_only" && contactId === TEST_CONTACT_ID
    : scope === SERIES || (scope === "internal_test_only" && contactId === TEST_CONTACT_ID);
  const reason = forcedReason || statuses.get(String(row.status));
  const date = reason === "unsubscribed" ? row.unsubscribed_at || row.updated_at : row.updated_at;
  if (!subscriberId || !contactId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !validScope || !reason || typeof date !== "string" || !Number.isFinite(Date.parse(date))) return null;
  const occurredAt = new Date(date).toISOString();
  const id = hash([rules.accountId, subscriberId, contactId, scope, reason, occurredAt].join(":"));
  return { id, accountId: rules.accountId, subscriberId, contactId, email, scope, reason, occurredAt };
}

export function fromWebhook(value: unknown, rules: Rules): Suppression | null {
  const root = object(value);
  const reason = events.get(String(root.event || root.type));
  if (!reason) return null;
  if (root.account_id != null && identifier(root.account_id) !== rules.accountId) return null;
  return fromSubscriber(root.subscriber || root, rules, reason);
}

export function nextOutreachResult(current: string | null, reason: Reason): string {
  if (reason !== "bounced") return "Do Not Contact";
  return current === "Do Not Contact" || current === "Invalid Email" ? current : "Bounced Email";
}

function keyBytes(key: string): Buffer {
  if (!/^[a-f0-9]{64}$/i.test(key)) throw new Error("Invalid MailerLite encryption configuration");
  return Buffer.from(key, "hex");
}
export function encrypt(value: unknown, key: string): string {
  const iv = randomBytes(12), cipher = createCipheriv("aes-256-gcm", keyBytes(key), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return JSON.stringify({ v: 1, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: ciphertext.toString("base64") });
}
export function decrypt<T>(text: string, key: string): T {
  const row = JSON.parse(text);
  if (row.v !== 1) throw new Error("Invalid MailerLite queue record");
  const decipher = createDecipheriv("aes-256-gcm", keyBytes(key), Buffer.from(row.iv, "base64"));
  decipher.setAuthTag(Buffer.from(row.tag, "base64"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(row.data, "base64")), decipher.final()]).toString("utf8")) as T;
}
