"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Check,
  Trash2,
  Folder,
  Star,
  Heart,
  Bookmark,
  Zap,
  Book,
  Target,
  Tag,
  Briefcase,
  Code2,
  ChevronUp,
} from "lucide-react"
import { updateFolder, deleteFolder } from "@/app/actions/folders"
import { useToast } from "@/contexts/toast-context"
import type { Folder as FolderType } from "@/types"
import { ConfirmModal } from "@/components/ui/confirm-modal"

interface EditFolderModalProps {
  isOpen: boolean
  onClose: () => void
  folder: FolderType | null
  onDelete?: () => void
}

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

const FOLDER_ICONS = [
  { id: "folder", icon: Folder, name: "Folder" },
  { id: "star", icon: Star, name: "Star" },
  { id: "heart", icon: Heart, name: "Heart" },
  { id: "bookmark", icon: Bookmark, name: "Bookmark" },
  { id: "zap", icon: Zap, name: "Zap" },
  { id: "book", icon: Book, name: "Book" },
  { id: "target", icon: Target, name: "Target" },
  { id: "tag", icon: Tag, name: "Tag" },
  { id: "briefcase", icon: Briefcase, name: "Briefcase" },
  { id: "code", icon: Code2, name: "Code" },
]

const ICON_MAP: Record<string, React.ElementType> = {}
FOLDER_ICONS.forEach((i) => {
  ICON_MAP[i.id] = i.icon
})

export function EditFolderModal({ isOpen, onClose, folder, onDelete }: EditFolderModalProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState("#1D9BF0")
  const [icon, setIcon] = useState("folder")
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const { success, error: showError } = useToast()
  const modalRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const pickerTriggerRef = useRef<HTMLButtonElement>(null)
  const pickerDropdownRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)
  const initializedFolderIdRef = useRef<string | null>(null)

  const SelectedIcon = ICON_MAP[icon]

  useEffect(() => {
    if (isOpen && folder) {
      if (initializedFolderIdRef.current !== folder.id) {
        initializedFolderIdRef.current = folder.id
        setTimeout(() => {
          setName(folder.name)
          setColor(folder.color)
          setIcon(folder.icon || "folder")
          setIsPickerOpen(false)
        }, 0)
      }
      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, folder])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!folder) return

    setIsLoading(true)
    const result = await updateFolder(folder.id, name, color, icon)

    if ("error" in result) {
      showError("Failed to update folder", result.error)
      setIsLoading(false)
    } else {
      success("Folder updated")
      setIsLoading(false)
      setIsPickerOpen(false)
      onClose()
    }
  }

  const handleDelete = async () => {
    if (!folder) return

    setIsDeleting(true)
    const result = await deleteFolder(folder.id)

    if ("error" in result) {
      showError("Failed to delete folder", result.error)
      setIsDeleting(false)
    } else {
      success("Folder deleted")
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      onDelete?.()
      onClose()
    }
  }

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (isPickerOpen) {
          setIsPickerOpen(false)
        } else {
          onClose()
        }
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose, isPickerOpen])

  // Close picker when clicking outside (but not inside picker)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isPickerOpen && pickerDropdownRef.current) {
        const dropdownRect = pickerDropdownRef.current.getBoundingClientRect()
        const isClickInsideDropdown =
          e.clientX >= dropdownRect.left &&
          e.clientX <= dropdownRect.right &&
          e.clientY >= dropdownRect.top &&
          e.clientY <= dropdownRect.bottom

        if (!isClickInsideDropdown) {
          setIsPickerOpen(false)
        }
      }
    }

    if (isPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPickerOpen])

  if (!isOpen || !folder) return null

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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 w-full max-w-md rounded-2xl border shadow-2xl backdrop-blur"
            >
              {/* Header */}
              <div className="border-border/40 flex items-center justify-between border-b p-6">
                <div>
                  <h2 id="modal-title" className="text-xl font-semibold">
                    Edit Folder
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Update folder name, icon, and color
                  </p>
                </div>
                <button
                  ref={firstFocusableRef}
                  onClick={onClose}
                  aria-label="Close modal"
                  className="text-muted-foreground hover:bg-accent-foreground/50 hover:text-foreground focus:ring-primary/50 cursor-pointer rounded-lg p-2 transition-colors focus:ring-2 focus:outline-none"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdate} className="space-y-4 p-6">
                {/* Name Input with Icon and Color */}
                <div className="space-y-2">
                  <label
                    htmlFor="folder-name"
                    className="text-foreground block text-sm font-medium"
                  >
                    Folder Name
                  </label>
                  <div className="relative">
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2 transition-all focus-within:border-white/20">
                      {/* Icon Selector Button */}
                      <button
                        ref={pickerTriggerRef}
                        type="button"
                        onClick={() => !isPickerOpen && setIsPickerOpen(true)}
                        aria-expanded={isPickerOpen}
                        aria-label="Select icon and color"
                        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-all focus:ring-2 focus:ring-white/50 focus:outline-none"
                        style={{ backgroundColor: color }}
                      >
                        <SelectedIcon className="h-5 w-5 text-white" />
                      </button>

                      {/* Name Input */}
                      <input
                        id="folder-name"
                        ref={nameInputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Folder name..."
                        className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Icon & Color Dropdown */}
                    <AnimatePresence>
                      {isPickerOpen && (
                        <motion.div
                          ref={pickerDropdownRef}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-background/95 supports-backdrop-filter:bg-background absolute top-full left-0 z-10 mt-2 max-h-96 w-full overflow-x-hidden overflow-y-auto rounded-xl border border-white/10 p-4 shadow-xl backdrop-blur-xl"
                        >
                          {/* Icon Picker */}
                          <fieldset className="mb-4">
                            <legend className="text-foreground mb-3 block text-sm font-medium">
                              Icon
                            </legend>
                            <div
                              className="grid grid-cols-5 gap-2"
                              role="radiogroup"
                              aria-label="Select folder icon"
                            >
                              {FOLDER_ICONS.map((i) => {
                                const Icon = i.icon
                                return (
                                  <button
                                    key={i.id}
                                    type="button"
                                    onClick={() => setIcon(i.id)}
                                    aria-pressed={icon === i.id}
                                    disabled={isLoading}
                                    aria-label={`Icon ${i.name}`}
                                    className={`flex h-9 w-full cursor-pointer items-center justify-center rounded-lg border transition-all focus:ring-2 focus:ring-white/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                                      icon === i.id
                                        ? "border-white bg-white/10"
                                        : "border-white/10 bg-white/5 hover:border-white/20"
                                    }`}
                                  >
                                    <Icon className="h-5 w-5 text-white/80" aria-hidden="true" />
                                  </button>
                                )
                              })}
                            </div>
                          </fieldset>

                          {/* Color Picker */}
                          <fieldset>
                            <legend className="text-foreground mb-3 block text-sm font-medium">
                              Color
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
                                  disabled={isLoading}
                                  aria-label={`Color ${c}`}
                                  className={`h-9 w-9 cursor-pointer rounded-xl transition-all focus:ring-2 focus:ring-white/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                                    color === c
                                      ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-400"
                                      : ""
                                  }`}
                                  style={{ backgroundColor: c }}
                                >
                                  {color === c && (
                                    <Check
                                      className="mx-auto h-5 w-5 text-white"
                                      aria-hidden="true"
                                    />
                                  )}
                                </button>
                              ))}
                            </div>
                          </fieldset>

                          {/* Close Button */}
                          <button
                            type="button"
                            onClick={() => setIsPickerOpen(false)}
                            disabled={isLoading}
                            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10 focus:ring-2 focus:ring-white/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <ChevronUp className="h-4 w-4" aria-hidden="true" />
                            Done
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 focus:ring-destructive/50 flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading || isDeleting}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </button>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={onClose}
                    className="border-input hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-transparent px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    ref={lastFocusableRef}
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-primary/50 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading || !name.trim()}
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Delete Confirm Modal */}
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Delete Folder"
            description={`This will remove folder "${folder.name}". Bookmarks in this folder will not be deleted.`}
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
            isLoading={isDeleting}
          />
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
