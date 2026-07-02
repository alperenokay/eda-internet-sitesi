/** KVKK sabitleri ve yardımcılar. */

import { DEFAULT_CONTACT_EMAIL } from "@/lib/site";

const DEFAULT_RETENTION_MONTHS = 24;

export function getRetentionMonths(): number {
  const raw = Number(process.env.DATA_RETENTION_MONTHS);
  if (Number.isFinite(raw) && raw > 0 && raw <= 120) return Math.floor(raw);
  return DEFAULT_RETENTION_MONTHS;
}

export function computeRetentionUntil(from: Date = new Date()): Date {
  const until = new Date(from);
  until.setMonth(until.getMonth() + getRetentionMonths());
  return until;
}

export function hasKvkkConsent(data: Record<string, unknown>): boolean {
  const value = data.kvkk_consent;
  return value === true || value === "true" || value === 1 || value === "1";
}

export function getKvkkContactEmail(): string {
  const fromEnv = process.env.KVKK_CONTACT_EMAIL?.trim();
  if (fromEnv) return fromEnv;
  const notify = process.env.NOTIFY_TO?.trim();
  if (notify) return notify;
  return DEFAULT_CONTACT_EMAIL;
}

export const KVKK_CONSENT_ERROR =
  "Devam etmek için aydınlatma metnini okuyup onay vermeniz gerekiyor.";
