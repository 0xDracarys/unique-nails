import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import * as bcrypt from "bcryptjs"

// This route should only be accessible during initial setup or through a secure admin process
export async function POST(request: NextRequest) {
  try {
    // Check if admin credentials already exist
    const existingAdmin = await redis.get("admin:credentials")
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin account already set up" }, { status: 400 })
    }

    const { email, password, setupKey } = await request.json()

    // Validate setup key - this should be a secure, randomly generated key
    // In production, this could be an environment variable or a one-time token
    const expectedSetupKey = process.env.ADMIN_SETUP_KEY || "unique-nails-secure-setup-key-2023"

    if (setupKey !== expectedSetupKey) {
      return NextResponse.json({ error: "Invalid setup key" }, { status: 401 })
    }

    // Validate email and password
    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        {
          error: "Invalid credentials. Email required and password must be at least 8 characters.",
        },
        { status: 400 },
      )
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Store admin credentials in Redis
    await redis.set(
      "admin:credentials",
      JSON.stringify({
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
      }),
    )

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
    })
  } catch (error) {
    console.error("Admin setup error:", error)
    return NextResponse.json({ error: "Failed to set up admin account" }, { status: 500 })
  }
}

// Allow checking if admin is set up
export async function GET() {
  try {
    const adminExists = await redis.exists("admin:credentials")
    return NextResponse.json({
      isSetup: adminExists === 1,
    })
  } catch (error) {
    console.error("Admin setup check error:", error)
    return NextResponse.json({ error: "Failed to check admin setup" }, { status: 500 })
  }
}
