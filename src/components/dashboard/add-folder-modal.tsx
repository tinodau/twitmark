"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
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
  Check,
} from "lucide-react"
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

// Predefined icons
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

// Map icon IDs to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {}
FOLDER_ICONS.forEach((i) => {
  ICON_MAP[i.id] = i.icon
})

export function AddFolderModal({ isOpen, onClose }: AddFolderModalProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState(FOLDER_COLORS[0])
  const [icon, setIcon] = useState(FOLDER_ICONS[0].id)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const pickerTriggerRef = useRef<HTMLButtonElement>(null)
  const pickerDropdownRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)
  const { success, error: showError } = useToast()

  const SelectedIcon = ICON_MAP[icon]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("color", color)
    formData.append("icon", icon)

    const result = await createFolder(formData)

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
      showError("Failed to create folder", result.error)
    } else {
      success(`Folder "${name}" created`)
      setName("")
      setColor(FOLDER_COLORS[0])
      setIcon(FOLDER_ICONS[0].id)
      setIsPickerOpen(false)
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
              aria-labelledby="folder-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <div className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/90 relative rounded-2xl border p-6 shadow-2xl backdrop-blur-xl">
                {/* Header */}
                <div className="border-border/40 mb-6 flex items-center justify-between border-b pb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-xl"
                      aria-hidden="true"
                    >
                      <Folder className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h2 id="folder-modal-title" className="text-xl font-semibold">
                        New Folder
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Create a folder to organize bookmarks
                      </p>
                    </div>
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input with Icon and Color */}
                  <div className="space-y-2">
                    <label htmlFor="folder-name" className="text-sm font-medium">
                      Folder Name
                    </label>
                    <div className="relative">
                      <div className="border-input bg-background focus-within:ring-ring flex items-center gap-3 rounded-xl border p-2 transition-all focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none">
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
                          placeholder="e.g., Tech News, Dev Tips..."
                          className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
                          maxLength={50}
                          aria-describedby="folder-name-counter"
                          aria-invalid={!!error}
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
                            className="border-border bg-background/95 absolute top-full left-0 z-10 mt-2 max-h-96 w-full overflow-x-hidden overflow-y-auto rounded-xl border p-4 shadow-xl backdrop-blur-xl"
                          >
                            {/* Icon Picker */}
                            <fieldset className="mb-4">
                              <legend className="mb-3 block text-sm font-medium">Icon</legend>
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
                                      aria-label={`Icon ${i.name}`}
                                      className={`focus:ring-primary/50 flex h-9 w-full cursor-pointer items-center justify-center rounded-lg border transition-all focus:ring-2 focus:outline-none ${
                                        icon === i.id
                                          ? "border-primary bg-primary/10"
                                          : "border-input hover:bg-accent"
                                      }`}
                                    >
                                      <Icon
                                        className="text-foreground h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  )
                                })}
                              </div>
                            </fieldset>

                            {/* Color Picker */}
                            <fieldset>
                              <legend className="mb-3 block text-sm font-medium">Color</legend>
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
                                    className={`focus:ring-primary/50 h-9 w-9 cursor-pointer rounded-xl transition-all focus:ring-2 focus:outline-none ${
                                      color === c
                                        ? "ring-primary ring-offset-background scale-110 ring-2 ring-offset-2"
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
                              className="text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors focus:ring-2 focus:outline-none"
                            >
                              <ChevronUp className="h-4 w-4" aria-hidden="true" />
                              Done
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <p
                      id="folder-name-counter"
                      className="text-muted-foreground/60 mt-1.5 text-xs"
                      aria-live="polite"
                    >
                      {name.length}/50 characters
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <p
                      className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm"
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
                      className="border-input hover:bg-accent-foreground hover:text-foreground focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center rounded-xl border bg-transparent px-4 py-3 font-medium transition-colors focus:ring-2 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      ref={lastFocusableRef}
                      type="submit"
                      disabled={isSubmitting || !name.trim()}
                      className="bg-primary hover:bg-primary/80 focus:ring-primary/50 text-primary-foreground flex-1 rounded-xl px-4 py-3 font-medium transition-all hover:cursor-pointer focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
