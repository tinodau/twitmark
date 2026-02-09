"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Link as LinkIcon, Check, ChevronDown, Plus } from "lucide-react"
import { updateBookmark } from "@/app/actions/bookmarks"
import { getFolders } from "@/app/actions/folders"
import { useFolder } from "@/contexts/folder-context"
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
  const [isFolderDropdownOpen, setIsFolderDropdownOpen] = useState(false)
  const [folders, setFolders] = useState<Folder[]>([])
  const { success, error: showError } = useToast()
  const { setIsAddModalOpen, isAddModalOpen } = useFolder()
  const modalRef = useRef<HTMLDivElement>(null)
  const folderDropdownRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)

  // Close folder dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (folderDropdownRef.current && !folderDropdownRef.current.contains(e.target as Node)) {
        setIsFolderDropdownOpen(false)
      }
    }
    if (isFolderDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFolderDropdownOpen])

  // Refresh folders when Add Folder modal closes (new folder was created)
  useEffect(() => {
    if (!isAddModalOpen) {
      getFolders().then((data) => setFolders(data))
    }
  }, [isAddModalOpen])

  // Load folders when component mounts
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
        className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/90 overflow w-full max-w-md rounded-2xl border shadow-2xl backdrop-blur"
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
            className="text-muted-foreground hover:bg-accent-foreground/50 hover:text-foreground focus:ring-primary/50 cursor-pointer rounded-lg p-2 transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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

            {/* Folder Selection Dropdown */}
            <div className="space-y-2" ref={folderDropdownRef}>
              <label htmlFor="folder-select" className="text-foreground text-sm font-medium">
                Folders
              </label>
              <div className="relative">
                <button
                  id="folder-select"
                  type="button"
                  onClick={() => setIsFolderDropdownOpen(!isFolderDropdownOpen)}
                  disabled={isFoldersLoading || isLoading}
                  className="border-input bg-background hover:bg-accent focus:ring-primary/50 flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-expanded={isFolderDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <div className="flex items-center gap-2">
                    {isFoldersLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : selectedFolderIds.length > 0 ? (
                      <div className="flex items-center gap-1">
                        {selectedFolderIds.slice(0, 2).map((folderId) => {
                          const folder = folders.find((f) => f.id === folderId)
                          if (!folder) return null
                          return (
                            <div key={folder.id} className="flex items-center gap-1.5">
                              <div
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: folder.color }}
                                aria-hidden="true"
                              />
                              <span className="truncate">{folder.name}</span>
                            </div>
                          )
                        })}
                        {selectedFolderIds.length > 2 && (
                          <span className="text-muted-foreground">
                            +{selectedFolderIds.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select folder...</span>
                    )}
                  </div>
                  <ChevronDown
                    className={`text-muted-foreground h-4 w-4 transition-transform ${
                      isFolderDropdownOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isFolderDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="border-border bg-background/95 absolute z-50 mt-1.5 max-h-80 w-full overflow-hidden rounded-lg border shadow-xl backdrop-blur"
                      role="listbox"
                      aria-labelledby="folder-select"
                    >
                      {/* Dropdown Header with Close Button */}
                      <div className="border-border/40 flex items-center justify-between border-b px-3 py-2">
                        <span className="text-foreground text-sm font-medium">Select Folders</span>
                        <button
                          type="button"
                          onClick={() => setIsFolderDropdownOpen(false)}
                          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 cursor-pointer rounded-md p-1 transition-colors focus:ring-2 focus:outline-none"
                          aria-label="Close folder dropdown"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="flex max-h-52 flex-col overflow-y-auto p-1.5">
                        {folders.map((folder) => {
                          const isSelected = selectedFolderIds.includes(folder.id)
                          return (
                            <button
                              key={folder.id}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedFolderIds(
                                    selectedFolderIds.filter((id) => id !== folder.id)
                                  )
                                } else {
                                  setSelectedFolderIds([...selectedFolderIds, folder.id])
                                }
                              }}
                              role="option"
                              aria-selected={isSelected}
                              disabled={isLoading}
                              className={`focus:ring-primary/50 flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                                isSelected ? "bg-primary/10 text-primary" : "hover:bg-accent"
                              }`}
                            >
                              <div
                                className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2"
                                style={{
                                  borderColor: isSelected ? folder.color : "currentColor",
                                  backgroundColor: isSelected ? folder.color : "transparent",
                                }}
                                aria-hidden="true"
                              >
                                {isSelected && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                )}
                              </div>
                              <div
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: folder.color }}
                                aria-hidden="true"
                              />
                              <span className="flex-1 truncate">{folder.name}</span>
                            </button>
                          )
                        })}
                      </div>

                      {/* Sticky "Add Folder" Button */}
                      <div className="border-border/40 bg-background/95 sticky bottom-0 flex items-center gap-2 border-t p-2 backdrop-blur">
                        <button
                          type="button"
                          onClick={() => {
                            setIsFolderDropdownOpen(false)
                            setIsAddModalOpen(true)
                          }}
                          disabled={isLoading}
                          className="focus:ring-primary/50 bg-accent hover:bg-accent/80 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                          Add Folder
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              ref={lastFocusableRef}
              type="button"
              onClick={isLoading ? undefined : onClose}
              disabled={isLoading}
              className="border-input hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-transparent px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
