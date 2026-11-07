// In-memory rate limiting with IP and identifier tracking
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up stale records periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (record.resetAt <= now) {
        memoryStore.delete(key);
      }
    }
  }, 60 * 1000);
}

/**
 * Checks rate limit for a key. Returns { allowed: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowSeconds: number = 15 * 60
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const existing = memoryStore.get(key);

  if (!existing || existing.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetInSeconds: windowSeconds,
    };
  }

  if (existing.count >= maxAttempts) {
    const resetInSeconds = Math.ceil((existing.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.max(resetInSeconds, 1),
    };
  }

  existing.count += 1;
  const resetInSeconds = Math.ceil((existing.resetAt - now) / 1000);
  return {
    allowed: true,
    remaining: maxAttempts - existing.count,
    resetInSeconds,
  };
}

