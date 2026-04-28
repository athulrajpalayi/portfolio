type RateLimitResult = {
  ok: boolean;
  retryAfterSeconds: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function applyRateLimit(
  key: string,
  maxRequests = 5,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  if (current.count >= maxRequests) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    };
  }

  current.count += 1;
  buckets.set(key, current);

  return {
    ok: true,
    retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000)
  };
}
