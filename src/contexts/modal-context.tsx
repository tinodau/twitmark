"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { BookmarkWithFolder, Folder } from "@/types"

// ============================================================================
// Modal Content Types (Discriminated Union)
// ============================================================================

export type ModalContent =
  | ConfirmModal
  | AddBookmarkModal
  | EditBookmarkModal
  | AddFolderModal
  | EditFolderModal
  | CustomModal

interface BaseModal {
  id: string
}

// Confirm dialog
export interface ConfirmModal extends BaseModal {
  type: "confirm"
  title: string
  description: string
  onConfirm: () => void | Promise<void>
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
}

// Add bookmark
export interface AddBookmarkModal extends BaseModal {
  type: "add-bookmark"
  onSuccess?: () => void
}

// Edit bookmark
export interface EditBookmarkModal extends BaseModal {
  type: "edit-bookmark"
  bookmark: BookmarkWithFolder
  onSuccess?: () => void
}

// Add folder
export interface AddFolderModal extends BaseModal {
  type: "add-folder"
  onSuccess?: () => void
}

// Edit folder
export interface EditFolderModal extends BaseModal {
  type: "edit-folder"
  folder: Folder
  onSuccess?: () => void
  onDelete?: () => void
}

// Custom content
export interface CustomModal extends BaseModal {
  type: "custom"
  content: React.ReactNode
  title?: string
}

// ============================================================================
// Modal Context
// ============================================================================

interface ModalContextType {
  modal: ModalContent | null
  openModal: (
    content:
      | Omit<ConfirmModal, "id">
      | Omit<AddBookmarkModal, "id">
      | Omit<EditBookmarkModal, "id">
      | Omit<AddFolderModal, "id">
      | Omit<EditFolderModal, "id">
      | Omit<CustomModal, "id">
  ) => void
  closeModal: () => void
  confirmModal: (
    title: string,
    description: string,
    onConfirm: () => void | Promise<void>,
    options?: {
      confirmText?: string
      cancelText?: string
      isDestructive?: boolean
    }
  ) => void
  openAddBookmark: (onSuccess?: () => void) => void
  openEditBookmark: (bookmark: BookmarkWithFolder, onSuccess?: () => void) => void
  openAddFolder: (onSuccess?: () => void) => void
  openEditFolder: (folder: Folder, onSuccess?: () => void, onDelete?: () => void) => void
  openCustom: (content: React.ReactNode, title?: string) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalContent | null>(null)

  const closeModal = useCallback(() => {
    setModal(null)
  }, [])

  const openModal = useCallback(
    (
      content:
        | Omit<ConfirmModal, "id">
        | Omit<AddBookmarkModal, "id">
        | Omit<EditBookmarkModal, "id">
        | Omit<AddFolderModal, "id">
        | Omit<EditFolderModal, "id">
        | Omit<CustomModal, "id">
    ) => {
      const id = Math.random().toString(36).substring(2)
      setModal({ ...content, id } as ModalContent)
    },
    []
  )

  // Quick helpers for common modal types
  const confirmModal = useCallback(
    (
      title: string,
      description: string,
      onConfirm: () => void | Promise<void>,
      options?: {
        confirmText?: string
        cancelText?: string
        isDestructive?: boolean
      }
    ) => {
      openModal({
        type: "confirm",
        title,
        description,
        onConfirm,
        ...options,
      })
    },
    [openModal]
  )

  const openAddBookmark = useCallback(
    (onSuccess?: () => void) => {
      openModal({ type: "add-bookmark", onSuccess })
    },
    [openModal]
  )

  const openEditBookmark = useCallback(
    (bookmark: BookmarkWithFolder, onSuccess?: () => void) => {
      openModal({ type: "edit-bookmark", bookmark, onSuccess })
    },
    [openModal]
  )

  const openAddFolder = useCallback(
    (onSuccess?: () => void) => {
      openModal({ type: "add-folder", onSuccess })
    },
    [openModal]
  )

  const openEditFolder = useCallback(
    (folder: Folder, onSuccess?: () => void, onDelete?: () => void) => {
      openModal({ type: "edit-folder", folder, onSuccess, onDelete })
    },
    [openModal]
  )

  const openCustom = useCallback(
    (content: React.ReactNode, title?: string) => {
      openModal({ type: "custom", content, title })
    },
    [openModal]
  )

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modal) {
        closeModal()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [modal, closeModal])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [modal])

  return (
    <ModalContext.Provider
      value={{
        modal,
        openModal,
        closeModal,
        confirmModal,
        openAddBookmark,
        openEditBookmark,
        openAddFolder,
        openEditFolder,
        openCustom,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}
