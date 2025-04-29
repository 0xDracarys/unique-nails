"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Loader2, Save, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useDesigns } from "@/hooks/use-designs"
import { toast } from "@/components/ui/use-toast"

export default function DesignPage() {
  const [selectedFinger, setSelectedFinger] = useState<number | null>(null)
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null)
  const [fingerDesigns, setFingerDesigns] = useState<Record<number, string>>({})
  const [designName, setDesignName] = useState("My Cosmic Design")
  const [isSaving, setIsSaving] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { user } = useAuth()
  const { createDesign } = useDesigns()
  const router = useRouter()

  const designs = [
    { id: "holographic", name: "Holographic Chrome", color: "from-pink-400 via-purple-400 to-blue-500" },
    { id: "gemstone", name: "Gemstone", color: "from-emerald-400 to-teal-500" },
    { id: "galaxy", name: "Galaxy", color: "from-indigo-500 via-purple-500 to-pink-500" },
    { id: "floral", name: "Floral Embossed", color: "from-rose-400 to-pink-500" },
  ]

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw hand
    drawHand(ctx, canvas.width, canvas.height, fingerDesigns, selectedFinger)
  }, [selectedFinger, fingerDesigns])

  const applyDesignToFinger = () => {
    if (selectedFinger !== null && selectedDesign !== null) {
      setFingerDesigns({
        ...fingerDesigns,
        [selectedFinger]: selectedDesign,
      })
    }
  }

  const clearAllDesigns = () => {
    setFingerDesigns({})
  }

  const saveDesign = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your design.",
        variant: "destructive",
      })
      router.push("/auth/sign-in")
      return
    }

    if (Object.keys(fingerDesigns).length === 0) {
      toast({
        title: "No design to save",
        description: "Please apply at least one design before saving.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Determine the primary design type based on most used
      const designCounts: Record<string, number> = {}
      Object.values(fingerDesigns).forEach((design) => {
        designCounts[design] = (designCounts[design] || 0) + 1
      })

      const primaryType = Object.entries(designCounts).sort((a, b) => b[1] - a[1])[0][0]

      const result = await createDesign({
        name: designName,
        type: primaryType,
        fingerDesigns,
        public: true,
      })

      if (result) {
        toast({
          title: "Design saved!",
          description: "Your cosmic nail design has been saved successfully.",
          variant: "default",
        })
        router.push("/saved")
      } else {
        toast({
          title: "Failed to save",
          description: "There was an error saving your design. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "There was an error saving your design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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
          <Link href="/explore" className="text-white hover:text-pink-300 transition-colors">
            Explore
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
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              className="lg:w-2/3 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                  Design Canvas
                </h2>
                <div className="flex gap-2">
                  <motion.button
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="h-5 w-5 text-purple-300" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="h-5 w-5 text-purple-300" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg bg-pink-500 hover:bg-pink-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveDesign}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    ) : (
                      <Save className="h-5 w-5 text-white" />
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  className="bg-transparent border-b border-purple-500/30 text-lg font-medium text-white focus:border-pink-500 focus:outline-none w-full px-2 py-1"
                  placeholder="Design Name"
                />
              </div>

              <div className="relative aspect-[4/3] bg-slate-900/50 rounded-xl overflow-hidden mb-4">
                <canvas ref={canvasRef} width={800} height={600} className="w-full h-full" />

                {/* Finger selection overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[300px] h-[400px]">
                    {[0, 1, 2, 3, 4].map((finger) => (
                      <motion.button
                        key={finger}
                        className={`absolute w-12 h-20 rounded-full border-2 ${
                          selectedFinger === finger
                            ? "border-pink-500 shadow-lg shadow-pink-500/50"
                            : "border-purple-500/30"
                        }`}
                        style={{
                          top: getFingerPosition(finger).top,
                          left: getFingerPosition(finger).left,
                        }}
                        onClick={() => setSelectedFinger(finger)}
                        whileHover={{ scale: 1.1 }}
                        animate={{
                          boxShadow:
                            selectedFinger === finger
                              ? [
                                  "0 0 0px rgba(236, 72, 153, 0.5)",
                                  "0 0 15px rgba(236, 72, 153, 0.7)",
                                  "0 0 0px rgba(236, 72, 153, 0.5)",
                                ]
                              : "none",
                        }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-purple-300">
                {selectedFinger !== null ? (
                  <p>Designing for {getFingerName(selectedFinger)}</p>
                ) : (
                  <p>Select a finger to begin designing</p>
                )}
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 shadow-lg mb-6">
                <h3 className="text-lg font-bold mb-4 font-orbitron">Design Library</h3>

                <div className="grid grid-cols-2 gap-3">
                  {designs.map((design) => (
                    <motion.button
                      key={design.id}
                      className={`relative group ${
                        selectedDesign === design.id ? "ring-2 ring-pink-500 ring-offset-2 ring-offset-slate-800" : ""
                      }`}
                      onClick={() => setSelectedDesign(design.id)}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`aspect-square rounded-lg bg-gradient-to-br ${design.color}`}></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/70 backdrop-blur-sm rounded-lg">
                        <p className="text-xs font-medium text-white">{design.name}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 shadow-lg">
                <h3 className="text-lg font-bold mb-4 font-orbitron">Actions</h3>

                <div className="space-y-3">
                  <motion.button
                    className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                      selectedFinger !== null && selectedDesign !== null
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                        : "bg-slate-700/50 cursor-not-allowed"
                    } transition-all shadow-lg`}
                    onClick={applyDesignToFinger}
                    disabled={selectedFinger === null || selectedDesign === null}
                    whileHover={{ scale: selectedFinger !== null && selectedDesign !== null ? 1.03 : 1 }}
                    whileTap={{ scale: selectedFinger !== null && selectedDesign !== null ? 0.98 : 1 }}
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Apply Design</span>
                  </motion.button>

                  <motion.button
                    className="w-full py-3 px-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    onClick={clearAllDesigns}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Clear All</span>
                  </motion.button>

                  <motion.button
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
                    onClick={saveDesign}
                    disabled={isSaving}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    <span>{isSaving ? "Saving..." : "Save Design"}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

function getFingerPosition(finger: number) {
  // Positions for thumb, index, middle, ring, pinky
  const positions = [
    { top: "250px", left: "30px" }, // thumb
    { top: "120px", left: "90px" }, // index
    { top: "80px", left: "140px" }, // middle
    { top: "100px", left: "190px" }, // ring
    { top: "140px", left: "240px" }, // pinky
  ]

  return positions[finger]
}

function getFingerName(finger: number) {
  const names = ["Thumb", "Index Finger", "Middle Finger", "Ring Finger", "Pinky"]
  return names[finger]
}

function drawHand(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fingerDesigns: Record<number, string>,
  selectedFinger: number | null,
) {
  // Set up hand dimensions
  const handWidth = width * 0.6
  const handHeight = height * 0.7
  const handX = width / 2 - handWidth / 2
  const handY = height / 2 - handHeight / 3

  // Draw palm
  ctx.fillStyle = "#f8e0d4"
  ctx.beginPath()
  ctx.ellipse(handX + handWidth / 2, handY + handHeight / 2, handWidth / 3, handHeight / 3, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw fingers
  const fingerPositions = [
    {
      x: handX + handWidth * 0.15,
      y: handY + handHeight * 0.4,
      angle: -0.3,
      length: handHeight * 0.4,
      width: handWidth * 0.15,
    }, // thumb
    { x: handX + handWidth * 0.35, y: handY, angle: 0, length: handHeight * 0.5, width: handWidth * 0.12 }, // index
    {
      x: handX + handWidth * 0.5,
      y: handY - handHeight * 0.05,
      angle: 0,
      length: handHeight * 0.55,
      width: handWidth * 0.12,
    }, // middle
    { x: handX + handWidth * 0.65, y: handY, angle: 0, length: handHeight * 0.5, width: handWidth * 0.12 }, // ring
    {
      x: handX + handWidth * 0.8,
      y: handY + handHeight * 0.1,
      angle: 0,
      length: handHeight * 0.4,
      width: handWidth * 0.1,
    }, // pinky
  ]

  // Draw each finger
  fingerPositions.forEach((finger, index) => {
    // Draw finger
    ctx.save()
    ctx.translate(finger.x, finger.y)
    ctx.rotate(finger.angle)

    // Finger body
    ctx.fillStyle = "#f8e0d4"
    ctx.beginPath()
    ctx.roundRect(-finger.width / 2, 0, finger.width, finger.length, [finger.width / 2])
    ctx.fill()

    // Nail
    const nailWidth = finger.width * 0.8
    const nailHeight = finger.length * 0.25
    const nailY = finger.length * 0.1

    ctx.fillStyle = fingerDesigns[index] ? getDesignColor(fingerDesigns[index]) : "#fff"
    ctx.beginPath()
    ctx.roundRect(-nailWidth / 2, nailY, nailWidth, nailHeight, [nailWidth / 2, nailWidth / 2, 0, 0])
    ctx.fill()

    // Highlight selected finger
    if (selectedFinger === index) {
      ctx.strokeStyle = "#ec4899"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(-finger.width / 2, 0, finger.width, finger.length, [finger.width / 2])
      ctx.stroke()
    }

    ctx.restore()
  })
}

function getDesignColor(designId: string) {
  switch (designId) {
    case "holographic":
      return "rgba(236, 72, 153, 0.7)" // pink
    case "gemstone":
      return "rgba(16, 185, 129, 0.7)" // emerald
    case "galaxy":
      return "rgba(139, 92, 246, 0.7)" // purple
    case "floral":
      return "rgba(244, 114, 182, 0.7)" // rose
    default:
      return "#fff"
  }
}
