import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import redis from "@/lib/redis"
import { adminMiddleware } from "../middleware"

interface Post {
  id: string
  title: string
  link: string
  imageUrl: string
  creatorId: string
  creatorName: string
  createdAt: number
}

// Get all posts
export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

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
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// Create a new post
export async function POST(request: NextRequest) {
  // Check admin authentication
  const authResponse = await adminMiddleware(request)
  if (authResponse) return authResponse

  try {
    const { title, link, imageUrl, creatorId } = await request.json()

    // Validate required fields
    if (!title || !link || !imageUrl || !creatorId) {
      return NextResponse.json({ error: "Title, link, image URL, and creator ID are required" }, { status: 400 })
    }

    // Check if user exists
    const userData = await redis.get(`user:${creatorId}`)
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = JSON.parse(userData as string)

    const postId = uuidv4()
    const timestamp = Date.now()

    const post: Post = {
      id: postId,
      title,
      link,
      imageUrl,
      creatorId,
      creatorName: user.name,
      createdAt: timestamp,
    }

    // Store post
    await redis.set(`post:${postId}`, JSON.stringify(post))

    // Add to post list
    await redis.rpush("post-ids", postId)

    return NextResponse.json(post)
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
