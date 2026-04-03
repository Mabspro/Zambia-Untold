export class PublicRouteError extends Error {
  code: string;
  status: number;

  constructor(code: string, status: number) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitStore = Map<string, RateLimitBucket>;

const RATE_LIMIT_STORE_KEY = "__zambia_untold_public_rate_limits";

function getRateLimitStore(): RateLimitStore {
  const globalStore = globalThis as typeof globalThis & {
    [RATE_LIMIT_STORE_KEY]?: RateLimitStore;
  };

  if (!globalStore[RATE_LIMIT_STORE_KEY]) {
    globalStore[RATE_LIMIT_STORE_KEY] = new Map<string, RateLimitBucket>();
  }

  return globalStore[RATE_LIMIT_STORE_KEY];
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  return "unknown";
}

export function applyIpRateLimit(
  request: Request,
  bucketName: string,
  limit: number,
  windowMs: number
) {
  const store = getRateLimitStore();
  const now = Date.now();
  const key = `${bucketName}:${getClientIp(request)}`;
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const nextBucket = { count: 1, resetAt: now + windowMs };
    store.set(key, nextBucket);
    return {
      ok: true as const,
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(Math.max(limit - nextBucket.count, 0)),
        "X-RateLimit-Reset": String(Math.ceil(nextBucket.resetAt / 1000)),
      },
    };
  }

  if (current.count >= limit) {
    return {
      ok: false as const,
      retryAfterSeconds: Math.max(Math.ceil((current.resetAt - now) / 1000), 1),
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(current.resetAt / 1000)),
      },
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    ok: true as const,
    headers: {
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": String(Math.max(limit - current.count, 0)),
      "X-RateLimit-Reset": String(Math.ceil(current.resetAt / 1000)),
    },
  };
}

export async function parseJsonBodyWithLimit<T>(request: Request, maxBytes: number): Promise<T> {
  const text = await request.text();
  const size = new TextEncoder().encode(text).length;

  if (size > maxBytes) {
    throw new PublicRouteError("body_too_large", 413);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new PublicRouteError("invalid_json", 400);
  }
}
