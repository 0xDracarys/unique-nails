import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import redis from "@/lib/redis"
import type { Design } from "@/types"
import { getUserFromSession } from "@/lib/auth"

// Get all designs (with pagination)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const type = searchParams.get("type")
    const userId = searchParams.get("userId")

    // Get all design IDs - ensure we get an array back from Redis
    const designKeysResult = await redis.keys("design:*")

    // Make sure designKeys is an array
    const designKeys = Array.isArray(designKeysResult) ? designKeysResult : []
    const designs: Design[] = []

    // Get design data for each ID
    for (const key of designKeys) {
      if (!key.startsWith("design:")) continue
      const designData = await redis.get(key)
      if (designData) {
        const design = JSON.parse(designData as string) as Design

        // Filter by type if specified
        if (type && design.type !== type) continue

        // Filter by userId if specified
        if (userId && design.userId !== userId) continue

        // Only include public designs or user's own designs
        if (design.public) {
          designs.push(design)
        }
      }
    }

    // Sort by creation date (newest first)
    designs.sort((a, b) => b.createdAt - a.createdAt)

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const paginatedDesigns = designs.slice(startIndex, endIndex)

    return NextResponse.json({
      designs: paginatedDesigns,
      total: designs.length,
      page,
      limit,
      totalPages: Math.ceil(designs.length / limit),
    })
  } catch (error) {
    console.error("Get designs error:", error)
    return NextResponse.json({ error: "Failed to fetch designs" }, { status: 500 })
  }
}

// Create a new design
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, type, fingerDesigns, public: isPublic = true } = await request.json()

    const designId = uuidv4()
    const timestamp = Date.now()

    const design: Design = {
      id: designId,
      name,
      type,
      createdAt: timestamp,
      updatedAt: timestamp,
      userId: user.id,
      userName: user.name,
      likes: 0,
      fingerDesigns,
      public: isPublic,
    }

    // Store design
    await redis.set(`design:${designId}`, JSON.stringify(design))

    // Add design to user's designs
    const userData = await redis.get(`user:${user.id}`)
    if (userData) {
      const userObj = JSON.parse(userData as string)
      userObj.designs.push(designId)
      await redis.set(`user:${user.id}`, JSON.stringify(userObj))
    }

    return NextResponse.json({ success: true, design })
  } catch (error) {
    console.error("Create design error:", error)
    return NextResponse.json({ error: "Failed to create design" }, { status: 500 })
  }
}
