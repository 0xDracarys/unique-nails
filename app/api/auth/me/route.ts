import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import redis from "@/lib/redis"

export async function GET() {
  try {
    // Get session cookie
    const sessionId = cookies().get("session_id")?.value

    if (!sessionId) {
      return NextResponse.json({ user: null })
    }

    // Get session data
    const sessionData = await redis.get(`session:${sessionId}`)
    if (!sessionData) {
      return NextResponse.json({ user: null })
    }

    // Parse session data
    let session
    try {
      // Handle both string and object formats
      if (typeof sessionData === "object" && sessionData !== null) {
        session = sessionData
      } else {
        session = JSON.parse(sessionData as string)
      }
    } catch (error) {
      console.error("Error parsing session data:", error)
      return NextResponse.json({ user: null })
    }

    // Check if session is expired
    if (session.expires < Date.now()) {
      return NextResponse.json({ user: null })
    }

    // Get user data
    const userData = await redis.get(`user:${session.userId}`)
    if (!userData) {
      return NextResponse.json({ user: null })
    }

    // Parse user data
    let user
    try {
      // Handle both string and object formats
      if (typeof userData === "object" && userData !== null) {
        user = userData
      } else {
        user = JSON.parse(userData as string)
      }
    } catch (error) {
      console.error("Error parsing user data:", error)

      // Attempt to recover if userData is "[object Object]"
      if (userData === "[object Object]") {
        // Create a basic user object with the ID
        user = { id: session.userId, name: "User", email: "user@example.com" }

        // Fix the data in Redis for future requests
        await redis.set(`user:${session.userId}`, JSON.stringify(user))
      } else {
        return NextResponse.json({ user: null })
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ user: null })
  }
}
