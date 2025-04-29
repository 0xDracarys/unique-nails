import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import redis from "@/lib/redis"
import { adminMiddleware } from "../middleware"

interface Link {
  id: string
  title: string
  url: string
  category: string
  createdAt: number
}

// Get all links
export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const linkKeys = await redis.keys("link:*")

    const links = []
    for (const key of linkKeys) {
      const linkData = await redis.get(key)
      if (linkData) {
        links.push(JSON.parse(linkData as string))
      }
    }

    // Sort by creation date (newest first)
    links.sort((a, b) => b.createdAt - a.createdAt)

    return NextResponse.json({ links })
  } catch (error) {
    console.error("Get links error:", error)
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 })
  }
}

// Create a new link
export async function POST(request: NextRequest) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const { title, url, category } = await request.json()

    // Validate required fields
    if (!title || !url || !category) {
      return NextResponse.json({ error: "Title, URL, and category are required" }, { status: 400 })
    }

    const linkId = uuidv4()
    const timestamp = Date.now()

    const link: Link = {
      id: linkId,
      title,
      url,
      category,
      createdAt: timestamp,
    }

    // Store link
    await redis.set(`link:${linkId}`, JSON.stringify(link))

    // Add to inspiration links set
    await redis.sadd("inspiration-links", linkId)

    return NextResponse.json(link)
  } catch (error) {
    console.error("Create link error:", error)
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
  }
}
