import { redis } from "./redis"

export async function rateLimit(
  identifier: string,
  limit = 10,
  window = 60,
): Promise<{ success: boolean; remaining: number }> {
  const key = `rate-limit:${identifier}`

  try {
    const current = await redis.incr(key)

    if (current === 1) {
      await redis.expire(key, window)
    }

    const remaining = Math.max(0, limit - current)

    return {
      success: current <= limit,
      remaining,
    }
  } catch (error) {
    console.error("[RateLimit] Error:", error)
    // Fail open on Redis errors
    return { success: true, remaining: limit }
  }
}
