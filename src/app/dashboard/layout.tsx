"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { EditFolderModal } from "@/components/dashboard/edit-folder-modal"
import { AddFolderModal } from "@/components/dashboard/add-folder-modal"
import { FolderProvider } from "@/contexts/folder-context"
import { useFolder } from "@/contexts/folder-context"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { deleteFolder } from "@/app/actions/folders"
import { useToast } from "@/contexts/toast-context"
import { User } from "@supabase/supabase-js"

function EditFolderModalContent() {
  const { isEditModalOpen, setIsEditModalOpen, editingFolder, setEditingFolder } = useFolder()

  return (
    <EditFolderModal
      isOpen={isEditModalOpen}
      onClose={() => {
        setIsEditModalOpen(false)
        setEditingFolder(null)
      }}
      folder={editingFolder}
    />
  )
}

function AddFolderModalContent() {
  const { isAddModalOpen, setIsAddModalOpen } = useFolder()

  return <AddFolderModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
}

function DeleteFolderModalContent() {
  const {
    deletingFolder,
    setDeletingFolder,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    selectedFolderId,
    setSelectedFolderId,
  } = useFolder()
  const [isDeleting, setIsDeleting] = useState(false)
  const { success, error: showError } = useToast()

  const handleDelete = async () => {
    if (!deletingFolder) return

    setIsDeleting(true)
    const result = await deleteFolder(deletingFolder.id)

    if ("error" in result) {
      showError("Failed to delete folder", result.error)
      setIsDeleting(false)
    } else {
      success("Folder deleted")
      // Deselect if the deleted folder was selected
      if (selectedFolderId === deletingFolder.id) {
        setSelectedFolderId(null)
      }
      setIsDeleting(false)
      setDeletingFolder(null)
      setIsDeleteConfirmOpen(false)
    }
  }

  return (
    <ConfirmModal
      isOpen={isDeleteConfirmOpen}
      onClose={() => {
        setIsDeleteConfirmOpen(false)
        setDeletingFolder(null)
      }}
      onConfirm={handleDelete}
      title="Delete Folder"
      description={
        deletingFolder
          ? `This will remove folder "${deletingFolder.name}". Bookmarks in this folder will not be deleted.`
          : ""
      }
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      isLoading={isDeleting}
    />
  )
}

function DashboardLayoutWithProvider({ children }: { children: React.ReactNode }) {
  return (
    <FolderProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 pt-[80px] sm:pl-20 md:pl-72 lg:pl-[280px]">{children}</main>
      </div>
      <AddFolderModalContent />
      <EditFolderModalContent />
      <DeleteFolderModalContent />
    </FolderProvider>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      } else {
        setUser(user)
        setLoading(false)
      }
    }
    checkAuth()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <Header user={user!} />
      <DashboardLayoutWithProvider>{children}</DashboardLayoutWithProvider>
    </div>
  )
}
