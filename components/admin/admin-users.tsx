"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Pencil, Trash2, UserPlus, Search } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import AdminUserForm from "./admin-user-form"

interface User {
  id: string
  name: string
  email: string
  designs: string[]
  followers: string[]
  following: string[]
  profileImage?: string
  createdAt: number
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
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
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    setIsDeleting(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId))
        toast({
          title: "Success",
          description: "User deleted successfully",
          variant: "default",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    setEditingUser(null)
    toast({
      title: "Success",
      description: "User updated successfully",
      variant: "default",
    })
  }

  const handleUserAdded = (newUser: User) => {
    setUsers([...users, newUser])
    setIsAddingUser(false)
    toast({
      title: "Success",
      description: "User added successfully",
      variant: "default",
    })
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
      </div>
    )
  }

  if (editingUser) {
    return <AdminUserForm user={editingUser} onSave={handleUserUpdated} onCancel={() => setEditingUser(null)} />
  }

  if (isAddingUser) {
    return <AdminUserForm onSave={handleUserAdded} onCancel={() => setIsAddingUser(false)} />
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="bg-slate-800/50 border border-amber-500/30 rounded-lg py-2 pl-10 pr-4 w-full text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring focus:ring-amber-500/20 transition-all shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <motion.button
          className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-500 rounded-lg text-white shadow-lg shadow-amber-500/20"
          onClick={() => setIsAddingUser(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add New User
        </motion.button>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 shadow-lg text-center">
          <p className="text-purple-200">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-amber-500/20">
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Designs
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Followers
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-purple-500 flex items-center justify-center text-white text-sm mr-3">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-purple-200">{user.email}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-purple-200">{user.designs?.length || 0}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-purple-200">{user.followers?.length || 0}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <motion.button
                        className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:text-purple-200"
                        onClick={() => handleEditUser(user)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Pencil className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={isDeleting === user.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isDeleting === user.id ? (
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
