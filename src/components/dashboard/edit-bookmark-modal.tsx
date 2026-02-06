"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Link as LinkIcon } from "lucide-react"
import { updateBookmark } from "@/app/actions/bookmarks"
import { useToast } from "@/contexts/toast-context"
import type { BookmarkWithFolder } from "@/types"

interface EditBookmarkModalProps {
  isOpen: boolean
  onClose: () => void
  bookmark: BookmarkWithFolder
  onUpdate?: () => void
}

export function EditBookmarkModal({ isOpen, onClose, bookmark, onUpdate }: EditBookmarkModalProps) {
  // Derive initial title from bookmark
  const initialTitle = useMemo(
    () =>
      (bookmark.metadata?.title as string) ||
      ((bookmark.metadata?.author_name as string)
        ? `${bookmark.metadata?.author_name}'s tweet`
        : "Tweet"),
    [bookmark.metadata]
  )

  const [title, setTitle] = useState(initialTitle)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { success, error: showError } = useToast()
  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)

  // Reset form when modal opens
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

  // Reset title when bookmark changes
  useEffect(() => {
    setTitle(initialTitle)
  }, [initialTitle])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append("title", title)

    const result = await updateBookmark(bookmark.id, formData)

    if (result.error) {
      setError(result.error)
      showError("Failed to update bookmark", result.error)
      setIsLoading(false)
    } else {
      success("Bookmark updated successfully")
      setIsLoading(false)
      onClose()
      onUpdate?.()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={bookmark.id}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
            className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 overflow w-full max-w-md rounded-2xl border shadow-2xl backdrop-blur"
          >
            {/* Header */}
            <div className="border-border/40 flex items-center justify-between border-b p-6">
              <div>
                <h2 id="modal-title" className="text-xl font-semibold">
                  Edit Bookmark
                </h2>
                <p className="text-muted-foreground text-sm">Update bookmark title</p>
              </div>
              <button
                ref={firstFocusableRef}
                onClick={onClose}
                aria-label="Close modal"
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 cursor-pointer rounded-lg p-2 transition-colors focus:ring-2 focus:outline-none"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-foreground text-sm font-medium">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Bookmark title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                    aria-describedby={error ? "title-error" : undefined}
                    aria-invalid={!!error}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="url" className="text-foreground text-sm font-medium">
                    Tweet URL
                  </label>
                  <div className="relative">
                    <LinkIcon
                      className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="url"
                      type="url"
                      value={bookmark.url}
                      disabled
                      className="border-input bg-muted/50 text-muted-foreground w-full rounded-lg border px-10 py-2.5 text-sm opacity-75 focus:ring-0 focus:outline-none"
                      aria-label="Tweet URL (disabled)"
                    />
                  </div>
                </div>

                {error && (
                  <p id="title-error" className="text-destructive text-sm" role="alert">
                    {error}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="border-input hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-transparent px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading || !title.trim()}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
