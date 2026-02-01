"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Folder as FolderIcon } from "lucide-react";
import { getFolders } from "@/app/actions/folders";
import {
  addBookmarkToFolders,
  removeBookmarkFromFolders,
} from "@/app/actions/bookmarks";
import { useToast } from "@/contexts/toast-context";
import type { Folder } from "@/types";

interface ManageFoldersModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkId: string;
  currentFolderIds?: string[];
  onUpdate?: () => void;
}

// Helper function to convert hex to rgba with opacity
function hexToRgba(hex: string, opacity: number): string {
  const cleanHex = hex.replace("#", "");
  const r = Number.parseInt(cleanHex.substring(0, 2), 16);
  const g = Number.parseInt(cleanHex.substring(2, 4), 16);
  const b = Number.parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function ManageFoldersModal({
  isOpen,
  onClose,
  bookmarkId,
  currentFolderIds = [],
  onUpdate,
}: ManageFoldersModalProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderIds, setSelectedFolderIds] =
    useState<string[]>(currentFolderIds);
  const [isLoading, setIsLoading] = useState(false);
  const [isFoldersLoading, setIsFoldersLoading] = useState(false);
  const { success, error: showError } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  const handleToggleFolder = (folderId: string) => {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId],
    );
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Calculate folders to add and remove
    const foldersToAdd = selectedFolderIds.filter(
      (id) => !currentFolderIds.includes(id),
    );
    const foldersToRemove = currentFolderIds.filter(
      (id) => !selectedFolderIds.includes(id),
    );

    // Add new folders
    if (foldersToAdd.length > 0) {
      const addResult = await addBookmarkToFolders(bookmarkId, foldersToAdd);
      if (addResult.error) {
        showError("Failed to add folders", addResult.error);
        setIsLoading(false);
        return;
      }
    }

    // Remove folders
    if (foldersToRemove.length > 0) {
      const removeResult = await removeBookmarkFromFolders(
        bookmarkId,
        foldersToRemove,
      );
      if (removeResult.error) {
        showError("Failed to remove folders", removeResult.error);
        setIsLoading(false);
        return;
      }
    }

    success("Folders updated");
    setIsLoading(false);
    onClose();
    onUpdate?.();
  };

  // Load folders when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const loadFoldersAsync = async () => {
      setIsFoldersLoading(true);
      const data = await getFolders();
      setFolders(data);
      setIsFoldersLoading(false);
    };

    loadFoldersAsync();
  }, [isOpen]);

  // Update selected folder IDs when currentFolderIds changes
  useEffect(() => {
    setSelectedFolderIds(currentFolderIds);
  }, [currentFolderIds]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

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
            onClick={isLoading ? undefined : onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={isLoading ? undefined : onClose}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/40 p-6">
                <div>
                  <h2 id="modal-title" className="text-xl font-semibold">
                    Manage Folders
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Select folders to organize this bookmark
                  </p>
                </div>
                <button
                  ref={firstFocusableRef}
                  onClick={isLoading ? undefined : onClose}
                  aria-label="Close modal"
                  disabled={isLoading}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Folder List */}
              <div className="p-6">
                {isFoldersLoading ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/50 px-4 py-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="text-sm text-muted-foreground">
                      Loading folders...
                    </span>
                  </div>
                ) : folders.length > 0 ? (
                  <div
                    className="space-y-2"
                    role="group"
                    aria-label="Select folders"
                  >
                    {folders.map((folder) => {
                      const isSelected = selectedFolderIds.includes(folder.id);
                      return (
                        <button
                          key={folder.id}
                          type="button"
                          onClick={() => handleToggleFolder(folder.id)}
                          aria-pressed={isSelected}
                          disabled={isLoading}
                          className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:bg-accent"
                          }`}
                        >
                          <div
                            className="h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center"
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
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </div>
                          <div
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: folder.color }}
                            aria-hidden="true"
                          />
                          <span className="font-medium">{folder.name}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/40 bg-muted/30 px-4 py-8 text-center">
                    <FolderIcon
                      className="mx-auto h-12 w-12 text-muted-foreground/50"
                      aria-hidden="true"
                    />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No folders yet
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Create folders to organize your bookmarks
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t border-border/40 p-6">
                <button
                  type="button"
                  onClick={isLoading ? undefined : onClose}
                  disabled={isLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-input bg-transparent px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  ref={lastFocusableRef}
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading || isFoldersLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
