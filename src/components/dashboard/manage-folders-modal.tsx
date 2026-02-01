"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Folder as FolderIcon } from "lucide-react"
import { getFolders } from "@/app/actions/folders"
import { addBookmarkToFolders, removeBookmarkFromFolders } from "@/app/actions/bookmarks"
import { useToast } from "@/contexts/toast-context"
import type { Folder } from "@/types"

interface ManageFoldersModalProps {
  isOpen: boolean
  onClose: () => void
  bookmarkId: string
  currentFolderIds?: string[]
  onUpdate?: () => void
}

// Helper function to convert hex to rgba with opacity
function hexToRgba(hex: string, opacity: number): string {
  const cleanHex = hex.replace("#", "")
  const r = Number.parseInt(cleanHex.substring(0, 2), 16)
  const g = Number.parseInt(cleanHex.substring(2, 4), 16)
  const b = Number.parseInt(cleanHex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export function ManageFoldersModal({
  isOpen,
  onClose,
  bookmarkId,
  currentFolderIds = [],
  onUpdate,
}: ManageFoldersModalProps) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>(currentFolderIds)
  const [isLoading, setIsLoading] = useState(false)
  const [isFoldersLoading, setIsFoldersLoading] = useState(false)
  const { success, error: showError } = useToast()
  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)

  const handleToggleFolder = (folderId: string) => {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
    )
  }

  const handleSave = async () => {
    setIsLoading(true)

    // Calculate folders to add and remove
    const foldersToAdd = selectedFolderIds.filter((id) => !currentFolderIds.includes(id))
    const foldersToRemove = currentFolderIds.filter((id) => !selectedFolderIds.includes(id))

    // Add new folders
    if (foldersToAdd.length > 0) {
      const addResult = await addBookmarkToFolders(bookmarkId, foldersToAdd)
      if (addResult.error) {
        showError("Failed to add folders", addResult.error)
        setIsLoading(false)
        return
      }
    }

    // Remove folders
    if (foldersToRemove.length > 0) {
      const removeResult = await removeBookmarkFromFolders(bookmarkId, foldersToRemove)
      if (removeResult.error) {
        showError("Failed to remove folders", removeResult.error)
        setIsLoading(false)
        return
      }
    }

    success("Folders updated")
    setIsLoading(false)
    onClose()
    onUpdate?.()
  }

  // Load folders when modal opens
  useEffect(() => {
    if (!isOpen) return

    const loadFoldersAsync = async () => {
      setIsFoldersLoading(true)
      const data = await getFolders()
      setFolders(data)
      setIsFoldersLoading(false)
    }

    loadFoldersAsync()
  }, [isOpen])

  // Update selected folder IDs when currentFolderIds changes
  useEffect(() => {
    setSelectedFolderIds(currentFolderIds)
  }, [currentFolderIds])

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

  if (!isOpen) return null

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
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={isLoading ? undefined : onClose}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl backdrop-blur"
            >
              {/* Header */}
              <div className="border-border/40 flex items-center justify-between border-b p-6">
                <div>
                  <h2 id="modal-title" className="text-xl font-semibold">
                    Manage Folders
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Select folders to organize this bookmark
                  </p>
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

              {/* Folder List */}
              <div className="p-6">
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

              {/* Actions */}
              <div className="border-border/40 flex gap-3 border-t p-6">
                <button
                  type="button"
                  onClick={isLoading ? undefined : onClose}
                  disabled={isLoading}
                  className="border-input hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-transparent px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  ref={lastFocusableRef}
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading || isFoldersLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
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
