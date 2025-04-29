import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"

// Get public links
export async function GET(request: NextRequest) {
  try {
    const linkIds = await redis.smembers("inspiration-links")

    const links = []
    for (const id of linkIds) {
      const linkData = await redis.get(`link:${id}`)
      if (linkData) {
        links.push(JSON.parse(linkData as string))
      }
    }

    // Sort by creation date (newest first)
    links.sort((a, b) => b.createdAt - a.createdAt)

    return NextResponse.json({ links })
  } catch (error) {
    console.error("Get public links error:", error)
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 })
  }
}
