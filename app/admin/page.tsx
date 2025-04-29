"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Palette, FileText, LinkIcon, FileEdit, LogOut, Home, Menu, X, BarChart3 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import AdminDashboardContent from "@/components/admin/dashboard-content"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminData, setAdminData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-auth")
        if (!res.ok) {
          router.push("/admin/login")
          return
        }

        // Fetch dashboard data
        const dashboardRes = await fetch("/api/admin/dashboard")
        if (dashboardRes.ok) {
          const data = await dashboardRes.json()
          setAdminData(data)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
        variant: "default",
      })
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-950 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-purple-200">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-950 text-white">
      {/* Stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
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

      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <motion.button
          className="p-2 bg-slate-800/80 rounded-lg border border-amber-500/30"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6 text-amber-400" /> : <Menu className="h-6 w-6 text-amber-400" />}
        </motion.button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.div
            className={`fixed top-0 left-0 h-full w-64 bg-slate-900/90 backdrop-blur-md border-r border-amber-500/20 z-40 ${
              isMobileMenuOpen ? "block" : "hidden md:block"
            }`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-8">
                <motion.h1
                  className="text-2xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-400"
                  animate={{
                    textShadow: [
                      "0 0 7px rgba(245, 158, 11, 0.7)",
                      "0 0 10px rgba(245, 158, 11, 0.9)",
                      "0 0 7px rgba(245, 158, 11, 0.7)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  Unique Nails
                </motion.h1>
              </div>

              <nav className="space-y-1">
                <SidebarLink
                  icon={<BarChart3 className="h-5 w-5" />}
                  label="Dashboard"
                  isActive={activeSection === "dashboard"}
                  onClick={() => {
                    setActiveSection("dashboard")
                    setIsMobileMenuOpen(false)
                  }}
                />
                <SidebarLink
                  icon={<Users className="h-5 w-5" />}
                  label="Users"
                  isActive={activeSection === "users"}
                  onClick={() => {
                    setActiveSection("users")
                    setIsMobileMenuOpen(false)
                  }}
                />
                <SidebarLink
                  icon={<Palette className="h-5 w-5" />}
                  label="Designs"
                  isActive={activeSection === "designs"}
                  onClick={() => {
                    setActiveSection("designs")
                    setIsMobileMenuOpen(false)
                  }}
                />
                <SidebarLink
                  icon={<FileText className="h-5 w-5" />}
                  label="Posts"
                  isActive={activeSection === "posts"}
                  onClick={() => {
                    setActiveSection("posts")
                    setIsMobileMenuOpen(false)
                  }}
                />
                <SidebarLink
                  icon={<LinkIcon className="h-5 w-5" />}
                  label="Links"
                  isActive={activeSection === "links"}
                  onClick={() => {
                    setActiveSection("links")
                    setIsMobileMenuOpen(false)
                  }}
                />
                <SidebarLink
                  icon={<FileEdit className="h-5 w-5" />}
                  label="Bio"
                  isActive={activeSection === "bio"}
                  onClick={() => {
                    setActiveSection("bio")
                    setIsMobileMenuOpen(false)
                  }}
                />
              </nav>

              <div className="absolute bottom-6 left-0 right-0 px-6">
                <div className="pt-6 mt-6 border-t border-amber-500/20">
                  <Link
                    href="/"
                    className="flex items-center py-2 px-3 rounded-lg text-purple-200 hover:text-white hover:bg-slate-800/50 transition-colors mb-3"
                  >
                    <Home className="h-5 w-5 mr-3" />
                    <span>View Website</span>
                  </Link>
                  <motion.button
                    className="w-full flex items-center py-2 px-3 rounded-lg text-red-300 hover:text-red-200 hover:bg-red-900/20 transition-colors"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="md:ml-64 min-h-screen">
        <div className="p-6 pt-16 md:pt-6">
          <AdminDashboardContent activeSection={activeSection} adminData={adminData} />
        </div>
      </div>
    </div>
  )
}

interface SidebarLinkProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function SidebarLink({ icon, label, isActive, onClick }: SidebarLinkProps) {
  return (
    <motion.button
      className={`w-full flex items-center py-2 px-3 rounded-lg transition-colors ${
        isActive
          ? "bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-white"
          : "text-purple-200 hover:text-white hover:bg-slate-800/50"
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
      {isActive && (
        <motion.div
          className="ml-auto h-2 w-2 rounded-full bg-amber-400"
          layoutId="activeSection"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  )
}
