"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Pencil, Trash2, Star, PlusCircle, Search } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import AdminDesignForm from "./admin-design-form"

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

export default function AdminDesigns() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editingDesign, setEditingDesign] = useState<Design | null>(null)
  const [isAddingDesign, setIsAddingDesign] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchDesigns()
  }, [])

  const fetchDesigns = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/designs")
      if (response.ok) {
        const data = await response.json()
        setDesigns(data.designs)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch designs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching designs:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDesign = async (designId: string) => {
    if (!confirm("Are you sure you want to delete this design?")) return

    setIsDeleting(designId)
    try {
      const response = await fetch(`/api/admin/designs/${designId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDesigns(designs.filter((design) => design.id !== designId))
        toast({
          title: "Success",
          description: "Design deleted successfully",
          variant: "default",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete design",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting design:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditDesign = (design: Design) => {
    setEditingDesign(design)
  }

  const handleFeatureDesign = async (design: Design) => {
    try {
      const response = await fetch(`/api/admin/designs/${design.id}/feature`, {
        method: "PUT",
      })

      if (response.ok) {
        const updatedDesign = await response.json()
        setDesigns(designs.map((d) => (d.id === updatedDesign.id ? updatedDesign : d)))
        toast({
          title: "Success",
          description: "Design featured successfully",
          variant: "default",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to feature design",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error featuring design:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDesignUpdated = (updatedDesign: Design) => {
    setDesigns(designs.map((design) => (design.id === updatedDesign.id ? updatedDesign : design)))
    setEditingDesign(null)
    toast({
      title: "Success",
      description: "Design updated successfully",
      variant: "default",
    })
  }

  const handleDesignAdded = (newDesign: Design) => {
    setDesigns([...designs, newDesign])
    setIsAddingDesign(false)
    toast({
      title: "Success",
      description: "Design added successfully",
      variant: "default",
    })
  }

  const filteredDesigns = designs.filter(
    (design) =>
      design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.userName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getDesignBackground = (type: string) => {
    switch (type) {
      case "galaxy":
        return "from-indigo-500 via-purple-500 to-pink-500"
      case "gemstone":
        return "from-emerald-400 to-teal-500"
      case "holographic":
        return "from-pink-400 via-purple-400 to-blue-500"
      case "floral":
        return "from-rose-400 to-pink-500"
      default:
        return "from-purple-500 to-pink-500"
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  if (editingDesign) {
    return (
      <AdminDesignForm design={editingDesign} onSave={handleDesignUpdated} onCancel={() => setEditingDesign(null)} />
    )
  }

  if (isAddingDesign) {
    return <AdminDesignForm onSave={handleDesignAdded} onCancel={() => setIsAddingDesign(false)} />
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search designs..."
            className="bg-slate-800/50 border border-amber-500/30 rounded-lg py-2 pl-10 pr-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <motion.button
          className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-500 rounded-lg text-white shadow-lg shadow-amber-500/20"
          onClick={() => setIsAddingDesign(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Design
        </motion.button>
      </div>

      {filteredDesigns.length === 0 ? (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 shadow-lg text-center">
          <p className="text-purple-200">No designs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              className="bg-slate-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-amber-500/20 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="aspect-square relative">
                <div className={`w-full h-full bg-gradient-to-br ${getDesignBackground(design.type)}`}></div>
                {design.type === "featured" && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-white mb-1">{design.name}</h3>
                <p className="text-sm text-purple-200 mb-2">By {design.userName}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-400 mr-1" />
                    <span className="text-sm text-purple-200">{design.likes} likes</span>
                  </div>
                  <div className="text-xs text-purple-300">{new Date(design.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="mt-4 flex justify-between">
                  <motion.button
                    className="p-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:text-purple-200"
                    onClick={() => handleEditDesign(design)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Pencil className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 hover:text-amber-200"
                    onClick={() => handleFeatureDesign(design)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200"
                    onClick={() => handleDeleteDesign(design.id)}
                    disabled={isDeleting === design.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isDeleting === design.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
