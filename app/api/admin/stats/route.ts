import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import { adminMiddleware } from "../middleware"

export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    // Get user count
    const userKeys = await redis.keys("user:*")
    const userCount = userKeys.filter((key) => !key.includes("user:email:") && !key.includes("user:auth:")).length

    // Get design count
    const designKeys = await redis.keys("design:*")
    const designCount = designKeys.length

    // Get post count
    const postKeys = await redis.keys("post:*")
    const postCount = postKeys.length

    // Get link count
    const links = await redis.smembers("inspiration-links")
    const linkCount = links.length

    return NextResponse.json({
      users: userCount,
      designs: designCount,
      posts: postCount,
      links: linkCount,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
