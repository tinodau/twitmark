"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus } from "lucide-react";
import { createFolder } from "@/app/actions/folders";
import { useToast } from "@/contexts/toast-context";

interface AddFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Predefined color palette
const FOLDER_COLORS = [
  "#1D9BF0", // Blue
  "#F91880", // Red
  "#BA36F4", // Purple
  "#EAB308", // Yellow
  "#17A34A", // Green
  "#F97316", // Orange
  "#EC4899", // Pink
  "#06B6D4", // Cyan
];

export function AddFolderModal({ isOpen, onClose }: AddFolderModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(FOLDER_COLORS[0]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  const { success, error: showError } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("color", color);

    const result = await createFolder(formData);

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      showError("Failed to create folder", result.error);
    } else {
      success(`Folder "${name}" created`);
      setName("");
      setColor(FOLDER_COLORS[0]);
      onClose();
    }
  }

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus on name input when modal opens
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
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
              aria-labelledby="folder-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <div className="bg-[rgba(18,18,18,0.8)] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <FolderPlus className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2
                        id="folder-modal-title"
                        className="text-xl font-semibold text-white"
                      >
                        New Folder
                      </h2>
                      <p className="text-sm text-white/60">
                        Create a folder to organize bookmarks
                      </p>
                    </div>
                  </div>
                  <button
                    ref={firstFocusableRef}
                    onClick={onClose}
                    aria-label="Close modal"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                  >
                    <X className="w-4 h-4 text-white/60" aria-hidden="true" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="folder-name"
                      className="block text-sm font-medium text-white/90 mb-2"
                    >
                      Folder Name
                    </label>
                    <input
                      id="folder-name"
                      ref={nameInputRef}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Tech News, Dev Tips..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                      maxLength={50}
                      aria-describedby="folder-name-counter"
                      aria-invalid={!!error}
                    />
                    <p
                      id="folder-name-counter"
                      className="mt-1.5 text-xs text-white/40"
                      aria-live="polite"
                    >
                      {name.length}/50 characters
                    </p>
                  </div>

                  {/* Color Picker */}
                  <div>
                    <fieldset>
                      <legend className="block text-sm font-medium text-white/90 mb-3">
                        Folder Color
                      </legend>
                      <div
                        className="flex gap-2 flex-wrap"
                        role="radiogroup"
                        aria-label="Select folder color"
                      >
                        {FOLDER_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            aria-pressed={color === c}
                            aria-label={`Color ${c}`}
                            className={`w-9 h-9 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer ${
                              color === c
                                ? "ring-2 ring-white ring-offset-2 ring-offset-[rgba(18,18,18,0.8)] scale-110"
                                : "hover:scale-110"
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  {/* Preview */}
                  <div
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                    role="status"
                    aria-live="polite"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    >
                      <FolderPlus className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90 font-medium">
                      {name || "Untitled Folder"}
                    </span>
                  </div>

                  {/* Error */}
                  {error && (
                    <p
                      className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 hover:cursor-pointer text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      Cancel
                    </button>
                    <button
                      ref={lastFocusableRef}
                      type="submit"
                      disabled={isSubmitting || !name.trim()}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 hover:cursor-pointer focus:ring-blue-500/50"
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Folder"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
