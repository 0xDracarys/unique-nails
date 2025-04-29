import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import { getUserFromSession } from "@/lib/auth"

// Like or unlike a design
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if user has already liked this design
    const likeKey = `like:${designId}:${user.id}`
    const hasLiked = await redis.exists(likeKey)

    if (hasLiked) {
      // Unlike
      await redis.del(likeKey)
      design.likes = Math.max(0, design.likes - 1)
    } else {
      // Like
      await redis.set(likeKey, Date.now())
      design.likes += 1
    }

    await redis.set(`design:${designId}`, JSON.stringify(design))

    return NextResponse.json({
      success: true,
      liked: !hasLiked,
      likes: design.likes,
    })
  } catch (error) {
    console.error("Like design error:", error)
    return NextResponse.json({ error: "Failed to like design" }, { status: 500 })
  }
}
