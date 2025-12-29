/**
 * Rate limiter for API routes
 *
 * DEVELOPMENT: Uses in-memory storage (single-instance only)
 *
 * PRODUCTION TODO: Replace with Redis (Upstash) for:
 * - Multi-instance support (horizontal scaling)
 * - Persistent rate limits across deployments
 * - Distributed rate limiting
 *
 * To migrate to Redis:
 * 1. Install: npm install @upstash/redis
 * 2. Set env vars: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 * 3. Replace RateLimitStore implementation with RedisRateLimitStore
 * 4. Update checkRateLimit to use async Redis operations
 *
 * Example Redis implementation:
 * ```typescript
 * import { Redis } from '@upstash/redis'
 * const redis = new Redis({
 *   url: process.env.UPSTASH_REDIS_REST_URL!,
 *   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
 * })
 *
 * // Use Redis INCR with expiry for atomic rate limiting
 * const count = await redis.incr(key)
 * if (count === 1) {
 *   await redis.expire(key, windowSeconds)
 * }
 * ```
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

/**
 * Abstract rate limit store interface
 * Allows swapping between in-memory and Redis implementations
 */
interface RateLimitStore {
  get(key: string): RateLimitEntry | null
  set(key: string, entry: RateLimitEntry): void
  delete(key: string): void
  entries(): IterableIterator<[string, RateLimitEntry]>
}

/**
 * In-memory implementation (development only)
 * WARNING: Will reset on server restart and doesn't work with multiple instances
 */
class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, RateLimitEntry>()

  get(key: string): RateLimitEntry | null {
    return this.store.get(key) || null
  }

  set(key: string, entry: RateLimitEntry): void {
    this.store.set(key, entry)
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  entries(): IterableIterator<[string, RateLimitEntry]> {
    return this.store.entries()
  }
}

// Current implementation (swap with RedisRateLimitStore for production)
const rateLimitStore: RateLimitStore = new MemoryRateLimitStore()

// Clean up expired entries periodically (in-memory only)
// NOTE: Redis handles expiry automatically with TTL
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check rate limit for a given identifier (usually IP or user ID)
 *
 * NOTE: This is currently synchronous for in-memory store.
 * When migrating to Redis, update signature to:
 * export async function checkRateLimit(...): Promise<RateLimitResult>
 *
 * And update all call sites to await the result.
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const key = identifier

  const entry = rateLimitStore.get(key)

  // If no entry or window expired, create new entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    }
  }

  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)

  // Check if over limit
  if (entry.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetTime,
    }
  }

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetTime,
  }
}

/**
 * Rate limiter presets for different endpoint types
 */
export const rateLimiters = {
  // Public forms: 5 requests per 5 minutes
  form: (ip: string) => checkRateLimit(`form:${ip}`, 5, 5 * 60 * 1000),

  // Contact/inquiry: 3 requests per 10 minutes
  inquiry: (ip: string) => checkRateLimit(`inquiry:${ip}`, 3, 10 * 60 * 1000),

  // Auth endpoints: 5 attempts per 15 minutes
  auth: (ip: string) => checkRateLimit(`auth:${ip}`, 5, 15 * 60 * 1000),

  // API general: 100 requests per minute
  api: (ip: string) => checkRateLimit(`api:${ip}`, 100, 60 * 1000),

  // Checkout: 10 requests per 5 minutes
  checkout: (ip: string) => checkRateLimit(`checkout:${ip}`, 10, 5 * 60 * 1000),
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Check various headers for the real IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list, take the first one
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback
  return 'unknown'
}

/**
 * Create rate limit response headers
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  }
}
