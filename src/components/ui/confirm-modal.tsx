"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import { X, AlertTriangle, Trash2 } from "lucide-react"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning" | "info"
  isLoading?: boolean
}

const variantStyles = {
  danger: {
    icon: <AlertTriangle className="h-6 w-6" />,
    iconBg: "bg-destructive/20 text-destructive",
    confirmBtn: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  },
  warning: {
    icon: <AlertTriangle className="h-6 w-6" />,
    iconBg: "bg-yellow-500/20 text-yellow-400",
    confirmBtn: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
  info: {
    icon: <AlertTriangle className="h-6 w-6" />,
    iconBg: "bg-blue-500/20 text-blue-400",
    confirmBtn: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)

  // Focus management
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        firstFocusableRef.current?.focus()
      }, 100)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, isLoading, onClose])

  // Focus trap within modal
  useEffect(() => {
    const modal = modalRef.current
    if (!modal || !isOpen) return

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener("keydown", handleTab)
    return () => modal.removeEventListener("keydown", handleTab)
  }, [isOpen])

  const style = variantStyles[variant]

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={isLoading ? undefined : onClose}
        className="absolute inset-0 z-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="border-border/40 bg-background/95 relative z-10 w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl saturate-180 backdrop-blur-md"
        style={{ willChange: "transform, opacity" }}
      >
        <div className="p-6">
          {/* Header with Icon */}
          <div className="mb-4 flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}
              aria-hidden="true"
            >
              {variant === "danger" ? <Trash2 className="h-6 w-6" /> : style.icon}
            </div>
            <div className="flex-1">
              <h2 id="confirm-modal-title" className="text-foreground text-xl font-semibold">
                {title}
              </h2>
              {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
            </div>
            <button
              ref={firstFocusableRef}
              onClick={isLoading ? undefined : onClose}
              aria-label="Close modal"
              disabled={isLoading}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 cursor-pointer rounded-lg p-2 transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="border-input hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 flex-1 cursor-pointer rounded-lg border bg-transparent px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              ref={lastFocusableRef}
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                variant === "danger"
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  )
}
