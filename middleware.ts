import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"

export async function middleware(request: NextRequest) {
  // Skip authentication for public routes
  if (
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/fonts") ||
    request.nextUrl.pathname.startsWith("/assets")
  ) {
    return NextResponse.next()
  }

  const sessionId = request.cookies.get("session_id")?.value

  if (!sessionId) {
    // Redirect to login if no session
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }

  // Verify session
  const sessionData = await redis.get(`session:${sessionId}`)
  if (!sessionData) {
    // Invalid session
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }

  const session = JSON.parse(sessionData as string)

  // Check if session is expired
  if (session.expires < Date.now()) {
    // Expired session
    await redis.del(`session:${sessionId}`)
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
