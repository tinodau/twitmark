"use client";

import { useState, useEffect } from "react";
import {
  Folder,
  Plus,
  LayoutDashboard,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getFolders } from "@/app/actions/folders";
import type { Folder as FolderType } from "@/types";
import { AddFolderModal } from "./add-folder-modal";
import { useFolder } from "@/contexts/folder-context";

export function Sidebar() {
  const { selectedFolderId, setSelectedFolderId } = useFolder();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [readingListCount, setReadingListCount] = useState(0);

  async function loadFolders() {
    const data = await getFolders();
    setFolders(data);
  }

  useEffect(() => {
    loadFolders();
  }, [isAddModalOpen]);

  const navItems = [
    { icon: LayoutDashboard, label: "All Bookmarks", id: null },
    { icon: BookOpen, label: "Reading List", id: "reading-list" },
  ];

  return (
    <aside
      className={`border-r border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-2 px-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setSelectedFolderId(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  selectedFolderId === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Folders Section */}
          {!isCollapsed && (
            <div className="mt-6 px-3">
              <div className="mb-2 flex items-center justify-between px-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Folders
                </span>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              {folders.length > 0 ? (
                <div className="space-y-1">
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolderId(folder.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        selectedFolderId === folder.id
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: folder.color }}
                      />
                      <span className="truncate">{folder.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {folder.bookmarkCount || 0}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-3 text-xs text-muted-foreground">
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
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Add Folder Modal */}
        <AddFolderModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </aside>
  );
}
