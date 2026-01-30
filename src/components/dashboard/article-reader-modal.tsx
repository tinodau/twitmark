"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Clock, User } from "lucide-react";
import { Tweet } from "react-tweet";

interface ArticleReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  contentType: "tweet" | "article";
}

export function ArticleReaderModal({
  isOpen,
  onClose,
  url,
  contentType,
}: ArticleReaderModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const extractTweetId = (url: string): string | null => {
    // Extract ID from both article and tweet URLs
    const patterns = [
      /x\.com\/\w+\/articles\/(\d+)/, // Article URL
      /x\.com\/\w+\/status\/(\d+)/, // Tweet URL
      /twitter\.com\/\w+\/status\/(\d+)/,
      /mobile\.twitter\.com\/\w+\/status\/(\d+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const tweetId = extractTweetId(url);

  console.log("ArticleReaderModal:", { url, contentType, tweetId });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
                <div className="flex items-center gap-3">
                  {contentType === "article" ? (
                    <>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Article Mode</h2>
                        <p className="text-sm text-muted-foreground">
                          Optimized reading experience
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Tweet View</h2>
                        <p className="text-sm text-muted-foreground">
                          Standard tweet display
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open on X
                  </a>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {contentType === "article" ? (
                  <div className="mx-auto max-w-2xl space-y-6">
                    {/* Article Header */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">X Article</span>
                      </div>
                      <h1 className="text-2xl font-bold">Loading Article...</h1>
                    </div>

                    {/* Article Placeholder */}
                    <div className="space-y-3 pt-4">
                      <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
                      <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
                      <div className="h-4 w-11/12 animate-pulse rounded bg-muted/50" />
                      <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
                      <div className="h-4 w-10/12 animate-pulse rounded bg-muted/50" />
                      <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
                      <div className="h-4 w-9/12 animate-pulse rounded bg-muted/50" />
                    </div>

                    {/* Note */}
                    <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-sm">
                      <p className="mb-2 font-medium text-primary">
                        About Article Mode
                      </p>
                      <p className="text-muted-foreground">
                        X Articles are displayed natively on X.com. Use the
                        `Open on X` button above to read the full article with
                        all formatting and media.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Tweet View */
                  <div className="flex h-full items-center justify-center">
                    {tweetId ? (
                      <Tweet id={tweetId} />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        Could not load tweet
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border/40 px-6 py-3">
                <p className="text-center text-xs text-muted-foreground">
                  Press{" "}
                  <kbd className="rounded bg-muted px-1.5 py-0.5">Esc</kbd> to
                  close
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
