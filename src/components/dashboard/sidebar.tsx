"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { getFolders } from "@/app/actions/folders";
import type { Folder as FolderType } from "@/types";
import { AddFolderModal } from "./add-folder-modal";
import { useFolder } from "@/contexts/folder-context";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
  } = useFolder();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [folders, setFolders] = useState<FolderType[]>([]);

  async function loadFolders() {
    const data = await getFolders();
    setFolders(data);
  }

  useEffect(() => {
    loadFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddModalOpen, isEditModalOpen]);

  const navItems = [
    { icon: LayoutDashboard, label: "All Bookmarks", id: null },
    { icon: BookOpen, label: "Reading List", id: "reading-list" },
  ];

  return (
    <aside
      className={`border-r border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-300 ${
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
                } focus:outline-none focus:ring-2 focus:ring-primary/50`}
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
                <h2 className="text-xs font-semibold uppercase text-muted-foreground">
                  Folders
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  aria-label="Add new folder"
                  className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg p-1"
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
                          className={`flex-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            selectedFolderId === folder.id
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                        >
                          <div
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: folder.color }}
                            aria-hidden="true"
                          />
                          <span className="truncate">{folder.name}</span>
                          <span
                            className="ml-auto text-xs text-muted-foreground"
                            aria-label={`${folder.bookmarkCount || 0} bookmarks`}
                          >
                            {folder.bookmarkCount || 0}
                          </span>
                        </button>
                        <DropdownMenu
                          trigger={
                            <button
                              className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                              aria-label="Folder options"
                            >
                              <MoreVertical
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </button>
                          }
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingFolder(folder);
                              setIsEditModalOpen(true);
                            }}
                            icon={<Edit2 className="h-4 w-4" />}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingFolder(folder);
                              setIsEditModalOpen(true);
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
                <p className="px-3 text-xs text-muted-foreground" role="status">
                  No folders yet. Create one to organize bookmarks!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <div className="border-t border-border/40 p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
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
  );
}
