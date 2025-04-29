import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import { cookies } from "next/headers"

export async function adminMiddleware(request: NextRequest) {
  const sessionId = cookies().get("admin_session_id")?.value

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessionData = await redis.get(`admin-session:${sessionId}`)
  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const session = JSON.parse(sessionData as string)

  // Check if session is expired
  if (session.expires < Date.now()) {
    await redis.del(`admin-session:${sessionId}`)
    return NextResponse.json({ error: "Session expired" }, { status: 401 })
  }

  return null // Continue if authenticated
}
