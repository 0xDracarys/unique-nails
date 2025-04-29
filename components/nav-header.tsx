"use client"

import type React from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function NavHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-amber-500/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <motion.div
            className="text-xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            CosmicNails
          </motion.div>
        </Link>

        {/* Mobile menu button */}
        <motion.button
          className="md:hidden text-white p-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/explore">Explore</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/design">Design</NavLink>
          <NavLink href="/saved">Saved</NavLink>
          <NavLink href="/profile">Profile</NavLink>
        </nav>
      </div>

      {/* Mobile menu */}
      <motion.nav
        className={`md:hidden absolute w-full bg-slate-900/95 backdrop-blur-md border-b border-amber-500/10 ${
          isMenuOpen ? "block" : "hidden"
        }`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isMenuOpen ? "auto" : 0, opacity: isMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <NavLink href="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink href="/explore" onClick={() => setIsMenuOpen(false)}>
            Explore
          </NavLink>
          <NavLink href="/about" onClick={() => setIsMenuOpen(false)}>
            About
          </NavLink>
          <NavLink href="/design" onClick={() => setIsMenuOpen(false)}>
            Design
          </NavLink>
          <NavLink href="/saved" onClick={() => setIsMenuOpen(false)}>
            Saved
          </NavLink>
          <NavLink href="/profile" onClick={() => setIsMenuOpen(false)}>
            Profile
          </NavLink>
        </div>
      </motion.nav>
    </header>
  )
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
}

function NavLink({ href, children, isActive, onClick }: NavLinkProps) {
  return (
    <Link href={href} onClick={onClick}>
      <motion.span
        className={`relative px-2 py-1 ${
          isActive ? "text-amber-400" : "text-white hover:text-amber-300"
        } transition-colors`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
        {isActive && (
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-purple-400"
            layoutId="activeNavIndicator"
          />
        )}
      </motion.span>
    </Link>
  )
}
