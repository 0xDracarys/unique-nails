import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Unique Nails | Cosmic Nail Art",
  description: "Discover the story behind Unique Nails, where every design is a cosmic celebration of individuality.",
}

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
