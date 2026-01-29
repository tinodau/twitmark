"use client";

import { motion } from "framer-motion";
import { ExternalLink, BookMarked, MoreVertical } from "lucide-react";

interface BookmarkCardProps {
  bookmark: {
    id: string;
    url: string;
    contentType: "tweet" | "article";
    createdAt: Date;
    folder?: {
      name: string;
      color: string;
    };
  };
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
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
          <button className="opacity-0 transition-opacity group-hover:opacity-100">
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          {bookmark.contentType === "tweet" ? (
            <div className="rounded-lg bg-muted/50 p-3 text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <BookMarked className="h-4 w-4" />
                <span>Tweet Preview</span>
              </div>
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
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: bookmark.folder.color }}
              />
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
