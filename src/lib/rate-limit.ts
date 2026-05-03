import "server-only";

/**
 * Çok hafif, in-memory sliding-window benzeri rate limiter.
 * Vercel Node serverless'ta module scope tek bir warm container ömrü kadar yaşar
 * (mükemmel değil ama kötü niyetli login spamı için anlamlı bir koruma sağlar).
 *
 * Production trafiği büyüyünce Upstash Redis ile değiştirilmeli:
 *   import { Ratelimit } from "@upstash/ratelimit";
 *   import { Redis } from "@upstash/redis";
 *   const r = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, "1 m") });
 */

type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

export function memoryRateLimit(
  key: string,
  max: number,
  windowMs: number,
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    const reset = now + windowMs;
    buckets.set(key, { count: 1, reset });
    return { ok: true, remaining: max - 1, resetAt: reset };
  }
  if (b.count >= max) {
    return { ok: false, remaining: 0, resetAt: b.reset };
  }
  b.count += 1;
  return { ok: true, remaining: max - b.count, resetAt: b.reset };
}

/** En yaygın kullanım için ön-tanımlı limitler */
export const LIMITS = {
  login: { max: 5, windowMs: 60_000 }, // dakikada 5
  signup: { max: 3, windowMs: 60_000 },
  inquiry: { max: 10, windowMs: 60 * 60_000 }, // saatte 10 teklif
  message: { max: 60, windowMs: 60_000 }, // dakikada 60 mesaj
  contactForm: { max: 3, windowMs: 60_000 },
} as const;

export function ipFromHeaders(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
