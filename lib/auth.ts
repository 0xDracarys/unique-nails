import { cookies } from "next/headers"
import redis from "./redis"
import type { User } from "@/types"

export async function getUserFromSession(): Promise<User | null> {
  try {
    const sessionId = cookies().get("session_id")?.value

    if (!sessionId) {
      return null
    }

    const sessionData = await redis.get(`session:${sessionId}`)
    if (!sessionData) {
      return null
    }

    const session = JSON.parse(sessionData as string)

    // Check if session is expired
    if (session.expires < Date.now()) {
      await redis.del(`session:${sessionId}`)
      return null
    }

    const userData = await redis.get(`user:${session.userId}`)
    if (!userData) {
      return null
    }

    return JSON.parse(userData as string) as User
  } catch (error) {
    console.error("Get user from session error:", error)
    return null
  }
}
