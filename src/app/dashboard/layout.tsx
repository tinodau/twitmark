"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { EditFolderModal } from "@/components/dashboard/edit-folder-modal"
import { AddFolderModal } from "@/components/dashboard/add-folder-modal"
import { FolderProvider } from "@/contexts/folder-context"
import { useFolder } from "@/contexts/folder-context"
import { deleteFolder } from "@/app/actions/folders"
import { useToast } from "@/contexts/toast-context"
import { useModalControl } from "@/hooks/use-modal"
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
    triggerFolderRefresh,
  } = useFolder()
  const { success, error: showError } = useToast()
  const { openConfirm } = useModalControl()
  const router = useRouter()

  useEffect(() => {
    if (isDeleteConfirmOpen && deletingFolder) {
      openConfirm(
        "Delete Folder",
        `This will remove folder "${deletingFolder.name}". Bookmarks in this folder will not be deleted.`,
        async () => {
          const result = await deleteFolder(deletingFolder.id)

          if ("error" in result) {
            showError("Failed to delete folder", result.error)
          } else {
            success("Folder deleted")
            triggerFolderRefresh()
            router.push("/dashboard/folders")
            setDeletingFolder(null)
            setIsDeleteConfirmOpen(false)
          }
        }
      )
      // Reset state in next tick to avoid cascading renders
      requestAnimationFrame(() => setIsDeleteConfirmOpen(false))
    }
  }, [isDeleteConfirmOpen, deletingFolder])

  return null
}

function DashboardLayoutWithProvider({
  children,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  user,
}: {
  children: React.ReactNode
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  user: User
}) {
  const onMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [setIsMobileMenuOpen])

  const onSidebarToggle = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev)
  }, [setIsSidebarCollapsed])
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  return (
    <FolderProvider>
      <div className="flex min-h-screen">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={onMobileMenuToggle}
          isCollapsed={isSidebarCollapsed}
        />
        <div
          className={`relative flex flex-1 flex-col ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}
        >
          <Header
            user={user!}
            onMobileMenuToggle={onMobileMenuToggle}
            isMobileMenuOpen={isMobileMenuOpen}
            isSidebarCollapsed={isSidebarCollapsed}
            onSidebarToggle={onSidebarToggle}
          />
          <main className="flex-1 p-6">{children}</main>
        </div>
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
      <DashboardLayoutWithProvider
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        user={user!}
      >
        {children}
      </DashboardLayoutWithProvider>
    </div>
  )
}
