import { NextResponse } from "next/server"
import redis from "@/lib/redis"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const sessionId = cookies().get("admin_session_id")?.value

    if (sessionId) {
      // Delete session from Redis
      await redis.del(`admin-session:${sessionId}`)

      // Clear cookie
      cookies().delete("admin_session_id")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin logout error:", error)
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}
