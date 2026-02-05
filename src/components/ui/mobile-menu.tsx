"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileMenuProps {
  trigger: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

interface MobileMenuItemProps {
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  icon?: React.ReactNode
  variant?: "default" | "danger"
}

export function MobileMenu({ trigger, isOpen, onToggle }: MobileMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Lock body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggle()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onToggle()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onToggle])

  // Close menu on route change
  React.useEffect(() => {
    if (isOpen) {
      onToggle()
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <div className="cursor-pointer" onClick={onToggle}>
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to prevent clicking outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-black/50"
              aria-hidden="true"
            />
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.15 }}
              className="bg-secondary border-border/40 fixed top-16 right-0 z-50 flex h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden border shadow-lg backdrop-blur"
              role="menu"
            >
              <div className="w-full max-w-md px-6" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export function MobileMenuItem({
  onClick,
  disabled,
  children,
  icon,
  variant = "default",
}: MobileMenuItemProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      disabled={disabled}
      role="menuitem"
      className={`focus:ring-primary/50 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-6 py-4 text-center text-lg font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
        variant === "danger"
          ? "text-destructive hover:bg-red-500/10"
          : "text-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {icon && <span className="h-5 w-5">{icon}</span>}
      {children}
    </button>
  )
}
