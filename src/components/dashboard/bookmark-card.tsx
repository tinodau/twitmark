"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BookMarked,
  Trash2,
  Folder,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  MoreVertical,
  Edit2,
} from "lucide-react";
import { Tweet } from "react-tweet";
import type { BookmarkWithFolder } from "@/types";
import { deleteBookmark, toggleReadingList } from "@/app/actions/bookmarks";
import { useToast } from "@/contexts/toast-context";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface BookmarkCardProps {
  bookmark: BookmarkWithFolder;
  onUpdate?: () => void;
}

export function BookmarkCard({ bookmark, onUpdate }: BookmarkCardProps) {
  const { success, error: showError } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

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

  const handleToggleReadingList = async () => {
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

  const handleEditTitle = () => {
    setEditedTitle(
      (bookmark.metadata?.title as string) ||
        ((bookmark.metadata?.author_name as string)
          ? `${bookmark.metadata.author_name}'s tweet`
          : "Tweet"),
    );
    setIsEditingTitle(true);
  };

  const handleSaveTitle = async () => {
    // TODO: Implement save title functionality
    setIsEditingTitle(false);
    success("Title updated");
    onUpdate?.();
  };

  const handleOpenTweet = () => {
    window.open(bookmark.url, "_blank", "noopener,noreferrer");
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
  const bookmarkTitle = (bookmark.metadata?.title as string) || "Untitled";

  const formatDateTime = (date: Date) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${formattedDate} ${formattedTime}`;
  };

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
        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3">
          {/* Title */}
          <div className="flex-1 pr-4">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-1 rounded-lg border border-input bg-transparent px-2 py-1 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveTitle();
                    if (e.key === "Escape") setIsEditingTitle(false);
                  }}
                />
                <button
                  onClick={handleSaveTitle}
                  className="rounded-lg bg-primary px-2 py-1 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            ) : (
              <h3 className="line-clamp-2 text-lg font-semibold text-foreground">
                {bookmarkTitle}
              </h3>
            )}
          </div>

          {/* Dropdown Menu */}
          <DropdownMenu
            trigger={
              <button
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            }
          >
            <DropdownMenuItem
              onClick={handleToggleReadingList}
              icon={<BookOpen className="h-4 w-4" />}
            >
              {bookmark.readingList
                ? "Remove from Reading List"
                : "Add to Reading List"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleEditTitle}
              icon={<Edit2 className="h-4 w-4" />}
            >
              Edit Title
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleOpenTweet}
              icon={<ExternalLink className="h-4 w-4" />}
            >
              Open Tweet
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteModalOpen(true)}
              icon={<Trash2 className="h-4 w-4" />}
              variant="danger"
            >
              Delete Bookmark
            </DropdownMenuItem>
          </DropdownMenu>
        </div>

        {/* Metadata Bar */}
        <div className="flex items-center gap-3 border-b border-border/40 px-4 py-2 text-xs text-muted-foreground">
          {/* Reading List Status */}
          <span className="flex items-center gap-1.5">
            {bookmark.readingList ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            ) : (
              <BookMarked className="h-3.5 w-3.5" />
            )}
            {bookmark.readingList ? "In Reading List" : "Bookmark"}
          </span>

          {/* Folder */}
          {bookmark.folder && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <span className="flex items-center gap-1.5">
                <Folder className="h-3.5 w-3.5" />
                {bookmark.folder.name}
              </span>
            </>
          )}

          {/* Spacer */}
          <span className="flex-1" />

          {/* Timestamp */}
          <time dateTime={bookmark.createdAt.toISOString()}>
            {formatDateTime(bookmark.createdAt)}
          </time>
        </div>

        {/* Tweet Content */}
        <div className="flex-1 -my-6 p-4">
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
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-muted-foreground">
              Could not load tweet
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
