"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Pencil, Trash2, PlusCircle, Search, ExternalLink } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import AdminLinkForm from "./admin-link-form"

interface Link {
  id: string
  title: string
  url: string
  category: string
  createdAt: number
}

export default function AdminLinks() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/links")
      if (response.ok) {
        const data = await response.json()
        setLinks(data.links)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch links",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching links:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return

    setIsDeleting(linkId)
    try {
      const response = await fetch(`/api/admin/links/${linkId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setLinks(links.filter((link) => link.id !== linkId))
        toast({
          title: "Success",
          description: "Link deleted successfully",
          variant: "default",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete link",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting link:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditLink = (link: Link) => {
    setEditingLink(link)
  }

  const handleLinkUpdated = (updatedLink: Link) => {
    setLinks(links.map((link) => (link.id === updatedLink.id ? updatedLink : link)))
    setEditingLink(null)
    toast({
      title: "Success",
      description: "Link updated successfully",
      variant: "default",
    })
  }

  const handleLinkAdded = (newLink: Link) => {
    setLinks([...links, newLink])
    setIsAddingLink(false)
    toast({
      title: "Success",
      description: "Link added successfully",
      variant: "default",
    })
  }

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  if (editingLink) {
    return <AdminLinkForm link={editingLink} onSave={handleLinkUpdated} onCancel={() => setEditingLink(null)} />
  }

  if (isAddingLink) {
    return <AdminLinkForm onSave={handleLinkAdded} onCancel={() => setIsAddingLink(false)} />
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search links..."
            className="bg-slate-800/50 border border-amber-500/30 rounded-lg py-2 pl-10 pr-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <motion.button
          className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-500 rounded-lg text-white shadow-lg shadow-amber-500/20"
          onClick={() => setIsAddingLink(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Link
        </motion.button>
      </div>

      {filteredLinks.length === 0 ? (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 shadow-lg text-center">
          <p className="text-purple-200">No links found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-amber-500/20">
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Title
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  URL
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link, index) => (
                <motion.tr
                  key={link.id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="py-3 px-4 whitespace-nowrap text-white">{link.title}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-amber-400 hover:text-amber-300"
                    >
                      View <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                      {link.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-purple-200">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <motion.button
                        className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:text-purple-200"
                        onClick={() => handleEditLink(link)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Pencil className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200"
                        onClick={() => handleDeleteLink(link.id)}
                        disabled={isDeleting === link.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isDeleting === link.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
