"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, BookOpen, Folder } from "lucide-react";
import { AddBookmarkModal } from "@/components/dashboard/add-bookmark-modal";
import { BookmarkCard } from "@/components/dashboard/bookmark-card";
import { getUserBookmarks } from "@/app/actions/bookmarks";
import { getFolderById } from "@/app/actions/folders";
import { useFolder } from "@/contexts/folder-context";
import type { BookmarkWithFolder } from "@/types";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkWithFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [folderName, setFolderName] = useState<string>("");
  const { selectedFolderId, setSelectedFolderId } = useFolder();
  const mountedRef = useRef(true);

  const fetchBookmarks = async () => {
    if (!mountedRef.current) return;
    setIsLoading(true);
    const data = await getUserBookmarks();
    if (mountedRef.current) {
      let filteredData = data as BookmarkWithFolder[];

      // Filter by reading list
      if (selectedFolderId === "reading-list") {
        filteredData = filteredData.filter((b) => b.readingList);
      }
      // Filter by folder
      else if (selectedFolderId) {
        filteredData = filteredData.filter(
          (b) => b.folderId === selectedFolderId,
        );
      }

      setBookmarks(filteredData);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      await fetchBookmarks();

      // Load folder name when a folder is selected
      if (selectedFolderId && selectedFolderId !== "reading-list") {
        const folder = await getFolderById(selectedFolderId);
        if (mountedRef.current && folder) {
          setFolderName(folder.name);
        }
      } else {
        if (mountedRef.current) {
          setFolderName("");
        }
      }
    })();
    return () => {
      mountedRef.current = false;
    };
  }, [selectedFolderId]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(fetchBookmarks, 100);
  };

  const getTitle = () => {
    if (selectedFolderId === null) return "All Bookmarks";
    if (selectedFolderId === "reading-list") return "Reading List";
    return folderName || "Folder";
  };

  const getDescription = () => {
    if (selectedFolderId === null) return "Your saved tweets and articles";
    if (selectedFolderId === "reading-list")
      return `${bookmarks.length} ${bookmarks.length === 1 ? "item" : "items"} marked for later reading`;
    return `Bookmarks in this folder`;
  };

  const getEmptyStateTitle = () => {
    if (selectedFolderId === "reading-list")
      return "Your reading list is empty";
    return "No bookmarks yet";
  };

  const getEmptyStateDescription = () => {
    if (selectedFolderId === "reading-list") {
      return "Add bookmarks to your reading list to track what you want to read later";
    }
    return "Start saving your favorite tweets and articles";
  };

  const getEmptyStateButtonText = () => {
    if (selectedFolderId === "reading-list") return "Browse All Bookmarks";
    return "Add Your First Bookmark";
  };

  const handleEmptyStateClick = () => {
    if (selectedFolderId === "reading-list") {
      setSelectedFolderId(null);
    } else {
      setIsModalOpen(true);
    }
  };

  // Accessibility keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isModalOpen) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          handleModalClose();
        }
      });
    }
    return () => {
      document.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          handleModalClose();
        }
      });
    };
  }, [isModalOpen]);

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <header className="flex items-center justify-between" role="banner">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{getTitle()}</h1>
          <p className="text-muted-foreground">{getDescription()}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          aria-label="Add new bookmark"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Bookmark
        </button>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-muted/50"
            />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/40 py-16"
          role="status"
          aria-live="polite"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            {selectedFolderId === "reading-list" ? (
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            ) : (
              <Plus className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <h3 className="mb-2 text-lg font-semibold">{getEmptyStateTitle()}</h3>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            {getEmptyStateDescription()}
          </p>
          <button
            onClick={handleEmptyStateClick}
            aria-label={
              selectedFolderId === "reading-list"
                ? "Browse all bookmarks"
                : "Add your first bookmark"
            }
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {selectedFolderId === "reading-list" ? (
              <>
                <Folder className="h-4 w-4" />
                {getEmptyStateButtonText()}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {getEmptyStateButtonText()}
              </>
            )}
          </button>
        </div>
      ) : (
        <section
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Bookmarks grid"
        >
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onUpdate={fetchBookmarks}
            />
          ))}
        </section>
      )}

      <AddBookmarkModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
