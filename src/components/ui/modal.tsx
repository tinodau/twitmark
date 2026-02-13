"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useModal } from "@/contexts/modal-context"
import { Button } from "@/components/ui/button"

export default function Modal() {
  const { modal, closeModal } = useModal()

  const handleConfirm = async () => {
    if (modal?.onConfirm) {
      await modal.onConfirm()
    }
    closeModal()
  }

  const handleCancel = () => {
    if (modal?.onCancel) {
      modal.onCancel()
    }
    closeModal()
  }

  if (!modal) return null

  return (
    <AnimatePresence>
      {modal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="border-border bg-background/95 dark:bg-background/95 mx-4 w-full max-w-lg overflow-hidden rounded-2xl border p-6 shadow-2xl backdrop-blur-md"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-foreground text-xl font-semibold">{modal.title}</h2>
                  {modal.description && (
                    <p className="text-muted-foreground mt-2 text-sm">{modal.description}</p>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground ml-4 rounded-lg p-1 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              {modal.content && <div className="mb-6">{modal.content}</div>}

              {/* Footer Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={handleCancel} disabled={modal.isLoading}>
                  {modal.cancelText || "Cancel"}
                </Button>
                <Button
                  variant={modal.isDestructive ? "destructive" : "default"}
                  onClick={handleConfirm}
                  disabled={modal.isLoading}
                >
                  {modal.isLoading ? "Processing..." : modal.confirmText || "Confirm"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
