import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import { adminMiddleware } from "../middleware"

export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    // Get recent users
    const userKeys = await redis.keys("user:*")
    const filteredUserKeys = userKeys.filter((key) => !key.includes("user:email:") && !key.includes("user:auth:"))

    const recentUsers = []
    for (let i = 0; i < Math.min(5, filteredUserKeys.length); i++) {
      const userData = await redis.get(filteredUserKeys[i])
      if (userData) {
        recentUsers.push(JSON.parse(userData as string))
      }
    }

    // Get popular designs
    const designKeys = await redis.keys("design:*")
    const popularDesigns = []

    for (let i = 0; i < Math.min(5, designKeys.length); i++) {
      const designData = await redis.get(designKeys[i])
      if (designData) {
        popularDesigns.push(JSON.parse(designData as string))
      }
    }

    // Sort by likes
    popularDesigns.sort((a, b) => b.likes - a.likes)

    return NextResponse.json({
      recentUsers,
      popularDesigns: popularDesigns.slice(0, 5),
    })
  } catch (error) {
    console.error("Dashboard data error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
