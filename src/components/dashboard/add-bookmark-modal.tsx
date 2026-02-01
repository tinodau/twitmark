"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link as LinkIcon, Check, Folder } from "lucide-react";
import { createBookmark } from "@/app/actions/bookmarks";
import { getFolders } from "@/app/actions/folders";
import { useFolder } from "@/contexts/folder-context";
import { useToast } from "@/contexts/toast-context";
import type { Folder as FolderType } from "@/types";

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBookmarkModal({ isOpen, onClose }: AddBookmarkModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFoldersLoading, setIsFoldersLoading] = useState(false);
  const [error, setError] = useState("");
  const { selectedFolderId: currentFolderId } = useFolder();
  const { success, error: showError } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  async function loadFolders() {
    const data = await getFolders();
    setFolders(data);
  }

  // Focus trap and management
  useEffect(() => {
    let isMounted = true;

    const loadFoldersAsync = async () => {
      setIsFoldersLoading(true);
      const data = await getFolders();
      if (isMounted) {
        setFolders(data);
        setIsFoldersLoading(false);
        // Pre-select folder if viewing a specific folder
        if (currentFolderId && currentFolderId !== "reading-list") {
          setSelectedFolderIds([currentFolderId]);
        }
      }
    };

    if (isOpen) {
      loadFoldersAsync();

      // Focus on URL input when modal opens
      setTimeout(() => {
        urlInputRef.current?.focus();
      }, 100);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      isMounted = false;
      document.body.style.overflow = "";
    };
  }, [isOpen, currentFolderId]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus trap within modal
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal || !isOpen) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleTab);
    return () => modal.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);

    const formData = new FormData();
    formData.append("url", url);
    if (title) {
      formData.append("title", title);
    }
    if (selectedFolderIds.length > 0) {
      selectedFolderIds.forEach((folderId) => {
        formData.append("folderIds", folderId);
      });
    }

    const result = await createBookmark(formData);

    if (result.error) {
      setError(result.error);
      showError("Failed to save bookmark", result.error);
      setIsLoading(false);
    } else {
      success("Bookmark saved successfully");
      setIsLoading(false);
      onClose();
      setTitle("");
      setUrl("");
      setSelectedFolderIds([]);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/40 p-6">
                <div>
                  <h2 id="modal-title" className="text-xl font-semibold">
                    Add Bookmark
                  </h2>
                  <p className="text-sm text-muted-foreground">Save a tweet</p>
                </div>
                <button
                  ref={firstFocusableRef}
                  onClick={onClose}
                  aria-label="Close modal"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="text-sm font-medium text-foreground"
                    >
                      Title (Optional)
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Add a custom title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="url"
                      className="text-sm font-medium text-foreground"
                    >
                      URL
                    </label>
                    <div className="relative">
                      <LinkIcon
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <input
                        id="url"
                        ref={urlInputRef}
                        type="url"
                        placeholder="https://x.com/username/status/123456"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full rounded-lg border border-input bg-transparent px-10 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isLoading}
                        aria-describedby={error ? "url-error" : undefined}
                        aria-invalid={!!error}
                      />
                    </div>
                    {error && (
                      <p
                        id="url-error"
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Folder Selection */}
                  <fieldset className="space-y-2">
                    <legend className="text-sm font-medium text-foreground">
                      Folder (Optional)
                    </legend>
                    {isFoldersLoading ? (
                      <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/50 px-4 py-3">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span className="text-sm text-muted-foreground">
                          Loading folders...
                        </span>
                      </div>
                    ) : folders.length > 0 ? (
                      <div
                        className="grid gap-2"
                        role="group"
                        aria-label="Select folders"
                      >
                        {folders.map((folder) => {
                          const isSelected = selectedFolderIds.includes(
                            folder.id,
                          );
                          return (
                            <button
                              key={folder.id}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedFolderIds(
                                    selectedFolderIds.filter(
                                      (id) => id !== folder.id,
                                    ),
                                  );
                                } else {
                                  setSelectedFolderIds([
                                    ...selectedFolderIds,
                                    folder.id,
                                  ]);
                                }
                              }}
                              aria-pressed={isSelected}
                              disabled={isLoading}
                              className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 ${
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border hover:bg-accent"
                              }`}
                            >
                              <div
                                className="h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center"
                                style={{
                                  borderColor: isSelected
                                    ? folder.color
                                    : "currentColor",
                                  backgroundColor: isSelected
                                    ? folder.color
                                    : "transparent",
                                }}
                                aria-hidden="true"
                              >
                                {isSelected && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                )}
                              </div>
                              <div
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: folder.color }}
                                aria-hidden="true"
                              />
                              <span className="truncate">{folder.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border/40 bg-muted/30 px-4 py-3 text-center">
                        <p className="text-sm text-muted-foreground">
                          We automatically fetch tweet
                        </p>
                      </div>
                    )}
                  </fieldset>

                  <div
                    className={`flex items-center gap-2 rounded-lg bg-muted/50 p-3 ${
                      isLoading ? "opacity-50" : ""
                    }`}
                    role="note"
                    aria-label="Tip"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20"
                      aria-hidden="true"
                    >
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We automatically fetch the tweet
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-input bg-transparent px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={isLoading || isFoldersLoading}
                  >
                    Cancel
                  </button>
                  <button
                    ref={lastFocusableRef}
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={isLoading || isFoldersLoading || !url}
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" />
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
    </AnimatePresence>,
    document.body,
  );
}
