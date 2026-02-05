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
              <div className="bg-background/95 supports-backdrop-filter:bg-background/60 relative rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
                      aria-hidden="true"
                    >
                      <Folder className="h-5 w-5 text-blue-400" />
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input with Icon and Color */}
                  <div className="space-y-2">
                    <label
                      htmlFor="folder-name"
                      className="block text-sm font-medium text-white/90"
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
                          placeholder="e.g., Tech News, Dev Tips..."
                          className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
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
                            className="bg-background/95 supports-backdrop-filter:bg-background absolute top-full left-0 z-10 mt-2 max-h-[400px] w-full overflow-x-hidden overflow-y-auto rounded-xl border border-white/10 p-4 shadow-xl backdrop-blur-xl"
                          >
                            {/* Icon Picker */}
                            <fieldset className="mb-4">
                              <legend className="mb-3 block text-sm font-medium text-white/90">
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
                                      aria-label={`Icon ${i.name}`}
                                      className={`flex h-9 w-full cursor-pointer items-center justify-center rounded-lg border transition-all focus:ring-2 focus:ring-white/50 focus:outline-none ${
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
                              <legend className="mb-3 block text-sm font-medium text-white/90">
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
                                    aria-label={`Color ${c}`}
                                    className={`h-9 w-9 cursor-pointer rounded-xl transition-all focus:ring-2 focus:ring-white/50 focus:outline-none ${
                                      color === c
                                        ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[rgba(18,18,18,0.95)]"
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
                              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10 focus:ring-2 focus:ring-white/50 focus:outline-none"
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
                      className="mt-1.5 text-xs text-white/40"
                      aria-live="polite"
                    >
                      {name.length}/50 characters
                    </p>
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
                      className="bg-primary hover:bg-primary/90 focus:ring-primary/50 flex-1 rounded-xl px-4 py-3 font-medium text-white transition-all hover:cursor-pointer focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
