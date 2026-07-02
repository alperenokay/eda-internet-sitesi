/** Basit bellek içi rate limit (tek instance; Render free tier). */

const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}

/** Form gönderimi: IP başına 10 / saat */
export function checkFormRateLimit(ip: string): boolean {
  return checkRateLimit(`form:${ip}`, 10, 60 * 60 * 1000);
}
