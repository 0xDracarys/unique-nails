import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import redis from "@/lib/redis"
import { adminMiddleware } from "../middleware"
import type { User } from "@/types"

// Get all users
export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const userKeys = await redis.keys("user:*")
    const filteredUserKeys = userKeys.filter((key) => !key.includes("user:email:") && !key.includes("user:auth:"))

    const users = []
    for (const key of filteredUserKeys) {
      const userData = await redis.get(key)
      if (userData) {
        users.push(JSON.parse(userData as string))
      }
    }

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// Create a new user
export async function POST(request: NextRequest) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const { name, email, password } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await redis.get(`user:email:${email}`)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Create new user
    const userId = uuidv4()
    const timestamp = Date.now()

    const user: User = {
      id: userId,
      name,
      email,
      createdAt: timestamp,
      designs: [],
      followers: [],
      following: [],
    }

    // Store user data
    await redis.set(`user:${userId}`, JSON.stringify(user))
    await redis.set(`user:email:${email}`, userId)

    // Store password hash (in a real app, you'd hash the password)
    await redis.set(`user:auth:${userId}`, password)

    return NextResponse.json(user)
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
