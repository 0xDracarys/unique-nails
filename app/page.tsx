"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import NavHeader from "@/components/nav-header"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const starsRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Set dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Track mouse position for star interaction with reduced sensitivity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle updates to reduce sensitivity
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY })
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Move stars based on mouse position with reduced sensitivity
  useEffect(() => {
    if (!starsRef.current || dimensions.width === 0) return

    const stars = starsRef.current.children
    const centerX = dimensions.width / 2
    const centerY = dimensions.height / 2

    // Calculate mouse offset from center with reduced sensitivity
    const offsetX = (mousePosition.x - centerX) / 150 // Reduced from 50 to 150
    const offsetY = (mousePosition.y - centerY) / 150 // Reduced from 50 to 150

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i] as HTMLElement
      if (star.classList.contains("shooting-star")) continue // Skip shooting stars

      const depth = Number.parseFloat(star.getAttribute("data-depth") || "1")
      const starX = Number.parseFloat(star.getAttribute("data-x") || "0")
      const starY = Number.parseFloat(star.getAttribute("data-y") || "0")

      // Apply smoother parallax effect based on depth
      star.style.transform = `translate(${starX + offsetX * depth}px, ${starY + offsetY * depth}px)`
    }
  }, [mousePosition, dimensions])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-950 text-white">
      <NavHeader />

      {/* Interactive stars background */}
      <div ref={starsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Regular stars */}
        {Array.from({ length: 100 }).map((_, i) => {
          const size = Math.random() * 3 + 1
          const x = Math.random() * 100
          const y = Math.random() * 100
          const depth = Math.random() * 2 + 0.5 // Reduced max depth

          return (
            <div
              key={i}
              className="absolute rounded-full bg-white transition-transform duration-1000 ease-out"
              data-depth={depth}
              data-x={x}
              data-y={y}
              style={{
                top: `${y}%`,
                left: `${x}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          )
        })}

        {/* Shooting stars */}
        {Array.from({ length: 5 }).map((_, i) => {
          const startX = Math.random() * 100
          const startY = Math.random() * 100
          const angle = Math.random() * 45 + 15 // 15-60 degrees
          const duration = Math.random() * 3 + 2 // 2-5 seconds
          const delay = Math.random() * 10 // 0-10 seconds

          return (
            <div
              key={`shooting-${i}`}
              className="shooting-star absolute"
              style={{
                top: `${startY}%`,
                left: `${startX}%`,
                opacity: 0,
                animation: `shootingStar ${duration}s linear ${delay}s infinite`,
                transform: `rotate(${angle}deg)`,
              }}
            >
              <div
                className="w-[100px] h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-white"
                style={{
                  boxShadow: "0 0 3px rgba(255, 255, 255, 0.7)",
                }}
              />
            </div>
          )
        })}
      </div>

      <header className="container mx-auto py-6 px-4 flex justify-between items-center relative z-10 pt-24">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-400">
          CosmicNails
        </div>
        <div className="space-x-4">
          <Link href="/auth/sign-in" className="px-4 py-2 rounded-lg text-white hover:text-amber-300 transition-colors">
            Sign In
          </Link>
          <Link
            href="/auth/sign-up"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-purple-500 hover:from-amber-500 hover:to-purple-600 text-white shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-purple-400 to-blue-400">
              Design Your Cosmic Nail Art
            </h1>
            <p className="text-lg text-purple-100 mb-8 max-w-2xl">
              Explore the universe of nail art with our futuristic 3D design platform. Create, save, and share your
              unique cosmic nail designs.
            </p>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-purple-500 text-white font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all hover:scale-105"
            >
              Get Started <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          <motion.div
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  {["holographic", "gemstone", "galaxy", "floral"].map((design, index) => (
                    <motion.div
                      key={design}
                      className="aspect-square rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 p-1 overflow-hidden"
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div
                        className={`w-full h-full rounded-lg bg-gradient-to-br ${getDesignGradient(index)} flex items-center justify-center`}
                      >
                        <span className="text-xs font-medium text-white/80">{design}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <motion.div
                    className="w-32 h-32 rounded-full bg-gradient-to-r from-amber-500/30 to-purple-500/30 flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        "0 0 10px 2px rgba(245, 158, 11, 0.3)",
                        "0 0 20px 5px rgba(245, 158, 11, 0.5)",
                        "0 0 10px 2px rgba(245, 158, 11, 0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center text-sm text-white/80">
                      Preview
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

function getDesignGradient(index: number) {
  const gradients = [
    "from-amber-500/80 to-purple-500/80", // holographic
    "from-amber-400/80 to-teal-500/80", // gemstone
    "from-amber-500/80 to-indigo-600/80", // galaxy
    "from-amber-400/80 to-pink-500/80", // floral
  ]
  return gradients[index % gradients.length]
}
