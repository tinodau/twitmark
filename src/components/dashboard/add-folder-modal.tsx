"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus } from "lucide-react";
import { createFolder } from "@/app/actions/folders";

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
    } else {
      setName("");
      setColor(FOLDER_COLORS[0]);
      onClose();
    }
  }

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-[rgba(18,18,18,0.8)] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <FolderPlus className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      New Folder
                    </h2>
                    <p className="text-sm text-white/60">
                      Create a folder to organize bookmarks
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
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
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Tech News, Dev Tips..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    maxLength={50}
                  />
                  <p className="mt-1.5 text-xs text-white/40">
                    {name.length}/50 characters
                  </p>
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Folder Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {FOLDER_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-9 h-9 rounded-xl transition-all ${
                          color === c
                            ? "ring-2 ring-white ring-offset-2 ring-offset-[rgba(18,18,18,0.8)] scale-110"
                            : "hover:scale-110"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <FolderPlus className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 font-medium">
                    {name || "Untitled Folder"}
                  </span>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim()}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? "Creating..." : "Create Folder"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
