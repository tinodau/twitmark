"use client";

import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { AddBookmarkModal } from "@/components/dashboard/add-bookmark-modal";
import { BookmarkCard } from "@/components/dashboard/bookmark-card";
import { getUserBookmarks } from "@/app/actions/bookmarks";
import type { BookmarkWithFolder } from "@/types";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkWithFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchBookmarks = async () => {
    if (!mountedRef.current) return;
    setIsLoading(true);
    const data = await getUserBookmarks();
    if (mountedRef.current) {
      setBookmarks(data as BookmarkWithFolder[]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      await fetchBookmarks();
    })();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(fetchBookmarks, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Bookmarks</h1>
          <p className="text-muted-foreground">
            Your saved tweets and articles
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Bookmark
        </button>
      </div>

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
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/40 py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No bookmarks yet</h3>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            Start saving your favorite tweets and articles
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Your First Bookmark
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onUpdate={fetchBookmarks}
            />
          ))}
        </div>
      )}

      <AddBookmarkModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
