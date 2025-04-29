"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Eye, EyeOff, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showTestCredentials, setShowTestCredentials] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  // Set test credentials for development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setShowTestCredentials(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log(`Attempting to sign in with email: ${email}`)
      const result = await signIn(email, password)

      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
          variant: "default",
        })
        router.push("/profile")
      } else {
        console.error("Sign in failed:", result.error)
        toast({
          title: "Sign in failed",
          description: result.error || "Please check your credentials and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Sign in submission error:", error)
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const useTestCredentials = () => {
    setEmail("test@example.com")
    setPassword("password123")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
      {/* Static stars background (no animations to reduce lag) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
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
      </div>

      <Link
        href="/"
        className="absolute top-6 left-6 text-white hover:text-amber-300 transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="relative backdrop-blur-lg bg-slate-900/60 rounded-2xl p-8 border border-amber-500/20 shadow-xl">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-purple-500 rounded-2xl opacity-20 blur-sm"></div>
          <div className="relative">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-400">
                Welcome Back
              </h1>
              <p className="text-purple-200/80 mt-2">Sign in to your cosmic account</p>
            </div>

            {showTestCredentials && (
              <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-200">
                      <strong>Test Account:</strong>
                    </p>
                    <p className="text-xs text-amber-200/80 mt-1">
                      Email: test@example.com
                      <br />
                      Password: password123
                    </p>
                    <button
                      type="button"
                      onClick={useTestCredentials}
                      className="text-xs text-amber-400 hover:text-amber-300 mt-2 underline"
                    >
                      Use test credentials
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-purple-100">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-slate-800/50 border-amber-500/30 rounded-lg py-6 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20 transition-all shadow-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm text-purple-100">
                    Password
                  </Label>
                  <Link href="#" className="text-xs text-amber-400 hover:text-amber-300 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="bg-slate-800/50 border-amber-500/30 rounded-lg py-6 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20 transition-all shadow-md pr-10"
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

              <Button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-600 hover:to-purple-600 rounded-lg text-white font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-purple-200/70">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="text-amber-400 hover:text-amber-300 hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
