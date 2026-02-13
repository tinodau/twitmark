"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

export type ModalType = "confirm" | "form" | "custom"

export interface Modal {
  id: string
  type: ModalType
  title: string
  description?: string
  content?: React.ReactNode
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  isLoading?: boolean
}

interface ModalContextType {
  modal: Modal | null
  openModal: (modal: Omit<Modal, "id">) => void
  closeModal: () => void
  confirmModal: (modal: Omit<Modal, "id" | "type">) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<Modal | null>(null)

  const closeModal = useCallback(() => {
    setModal(null)
  }, [])

  const openModal = useCallback((modalConfig: Omit<Modal, "id">) => {
    const id = Math.random().toString(36).substring(2)
    setModal({ ...modalConfig, id })
  }, [])

  const confirmModal = useCallback(
    (modalConfig: Omit<Modal, "id" | "type">) => {
      openModal({ ...modalConfig, type: "confirm" })
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
    <ModalContext.Provider value={{ modal, openModal, closeModal, confirmModal }}>
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
