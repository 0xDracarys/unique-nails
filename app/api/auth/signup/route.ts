import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import redis from "@/lib/redis"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { name, email, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await redis.get(`user:email:${email}`)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const userId = uuidv4()
    const userData = {
      id: userId,
      name,
      email,
      createdAt: Date.now(),
    }

    console.log("Creating new user:", userData)

    // Store user data - ensure it's properly stringified
    await redis.set(`user:${userId}`, JSON.stringify(userData))
    await redis.set(`user:email:${email}`, userId)
    await redis.set(`user:auth:${userId}`, password) // In a real app, hash this password

    console.log("User data stored in Redis")

    // Create session
    const sessionId = uuidv4()
    const expires = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days

    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        userId,
        expires,
      }),
    )

    // Set session cookie
    cookies().set("session_id", sessionId, {
      httpOnly: true,
      expires: new Date(expires),
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: { id: userId, name, email },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 })
  }
}
