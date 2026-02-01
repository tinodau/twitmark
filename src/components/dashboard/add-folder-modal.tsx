"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, FolderPlus } from "lucide-react"
import { createFolder } from "@/app/actions/folders"
import { useToast } from "@/contexts/toast-context"

interface AddFolderModalProps {
  isOpen: boolean
  onClose: () => void
}

// Predefined color palette
const FOLDER_COLORS = [
  "#1D9BF0", // Blue
  "#F91880", // Red
  "#BA36F4", // Purple
  "#EAB308", // Yellow
  "#17A34A", // Green
  "#F97316", // Orange
  "#EC4899", // Pink
  "#06B6D4", // Cyan
]

export function AddFolderModal({ isOpen, onClose }: AddFolderModalProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState(FOLDER_COLORS[0])
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)
  const { success, error: showError } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("color", color)

    const result = await createFolder(formData)

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
      showError("Failed to create folder", result.error)
    } else {
      success(`Folder "${name}" created`)
      setName("")
      setColor(FOLDER_COLORS[0])
      onClose()
    }
  }

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus on name input when modal opens
      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 100)
      // Prevent body scroll
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
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="folder-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <div className="rounded-2xl border border-white/10 bg-[rgba(18,18,18,0.8)] p-6 shadow-2xl backdrop-blur-xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                      aria-hidden="true"
                    >
                      <FolderPlus className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 id="folder-modal-title" className="text-xl font-semibold text-white">
                        New Folder
                      </h2>
                      <p className="text-sm text-white/60">Create a folder to organize bookmarks</p>
                    </div>
                  </div>
                  <button
                    ref={firstFocusableRef}
                    onClick={onClose}
                    aria-label="Close modal"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                  >
                    <X className="h-4 w-4 text-white/60" aria-hidden="true" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="folder-name"
                      className="mb-2 block text-sm font-medium text-white/90"
                    >
                      Folder Name
                    </label>
                    <input
                      id="folder-name"
                      ref={nameInputRef}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Tech News, Dev Tips..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all placeholder:text-white/40 focus:border-transparent focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                      maxLength={50}
                      aria-describedby="folder-name-counter"
                      aria-invalid={!!error}
                    />
                    <p
                      id="folder-name-counter"
                      className="mt-1.5 text-xs text-white/40"
                      aria-live="polite"
                    >
                      {name.length}/50 characters
                    </p>
                  </div>

                  {/* Color Picker */}
                  <div>
                    <fieldset>
                      <legend className="mb-3 block text-sm font-medium text-white/90">
                        Folder Color
                      </legend>
                      <div
                        className="flex flex-wrap gap-2"
                        role="radiogroup"
                        aria-label="Select folder color"
                      >
                        {FOLDER_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            aria-pressed={color === c}
                            aria-label={`Color ${c}`}
                            className={`h-9 w-9 cursor-pointer rounded-xl transition-all focus:ring-2 focus:ring-white/50 focus:outline-none ${
                              color === c
                                ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[rgba(18,18,18,0.8)]"
                                : "hover:scale-110"
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  {/* Preview */}
                  <div
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3"
                    role="status"
                    aria-live="polite"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    >
                      <FolderPlus className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-white/90">{name || "Untitled Folder"}</span>
                  </div>

                  {/* Error */}
                  {error && (
                    <p
                      className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-400"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-xl bg-white/5 px-4 py-3 font-medium text-white transition-colors hover:cursor-pointer hover:bg-white/10 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      ref={lastFocusableRef}
                      type="submit"
                      disabled={isSubmitting || !name.trim()}
                      className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-medium text-white transition-all hover:cursor-pointer hover:from-blue-500 hover:to-purple-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Folder"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
