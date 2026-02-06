"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { useEffect, useRef } from "react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const toastIcons = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
  warning: <AlertCircle className="h-5 w-5" />,
}

const toastColors = {
  success: "bg-green-500/10 border-green-500/20 text-green-400",
  error: "bg-red-500/10 border-red-500/20 text-red-400",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
}

function ToastItem({ toast, onClose }: ToastProps) {
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    const duration = toast.duration ?? 4000
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        onClose(toast.id)
      }, duration)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [toast.id, toast.duration, onClose])

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
      className={`relative flex w-full max-w-md items-start gap-3 rounded-xl border p-4 backdrop-blur-lg ${toastColors[toast.type]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="shrink-0 pt-0.5">{toastIcons[toast.type]}</div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
      </div>

      <button
        onClick={() => onClose(toast.id)}
        className="focus:ring-primary/50 shrink-0 cursor-pointer rounded-lg p-1 transition-opacity hover:opacity-80 focus:ring-2 focus:outline-none"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 sm:top-6 sm:right-6">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}
