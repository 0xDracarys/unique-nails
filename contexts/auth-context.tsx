"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Sending sign-in request with:", { email, password: "***" })

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      console.log("Sign-in response status:", res.status)

      // Check if the response is ok before trying to parse JSON
      if (!res.ok) {
        let errorMessage = `Failed to sign in: ${res.status}`
        try {
          const errorData = await res.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }
        return { success: false, error: errorMessage }
      }

      // Parse the successful response
      let data
      try {
        data = await res.json()
        console.log("Sign-in response data:", { ...data, user: data.user ? "User object present" : "No user" })
      } catch (parseError) {
        console.error("Error parsing success response:", parseError)
        return { success: false, error: "Invalid response from server" }
      }

      if (!data || !data.user) {
        console.error("Invalid response data:", data)
        return { success: false, error: "Invalid response from server" }
      }

      setUser(data.user)
      return { success: true }
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      // Check if the response is ok before trying to parse JSON
      if (!res.ok) {
        let errorMessage = `Failed to sign up: ${res.status}`
        try {
          const errorData = await res.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }
        return { success: false, error: errorMessage }
      }

      // Parse the successful response
      let data
      try {
        data = await res.json()
      } catch (parseError) {
        console.error("Error parsing success response:", parseError)
        return { success: false, error: "Invalid response from server" }
      }

      if (!data || !data.user) {
        return { success: false, error: "Invalid response from server" }
      }

      setUser(data.user)
      return { success: true }
    } catch (error) {
      console.error("Sign up error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" })
      setUser(null)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
