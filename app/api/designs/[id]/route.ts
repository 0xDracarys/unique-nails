import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import { getUserFromSession } from "@/lib/auth"

// Get a specific design
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const designId = params.id
    const designData = await redis.get(`design:${designId}`)

    if (!designData) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    const design = JSON.parse(designData as string)

    // Check if design is public or belongs to the current user
    const user = await getUserFromSession()
    if (!design.public && (!user || user.id !== design.userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(design)
  } catch (error) {
    console.error("Get design error:", error)
    return NextResponse.json({ error: "Failed to fetch design" }, { status: 500 })
  }
}

// Update a design
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const designId = params.id
    const designData = await redis.get(`design:${designId}`)

    if (!designData) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    const existingDesign = JSON.parse(designData as string)

    // Check if user owns the design
    if (existingDesign.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, type, fingerDesigns, public: isPublic } = await request.json()

    const updatedDesign = {
      ...existingDesign,
      name: name || existingDesign.name,
      type: type || existingDesign.type,
      fingerDesigns: fingerDesigns || existingDesign.fingerDesigns,
      public: isPublic !== undefined ? isPublic : existingDesign.public,
      updatedAt: Date.now(),
    }

    await redis.set(`design:${designId}`, JSON.stringify(updatedDesign))

    return NextResponse.json({ success: true, design: updatedDesign })
  } catch (error) {
    console.error("Update design error:", error)
    return NextResponse.json({ error: "Failed to update design" }, { status: 500 })
  }
}

// Delete a design
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromSession()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const designId = params.id
    const designData = await redis.get(`design:${designId}`)

    if (!designData) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    const design = JSON.parse(designData as string)

    // Check if user owns the design
    if (design.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete design
    await redis.del(`design:${designId}`)

    // Remove design from user's designs
    const userData = await redis.get(`user:${user.id}`)
    if (userData) {
      const userObj = JSON.parse(userData as string)
      userObj.designs = userObj.designs.filter((id: string) => id !== designId)
      await redis.set(`user:${user.id}`, JSON.stringify(userObj))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete design error:", error)
    return NextResponse.json({ error: "Failed to delete design" }, { status: 500 })
  }
}
