"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Link as LinkIcon, Folder as FolderIcon } from "lucide-react"
import { updateBookmark } from "@/app/actions/bookmarks"
import { getFolders } from "@/app/actions/folders"
import { useToast } from "@/contexts/toast-context"
import type { BookmarkWithFolder, Folder } from "@/types"

interface EditBookmarkModalProps {
  isOpen: boolean
  onClose: () => void
  bookmark: BookmarkWithFolder
  onUpdate?: () => void
}

// Inner component that gets remounted when bookmark.id changes
function EditBookmarkContent({
  bookmark,
  onClose,
  onUpdate,
}: {
  bookmark: BookmarkWithFolder
  onClose: () => void
  onUpdate?: () => void
}) {
  const initialTitle =
    (bookmark.metadata?.title as string) ||
    ((bookmark.metadata?.author_name as string)
      ? `${bookmark.metadata?.author_name}'s tweet`
      : "Tweet")

  const initialFolderIds = bookmark.folders?.map((f) => f.id) || []

  const [title, setTitle] = useState(initialTitle)
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>(initialFolderIds)
  const [isLoading, setIsLoading] = useState(false)
  const [isFoldersLoading, setIsFoldersLoading] = useState(false)
  const [error, setError] = useState("")
  const [folders, setFolders] = useState<Folder[]>([])
  const { success, error: showError } = useToast()
  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)

  // Load folders when modal opens
  useEffect(() => {
    const loadFoldersAsync = async () => {
      setIsFoldersLoading(true)
      const data = await getFolders()
      setFolders(data)
      setIsFoldersLoading(false)
    }

    loadFoldersAsync()
  }, [])

  // Handle body scroll and focus when modal opens
  useEffect(() => {
    document.body.style.overflow = "hidden"
    setTimeout(() => {
      firstFocusableRef.current?.focus()
    }, 100)

    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isLoading, onClose])

  // Focus trap within modal
  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return

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
  }, [])

  const handleToggleFolder = (folderId: string) => {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
    )
  }

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
    selectedFolderIds.forEach((folderId) => formData.append("folderIds", folderId))

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

  return (
    <motion.div
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
        className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl backdrop-blur"
      >
        {/* Header */}
        <div className="border-border/40 flex items-center justify-between border-b p-6">
          <div>
            <h2 id="modal-title" className="text-xl font-semibold">
              Edit Bookmark
            </h2>
            <p className="text-muted-foreground text-sm">Update title and folders</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Title */}
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

            {/* URL (disabled) */}
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

            {/* Folders */}
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">Folders</label>
              {isFoldersLoading ? (
                <div className="border-border/40 bg-muted/50 flex items-center gap-2 rounded-lg border px-4 py-3">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span className="text-muted-foreground text-sm">Loading folders...</span>
                </div>
              ) : folders.length > 0 ? (
                <div className="space-y-2" role="group" aria-label="Select folders">
                  {folders.map((folder) => {
                    const isSelected = selectedFolderIds.includes(folder.id)
                    return (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => handleToggleFolder(folder.id)}
                        aria-pressed={isSelected}
                        disabled={isLoading}
                        className={`focus:ring-primary/50 flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-accent"
                        }`}
                      >
                        <div
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2"
                          style={{
                            borderColor: isSelected ? folder.color : "currentColor",
                            backgroundColor: isSelected ? folder.color : "transparent",
                          }}
                          aria-hidden="true"
                        >
                          {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: folder.color }}
                          aria-hidden="true"
                        />
                        <span className="font-medium">{folder.name}</span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="border-border/40 bg-muted/30 rounded-lg border border-dashed px-4 py-8 text-center">
                  <FolderIcon
                    className="text-muted-foreground/50 mx-auto h-12 w-12"
                    aria-hidden="true"
                  />
                  <p className="text-muted-foreground mt-2 text-sm">No folders yet</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Create folders to organize your bookmarks
                  </p>
                </div>
              )}
            </div>

            {error && (
              <p id="title-error" className="text-destructive text-sm" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="border-border/40 mt-6 flex gap-3 border-t pt-6">
            <button
              type="button"
              onClick={isLoading ? undefined : onClose}
              disabled={isLoading}
              className="border-input hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-transparent px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading || !title.trim() || isFoldersLoading}
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
  )
}

export function EditBookmarkModal({ isOpen, onClose, bookmark, onUpdate }: EditBookmarkModalProps) {
  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <EditBookmarkContent
          key={bookmark.id}
          bookmark={bookmark}
          onClose={onClose}
          onUpdate={onUpdate}
        />
      )}
    </AnimatePresence>,
    document.body
  )
}
