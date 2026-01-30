"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link as LinkIcon, Check, Folder } from "lucide-react";
import { createBookmark } from "@/app/actions/bookmarks";
import { getFolders } from "@/app/actions/folders";
import { useFolder } from "@/contexts/folder-context";
import type { Folder as FolderType } from "@/types";

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBookmarkModal({ isOpen, onClose }: AddBookmarkModalProps) {
  const [url, setUrl] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { selectedFolderId: currentFolderId } = useFolder();

  async function loadFolders() {
    const data = await getFolders();
    setFolders(data);
  }

  useEffect(() => {
    if (isOpen) {
      loadFolders();
      // Pre-select folder if viewing a specific folder
      if (currentFolderId && currentFolderId !== "reading-list") {
        setSelectedFolderId(currentFolderId);
      }
    }
  }, [isOpen, currentFolderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);

    const formData = new FormData();
    formData.append("url", url);
    if (selectedFolderId) {
      formData.append("folderId", selectedFolderId);
    }

    const result = await createBookmark(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      onClose();
      setUrl("");
      setSelectedFolderId(null);
    }
  };

  if (!isOpen) return null;

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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/40 p-6">
                <div>
                  <h2 className="text-xl font-semibold">Add Bookmark</h2>
                  <p className="text-sm text-muted-foreground">
                    Save a tweet or article
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="url"
                      className="text-sm font-medium text-foreground"
                    >
                      URL
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="url"
                        type="url"
                        placeholder="https://x.com/username/status/123456"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full rounded-lg border border-input bg-transparent px-10 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isLoading}
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}
                  </div>

                  {/* Folder Selection */}
                  {folders.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Folder (Optional)
                      </label>
                      <div className="grid gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedFolderId(null)}
                          className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                            selectedFolderId === null
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:bg-accent"
                          }`}
                        >
                          <Folder className="h-4 w-4 shrink-0" />
                          <span>No Folder</span>
                        </button>
                        {folders.map((folder) => (
                          <button
                            key={folder.id}
                            type="button"
                            onClick={() => setSelectedFolderId(folder.id)}
                            className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                              selectedFolderId === folder.id
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:bg-accent"
                            }`}
                          >
                            <div
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: folder.color }}
                            />
                            <span className="truncate">{folder.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We`ll automatically fetch the tweet/article metadata
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-input bg-transparent px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading || !url}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Save Bookmark
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
