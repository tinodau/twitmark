"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookMarked,
  MoreVertical,
  Trash2,
  List,
  Folder,
  BookOpen,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Tweet } from "react-tweet";
import type { BookmarkWithFolder } from "@/types";
import { deleteBookmark, toggleReadingList } from "@/app/actions/bookmarks";
import { ArticleReaderModal } from "./article-reader-modal";
import { detectContentType } from "@/lib/utils/url-detector";

interface BookmarkCardProps {
  bookmark: BookmarkWithFolder;
  onUpdate?: () => void;
}

export function BookmarkCard({ bookmark, onUpdate }: BookmarkCardProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);

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
  const contentCheck = detectContentType(bookmark.url);

  const handleOpenReader = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReaderOpen(true);
  };

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

  const contentType = contentCheck.type;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className={`group relative overflow-hidden rounded-xl border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 ${
          bookmark.readingList
            ? "border-primary/40 ring-2 ring-primary/10"
            : "border-border/40"
        }`}
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
            <div className="pointer-events-auto flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
                {bookmark.readingList ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
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
            {contentType === "tweet" && tweetId ? (
              <Tweet id={tweetId} />
            ) : contentType === "article" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">X Article</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click `Read` to view this article in reading mode
                </p>
              </div>
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

          {/* Action Buttons */}
          <div className="pointer-events-auto absolute bottom-4 right-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleOpenReader}
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              title="Open in Reading Mode"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Read</span>
            </button>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
              title="Open on X"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Reading List Badge */}
        {bookmark.readingList && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-none absolute top-4 right-4 z-10"
          >
            <div
              className="rounded-full px-2.5 py-1 text-xs font-medium text-white"
              style={{
                backgroundColor: bookmark.folder?.color || "#1D9BF0",
              }}
            >
              To Read
            </div>
          </motion.div>
        )}

        {/* Hover Border Effect */}
        <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent opacity-0 transition-opacity group-hover:border-primary/20 group-hover:opacity-100" />
      </motion.div>

      {/* Article Reader Modal */}
      <ArticleReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        url={bookmark.url}
        contentType={contentType}
      />
    </>
  );
}
