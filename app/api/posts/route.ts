import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"

// Get public posts
export async function GET(request: NextRequest) {
  try {
    const postKeys = await redis.keys("post:*")

    const posts = []
    for (const key of postKeys) {
      const postData = await redis.get(key)
      if (postData) {
        posts.push(JSON.parse(postData as string))
      }
    }

    // Sort by creation date (newest first)
    posts.sort((a, b) => b.createdAt - a.createdAt)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Get public posts error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
