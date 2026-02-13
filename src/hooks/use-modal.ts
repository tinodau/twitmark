"use client"

import { useModal } from "@/contexts/modal-context"
import { useState, useCallback } from "react"

export function useModalControl() {
  const { openModal, closeModal, confirmModal } = useModal()

  const openConfirm = useCallback(
    (title: string, description: string, onConfirm: () => void | Promise<void>) => {
      confirmModal({
        title,
        description,
        onConfirm,
        isDestructive: true,
      })
    },
    [confirmModal]
  )

  return {
    openModal,
    closeModal,
    openConfirm,
  }
}
