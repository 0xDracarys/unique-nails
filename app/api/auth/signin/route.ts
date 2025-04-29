import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import redis from "@/lib/redis"
import { cookies } from "next/headers"

// Add a function to create a test user if none exists
async function ensureTestUserExists() {
  try {
    // Check if test user exists
    const testEmail = "test@example.com"
    const existingUserId = await redis.get(`user:email:${testEmail}`)

    if (!existingUserId) {
      console.log("Creating test user for development...")
      const userId = uuidv4()
      const testPassword = "password123"
      const userData = {
        id: userId,
        name: "Test User",
        email: testEmail,
        createdAt: Date.now(),
      }

      // Store user data - ensure it's properly stringified
      await redis.set(`user:${userId}`, JSON.stringify(userData))
      await redis.set(`user:email:${testEmail}`, userId)
      await redis.set(`user:auth:${userId}`, testPassword)

      console.log("Test user created successfully")
      return true
    }
    return false
  } catch (error) {
    console.error("Error creating test user:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Create test user for development purposes
    await ensureTestUserExists()

    // Parse the request body properly
    const body = await request.json()
    const { email, password } = body

    console.log(`Attempting login for email: ${email}`)

    // Get user ID from email
    const userId = await redis.get(`user:email:${email}`)
    if (!userId) {
      console.log(`No user found for email: ${email}`)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log(`Found user ID: ${userId}`)

    // Check password (in a real app, you'd compare hashed passwords)
    const storedPassword = await redis.get(`user:auth:${userId}`)
    console.log(`Stored password exists: ${!!storedPassword}`)

    if (storedPassword !== password) {
      console.log("Password mismatch")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Get user data
    const userData = await redis.get(`user:${userId}`)
    if (!userData) {
      console.log(`User data not found for ID: ${userId}`)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("Raw user data from Redis:", userData)

    // Parse user data safely - handle both string and object formats
    let user
    try {
      // Check if userData is already an object
      if (typeof userData === "object" && userData !== null) {
        user = userData
        console.log("User data is already an object, no parsing needed")
      } else {
        // If it's a string, parse it
        user = JSON.parse(userData as string)
        console.log("User data parsed successfully from string")
      }
    } catch (error) {
      console.error("Error parsing user data:", error, "Raw data:", userData)

      // Attempt to recover if userData is "[object Object]"
      if (userData === "[object Object]") {
        // Create a basic user object with the ID
        user = { id: userId, name: "User", email: email }
        console.log("Created recovery user object:", user)

        // Fix the data in Redis for future requests
        await redis.set(`user:${userId}`, JSON.stringify(user))
        console.log("Fixed user data in Redis")
      } else {
        return NextResponse.json({ error: "Invalid user data format" }, { status: 500 })
      }
    }

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

    console.log(`Session created: ${sessionId}`)

    // Set session cookie
    cookies().set("session_id", sessionId, {
      httpOnly: true,
      expires: new Date(expires),
      path: "/",
    })

    console.log("Login successful")

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name || "User", email: user.email || email },
    })
  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 })
  }
}
