"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkAuth()
  }, [])

  const buttonText = user ? "Dashboard" : "Get Started"

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
  ]

  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.height = "100vh"
    } else {
      document.body.style.overflow = ""
      document.body.style.height = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.height = ""
    }
  }, [isOpen])

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-lg"
      aria-label="Main navigation"
    >
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          className="focus:ring-primary/50 flex items-center gap-2 rounded-lg focus:ring-2 focus:outline-none"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-600 to-blue-700 font-bold text-white"
            aria-hidden="true"
          >
            T
          </div>
          <span className="text-xl font-bold text-white">Twitmark</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 sm:flex" role="list">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-muted-foreground focus:ring-primary/50 rounded-lg px-2 py-1 text-sm font-medium transition-colors hover:text-white focus:ring-2 focus:outline-none"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/dashboard"
              className="group focus:ring-primary/50 relative inline-flex h-10 items-center justify-center gap-2 rounded-full bg-linear-to-r from-cyan-600 to-blue-700 px-6 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/25 focus:ring-2 focus:outline-none"
              aria-label={user ? "Go to dashboard" : "Get started"}
            >
              {loading ? "..." : buttonText}
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle mobile menu"
          className="focus:ring-primary/50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 focus:ring-2 focus:outline-none sm:hidden"
        >
          {isOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </motion.div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10 sm:hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <ul className="flex h-[calc(100vh-5rem)] flex-col items-center justify-center gap-6 px-4 pt-6 pb-40">
              {navLinks.map((link) => (
                <li key={link.name} className="hover:text-muted w-full text-center">
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="focus:ring-primary/50 hover:text-muted-foreground block rounded-lg px-2 py-2 text-lg font-medium text-white transition-colors focus:ring-2 focus:outline-none"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="focus:ring-primary/50 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-linear-to-r from-cyan-600 to-blue-700 px-6 text-lg font-medium text-white transition-all focus:ring-2 focus:outline-none"
                  aria-label={user ? "Go to dashboard" : "Get started"}
                >
                  {loading ? "..." : buttonText}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
