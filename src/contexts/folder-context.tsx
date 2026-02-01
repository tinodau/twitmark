"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { Folder } from "@/types"

interface FolderContextType {
  selectedFolderId: string | null
  setSelectedFolderId: (folderId: string | null) => void
  editingFolder: Folder | null
  setEditingFolder: (folder: Folder | null) => void
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  isAddModalOpen: boolean
  setIsAddModalOpen: (open: boolean) => void
}

const FolderContext = createContext<FolderContextType | undefined>(undefined)

export function FolderProvider({ children }: { children: ReactNode }) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <FolderContext.Provider
      value={{
        selectedFolderId,
        setSelectedFolderId,
        editingFolder,
        setEditingFolder,
        isEditModalOpen,
        setIsEditModalOpen,
        isAddModalOpen,
        setIsAddModalOpen,
      }}
    >
      {children}
    </FolderContext.Provider>
  )
}

export function useFolder() {
  const context = useContext(FolderContext)
  if (context === undefined) {
    throw new Error("useFolder must be used within a FolderProvider")
  }
  return context
}
