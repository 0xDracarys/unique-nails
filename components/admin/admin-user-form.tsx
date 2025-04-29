"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Save, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  designs?: string[]
  followers?: string[]
  following?: string[]
  profileImage?: string
  createdAt?: number
}

interface AdminUserFormProps {
  user?: User
  onSave: (user: User) => void
  onCancel: () => void
}

export default function AdminUserForm({ user, onSave, onCancel }: AdminUserFormProps) {
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!user && !password.trim()) {
      newErrors.password = "Password is required for new users"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      if (user) {
        // Update existing user
        const response = await fetch(`/api/admin/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password: password || undefined, // Only send password if it's provided
          }),
        })

        if (response.ok) {
          const updatedUser = await response.json()
          onSave(updatedUser)
        } else {
          const data = await response.json()
          toast({
            title: "Error",
            description: data.error || "Failed to update user",
            variant: "destructive",
          })
        }
      } else {
        // Create new user
        const response = await fetch("/api/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        })

        if (response.ok) {
          const newUser = await response.json()
          onSave(newUser)
        } else {
          const data = await response.json()
          toast({
            title: "Error",
            description: data.error || "Failed to create user",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error saving user:", error)
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
          {user ? "Edit User" : "Add New User"}
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
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter name"
            className={`bg-slate-800/50 border ${
              errors.name ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-purple-100 block">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            className={`bg-slate-800/50 border ${
              errors.email ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-purple-100 block">
            {user ? "Password (leave blank to keep current)" : "Password"}
          </label>
          <input
            id="password"
            type="password"
            placeholder={user ? "••••••••" : "Enter password"}
            className={`bg-slate-800/50 border ${
              errors.password ? "border-red-500" : "border-amber-500/30"
            } rounded-lg py-3 px-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
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
                Save User
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
