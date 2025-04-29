import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import { adminMiddleware } from "../../middleware"

// Get a specific post
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const postId = params.id
    const postData = await redis.get(`post:${postId}`)

    if (!postData) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(JSON.parse(postData as string))
  } catch (error) {
    console.error("Get post error:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

// Update a post
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const postId = params.id
    const { title, link, imageUrl } = await request.json()

    // Get existing post
    const postData = await redis.get(`post:${postId}`)
    if (!postData) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const post = JSON.parse(postData as string)

    // Update post data
    const updatedPost = {
      ...post,
      title: title || post.title,
      link: link || post.link,
      imageUrl: imageUrl || post.imageUrl,
    }

    await redis.set(`post:${postId}`, JSON.stringify(updatedPost))

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Update post error:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

// Delete a post
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const postId = params.id

    // Get post data to confirm it exists
    const postData = await redis.get(`post:${postId}`)
    if (!postData) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Delete post
    await redis.del(`post:${postId}`)

    // Remove from post list
    await redis.lrem("post-ids", 0, postId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
