"use client"

import { ModalProvider } from "@/contexts/modal-context"
import Modal from "@/components/ui/modal"

export function AppModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      {children}
      <Modal />
    </ModalProvider>
  )
}
