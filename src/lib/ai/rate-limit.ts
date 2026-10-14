import "server-only";

/**
 * Tiny in-memory per-key limiter. It protects the Claude bill from accidental loops and casual abuse
 * on a single server instance. Real protection is authentication (Supabase session) plus a shared
 * store such as Redis, once accounts exist.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs = 60_000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const k of hits.keys()) if (!(hits.get(k) ?? []).some((t) => now - t < windowMs)) hits.delete(k);
  return true;
}

export const clientKey = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
