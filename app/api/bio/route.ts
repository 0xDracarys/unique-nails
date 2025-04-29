import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"

// Get public bio content
export async function GET(request: NextRequest) {
  try {
    const bioData = await redis.get("bio")

    if (!bioData) {
      // Return default bio if none exists
      return NextResponse.json({
        title: "Unique Nails",
        tagline: "Unique, That's What You Are",
        content:
          "Step into my universe with Unique Nails, where every design is a cosmic celebration of individuality.",
        updatedAt: Date.now(),
      })
    }

    return NextResponse.json(JSON.parse(bioData as string))
  } catch (error) {
    console.error("Get public bio error:", error)
    return NextResponse.json({ error: "Failed to fetch bio" }, { status: 500 })
  }
}
