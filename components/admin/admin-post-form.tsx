"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Save, X, ImageIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Post {
  id: string
  title: string
  link: string
  imageUrl: string
  creatorId: string
  creatorName: string
  createdAt: number
}

interface User {
  id: string
  name: string
  email: string
}

interface AdminPostFormProps {
  post?: Post
  onSave: (post: Post) => void
  onCancel: () => void
}

export default function AdminPostForm({ post, onSave, onCancel }: AdminPostFormProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [link, setLink] = useState(post?.link || "")
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || "")
  const [creatorId, setCreatorId] = useState(post?.creatorId || "")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingUsers, setIsFetchingUsers] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Fetch users for the dropdown
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users")
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch users",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsFetchingUsers(false)
      }
    }

    fetchUsers()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!link.trim()) {
      newErrors.link = "Link is required"
    } else if (!isValidUrl(link)) {
      newErrors.link = "Please enter a valid URL"
    }

    if (!imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required"
    } else if (!isValidUrl(imageUrl)) {
      newErrors.imageUrl = "Please enter a valid image URL"
    }

    if (!post && !creatorId.trim()) {
      newErrors.creatorId = "Creator is required"
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
      if (post) {
        // Update existing post
        const response = await fetch(`/api/admin/posts/${post.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            link,
            imageUrl,
          }),
        })

        if (response.ok) {
          const updatedPost = await response.json()
          onSave(updatedPost)
        } else {
          const data = await response.json()
          toast({
            title: "Error",
            description: data.error || "Failed to update post",
            variant: "destructive",
          })
        }
      } else {
        // Create new post
        const response = await fetch("/api/admin/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            link,
            imageUrl,
            creatorId,
          }),
        })

        if (response.ok) {
          const newPost = await response.json()
          onSave(newPost)
        } else {
          const data = await response.json()
          toast({
            title: "Error",
            description: data.error || "Failed to create post",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error saving post:", error)
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
          {post ? "Edit Post" : "Add New Post"}
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
            placeholder="Enter post title"
            className={`bg-slate-800/50 border ${
              errors.title ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="link" className="text-sm text-purple-100 block">
            Link URL
          </label>
          <input
            id="link"
            type="url"
            placeholder="https://example.com"
            className={`bg-slate-800/50 border ${
              errors.link ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          {errors.link && <p className="text-xs text-red-400 mt-1">{errors.link}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="imageUrl" className="text-sm text-purple-100 block">
            Image URL
          </label>
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                className={`bg-slate-800/50 border ${
                  errors.imageUrl ? "border-red-500" : "border-amber-500/30"
                } rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {errors.imageUrl && <p className="text-xs text-red-400 mt-1">{errors.imageUrl}</p>}
            </div>
            {imageUrl && (
              <div className="h-12 w-12 rounded-lg bg-slate-700 overflow-hidden">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                  }}
                />
              </div>
            )}
            {!imageUrl && (
              <div className="h-12 w-12 rounded-lg bg-slate-700 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-slate-500" />
              </div>
            )}
          </div>
        </div>

        {!post && (
          <div className="space-y-2">
            <label htmlFor="creatorId" className="text-sm text-purple-100 block">
              Creator
            </label>
            <select
              id="creatorId"
              className={`bg-slate-800/50 border ${
                errors.creatorId ? "border-red-500" : "border-amber-500/30"
              } rounded-lg py-3 px-4 w-full text-white focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
              value={creatorId}
              onChange={(e) => setCreatorId(e.target.value)}
              disabled={isFetchingUsers}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {errors.creatorId && <p className="text-xs text-red-400 mt-1">{errors.creatorId}</p>}
            {isFetchingUsers && <p className="text-xs text-purple-300 mt-1">Loading users...</p>}
          </div>
        )}

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
                Save Post
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
