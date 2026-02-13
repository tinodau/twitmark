"use client"

import { useModal } from "@/contexts/modal-context"
import { Button } from "@/components/ui/button"

export function ConfirmContent() {
  const { modal, closeModal } = useModal()

  if (modal?.type !== "confirm") return null

  const handleConfirm = async () => {
    await modal.onConfirm()
    closeModal()
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-foreground text-xl font-semibold">{modal.title}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{modal.description}</p>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={closeModal}>
          {modal.cancelText || "Cancel"}
        </Button>
        <Button variant={modal.isDestructive ? "destructive" : "default"} onClick={handleConfirm}>
          {modal.confirmText || "Confirm"}
        </Button>
      </div>
    </div>
  )
}
