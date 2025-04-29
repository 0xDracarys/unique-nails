import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import { adminMiddleware } from "../../middleware"

// Get a specific design
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const designId = params.id
    const designData = await redis.get(`design:${designId}`)

    if (!designData) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    return NextResponse.json(JSON.parse(designData as string))
  } catch (error) {
    console.error("Get design error:", error)
    return NextResponse.json({ error: "Failed to fetch design" }, { status: 500 })
  }
}

// Update a design
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const designId = params.id
    const { name, type, fingerDesigns, public: isPublic } = await request.json()

    // Get existing design
    const designData = await redis.get(`design:${designId}`)
    if (!designData) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    const design = JSON.parse(designData as string)

    // Update design data
    const updatedDesign = {
      ...design,
      name: name || design.name,
      type: type || design.type,
      fingerDesigns: fingerDesigns || design.fingerDesigns,
      public: isPublic !== undefined ? isPublic : design.public,
      updatedAt: Date.now(),
    }

    await redis.set(`design:${designId}`, JSON.stringify(updatedDesign))

    return NextResponse.json(updatedDesign)
  } catch (error) {
    console.error("Update design error:", error)
    return NextResponse.json({ error: "Failed to update design" }, { status: 500 })
  }
}

// Delete a design
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const designId = params.id

    // Get design data to find user
    const designData = await redis.get(`design:${designId}`)
    if (!designData) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    const design = JSON.parse(designData as string)

    // Delete design
    await redis.del(`design:${designId}`)

    // Remove design from user's designs
    const userData = await redis.get(`user:${design.userId}`)
    if (userData) {
      const user = JSON.parse(userData as string)
      user.designs = user.designs.filter((id: string) => id !== designId)
      await redis.set(`user:${design.userId}`, JSON.stringify(user))
    }

    // Remove from design list
    await redis.lrem("design-ids", 0, designId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete design error:", error)
    return NextResponse.json({ error: "Failed to delete design" }, { status: 500 })
  }
}
