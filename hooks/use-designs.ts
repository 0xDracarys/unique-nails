"use client"

import { useState } from "react"
import type { Design } from "@/types"

export function useDesigns() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDesigns = async (options?: {
    page?: number
    limit?: number
    type?: string
    userId?: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (options?.page) params.append("page", options.page.toString())
      if (options?.limit) params.append("limit", options.limit.toString())
      if (options?.type) params.append("type", options.type)
      if (options?.userId) params.append("userId", options.userId)

      const res = await fetch(`/api/designs?${params.toString()}`)

      if (!res.ok) {
        throw new Error("Failed to fetch designs")
      }

      const data = await res.json()
      setDesigns(data.designs)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return { designs: [], total: 0 }
    } finally {
      setLoading(false)
    }
  }

  const fetchDesign = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/designs/${id}`)

      if (!res.ok) {
        throw new Error("Failed to fetch design")
      }

      const design = await res.json()
      return design
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return null
    } finally {
      setLoading(false)
    }
  }

  const createDesign = async (designData: {
    name: string
    type: string
    fingerDesigns: Record<number, string>
    public?: boolean
  }) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(designData),
      })

      if (!res.ok) {
        throw new Error("Failed to create design")
      }

      const data = await res.json()
      return data.design
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateDesign = async (
    id: string,
    designData: Partial<{
      name: string
      type: string
      fingerDesigns: Record<number, string>
      public: boolean
    }>,
  ) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/designs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(designData),
      })

      if (!res.ok) {
        throw new Error("Failed to update design")
      }

      const data = await res.json()
      return data.design
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteDesign = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/designs/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete design")
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return false
    } finally {
      setLoading(false)
    }
  }

  const likeDesign = async (id: string) => {
    try {
      const res = await fetch(`/api/designs/${id}/like`, {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Failed to like design")
      }

      const data = await res.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return { success: false }
    }
  }

  return {
    designs,
    loading,
    error,
    fetchDesigns,
    fetchDesign,
    createDesign,
    updateDesign,
    deleteDesign,
    likeDesign,
  }
}
