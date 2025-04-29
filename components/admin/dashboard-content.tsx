"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Users, Palette, FileText, LinkIcon, FileEdit, BarChart3 } from "lucide-react"
import AdminDashboardStats from "./dashboard-stats"
import AdminUsers from "./admin-users"
import AdminDesigns from "./admin-designs"
import AdminPosts from "./admin-posts"
import AdminLinks from "./admin-links"
import AdminBio from "./admin-bio"

interface AdminDashboardContentProps {
  activeSection: string
  adminData: any
}

export default function AdminDashboardContent({ activeSection, adminData }: AdminDashboardContentProps) {
  const sectionTitles: Record<string, { title: string; icon: React.ReactNode }> = {
    dashboard: { title: "Dashboard Overview", icon: <BarChart3 className="h-6 w-6 text-amber-400" /> },
    users: { title: "User Management", icon: <Users className="h-6 w-6 text-amber-400" /> },
    designs: { title: "Design Management", icon: <Palette className="h-6 w-6 text-amber-400" /> },
    posts: { title: "Post Management", icon: <FileText className="h-6 w-6 text-amber-400" /> },
    links: { title: "Link Management", icon: <LinkIcon className="h-6 w-6 text-amber-400" /> },
    bio: { title: "Bio Management", icon: <FileEdit className="h-6 w-6 text-amber-400" /> },
  }

  const { title, icon } = sectionTitles[activeSection] || sectionTitles.dashboard

  return (
    <div>
      <motion.div
        className="mb-8 flex items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mr-3">{icon}</div>
        <h1 className="text-2xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-400">
          {title}
        </h1>
      </motion.div>

      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {activeSection === "dashboard" && <AdminDashboardStats data={adminData} />}
        {activeSection === "users" && <AdminUsers />}
        {activeSection === "designs" && <AdminDesigns />}
        {activeSection === "posts" && <AdminPosts />}
        {activeSection === "links" && <AdminLinks />}
        {activeSection === "bio" && <AdminBio />}
      </motion.div>
    </div>
  )
}
