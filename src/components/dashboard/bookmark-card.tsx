"use client";

import { motion } from "framer-motion";
import {
  BookMarked,
  Trash2,
  Folder,
  BookOpen,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Tweet } from "react-tweet";
import type { BookmarkWithFolder } from "@/types";
import { deleteBookmark, toggleReadingList } from "@/app/actions/bookmarks";
import { useToast } from "@/contexts/toast-context";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useState } from "react";

interface BookmarkCardProps {
  bookmark: BookmarkWithFolder;
  onUpdate?: () => void;
}

export function BookmarkCard({ bookmark, onUpdate }: BookmarkCardProps) {
  const { success, error: showError } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const result = await deleteBookmark(bookmark.id);
    if (result.error) {
      showError("Failed to delete bookmark", result.error);
      setIsDeleting(false);
    } else {
      success("Bookmark deleted");
      setIsDeleteModalOpen(false);
      setIsDeleting(false);
      onUpdate?.();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleteModalOpen(true);
  };

  const handleToggleReadingList = async (e: React.MouseEvent) => {
    e.preventDefault();
    const result = await toggleReadingList(bookmark.id);
    if (result.error) {
      showError("Failed to update reading list", result.error);
    } else {
      const message = bookmark.readingList
        ? "Removed from Reading List"
        : "Added to Reading List";
      success(message);
      onUpdate?.();
    }
  };

  const extractTweetId = (url: string): string | null => {
    const patterns = [
      /x\.com\/\w+\/status\/(\d+)/,
      /twitter\.com\/\w+\/status\/(\d+)/,
      /mobile\.twitter\.com\/\w+\/status\/(\d+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const tweetId = extractTweetId(bookmark.url);

  return (
    <>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Bookmark"
        description="This action cannot be undone. Are you sure you want to delete this bookmark?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className={`group relative flex h-fit min-h-[300px] flex-col overflow-hidden rounded-xl border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 ${
          bookmark.readingList
            ? "border-primary/40 ring-2 ring-primary/10"
            : "border-border/40"
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-border/40 p-3">
          <div
            className="flex h-8 items-center gap-2 rounded-lg px-2"
            style={{ backgroundColor: bookmark.folder?.color || "#1D9BF0" }}
          >
            <BookMarked className="h-4 w-4 text-white" />
          </div>
          <div className="pointer-events-auto flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleToggleReadingList}
              aria-label={
                bookmark.readingList
                  ? "Remove from Reading List"
                  : "Add to Reading List"
              }
              aria-pressed={bookmark.readingList}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              style={{
                color: bookmark.readingList
                  ? bookmark.folder?.color || "#1D9BF0"
                  : undefined,
              }}
            >
              {bookmark.readingList ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <BookOpen className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={handleDeleteClick}
              aria-label="Delete bookmark"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive/50"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Tweet Content */}
        <div
          className={`flex-1 w-full min-h-0 ${
            tweetId ? "" : "flex items-center justify-center"
          }`}
        >
          {tweetId ? (
            <Tweet
              id={tweetId}
              fallback={
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Loading tweet...
                </div>
              }
            />
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Could not load tweet
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <footer
          className="flex items-center justify-between border-t border-border/40 bg-muted/30 px-4 py-2"
          role="contentinfo"
        >
          {bookmark.folder && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Folder className="h-3.5 w-3.5" aria-hidden="true" />
              {bookmark.folder.name}
            </span>
          )}
          <time
            className="text-xs text-muted-foreground"
            dateTime={bookmark.createdAt.toISOString()}
          >
            {bookmark.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </time>
        </footer>

        {/* Action Button */}
        <div className="pointer-events-auto absolute bottom-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Open tweet on X (opens in new tab)"
            className="flex items-center gap-1 rounded-lg bg-muted/50 px-2 py-1 text-xs font-medium transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        {/* Reading List Badge */}
        {bookmark.readingList && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-none absolute right-3 top-3 z-10"
          >
            <div
              className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
              style={{
                backgroundColor: bookmark.folder?.color || "#1D9BF0",
              }}
            >
              To Read
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
