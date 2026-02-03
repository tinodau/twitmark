"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
}

interface DropdownMenuItemProps {
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  icon?: React.ReactNode
  variant?: "default" | "danger"
}

export function DropdownMenu({ trigger, children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  // Close menu on route change
  React.useEffect(() => {
    setIsOpen(false)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-background/95 border-border/40 absolute right-0 z-50 min-w-[180px] overflow-hidden rounded-xl border shadow-lg backdrop-blur"
            role="menu"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DropdownMenuItem({
  onClick,
  disabled,
  children,
  icon,
  variant = "default",
}: DropdownMenuItemProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      disabled={disabled}
      role="menuitem"
      className={`focus:ring-primary/50 flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
        variant === "danger"
          ? "text-destructive hover:bg-red-500/10"
          : "text-foreground hover:bg-gray-900"
      }`}
    >
      {icon && <span className="h-4 w-4">{icon}</span>}
      {children}
    </button>
  )
}
