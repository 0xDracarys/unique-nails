"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("recent")
  const [carouselIndex, setCarouselIndex] = useState(0)

  const recentDesigns = [
    { id: 1, name: "Cosmic Swirl", type: "galaxy", likes: 24 },
    { id: 2, name: "Diamond Dust", type: "gemstone", likes: 18 },
    { id: 3, name: "Aurora Glow", type: "holographic", likes: 32 },
    { id: 4, name: "Neon Bloom", type: "floral", likes: 15 },
    { id: 5, name: "Starlight", type: "galaxy", likes: 27 },
    { id: 6, name: "Crystal Wave", type: "gemstone", likes: 21 },
  ]

  const popularDesigns = [
    { id: 7, name: "Nebula Dreams", type: "galaxy", likes: 156 },
    { id: 8, name: "Emerald Aura", type: "gemstone", likes: 142 },
    { id: 9, name: "Prism Shift", type: "holographic", likes: 189 },
    { id: 10, name: "Cosmic Garden", type: "floral", likes: 124 },
    { id: 11, name: "Stardust", type: "galaxy", likes: 167 },
    { id: 12, name: "Opal Essence", type: "gemstone", likes: 138 },
  ]

  const inspirations = [
    { id: 1, name: "Celestial Patterns", url: "#" },
    { id: 2, name: "Gemstone References", url: "#" },
    { id: 3, name: "Holographic Textures", url: "#" },
    { id: 4, name: "Cosmic Art", url: "#" },
  ]

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.ceil(popularDesigns.length / 3))
  }

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + Math.ceil(popularDesigns.length / 3)) % Math.ceil(popularDesigns.length / 3))
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
          <Link href="/design" className="text-white hover:text-pink-300 transition-colors">
            Design
          </Link>
          <Link href="/profile" className="text-white hover:text-pink-300 transition-colors">
            Profile
          </Link>
          <Link href="/saved" className="text-white hover:text-pink-300 transition-colors">
            Saved
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              Explore Designs
            </h1>
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search designs..."
                className="bg-slate-800/50 border-purple-500/30 rounded-lg py-2 px-4 w-full text-white placeholder:text-slate-400 focus:border-pink-500 focus:ring-pink-500/20 transition-all shadow-md pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="flex border-b border-purple-500/20 mb-8">
            <button
              className={`py-2 px-4 text-sm font-medium relative ${
                activeTab === "recent" ? "text-pink-400" : "text-purple-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("recent")}
            >
              Most Recent
              {activeTab === "recent" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" layoutId="exploreTab" />
              )}
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium relative ${
                activeTab === "popular" ? "text-pink-400" : "text-purple-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("popular")}
            >
              Most Popular
              {activeTab === "popular" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" layoutId="exploreTab" />
              )}
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium relative ${
                activeTab === "inspirations" ? "text-pink-400" : "text-purple-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("inspirations")}
            >
              Inspirations
              {activeTab === "inspirations" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" layoutId="exploreTab" />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "recent" && (
              <motion.div
                key="recent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {recentDesigns.map((design) => (
                    <motion.div
                      key={design.id}
                      className="relative group"
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl opacity-50 blur-sm group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 shadow-lg">
                        <div className="aspect-square relative">
                          <div className={`w-full h-full ${getDesignBackground(design.type)}`}></div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/70 backdrop-blur-sm">
                            <div className="text-center">
                              <p className="text-white font-medium">{design.name}</p>
                              <p className="text-xs text-purple-300 mt-1">{design.likes} likes</p>
                              <Button size="sm" className="mt-3 bg-pink-500 hover:bg-pink-600">
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
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
              </motion.div>
            )}

            {activeTab === "popular" && (
              <motion.div
                key="popular"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold font-orbitron">Trending Designs</h2>
                    <div className="flex gap-2">
                      <motion.button
                        className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                        onClick={prevCarousel}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronLeft className="h-5 w-5 text-purple-300" />
                      </motion.button>
                      <motion.button
                        className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                        onClick={nextCarousel}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronRight className="h-5 w-5 text-purple-300" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <motion.div
                      className="flex gap-6"
                      animate={{ x: -carouselIndex * 100 + "%" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {popularDesigns.map((design) => (
                        <motion.div
                          key={design.id}
                          className="relative min-w-[calc(33.333%-1rem)] group"
                          whileHover={{ scale: 1.05, zIndex: 10 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl opacity-50 blur-sm group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 shadow-lg">
                            <div className="aspect-square relative">
                              <div className={`w-full h-full ${getDesignBackground(design.type)}`}></div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/70 backdrop-blur-sm">
                                <div className="text-center">
                                  <p className="text-white font-medium">{design.name}</p>
                                  <p className="text-xs text-purple-300 mt-1">{design.likes} likes</p>
                                  <Button size="sm" className="mt-3 bg-pink-500 hover:bg-pink-600">
                                    View
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  <div className="mt-8 flex justify-center">
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
              </motion.div>
            )}

            {activeTab === "inspirations" && (
              <motion.div
                key="inspirations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {inspirations.map((inspiration) => (
                    <motion.a
                      key={inspiration.id}
                      href={inspiration.url}
                      className="relative group block"
                      whileHover={{ scale: 1.03, zIndex: 10 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl opacity-50 blur-sm group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 shadow-lg p-6">
                        <h3 className="text-xl font-bold font-orbitron mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                          {inspiration.name}
                        </h3>
                        <p className="text-purple-200/80 mb-4">Find inspiration for your next nail design</p>
                        <div className="flex justify-end">
                          <div className="inline-flex items-center text-pink-400 group-hover:text-pink-300 transition-colors">
                            Explore <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
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
              </motion.div>
            )}
          </AnimatePresence>
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
