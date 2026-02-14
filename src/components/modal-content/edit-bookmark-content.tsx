"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link as LinkIcon, Check, ChevronDown, Plus, X } from "lucide-react"
import { updateBookmark } from "@/app/actions/bookmarks"
import { getFolders } from "@/app/actions/folders"
import { useToast } from "@/contexts/toast-context"
import { useModal } from "@/contexts/modal-context"
import type { Folder as FolderType } from "@/types"

export function EditBookmarkContent() {
  const { modal, closeModal, openModal } = useModal()
  const [title, setTitle] = useState("")
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFoldersLoading, setIsFoldersLoading] = useState(false)
  const [error, setError] = useState("")
  const [isFolderDropdownOpen, setIsFolderDropdownOpen] = useState(false)
  const [folders, setFolders] = useState<FolderType[]>([])
  const { success, error: showError } = useToast()
  const urlInputRef = useRef<HTMLInputElement>(null)
  const folderDropdownRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)

  // Initialize bookmark data when component mounts
  useEffect(() => {
    if (modal?.type === "edit-bookmark" && modal.bookmark?.metadata) {
      const initialTitle =
        (modal.bookmark.metadata.title as string) ||
        ((modal.bookmark.metadata.author_name as string)
          ? `${modal.bookmark.metadata.author_name}'s tweet`
          : "Tweet")
      const initialFolderIds = modal.bookmark.folders?.map((f) => f.id) || []

      // Wrap in setTimeout to avoid cascading renders
      setTimeout(() => {
        setTitle(initialTitle)
        setSelectedFolderIds(initialFolderIds)
      }, 0)
    }
  }, [modal])

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

  // Load folders and manage focus when component mounts
  useEffect(() => {
    const loadFoldersAsync = async () => {
      setIsFoldersLoading(true)
      const data = await getFolders()
      setFolders(data)
      setIsFoldersLoading(false)
    }

    loadFoldersAsync()
    setTimeout(() => {
      firstFocusableRef.current?.focus()
    }, 100)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    // Type guard - ensure modal is edit-bookmark type
    if (modal?.type !== "edit-bookmark") return

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

    const result = await updateBookmark(modal?.bookmark?.id || "", formData)

    if (result.error) {
      setError(result.error)
      showError("Failed to update bookmark", result.error)
      setIsLoading(false)
    } else {
      success("Bookmark updated successfully")
      setIsLoading(false)
      setIsFolderDropdownOpen(false)
      closeModal()
      if (modal?.onSuccess) {
        modal.onSuccess()
      }
    }
  }

  // Type guard - modal must be edit-bookmark type to render
  if (modal?.type !== "edit-bookmark") return null

  return (
    <div className="border-border/30 bg-background/75 supports-backdrop-filter:bg-background/90 relative rounded-2xl border p-6 shadow-2xl backdrop-blur">
      {/* Header */}
      <div className="border-border/40 -mx-6 mb-6 flex items-center justify-between border-b px-6 pb-6">
        <div>
          <h2 id="modal-title" className="text-xl font-semibold">
            Edit Bookmark
          </h2>
          <p className="text-muted-foreground text-sm">Update title and folders</p>
        </div>
        <button
          ref={firstFocusableRef}
          onClick={closeModal}
          aria-label="Close modal"
          disabled={isLoading}
          className="text-muted-foreground hover:bg-accent-foreground/50 hover:text-foreground focus:ring-primary/50 -mt-4 cursor-pointer rounded-lg p-2 transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="title" className="text-foreground block text-sm font-medium">
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
            <label htmlFor="url" className="text-foreground block text-sm font-medium">
              Tweet URL
            </label>
            <div className="relative">
              <LinkIcon
                className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="url"
                ref={urlInputRef}
                type="url"
                value={modal?.bookmark?.url}
                disabled
                className="border-input bg-muted/50 text-muted-foreground w-full rounded-lg border px-10 py-2.5 text-sm opacity-75 focus:ring-0 focus:outline-none"
                aria-label="Tweet URL (disabled)"
              />
            </div>
          </div>

          <div className="space-y-2" ref={folderDropdownRef}>
            <label htmlFor="folder-select" className="text-foreground block text-sm font-medium">
              Folders
            </label>
            <div className="relative">
              <button
                id="folder-select"
                type="button"
                onClick={() => setIsFolderDropdownOpen(!isFolderDropdownOpen)}
                disabled={isFoldersLoading}
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
                              {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
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

                    <div className="border-border/40 bg-background/95 sticky bottom-0 flex items-center gap-2 border-t p-2 backdrop-blur">
                      <button
                        type="button"
                        onClick={() => {
                          setIsFolderDropdownOpen(false)
                          openModal({
                            type: "add-folder",
                            onSuccess: async () => {
                              const data = await getFolders()
                              setFolders(data)
                            },
                          })
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

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            className="border-input hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-transparent px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            ref={lastFocusableRef}
            type="submit"
            disabled={isLoading || !title.trim() || isFoldersLoading}
            className="bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
    </div>
  )
}
