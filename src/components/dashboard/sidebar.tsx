"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
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
  LayoutDashboard,
  BookOpen,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { getFolders } from "@/app/actions/folders"
import type { Folder as FolderType } from "@/types"
import { AddFolderModal } from "./add-folder-modal"
import { useFolder } from "@/contexts/folder-context"
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

export function Sidebar({
  isMobileMenuOpen,
  onMobileMenuToggle,
  isCollapsed,
  setIsCollapsed,
}: {
  isMobileMenuOpen: boolean
  onMobileMenuToggle: () => void
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}) {
  const pathname = usePathname()
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
  const [folders, setFolders] = useState<FolderType[]>([])

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      onMobileMenuToggle()
    }
  }, [pathname, isMobileMenuOpen, onMobileMenuToggle])

  async function loadFolders() {
    const data = await getFolders()
    setFolders(data)
  }

  useEffect(() => {
    loadFolders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddModalOpen, isEditModalOpen, isDeleteConfirmOpen])

  const navItems = [
    { icon: LayoutDashboard, label: "All Bookmarks", href: "/dashboard" },
    { icon: BookOpen, label: "Reading List", href: "/dashboard/reading-list" },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={onMobileMenuToggle}
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`bg-background/95 supports-backdrop-filter:bg-background/60 fixed top-0 left-0 z-30 h-screen border-r backdrop-blur transition-all duration-300 ${
          isCollapsed ? "w-64 lg:w-16" : "w-64"
        } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        aria-label="Main navigation sidebar"
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-16 items-center px-4 pt-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-primary-foreground text-lg font-bold">T</span>
              </div>
              <span className={isCollapsed ? "hidden lg:hidden" : "font-semibold"}>Twitmark</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <TooltipProvider>
              <nav className="space-y-2 px-3" aria-label="Main navigation">
                {navItems.map((item) => {
                  const link = (
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`group hover:bg-primary/10 focus:ring-primary/50 relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:cursor-pointer focus:ring-2 focus:outline-none ${
                        isActive(item.href)
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      } ${isCollapsed ? "justify-center px-0 lg:justify-start lg:px-3" : ""}`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className={isCollapsed ? "flex lg:hidden" : ""}>{item.label}</span>
                    </Link>
                  )

                  return isCollapsed ? (
                    <div key={item.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ) : (
                    <div key={item.href}>{link}</div>
                  )
                })}
              </nav>

              {/* Folders Section */}
              <div className={`mt-6 ${isCollapsed ? "px-2" : "px-3"}`}>
                {isCollapsed ? (
                  <div className="mb-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setIsAddModalOpen(true)}
                          className="group hover:bg-primary/10 focus:ring-primary/50 mx-auto flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:cursor-pointer focus:ring-2 focus:outline-none"
                          aria-label="Add new folder"
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Add Folder</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : (
                  <div className="mb-2 flex items-center justify-between px-3">
                    <Link
                      href="/dashboard/folders"
                      className="text-muted-foreground hover:text-foreground text-xs font-semibold uppercase transition-colors"
                    >
                      Folders
                    </Link>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      aria-label="Add new folder"
                      className="text-muted-foreground hover:text-foreground focus:ring-primary/50 cursor-pointer rounded-lg p-1 focus:ring-2 focus:outline-none"
                    >
                      <Plus className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                )}
                {folders.length > 0 ? (
                  <ul
                    className={`${isCollapsed ? "space-y-3" : "space-y-1"}`}
                    role="list"
                    aria-label="Your folders"
                  >
                    {folders.map((folder) => (
                      <li key={folder.id} className={`${isCollapsed ? "" : "group"}`}>
                        {isCollapsed ? (
                          <div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={`/dashboard/folder/${folder.id}`}
                                  className="group hover:bg-primary/10 focus:ring-primary/50 relative mx-auto flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:cursor-pointer focus:ring-2 focus:outline-none"
                                  aria-label={`View ${folder.name}`}
                                >
                                  <div
                                    className="flex h-6 w-6 items-center justify-center rounded-md"
                                    style={{ backgroundColor: folder.color }}
                                  >
                                    {(() => {
                                      const IconComponent = ICON_MAP[folder.icon] || Folder
                                      return <IconComponent className="h-3.5 w-3.5 text-white" />
                                    })()}
                                  </div>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>{folder.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/folder/${folder.id}`}
                              className={`hover:bg-primary/10 focus:ring-primary/50 flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:cursor-pointer focus:ring-2 focus:outline-none ${
                                isActive(`/dashboard/folder/${folder.id}`)
                                  ? "bg-accent text-accent-foreground"
                                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                              }`}
                            >
                              <div
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                                style={{ backgroundColor: folder.color }}
                                aria-hidden="true"
                              >
                                {(() => {
                                  const IconComponent = ICON_MAP[folder.icon] || Folder
                                  return <IconComponent className="h-3 w-3 text-white" />
                                })()}
                              </div>
                              <span className="truncate">{folder.name}</span>
                              <span
                                className="text-muted-foreground ml-auto text-xs"
                                aria-label={`${folder.bookmarkCount || 0} bookmarks`}
                              >
                                {folder.bookmarkCount || 0}
                              </span>
                            </Link>
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
                                  setDeletingFolder(folder)
                                  setIsDeleteConfirmOpen(true)
                                }}
                                icon={<Trash2 className="h-4 w-4" />}
                                variant="danger"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenu>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground px-3 text-xs" role="status">
                    No folders yet. Create one to organize bookmarks!
                  </p>
                )}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </aside>
    </>
  )
}
