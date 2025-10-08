import { Redis } from "@upstash/redis"

if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
  throw new Error("REDIS_URL and REDIS_TOKEN must be defined")
}

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

// Cache utilities
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key)
    return cached as T | null
  } catch (error) {
    console.error("[Redis] Get error:", error)
    return null
  }
}

export async function setCached<T>(key: string, value: T, expirationSeconds = 3600): Promise<void> {
  try {
    await redis.setex(key, expirationSeconds, JSON.stringify(value))
  } catch (error) {
    console.error("[Redis] Set error:", error)
  }
}

export async function deleteCached(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error("[Redis] Delete error:", error)
  }
}
