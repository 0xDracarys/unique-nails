import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import { adminMiddleware } from "../../middleware"

// Get a specific link
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const linkId = params.id
    const linkData = await redis.get(`link:${linkId}`)

    if (!linkData) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    return NextResponse.json(JSON.parse(linkData as string))
  } catch (error) {
    console.error("Get link error:", error)
    return NextResponse.json({ error: "Failed to fetch link" }, { status: 500 })
  }
}

// Update a link
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const linkId = params.id
    const { title, url, category } = await request.json()

    // Get existing link
    const linkData = await redis.get(`link:${linkId}`)
    if (!linkData) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    const link = JSON.parse(linkData as string)

    // Update link data
    const updatedLink = {
      ...link,
      title: title || link.title,
      url: url || link.url,
      category: category || link.category,
    }

    await redis.set(`link:${linkId}`, JSON.stringify(updatedLink))

    return NextResponse.json(updatedLink)
  } catch (error) {
    console.error("Update link error:", error)
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 })
  }
}

// Delete a link
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const linkId = params.id

    // Get link data to confirm it exists
    const linkData = await redis.get(`link:${linkId}`)
    if (!linkData) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    // Delete link
    await redis.del(`link:${linkId}`)

    // Remove from inspiration links set
    await redis.srem("inspiration-links", linkId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete link error:", error)
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 })
  }
}
