export function clean(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export function required(value: string): boolean {
  return value.length > 0;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getIp(request: Request): string | null {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Yalnızca http/https kapak görseli URL'si */
export function safeHttpUrl(value: unknown, maxLen = 300): string | null {
  const trimmed = clean(value, maxLen);
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") return trimmed;
  } catch {
    /* geçersiz URL */
  }
  return null;
}

export { hasKvkkConsent, KVKK_CONSENT_ERROR } from "@/lib/kvkk";
