import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import redis from "@/lib/redis"
import { adminMiddleware } from "../middleware"
import type { Design } from "@/types"

// Get all designs
export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const designKeys = await redis.keys("design:*")

    const designs = []
    for (const key of designKeys) {
      const designData = await redis.get(key)
      if (designData) {
        designs.push(JSON.parse(designData as string))
      }
    }

    // Sort by creation date (newest first)
    designs.sort((a, b) => b.createdAt - a.createdAt)

    return NextResponse.json({ designs })
  } catch (error) {
    console.error("Get designs error:", error)
    return NextResponse.json({ error: "Failed to fetch designs" }, { status: 500 })
  }
}

// Create a new design
export async function POST(request: NextRequest) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const { name, type, userId, fingerDesigns, public: isPublic = true } = await request.json()

    // Validate required fields
    if (!name || !type || !userId) {
      return NextResponse.json({ error: "Name, type, and userId are required" }, { status: 400 })
    }

    // Check if user exists
    const userData = await redis.get(`user:${userId}`)
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = JSON.parse(userData as string)

    const designId = uuidv4()
    const timestamp = Date.now()

    const design: Design = {
      id: designId,
      name,
      type,
      createdAt: timestamp,
      updatedAt: timestamp,
      userId,
      userName: user.name,
      likes: 0,
      fingerDesigns: fingerDesigns || {},
      public: isPublic,
    }

    // Store design
    await redis.set(`design:${designId}`, JSON.stringify(design))

    // Add design to user's designs
    user.designs.push(designId)
    await redis.set(`user:${userId}`, JSON.stringify(user))

    // Add to design list
    await redis.rpush("design-ids", designId)

    return NextResponse.json(design)
  } catch (error) {
    console.error("Create design error:", error)
    return NextResponse.json({ error: "Failed to create design" }, { status: 500 })
  }
}
