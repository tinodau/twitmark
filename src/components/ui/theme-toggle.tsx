"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useContext } from "react"
import { ThemeContext } from "@/contexts/theme-context"

export function ThemeToggle() {
  const context = useContext(ThemeContext)
  const [mounted, setMounted] = useState(false)

  // Use context safely, default to dark if not available
  const { theme = "dark", toggleTheme = () => {} } = context || {}

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render placeholder before mount to avoid SSR issues
  if (!mounted || !context) {
    return (
      <div className="border-border/40 bg-card/50 relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border backdrop-blur-sm">
        <Moon className="text-foreground h-5 w-5" />
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      disabled={!context}
      className="group border-border/40 bg-card/50 hover:bg-accent/20 focus:ring-primary/50 relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border backdrop-blur-sm transition-all hover:scale-105 focus:ring-2 focus:outline-none"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait">
        {theme === "dark" && (
          <motion.div
            key="dark"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute"
          >
            <Moon className="text-foreground h-5 w-5" />
          </motion.div>
        )}
        {theme === "light" && (
          <motion.div
            key="light"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute"
          >
            <Sun className="text-foreground h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
