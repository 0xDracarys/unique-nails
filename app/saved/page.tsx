"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useDesigns } from "@/hooks/use-designs"
import type { Design } from "@/types"
import { toast } from "@/components/ui/use-toast"

export default function SavedDesignsPage() {
  const [savedDesigns, setSavedDesigns] = useState<Design[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const { user } = useAuth()
  const { fetchDesigns, deleteDesign } = useDesigns()
  const router = useRouter()

  useEffect(() => {
    const loadDesigns = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const data = await fetchDesigns({ userId: user.id })
        setSavedDesigns(data.designs || [])
      } catch (error) {
        console.error("Error loading designs:", error)
        toast({
          title: "Error",
          description: "Failed to load your saved designs",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDesigns()
  }, [user, fetchDesigns])

  const handleDeleteDesign = async (id: string) => {
    if (confirm("Are you sure you want to delete this design?")) {
      setIsDeleting(id)
      try {
        const success = await deleteDesign(id)
        if (success) {
          setSavedDesigns((prev) => prev.filter((design) => design.id !== id))
          toast({
            title: "Design deleted",
            description: "Your design has been deleted successfully",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to delete the design",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting design:", error)
        toast({
          title: "Error",
          description: "Failed to delete the design",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(null)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-950 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Stars background */}
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
      </div>

      <header className="container mx-auto py-6 px-4 flex justify-between items-center relative z-10">
        <Link
          href="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-400"
        >
          CosmicNails
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/explore" className="text-white hover:text-pink-300 transition-colors">
            Explore
          </Link>
          <Link href="/design" className="text-white hover:text-pink-300 transition-colors">
            Design
          </Link>
          <Link href="/profile" className="text-white hover:text-pink-300 transition-colors">
            Profile
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              Saved Designs
            </h1>
            <Button
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:text-white hover:bg-slate-800/50"
            >
              Sort by Date
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
              <span className="ml-3 text-lg text-purple-300">Loading your designs...</span>
            </div>
          ) : !user ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">Sign in to view your saved designs</h2>
              <p className="text-purple-200/70 mb-6">Create an account or sign in to save and view your nail designs</p>
              <div className="flex justify-center gap-4">
                <Link href="/auth/sign-in">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button variant="outline" className="border-purple-500/30">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          ) : savedDesigns.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-purple-300 mb-4">No saved designs yet</h2>
              <p className="text-purple-200/70 mb-6">Create your first cosmic nail design!</p>
              <Link href="/design">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  Create Design
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {savedDesigns.map((design) => (
                <motion.div
                  key={design.id}
                  className="relative group"
                  whileHover={{
                    scale: 1.05,
                    zIndex: 10,
                    rotateY: 10,
                    rotateX: -10,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl opacity-50 blur-sm group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 shadow-lg">
                    <div className="aspect-square relative">
                      <div className={`w-full h-full ${getDesignBackground(design.type)}`}></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/70 backdrop-blur-sm">
                        <div className="text-center p-4">
                          <p className="text-white font-medium">{design.name}</p>
                          <p className="text-xs text-purple-300 mt-1">
                            Created: {formatDate(new Date(design.createdAt).toISOString())}
                          </p>
                          <div className="mt-3 flex justify-center gap-2">
                            <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                              Apply
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:bg-red-950/30"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteDesign(design.id)
                              }}
                              disabled={isDeleting === design.id}
                            >
                              {isDeleting === design.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Link href="/design">
              <motion.div
                className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function getDesignBackground(type: string) {
  switch (type) {
    case "galaxy":
      return "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
    case "gemstone":
      return "bg-gradient-to-br from-emerald-400 to-teal-500"
    case "holographic":
      return "bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500"
    case "floral":
      return "bg-gradient-to-br from-rose-400 to-pink-500"
    default:
      return "bg-gradient-to-br from-purple-500 to-pink-500"
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
