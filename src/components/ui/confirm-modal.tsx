"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
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

  const getIconBg = () => {
    if (variant === "danger") return "bg-red-500/20 text-red-400"
    if (variant === "warning") return "bg-yellow-500/20 text-yellow-400"
    return "bg-blue-500/20 text-blue-400"
  }

  const getConfirmBtnClass = () => {
    if (variant === "danger") {
      return "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
    }
    return "bg-gradient-to-r from-cyan-700 to-blue-800 hover:from-cyan-600 hover:to-blue-700"
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={isLoading ? undefined : onClose}
          >
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
              className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl backdrop-blur"
            >
              {/* Header */}
              <div className="border-border/40 flex items-center justify-between border-b p-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${getIconBg()}`}
                    aria-hidden="true"
                  >
                    {variant === "danger" ? (
                      <Trash2 className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h2 id="confirm-modal-title" className="text-xl font-semibold">
                      {title}
                    </h2>
                    <p className="text-muted-foreground text-sm">{description}</p>
                  </div>
                </div>
                <button
                  ref={firstFocusableRef}
                  onClick={isLoading ? undefined : onClose}
                  aria-label="Close modal"
                  disabled={isLoading}
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg p-0 transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="border-input hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-transparent px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  ref={lastFocusableRef}
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`focus:ring-primary/50 text-primary-foreground flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:cursor-pointer focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${getConfirmBtnClass()}`}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
                      Deleting...
                    </>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
