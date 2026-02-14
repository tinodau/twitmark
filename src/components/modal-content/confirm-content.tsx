"use client"

import { useModal } from "@/contexts/modal-context"

export function ConfirmContent() {
  const { modal, closeModal } = useModal()

  if (modal?.type !== "confirm") return null

  const handleConfirm = async () => {
    await modal.onConfirm()
    closeModal()
  }

  return (
    <div className="border-border/30 bg-background/75 supports-backdrop-filter:bg-background/90 relative rounded-2xl border p-6 shadow-2xl backdrop-blur">
      <div className="space-y-4">
        <div>
          <h2 className="text-foreground text-xl font-semibold">{modal.title}</h2>
          <p className="text-muted-foreground mt-2 text-sm">{modal.description}</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={closeModal}
            className="border-input hover:bg-accent-foreground dark:hover:bg-muted focus:ring-primary/50 flex cursor-pointer items-center justify-center rounded-xl border bg-transparent px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none"
          >
            {modal.cancelText || "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            className={`focus:ring-destructive/50 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:ring-2 focus:outline-none ${
              modal.isDestructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary-hover"
            }`}
          >
            {modal.confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  )
}
