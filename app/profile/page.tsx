"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Edit, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Profile() {
  const [activeTab, setActiveTab] = useState("designs")

  const designs = [
    { id: 1, name: "Cosmic Swirl", date: "2023-04-15", type: "galaxy" },
    { id: 2, name: "Diamond Dust", date: "2023-04-10", type: "gemstone" },
    { id: 3, name: "Aurora Glow", date: "2023-04-05", type: "holographic" },
    { id: 4, name: "Neon Bloom", date: "2023-03-28", type: "floral" },
    { id: 5, name: "Starlight", date: "2023-03-20", type: "galaxy" },
    { id: 6, name: "Crystal Wave", date: "2023-03-15", type: "gemstone" },
  ]

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
          <Link href="/saved" className="text-white hover:text-pink-300 transition-colors">
            Saved
          </Link>
          <Button variant="ghost" size="icon" className="text-white hover:text-pink-300 transition-colors">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <motion.div
              className="w-full md:w-80 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  className="relative w-32 h-32 mb-4"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-md opacity-70"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-purple-500/50">
                    <Image
                      src="/placeholder.svg?height=128&width=128"
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-1.5 shadow-lg">
                    <Edit className="h-4 w-4 text-white" />
                  </button>
                </motion.div>

                <h1 className="text-xl font-bold font-orbitron mb-1">Cosmic User</h1>
                <p className="text-sm text-purple-300 mb-4">cosmic.user@example.com</p>

                <div className="grid grid-cols-3 w-full gap-2 mb-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-pink-400">24</p>
                    <p className="text-xs text-purple-300">Designs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-pink-400">142</p>
                    <p className="text-xs text-purple-300">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-pink-400">56</p>
                    <p className="text-xs text-purple-300">Following</p>
                  </div>
                </div>

                <motion.button
                  className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-medium shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all mb-4"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Update Password
                </motion.button>

                <div className="w-full flex flex-col gap-2">
                  <button className="w-full flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-700/50 transition-colors text-left">
                    <User className="h-4 w-4 text-purple-400" />
                    <span className="text-sm">Edit Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-700/50 transition-colors text-left">
                    <Settings className="h-4 w-4 text-purple-400" />
                    <span className="text-sm">Settings</span>
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex border-b border-purple-500/20 mb-6">
                <button
                  className={`py-2 px-4 text-sm font-medium relative ${
                    activeTab === "designs" ? "text-pink-400" : "text-purple-300 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("designs")}
                >
                  My Designs
                  {activeTab === "designs" && (
                    <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" layoutId="activeTab" />
                  )}
                </button>
                <button
                  className={`py-2 px-4 text-sm font-medium relative ${
                    activeTab === "liked" ? "text-pink-400" : "text-purple-300 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("liked")}
                >
                  Liked Designs
                  {activeTab === "liked" && (
                    <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" layoutId="activeTab" />
                  )}
                </button>
                <button
                  className={`py-2 px-4 text-sm font-medium relative ${
                    activeTab === "collections" ? "text-pink-400" : "text-purple-300 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("collections")}
                >
                  Collections
                  {activeTab === "collections" && (
                    <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" layoutId="activeTab" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {designs.map((design) => (
                  <motion.div
                    key={design.id}
                    className="relative group"
                    whileHover={{ scale: 1.03, zIndex: 10 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl opacity-50 blur-sm group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 shadow-lg">
                      <div className="aspect-square relative">
                        <div className={`w-full h-full ${getDesignBackground(design.type)}`}></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/70 backdrop-blur-sm">
                          <div className="text-center">
                            <p className="text-white font-medium">{design.name}</p>
                            <p className="text-xs text-purple-300 mt-1">Created: {formatDate(design.date)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
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
