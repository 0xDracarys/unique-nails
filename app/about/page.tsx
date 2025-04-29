"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import NavHeader from "@/components/nav-header"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Nail design data
const nailDesigns = [
  {
    id: "holographic",
    name: "Holographic Chrome",
    image: "/placeholder.svg?height=200&width=100",
    color: "from-amber-400 via-purple-400 to-blue-500",
  },
  {
    id: "galaxy",
    name: "Galaxy Theme",
    image: "/placeholder.svg?height=200&width=100",
    color: "from-indigo-500 via-purple-500 to-amber-500",
  },
  {
    id: "alien-superstar",
    name: "Alien Superstar",
    image: "/placeholder.svg?height=200&width=100",
    color: "from-red-600 via-red-500 to-amber-500",
  },
  {
    id: "stiletto",
    name: "Red Stiletto",
    image: "/placeholder.svg?height=200&width=100",
    color: "from-red-600 to-red-500",
  },
]

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeDesign, setActiveDesign] = useState<string | null>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Use more gentle transform values and smoother spring
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.5, 1, 1, 0.5])
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.95, 1, 1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [30, 0, 0, -30])

  // Use gentler spring settings
  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 70, mass: 1 })

  // Generate stars for the background
  const stars = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.7 + 0.3,
    delay: Math.random() * 5,
  }))

  // Handle nail design click
  const handleDesignClick = (id: string) => {
    setActiveDesign(activeDesign === id ? null : id)
  }

  // GSAP animations with gentler settings
  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Animate paragraphs with gentler settings
      gsap.utils.toArray(".bio-paragraph").forEach((paragraph, i) => {
        gsap.fromTo(
          paragraph,
          {
            opacity: 0,
            y: 30, // Reduced from 50
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: paragraph as Element,
              start: "top 85%", // Start earlier
              end: "top 60%", // End later for smoother transition
              toggleActions: "play none none reverse",
              scrub: 0.5, // Add gentle scrubbing
            },
          },
        )
      })

      // Animate highlighted phrases with gentler settings
      gsap.utils.toArray(".highlight").forEach((highlight) => {
        gsap.to(highlight, {
          backgroundSize: "100% 2px",
          duration: 1.5, // Increased from 1
          ease: "power1.out", // Gentler ease
          scrollTrigger: {
            trigger: highlight as Element,
            start: "top 85%", // Start earlier
            end: "top 60%", // End later for smoother transition
            toggleActions: "play none none reverse",
            scrub: 0.5, // Add gentle scrubbing
          },
        })
      })

      // Animate brand name with gentler settings
      gsap.fromTo(
        ".brand-name",
        {
          opacity: 0,
          scale: 0.9, // Less dramatic scale
        },
        {
          opacity: 1,
          scale: 1,
          duration: 2, // Increased from 1.5
          ease: "power2.out", // Gentler ease than elastic
        },
      )

      // Animate tagline with gentler settings
      gsap.fromTo(
        ".tagline",
        {
          opacity: 0,
          y: 15, // Reduced from 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.5, // Increased from 1
          ease: "power1.out", // Gentler ease
          delay: 0.7, // Increased from 0.5
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 to-purple-950 text-white overflow-hidden">
      {/* Navigation */}
      <NavHeader />

      {/* Stars background */}
      <div className="fixed inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: star.opacity,
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 1.3, star.opacity], // Reduced intensity
            }}
            transition={{
              duration: 4 + star.delay, // Slower animation
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Add shooting stars */}
        {Array.from({ length: 3 }).map((_, i) => {
          const startX = Math.random() * 100
          const startY = Math.random() * 50 // Keep in top half
          const angle = Math.random() * 45 + 15 // 15-60 degrees
          const duration = Math.random() * 3 + 2 // 2-5 seconds
          const delay = Math.random() * 10 // 0-10 seconds

          return (
            <div
              key={`shooting-${i}`}
              className="absolute"
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

      {/* Floating particles with reduced speed */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-500/30 blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -70], // Reduced distance
              opacity: [0, 0.4, 0], // Reduced opacity
            }}
            transition={{
              duration: 7 + Math.random() * 5, // Slower animation
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 10,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        ref={containerRef}
        className="relative z-10 container mx-auto px-4 py-16 md:py-24 pt-24 md:pt-32"
        style={{
          opacity,
          scale,
          y,
        }}
      >
        {/* Brand header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.h1
            className="brand-name text-5xl md:text-7xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-purple-400 mb-4"
            animate={{
              textShadow: [
                "0 0 7px rgba(245, 158, 11, 0.7)",
                "0 0 10px rgba(245, 158, 11, 0.9)",
                "0 0 7px rgba(245, 158, 11, 0.7)",
              ],
            }}
            transition={{
              duration: 3, // Slower animation
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            Unique Nails
          </motion.h1>
          <motion.p
            className="tagline text-xl md:text-2xl font-light italic"
            animate={{
              opacity: [0.7, 0.9, 0.7], // Reduced intensity
            }}
            transition={{
              duration: 4, // Slower animation
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <span className="bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
              Unique, That&apos;s What You Are
            </span>
          </motion.p>
        </div>

        {/* Bio content */}
        <div className="max-w-4xl mx-auto space-y-12 md:space-y-24">
          {/* Paragraph 1 */}
          <motion.div
            className="bio-paragraph relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-amber-500/20 shadow-lg"
            whileHover={{ scale: 1.01 }} // Reduced scale effect
            transition={{ type: "spring", stiffness: 200, damping: 25 }} // Gentler spring
          >
            <p className="text-lg leading-relaxed">
              Step into my universe with <span className="font-bold text-amber-400">Unique Nails</span>, where every
              design is a{" "}
              <span className="highlight relative inline-block bg-gradient-to-r from-amber-500 to-purple-500 bg-[length:0%_2px] bg-no-repeat bg-bottom pb-1">
                cosmic celebration of individuality
              </span>
              . I&apos;ve been painting my nails since I was a little dreamer, but my true journey began six years ago
              when I unwrapped a nail art kit on Christmas morning—thanks, Mum, for the best gift ever! What started as
              a spark turned into a blazing passion. As I grew, so did my artificial nails, stretching longer and
              bolder, reflecting my evolving love for self-expression. Not everyone saw the beauty in my creations—some
              mocked them, others admired them—but their words never dimmed my fire. Nail art became my destiny.
            </p>

            {/* Interactive nail element with gentler hover */}
            <motion.div
              className="absolute -top-10 -right-10 hidden md:block"
              whileHover={{ scale: 1.1, rotate: 3 }} // Reduced scale and rotation
              whileTap={{ scale: 0.97 }} // Gentler tap effect
              onClick={() => handleDesignClick("holographic")}
            >
              <div className="relative w-20 h-40">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
                <div
                  className={`relative w-full h-full rounded-t-full bg-gradient-to-br ${nailDesigns[0].color} shadow-lg shadow-amber-500/20`}
                ></div>
              </div>
            </motion.div>
          </motion.div>

          {/* Paragraph 2 */}
          <motion.div
            className="bio-paragraph relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-purple-500/20 shadow-lg ml-0 md:ml-12"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p className="text-lg leading-relaxed">
              I dove deep, studying combined Japanese manicures and nail art techniques, determined to master the craft.
              I&apos;m still on the path to becoming a manicurist, despite challenges. My mum once warned me that my
              autism might make it tough, given the social demands of the job. At first, I thought,{" "}
              <span className="italic text-purple-300">&quot;Just watch me—I&apos;ll get there!&quot;</span> But after
              gaining experience, I understood her caution. Still, nothing can extinguish this passion. To me,{" "}
              <span className="highlight relative inline-block bg-gradient-to-r from-pink-500 to-purple-500 bg-[length:0%_2px] bg-no-repeat bg-bottom pb-1">
                nails aren&apos;t just nails—they&apos;re art, expression, emotion, and experience
              </span>
              . Every design carries a story, a meaning, born from a process that demands patience and focus. When I
              paint, the world fades, and the nails become my sanctuary—a calming escape where I pour my heart into
              intricate, detailed designs.
            </p>

            {/* Interactive nail element */}
            <motion.div
              className="absolute -bottom-10 -left-10 hidden md:block"
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDesignClick("galaxy")}
            >
              <div className="relative w-20 h-40">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
                <div
                  className={`relative w-full h-full rounded-t-full bg-gradient-to-br ${nailDesigns[1].color} shadow-lg shadow-purple-500/20`}
                ></div>
              </div>
            </motion.div>
          </motion.div>

          {/* Paragraph 3 - Emotional section */}
          <motion.div
            className="bio-paragraph relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-purple-500/20 shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative overflow-hidden">
              {/* Tear particles */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-2 rounded-full bg-blue-300/50 blur-sm"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: "10%",
                    }}
                    animate={{
                      y: [0, 100],
                      opacity: [0, 0.7, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 5,
                      ease: "easeIn",
                    }}
                  />
                ))}
              </div>

              <p className="text-lg leading-relaxed">
                This love led me to my dream: <span className="font-bold text-pink-400">Unique Nails</span>, my press-on
                nails business. While I work toward becoming a nail technician, I couldn&apos;t wait to leap into the
                industry. My creations are for the bold, the unique—those who dare to shine. Inspired by Beyoncé&apos;s{" "}
                <span className="highlight relative inline-block bg-gradient-to-r from-red-500 to-pink-500 bg-[length:0%_2px] bg-no-repeat bg-bottom pb-1">
                  &quot;Alien Superstar&quot;
                </span>{" "}
                performance, where her long red stiletto nails gleamed against a black glittered glove, I found
                strength. She&apos;s not known for such nails, but that moment stuck with me. When people question,{" "}
                <span className="italic text-purple-300">&quot;How can you live with those claws?&quot;</span>
                —sometimes after the tenth comment, I&apos;d feel a tear—I think of her.
              </p>
            </div>

            {/* Alien Superstar nail */}
            <motion.div
              className="absolute -top-10 -right-10 hidden md:block"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 10px rgba(225, 29, 72, 0.5)",
                  "0 0 20px rgba(225, 29, 72, 0.7)",
                  "0 0 10px rgba(225, 29, 72, 0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              onClick={() => handleDesignClick("alien-superstar")}
            >
              <div className="relative w-20 h-40">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-500 rounded-full blur-lg opacity-70"></div>
                <div
                  className={`relative w-full h-full rounded-t-full bg-gradient-to-br ${nailDesigns[2].color} shadow-lg shadow-red-500/30`}
                ></div>
              </div>
            </motion.div>
          </motion.div>

          {/* Paragraph 4 - Final empowering section */}
          <motion.div
            className="bio-paragraph relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-purple-500/20 shadow-lg ml-0 md:ml-12"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p className="text-lg leading-relaxed">
              That&apos;s why I crafted a tribute to{" "}
              <span className="font-bold text-red-500">&quot;Alien Superstar&quot;</span> for Unique Nails: a collection
              designed with love, so every wearer feels confident, beautiful, and uniquely themselves. Because, as
              Beyoncé sings,{" "}
              <motion.span
                className="font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                animate={{
                  textShadow: [
                    "0 0 5px rgba(236, 72, 153, 0.5)",
                    "0 0 10px rgba(236, 72, 153, 0.8)",
                    "0 0 5px rgba(236, 72, 153, 0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                &quot;Unique: That&apos;s what you are.&quot;
              </motion.span>{" "}
              My nails are more than art—they&apos;re a{" "}
              <span className="highlight relative inline-block bg-gradient-to-r from-pink-500 to-purple-500 bg-[length:0%_2px] bg-no-repeat bg-bottom pb-1">
                cosmic celebration of individuality
              </span>
              .
            </p>

            {/* Star burst animation on "Unique: That's what you are" */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div
                className="w-0 h-0"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  repeatDelay: 5,
                }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-pink-500 rounded-full"
                    style={{
                      rotate: `${i * 30}deg`,
                      transformOrigin: "0 0",
                    }}
                    animate={{
                      scaleX: [1, 30, 1],
                      opacity: [0, 0.7, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      repeatDelay: 5,
                      delay: 0.1 * i,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <div className="text-center pt-8 md:pt-16">
            <Link href="/explore">
              <motion.button
                className="relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-medium shadow-lg shadow-pink-500/20 overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Particle effects on hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-white"
                      style={{
                        left: "50%",
                        top: "50%",
                      }}
                      animate={{
                        x: [0, (Math.random() - 0.5) * 100],
                        y: [0, (Math.random() - 0.5) * 100],
                        opacity: [0, 0.7, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: Math.random() * 0.5,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
                <span className="relative z-10 flex items-center font-orbitron">
                  Explore Unique Nails <ChevronRight className="ml-2 h-5 w-5" />
                </span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Modal for nail design details with gentler animations */}
      <AnimatePresence>
        {activeDesign && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }} // Slightly slower for smoother appearance
            onClick={() => setActiveDesign(null)}
          >
            <motion.div
              className="bg-slate-800/90 rounded-2xl p-6 max-w-md w-full border border-amber-500/30 shadow-xl"
              initial={{ scale: 0.95, y: 10 }} // Gentler initial state
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }} // Gentler spring
              onClick={(e) => e.stopPropagation()}
            >
              {nailDesigns
                .filter((design) => design.id === activeDesign)
                .map((design) => (
                  <div key={design.id} className="text-center">
                    <h3 className="text-2xl font-bold font-orbitron mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-400">
                      {design.name}
                    </h3>
                    <motion.div
                      className="relative w-40 h-80 mx-auto mb-6"
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} // Slower rotation
                    >
                      <div
                        className={`w-full h-full rounded-t-full bg-gradient-to-br ${design.color} shadow-lg shadow-amber-500/20`}
                      ></div>
                    </motion.div>
                    <p className="text-purple-200 mb-6">
                      This stunning {design.name.toLowerCase()} design captures the essence of cosmic beauty, perfect
                      for those who want to make a statement.
                    </p>
                    <button
                      className="px-6 py-2 bg-gradient-to-r from-amber-500 to-purple-500 rounded-lg text-white font-medium shadow-lg shadow-amber-500/20"
                      onClick={() => setActiveDesign(null)}
                    >
                      Close
                    </button>
                  </div>
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
