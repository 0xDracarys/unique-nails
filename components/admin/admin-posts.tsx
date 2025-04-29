"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Pencil, Trash2, PlusCircle, Search, ExternalLink } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import AdminPostForm from "./admin-post-form"

interface Post {
  id: string
  title: string
  link: string
  imageUrl: string
  creatorId: string
  creatorName: string
  createdAt: number
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isAddingPost, setIsAddingPost] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/posts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch posts",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    setIsDeleting(postId)
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId))
        toast({
          title: "Success",
          description: "Post deleted successfully",
          variant: "default",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete post",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
  }

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
    setEditingPost(null)
    toast({
      title: "Success",
      description: "Post updated successfully",
      variant: "default",
    })
  }

  const handlePostAdded = (newPost: Post) => {
    setPosts([...posts, newPost])
    setIsAddingPost(false)
    toast({
      title: "Success",
      description: "Post added successfully",
      variant: "default",
    })
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.creatorName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  if (editingPost) {
    return <AdminPostForm post={editingPost} onSave={handlePostUpdated} onCancel={() => setEditingPost(null)} />
  }

  if (isAddingPost) {
    return <AdminPostForm onSave={handlePostAdded} onCancel={() => setIsAddingPost(false)} />
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts..."
            className="bg-slate-800/50 border border-amber-500/30 rounded-lg py-2 pl-10 pr-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <motion.button
          className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-500 rounded-lg text-white shadow-lg shadow-amber-500/20"
          onClick={() => setIsAddingPost(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Post
        </motion.button>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 shadow-lg text-center">
          <p className="text-purple-200">No posts found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-amber-500/20">
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Image
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Title
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Link
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Creator
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post, index) => (
                <motion.tr
                  key={post.id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="h-12 w-12 rounded-lg bg-slate-700 overflow-hidden">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl || "/placeholder.svg"}
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-white">{post.title}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-amber-400 hover:text-amber-300"
                    >
                      View <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-purple-200">{post.creatorName}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-purple-200">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <motion.button
                        className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:text-purple-200"
                        onClick={() => handleEditPost(post)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Pencil className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200"
                        onClick={() => handleDeletePost(post.id)}
                        disabled={isDeleting === post.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isDeleting === post.id ? (
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
