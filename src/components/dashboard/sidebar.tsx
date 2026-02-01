"use client"

import { useState, useEffect } from "react"
import {
  Folder,
  Plus,
  LayoutDashboard,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react"
import { getFolders } from "@/app/actions/folders"
import type { Folder as FolderType } from "@/types"
import { AddFolderModal } from "./add-folder-modal"
import { useFolder } from "@/contexts/folder-context"
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function Sidebar() {
  const {
    selectedFolderId,
    setSelectedFolderId,
    editingFolder,
    setEditingFolder,
    isEditModalOpen,
    setIsEditModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
  } = useFolder()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [folders, setFolders] = useState<FolderType[]>([])

  async function loadFolders() {
    const data = await getFolders()
    setFolders(data)
  }

  useEffect(() => {
    loadFolders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddModalOpen, isEditModalOpen])

  const navItems = [
    { icon: LayoutDashboard, label: "All Bookmarks", id: null },
    { icon: BookOpen, label: "Reading List", id: "reading-list" },
  ]

  return (
    <aside
      className={`border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 border-r backdrop-blur transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      aria-label="Main navigation sidebar"
    >
      <div className="flex h-full flex-col">
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-2 px-3" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setSelectedFolderId(item.id)}
                aria-pressed={selectedFolderId === item.id}
                aria-current={selectedFolderId === item.id ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  selectedFolderId === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                } focus:ring-primary/50 cursor-pointer focus:ring-2 focus:outline-none`}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Folders Section */}
          {!isCollapsed && (
            <div className="mt-6 px-3">
              <div className="mb-2 flex items-center justify-between px-3">
                <h2 className="text-muted-foreground text-xs font-semibold uppercase">Folders</h2>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  aria-label="Add new folder"
                  className="text-muted-foreground hover:text-foreground focus:ring-primary/50 cursor-pointer rounded-lg p-1 focus:ring-2 focus:outline-none"
                >
                  <Plus className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
              {folders.length > 0 ? (
                <ul className="space-y-1" role="list" aria-label="Your folders">
                  {folders.map((folder) => (
                    <li key={folder.id} className="group">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedFolderId(folder.id)}
                          aria-pressed={selectedFolderId === folder.id}
                          className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            selectedFolderId === folder.id
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          } focus:ring-primary/50 cursor-pointer focus:ring-2 focus:outline-none`}
                        >
                          <div
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: folder.color }}
                            aria-hidden="true"
                          />
                          <span className="truncate">{folder.name}</span>
                          <span
                            className="text-muted-foreground ml-auto text-xs"
                            aria-label={`${folder.bookmarkCount || 0} bookmarks`}
                          >
                            {folder.bookmarkCount || 0}
                          </span>
                        </button>
                        <DropdownMenu
                          trigger={
                            <button
                              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 cursor-pointer rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:outline-none"
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
                              setEditingFolder(folder)
                              setIsEditModalOpen(true)
                            }}
                            icon={<Trash2 className="h-4 w-4" />}
                            variant="danger"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenu>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground px-3 text-xs" role="status">
                  No folders yet. Create one to organize bookmarks!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <div className="border-border/40 border-t p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:ring-2 focus:outline-none"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}
