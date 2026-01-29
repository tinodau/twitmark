"use client";

import { useState } from "react";
import {
  Folder,
  Plus,
  LayoutDashboard,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const folders = [
    { id: "1", name: "Tech News", count: 12, color: "#1D9BF0" },
    { id: "2", name: "Design Resources", count: 8, color: "#7856FF" },
    { id: "3", name: "Tutorials", count: 5, color: "#F45D22" },
  ];

  const navItems = [
    { icon: LayoutDashboard, label: "All Bookmarks", count: 25 },
    { icon: BookOpen, label: "Reading List", count: 7 },
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
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
                {!isCollapsed && item.count !== undefined && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {item.count}
                  </span>
                )}
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
                <button className="text-muted-foreground hover:text-foreground">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-1">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: folder.color }}
                    />
                    <span className="truncate">{folder.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {folder.count}
                    </span>
                  </button>
                ))}
              </div>
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
      </div>
    </aside>
  );
}
