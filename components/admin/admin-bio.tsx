"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Bio {
  title: string
  tagline: string
  content: string
  updatedAt: number
}

export default function AdminBio() {
  const [bio, setBio] = useState<Bio>({
    title: "Unique Nails",
    tagline: "Unique, That's What You Are",
    content: "",
    updatedAt: Date.now(),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchBio()
  }, [])

  const fetchBio = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/bio")
      if (response.ok) {
        const data = await response.json()
        setBio(data)
      }
    } catch (error) {
      console.error("Error fetching bio:", error)
      toast({
        title: "Error",
        description: "Failed to fetch bio content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!bio.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!bio.tagline.trim()) {
      newErrors.tagline = "Tagline is required"
    }

    if (!bio.content.trim()) {
      newErrors.content = "Content is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSaving(true)

    try {
      const response = await fetch("/api/admin/bio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bio,
          updatedAt: Date.now(),
        }),
      })

      if (response.ok) {
        const updatedBio = await response.json()
        setBio(updatedBio)
        toast({
          title: "Success",
          description: "Bio updated successfully",
          variant: "default",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to update bio",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving bio:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-400 mb-6">
        Edit Bio Content
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm text-purple-100 block">
            Title
          </label>
          <input
            id="title"
            type="text"
            className={`bg-slate-800/50 border ${
              errors.title ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={bio.title}
            onChange={(e) => setBio({ ...bio, title: e.target.value })}
          />
          {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="tagline" className="text-sm text-purple-100 block">
            Tagline
          </label>
          <input
            id="tagline"
            type="text"
            className={`bg-slate-800/50 border ${
              errors.tagline ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={bio.tagline}
            onChange={(e) => setBio({ ...bio, tagline: e.target.value })}
          />
          {errors.tagline && <p className="text-xs text-red-400 mt-1">{errors.tagline}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm text-purple-100 block">
            Bio Content
          </label>
          <textarea
            id="content"
            rows={12}
            className={`bg-slate-800/50 border ${
              errors.content ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={bio.content}
            onChange={(e) => setBio({ ...bio, content: e.target.value })}
          />
          {errors.content && <p className="text-xs text-red-400 mt-1">{errors.content}</p>}
          <p className="text-xs text-purple-300 mt-1">
            You can use Markdown formatting for rich text. Line breaks will be preserved.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <motion.button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-500 rounded-lg text-white shadow-lg shadow-amber-500/20 flex items-center"
            disabled={isSaving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Bio
              </>
            )}
          </motion.button>
        </div>
      </form>

      <div className="mt-8 pt-8 border-t border-amber-500/20">
        <h3 className="text-lg font-medium text-white mb-4">Preview</h3>
        <div className="bg-slate-900/50 rounded-lg p-6 border border-purple-500/20">
          <h1 className="text-2xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-400 mb-2">
            {bio.title}
          </h1>
          <p className="text-lg italic text-purple-300 mb-6">{bio.tagline}</p>
          <div className="prose prose-invert max-w-none">
            {bio.content.split("\n").map((paragraph, index) => (
              <p key={index} className="text-purple-100 mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
