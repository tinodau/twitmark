"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Trash2 } from "lucide-react";
import { updateFolder, deleteFolder } from "@/app/actions/folders";
import { useToast } from "@/contexts/toast-context";
import type { Folder as FolderType } from "@/types";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface EditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: FolderType | null;
}

const PRESET_COLORS = [
  "#1D9BF0", // Twitter Blue
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#EF4444", // Red
  "#06B6D4", // Cyan
  "#F97316", // Orange
];

export function EditFolderModal({
  isOpen,
  onClose,
  folder,
}: EditFolderModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#1D9BF0");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { success, error: showError } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (folder) {
        setName(folder.name);
        setColor(folder.color);
      }
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, folder]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folder) return;

    setIsLoading(true);
    const result = await updateFolder(folder.id, name, color);

    if ("error" in result) {
      showError("Failed to update folder", result.error);
      setIsLoading(false);
    } else {
      success("Folder updated");
      setIsLoading(false);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!folder) return;

    setIsDeleting(true);
    const result = await deleteFolder(folder.id);

    if ("error" in result) {
      showError("Failed to delete folder", result.error);
      setIsDeleting(false);
    } else {
      success("Folder deleted");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      onClose();
    }
  };

  if (!isOpen || !folder) return null;

  return createPortal(
    <>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Folder"
        description={`This will remove the folder "${folder.name}". Bookmarks in this folder will not be deleted.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />

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
                      Edit Folder
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Update folder name and color
                    </p>
                  </div>
                  <button
                    ref={firstFocusableRef}
                    onClick={onClose}
                    aria-label="Close modal"
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleUpdate} className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="folder-name"
                        className="text-sm font-medium text-foreground"
                      >
                        Folder Name
                      </label>
                      <input
                        id="folder-name"
                        ref={nameInputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Color
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {PRESET_COLORS.map((presetColor) => (
                          <button
                            key={presetColor}
                            type="button"
                            onClick={() => setColor(presetColor)}
                            aria-pressed={color === presetColor}
                            disabled={isLoading}
                            className={`h-12 w-full rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                              color === presetColor
                                ? "border-primary scale-110"
                                : "border-border hover:border-border/80"
                            }`}
                            style={{ backgroundColor: presetColor }}
                            aria-label={`Select color ${presetColor}`}
                          >
                            {color === presetColor && (
                              <Check
                                className="mx-auto h-5 w-5 text-white"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-destructive/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      disabled={isLoading || isDeleting}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Delete
                    </button>
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 rounded-lg border border-input bg-transparent px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      ref={lastFocusableRef}
                      type="submit"
                      className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                      disabled={isLoading || !name.trim()}
                      aria-busy={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" aria-hidden="true" />
                          Save Changes
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
    </>,
    document.body,
  );
}
