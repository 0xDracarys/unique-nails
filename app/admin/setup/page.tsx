"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function AdminSetup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [setupKey, setSetupKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSetup, setIsSetup] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is already set up
    const checkSetup = async () => {
      try {
        const res = await fetch("/api/admin/setup")
        const data = await res.json()

        setIsSetup(data.isSetup)

        if (data.isSetup) {
          // Redirect to login if already set up
          setTimeout(() => {
            router.push("/admin/login")
          }, 2000)
        }
      } catch (err) {
        console.error("Failed to check admin setup:", err)
        setError("Failed to check if admin is set up")
      }
    }

    checkSetup()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, setupKey }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to set up admin account")
      }

      // Success - redirect to login
      router.push("/admin/login")
    } catch (err: any) {
      setError(err.message || "An error occurred during setup")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSetup === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4">Checking setup status...</p>
        </div>
      </div>
    )
  }

  if (isSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center p-8 rounded-lg bg-opacity-20 bg-purple-900 backdrop-blur-lg">
          <h1 className="text-2xl font-bold mb-4">Admin Already Set Up</h1>
          <p className="mb-4">The admin account has already been configured.</p>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden relative">
      {/* Cosmic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md p-8 rounded-lg bg-opacity-20 bg-purple-900 backdrop-blur-lg border border-purple-500/30"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500">
            Admin Setup
          </h1>
          <p className="text-gray-300 mt-2">Create your admin account for Unique Nails</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-white text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-black/50 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="admin@uniquenails.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-black/50 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Minimum 8 characters"
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="setupKey" className="block text-sm font-medium text-gray-300 mb-1">
              Setup Key
            </label>
            <input
              id="setupKey"
              type="password"
              value={setupKey}
              onChange={(e) => setSetupKey(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-black/50 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter setup key"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-md bg-gradient-to-r from-amber-500 to-purple-600 text-white font-medium hover:from-amber-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Setting Up...
              </span>
            ) : (
              "Create Admin Account"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
