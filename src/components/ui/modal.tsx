"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useModal } from "@/contexts/modal-context"
import {
  ConfirmContent,
  AddBookmarkContent,
  EditBookmarkContent,
  AddFolderContent,
  EditFolderContent,
} from "@/components/modal-content"

export default function Modal() {
  const { modal, closeModal } = useModal()

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
            {/* Modal Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="mx-4 w-full max-w-lg"
            >
              {modal.type === "confirm" && <ConfirmContent />}
              {modal.type === "add-bookmark" && <AddBookmarkContent />}
              {modal.type === "edit-bookmark" && <EditBookmarkContent />}
              {modal.type === "add-folder" && <AddFolderContent />}
              {modal.type === "edit-folder" && <EditFolderContent />}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
