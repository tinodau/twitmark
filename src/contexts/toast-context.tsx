"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { Toast, ToastType } from "@/components/ui/toast"

interface ToastContextType {
  toasts: Toast[]
  toast: (type: ToastType, title: string, description?: string, duration?: number) => void
  success: (title: string, description?: string, duration?: number) => void
  error: (title: string, description?: string, duration?: number) => void
  info: (title: string, description?: string, duration?: number) => void
  warning: (title: string, description?: string, duration?: number) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    (type: ToastType, title: string, description?: string, duration?: number) => {
      const id = Math.random().toString(36).substring(2)
      setToasts((prev) => [...prev, { id, type, title, description, duration }])
    },
    []
  )

  const success = useCallback(
    (title: string, description?: string, duration?: number) => {
      toast("success", title, description, duration)
    },
    [toast]
  )

  const error = useCallback(
    (title: string, description?: string, duration?: number) => {
      toast("error", title, description, duration)
    },
    [toast]
  )

  const info = useCallback(
    (title: string, description?: string, duration?: number) => {
      toast("info", title, description, duration)
    },
    [toast]
  )

  const warning = useCallback(
    (title: string, description?: string, duration?: number) => {
      toast("warning", title, description, duration)
    },
    [toast]
  )

  return (
    <ToastContext.Provider value={{ toasts, toast, success, error, info, warning, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
