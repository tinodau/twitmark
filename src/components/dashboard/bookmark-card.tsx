"use client";

import { motion } from "framer-motion";
import { BookMarked, MoreVertical, Trash2, List, Folder } from "lucide-react";
import { Tweet } from "react-tweet";
import type { BookmarkWithFolder } from "@/types";
import { deleteBookmark, toggleReadingList } from "@/app/actions/bookmarks";

interface BookmarkCardProps {
  bookmark: BookmarkWithFolder;
  onUpdate?: () => void;
}

export function BookmarkCard({ bookmark, onUpdate }: BookmarkCardProps) {
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

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this bookmark?")) {
      await deleteBookmark(bookmark.id);
      onUpdate?.();
    }
  };

  const handleToggleReadingList = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggleReadingList(bookmark.id);
    onUpdate?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-xl border border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div
            className="flex h-8 items-center gap-2 rounded-lg px-2"
            style={{ backgroundColor: bookmark.folder?.color || "#1D9BF0" }}
          >
            <BookMarked className="h-4 w-4 text-white" />
          </div>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleToggleReadingList}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              title={
                bookmark.readingList
                  ? "Remove from Reading List"
                  : "Add to Reading List"
              }
              style={{
                color: bookmark.readingList
                  ? bookmark.folder?.color || "#1D9BF0"
                  : undefined,
              }}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Delete bookmark"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4 min-h-[200px]">
          {bookmark.contentType === "tweet" && tweetId ? (
            <Tweet id={tweetId} />
          ) : (
            <div className="space-y-2">
              <h3 className="font-semibold line-clamp-2">
                Article Title Goes Here
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                Article preview text would appear here...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {bookmark.folder && (
            <span className="flex items-center gap-1.5">
              <Folder className="h-3 w-3" />
              {bookmark.folder.name}
            </span>
          )}
          <span>
            {bookmark.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Link Overlay */}
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
          aria-label="Open bookmark"
        />
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent opacity-0 transition-opacity group-hover:border-primary/20 group-hover:opacity-100" />
    </motion.div>
  );
}
