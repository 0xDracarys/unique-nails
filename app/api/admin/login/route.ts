import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import redis from "@/lib/redis"
import { cookies } from "next/headers"
import * as bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Get admin credentials from Redis
    const adminData = await redis.get("admin:credentials")

    if (!adminData) {
      return NextResponse.json({ error: "Admin account not set up" }, { status: 500 })
    }

    const admin = JSON.parse(adminData)

    // Validate admin credentials
    if (email !== admin.email) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password using bcrypt
    const passwordMatch = await bcrypt.compare(password, admin.passwordHash)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create admin session
    const sessionId = uuidv4()
    const expires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

    await redis.set(
      `admin-session:${sessionId}`,
      JSON.stringify({
        email: admin.email,
        expires,
      }),
    )

    // Set session cookie
    cookies().set("admin_session_id", sessionId, {
      httpOnly: true,
      expires: new Date(expires),
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
