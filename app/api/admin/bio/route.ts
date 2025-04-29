import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import { adminMiddleware } from "../middleware"

interface Bio {
  title: string
  tagline: string
  content: string
  updatedAt: number
}

// Get bio content
export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const bioData = await redis.get("bio")

    if (!bioData) {
      // Return default bio if none exists
      const defaultBio: Bio = {
        title: "Unique Nails",
        tagline: "Unique, That's What You Are",
        content:
          "Step into my universe with Unique Nails, where every design is a cosmic celebration of individuality. I've been painting my nails since I was a little dreamer, but my true journey began six years ago when I unwrapped a nail art kit on Christmas morning—thanks, Mum, for the best gift ever!",
        updatedAt: Date.now(),
      }

      return NextResponse.json(defaultBio)
    }

    return NextResponse.json(JSON.parse(bioData as string))
  } catch (error) {
    console.error("Get bio error:", error)
    return NextResponse.json({ error: "Failed to fetch bio" }, { status: 500 })
  }
}

// Update bio content
export async function PUT(request: NextRequest) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const { title, tagline, content } = await request.json()

    // Validate required fields
    if (!title || !tagline || !content) {
      return NextResponse.json({ error: "Title, tagline, and content are required" }, { status: 400 })
    }

    const bio: Bio = {
      title,
      tagline,
      content,
      updatedAt: Date.now(),
    }

    // Store bio
    await redis.set("bio", JSON.stringify(bio))

    return NextResponse.json(bio)
  } catch (error) {
    console.error("Update bio error:", error)
    return NextResponse.json({ error: "Failed to update bio" }, { status: 500 })
  }
}
