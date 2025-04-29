"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Save, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Link {
  id: string
  title: string
  url: string
  category: string
  createdAt: number
}

interface AdminLinkFormProps {
  link?: Link
  onSave: (link: Link) => void
  onCancel: () => void
}

export default function AdminLinkForm({ link, onSave, onCancel }: AdminLinkFormProps) {
  const [title, setTitle] = useState(link?.title || "")
  const [url, setUrl] = useState(link?.url || "")
  const [category, setCategory] = useState(link?.category || "")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = ["Inspiration", "Tutorial", "Product", "Gallery", "Social Media", "Other"]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!url.trim()) {
      newErrors.url = "URL is required"
    } else if (!isValidUrl(url)) {
      newErrors.url = "Please enter a valid URL"
    }

    if (!category.trim()) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      if (link) {
        // Update existing link
        const response = await fetch(`/api/admin/links/${link.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            url,
            category,
          }),
        })

        if (response.ok) {
          const updatedLink = await response.json()
          onSave(updatedLink)
        } else {
          const data = await response.json()
          toast({
            title: "Error",
            description: data.error || "Failed to update link",
            variant: "destructive",
          })
        }
      } else {
        // Create new link
        const response = await fetch("/api/admin/links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            url,
            category,
          }),
        })

        if (response.ok) {
          const newLink = await response.json()
          onSave(newLink)
        } else {
          const data = await response.json()
          toast({
            title: "Error",
            description: data.error || "Failed to create link",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error saving link:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-400">
          {link ? "Edit Link" : "Add New Link"}
        </h2>
        <motion.button
          className="p-2 rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white"
          onClick={onCancel}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-5 w-5" />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm text-purple-100 block">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter link title"
            className={`bg-slate-800/50 border ${
              errors.title ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="url" className="text-sm text-purple-100 block">
            URL
          </label>
          <input
            id="url"
            type="url"
            placeholder="https://example.com"
            className={`bg-slate-800/50 border ${
              errors.url ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {errors.url && <p className="text-xs text-red-400 mt-1">{errors.url}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm text-purple-100 block">
            Category
          </label>
          <select
            id="category"
            className={`bg-slate-800/50 border ${
              errors.category ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <motion.button
            type="button"
            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50"
            onClick={onCancel}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-500 rounded-lg text-white shadow-lg shadow-amber-500/20 flex items-center"
            disabled={isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Link
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
