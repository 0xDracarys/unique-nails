import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import { adminMiddleware } from "../../../middleware"

// Feature or unfeature a design
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const designId = params.id

    // Get design data
    const designData = await redis.get(`design:${designId}`)
    if (!designData) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    const design = JSON.parse(designData as string)

    // Toggle featured status
    const isFeatured = design.type === "featured"
    const originalType = design.originalType || design.type

    const updatedDesign = {
      ...design,
      type: isFeatured ? originalType : "featured",
      originalType: isFeatured ? undefined : originalType,
      updatedAt: Date.now(),
    }

    await redis.set(`design:${designId}`, JSON.stringify(updatedDesign))

    return NextResponse.json(updatedDesign)
  } catch (error) {
    console.error("Feature design error:", error)
    return NextResponse.json({ error: "Failed to feature design" }, { status: 500 })
  }
}
