import { NextResponse } from "next/server"
import redis from "@/lib/redis"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const sessionId = cookies().get("session_id")?.value

    if (sessionId) {
      // Delete session from Redis
      await redis.del(`session:${sessionId}`)

      // Clear cookie
      cookies().delete("session_id")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Signout error:", error)
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 })
  }
}
