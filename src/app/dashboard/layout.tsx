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

function DashboardLayoutWithProvider({ children }: { children: React.ReactNode }) {
  return (
    <FolderProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <AddFolderModalContent />
      <EditFolderModalContent />
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
