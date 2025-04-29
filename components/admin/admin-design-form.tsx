"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Save, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Design {
  id: string
  name: string
  type: string
  createdAt: number
  updatedAt: number
  userId: string
  userName: string
  likes: number
  fingerDesigns: Record<number, string>
  public: boolean
}

interface User {
  id: string
  name: string
  email: string
}

interface AdminDesignFormProps {
  design?: Design
  onSave: (design: Design) => void
  onCancel: () => void
}

export default function AdminDesignForm({ design, onSave, onCancel }: AdminDesignFormProps) {
  const [name, setName] = useState(design?.name || "")
  const [type, setType] = useState(design?.type || "galaxy")
  const [userId, setUserId] = useState(design?.userId || "")
  const [isPublic, setIsPublic] = useState(design?.public !== false)
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

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!type.trim()) {
      newErrors.type = "Type is required"
    }

    if (!userId.trim()) {
      newErrors.userId = "Creator is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      if (design) {
        // Update existing design
        const response = await fetch(`/api/admin/designs/${design.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            type,
            public: isPublic,
          }),
        })

        if (response.ok) {
          const updatedDesign = await response.json()
          onSave(updatedDesign)
        } else {
          const data = await response.json()
          toast({
            title: "Error",
            description: data.error || "Failed to update design",
            variant: "destructive",
          })
        }
      } else {
        // Create new design
        const response = await fetch("/api/admin/designs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            type,
            userId,
            public: isPublic,
            fingerDesigns: { 0: type, 1: type, 2: type, 3: type, 4: type }, // Default all fingers to the same design
          }),
        })

        if (response.ok) {
          const newDesign = await response.json()
          onSave(newDesign)
        } else {
          const data = await response.json()
          toast({
            title: "Error",
            description: data.error || "Failed to create design",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error saving design:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const designTypes = [
    { value: "galaxy", label: "Galaxy" },
    { value: "gemstone", label: "Gemstone" },
    { value: "holographic", label: "Holographic" },
    { value: "floral", label: "Floral" },
    { value: "featured", label: "Featured" },
  ]

  return (
    <motion.div
      className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-400">
          {design ? "Edit Design" : "Add New Design"}
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
          <label htmlFor="name" className="text-sm text-purple-100 block">
            Design Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter design name"
            className={`bg-slate-800/50 border ${
              errors.name ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-sm text-purple-100 block">
            Design Type
          </label>
          <select
            id="type"
            className={`bg-slate-800/50 border ${
              errors.type ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {designTypes.map((designType) => (
              <option key={designType.value} value={designType.value}>
                {designType.label}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-xs text-red-400 mt-1">{errors.type}</p>}
        </div>

        {!design && (
          <div className="space-y-2">
            <label htmlFor="userId" className="text-sm text-purple-100 block">
              Creator
            </label>
            <select
              id="userId"
              className={`bg-slate-800/50 border ${
                errors.userId ? "border-red-500" : "border-amber-500/30"
              } rounded-lg py-3 px-4 w-full text-white focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isFetchingUsers}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {errors.userId && <p className="text-xs text-red-400 mt-1">{errors.userId}</p>}
            {isFetchingUsers && <p className="text-xs text-purple-300 mt-1">Loading users...</p>}
          </div>
        )}

        <div className="flex items-center">
          <input
            id="isPublic"
            type="checkbox"
            className="h-4 w-4 rounded border-amber-500/30 text-amber-500 focus:ring-amber-500/20"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label htmlFor="isPublic" className="ml-2 text-sm text-purple-100">
            Make this design public
          </label>
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
                Save Design
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
