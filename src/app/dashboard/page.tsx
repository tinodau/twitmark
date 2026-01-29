"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AddBookmarkModal } from "@/components/dashboard/add-bookmark-modal";
import { BookmarkCard } from "@/components/dashboard/bookmark-card";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockBookmarks = [
    {
      id: "1",
      url: "https://x.com/elonmusk/status/123456789",
      contentType: "tweet" as const,
      createdAt: new Date("2024-01-29"),
      folder: { name: "Tech News", color: "#1D9BF0" },
    },
    {
      id: "2",
      url: "https://x.com/vercel/status/987654321",
      contentType: "article" as const,
      createdAt: new Date("2024-01-28"),
      folder: { name: "Design Resources", color: "#7856FF" },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Bookmarks</h1>
          <p className="text-muted-foreground">
            Your saved tweets and articles
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Bookmark
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockBookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>

      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
