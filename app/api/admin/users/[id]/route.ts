import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import { adminMiddleware } from "../../middleware"

// Get a specific user
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const userId = params.id
    const userData = await redis.get(`user:${userId}`)

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(JSON.parse(userData as string))
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// Update a user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const userId = params.id
    const { name, email, password } = await request.json()

    // Get existing user
    const userData = await redis.get(`user:${userId}`)
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = JSON.parse(userData as string)

    // Check if email is being changed and if it's already in use
    if (email !== user.email) {
      const existingUserId = await redis.get(`user:email:${email}`)
      if (existingUserId && existingUserId !== userId) {
        return NextResponse.json({ error: "Email is already in use" }, { status: 400 })
      }

      // Update email index
      await redis.del(`user:email:${user.email}`)
      await redis.set(`user:email:${email}`, userId)
    }

    // Update user data
    const updatedUser = {
      ...user,
      name: name || user.name,
      email: email || user.email,
    }

    await redis.set(`user:${userId}`, JSON.stringify(updatedUser))

    // Update password if provided
    if (password) {
      await redis.set(`user:auth:${userId}`, password)
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

// Delete a user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const userId = params.id

    // Get user data to find email
    const userData = await redis.get(`user:${userId}`)
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = JSON.parse(userData as string)

    // Delete user data
    await redis.del(`user:${userId}`)
    await redis.del(`user:email:${user.email}`)
    await redis.del(`user:auth:${userId}`)

    // Delete user's designs
    if (user.designs && user.designs.length > 0) {
      for (const designId of user.designs) {
        await redis.del(`design:${designId}`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
