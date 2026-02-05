"use client"

import { useState, useEffect } from "react"
import {
  Folder,
  Star,
  Heart,
  Bookmark,
  Zap,
  Book,
  Target,
  Tag,
  Briefcase,
  Code2,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react"
import { motion } from "framer-motion"
import { getFolders } from "@/app/actions/folders"
import type { Folder as FolderType } from "@/types"
import { AddFolderModal } from "@/components/dashboard/add-folder-modal"
import { EditFolderModal } from "@/components/dashboard/edit-folder-modal"
import { useFolder } from "@/contexts/folder-context"
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu"

// Map icon IDs to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  folder: Folder,
  star: Star,
  heart: Heart,
  bookmark: Bookmark,
  zap: Zap,
  book: Book,
  target: Target,
  tag: Tag,
  briefcase: Briefcase,
  code2: Code2,
}

export default function FoldersPage() {
  const [folders, setFolders] = useState<FolderType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {
    editingFolder,
    setEditingFolder,
    isEditModalOpen,
    setIsEditModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    deletingFolder,
    setDeletingFolder,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
  } = useFolder()

  async function loadFolders() {
    setIsLoading(true)
    const data = await getFolders()
    setFolders(data)
    setIsLoading(false)
  }

  useEffect(() => {
    async function fetchFolders() {
      await loadFolders()
    }
    fetchFolders()
  }, [isAddModalOpen, isEditModalOpen, isDeleteConfirmOpen])

  const totalBookmarks = folders.reduce((sum, folder) => sum + (folder.bookmarkCount || 0), 0)

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between" role="banner">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Folders</h1>
          <p className="text-muted-foreground">
            {folders.length} {folders.length === 1 ? "folder" : "folders"} · {totalBookmarks}{" "}
            {totalBookmarks === 1 ? "bookmark" : "bookmarks"}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          aria-label="Add new folder"
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:cursor-pointer focus:ring-2 focus:outline-none"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Folder
        </button>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-muted/50 h-32 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : folders.length === 0 ? (
        <div
          className="border-border/40 flex flex-col items-center justify-center rounded-xl border border-dashed py-16"
          role="status"
          aria-live="polite"
        >
          <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Folder className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No folders yet</h3>
          <p className="text-muted-foreground mb-4 text-center text-sm">
            Create folders to organize your bookmarks
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            aria-label="Create your first folder"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:outline-none"
          >
            <Plus className="h-4 w-4" />
            Create Folder
          </button>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Folders grid">
          {folders.map((folder, index) => {
            const IconComponent = ICON_MAP[folder.icon] || Folder
            return (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-border/40 bg-background/95 hover:bg-accent hover:border-accent/50 group relative overflow-hidden rounded-xl border p-6 transition-all"
              >
                <a
                  href={`/dashboard/folder/${folder.id}`}
                  className="focus:ring-primary/50 flex items-start gap-4 outline-none focus:ring-2"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: folder.color }}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="truncate text-lg font-semibold">{folder.name}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {folder.bookmarkCount || 0}{" "}
                      {folder.bookmarkCount === 1 ? "bookmark" : "bookmarks"}
                    </p>
                  </div>
                </a>
                <DropdownMenu
                  trigger={
                    <button
                      className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 absolute top-6 right-4 cursor-pointer rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:outline-none"
                      aria-label="Folder options"
                    >
                      <MoreVertical className="h-4 w-4" aria-hidden="true" />
                    </button>
                  }
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingFolder(folder)
                      setIsEditModalOpen(true)
                    }}
                    icon={<Edit2 className="h-4 w-4" />}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setDeletingFolder(folder)
                      setIsDeleteConfirmOpen(true)
                    }}
                    icon={<Trash2 className="h-4 w-4" />}
                    variant="danger"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenu>
              </motion.div>
            )
          })}
        </section>
      )}

      <AddFolderModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditFolderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        folder={editingFolder}
      />
    </div>
  )
}
