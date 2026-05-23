const store = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

export function rateLimit(
  key: string,
  options: RateLimitOptions = { windowMs: 60_000, maxRequests: 20 },
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { ok: true, remaining: options.maxRequests - 1 };
  }

  entry.count += 1;
  if (entry.count > options.maxRequests) {
    return { ok: false, remaining: 0 };
  }

  return { ok: true, remaining: options.maxRequests - entry.count };
}

// Periodic cleanup to prevent memory leak from stale entries
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now >= entry.resetAt) store.delete(key);
    }
  }, 60_000);
}
