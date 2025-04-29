"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [adminNotSetup, setAdminNotSetup] = useState(false)

  // Shooting stars effect
  const shootingStars = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 10,
    duration: Math.random() * 3 + 2,
    top: Math.random() * 100,
    left: Math.random() * 100,
    angle: Math.random() * 45 + 15,
  }))

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Login successful",
          description: "Welcome to the Unique Nails admin panel",
          variant: "default",
        })
        router.push("/admin")
      } else {
        toast({
          title: "Login failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const checkAdminSetup = async () => {
      try {
        const res = await fetch("/api/admin/setup")
        const data = await res.json()

        if (!data.isSetup) {
          setAdminNotSetup(true)
        }
      } catch (err) {
        console.error("Failed to check admin setup:", err)
      }
    }

    checkAdminSetup()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <div
            key={`shooting-${star.id}`}
            className="absolute"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: 0,
              animation: `shootingStar ${star.duration}s linear ${star.delay}s infinite`,
              transform: `rotate(${star.angle}deg)`,
            }}
          >
            <div
              className="w-[100px] h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-white"
              style={{
                boxShadow: "0 0 3px rgba(255, 255, 255, 0.7)",
              }}
            />
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="relative backdrop-blur-lg bg-slate-900/60 rounded-2xl p-8 border border-amber-500/20 shadow-xl">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-purple-500 rounded-2xl opacity-20 blur-sm"></div>
          <div className="relative">
            <div className="text-center mb-8">
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Lock className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-400">
                Admin Access
              </h1>
              <p className="text-purple-200/80 mt-2">Unique Nails Management System</p>
            </div>

            {adminNotSetup && (
              <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500/50 rounded-md text-white text-sm">
                Admin account not set up.{" "}
                <a href="/admin/setup" className="underline hover:text-amber-300">
                  Set up now
                </a>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-purple-100 block">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@uniquenails.com"
                    className="bg-slate-800/50 border border-amber-500/30 rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-purple-100 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="bg-slate-800/50 border border-amber-500/30 rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-600 hover:to-purple-600 rounded-lg text-white font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Authenticating...
                  </span>
                ) : (
                  "Access Admin Panel"
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
