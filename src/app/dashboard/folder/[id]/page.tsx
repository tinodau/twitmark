"use client"

export const runtime = "edge"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Plus, ChevronDown, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { AddBookmarkModal } from "@/components/dashboard/add-bookmark-modal"
import { BookmarkCard } from "@/components/dashboard/bookmark-card"
import { getUserBookmarks } from "@/app/actions/bookmarks"
import { getFolderById } from "@/app/actions/folders"
import type { BookmarkWithFolder } from "@/types"

const ITEMS_PER_PAGE = 12
const SCROLL_THRESHOLD = 80

export default function FolderPage() {
  const router = useRouter()
  const params = useParams()
  const folderId = params.id as string

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [allBookmarks, setAllBookmarks] = useState<BookmarkWithFolder[]>([])
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [folderName, setFolderName] = useState<string>("")
  const [showFloatingButton, setShowFloatingButton] = useState(false)
  const [folderExists, setFolderExists] = useState(true)

  const fetchBookmarks = async () => {
    setIsLoading(true)
    const data = await getUserBookmarks()
    setAllBookmarks(data as BookmarkWithFolder[])
    setIsLoading(false)
  }

  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      // Check if folder exists
      const folder = await getFolderById(folderId)
      if (controller.signal.aborted) return

      if (!folder) {
        setFolderExists(false)
        setIsLoading(false)
        return
      }

      if (folder) {
        setFolderName(folder.name)
      }

      await fetchBookmarks()
    })()

    return () => {
      controller.abort()
    }
  }, [folderId])

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleBookmarkAdded = () => {
    fetchBookmarks()
  }

  // Filter bookmarks for this folder
  const filteredBookmarks = allBookmarks.filter((b) => b.folders.some((f) => f.id === folderId))
  const displayedBookmarks = filteredBookmarks.slice(0, displayCount)
  const hasMore = filteredBookmarks.length > displayCount

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE)
  }

  const handleBack = () => {
    router.push("/dashboard/folders")
  }

  // Accessibility keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isModalOpen) {
      handleModalClose()
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false)
      }
    }

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape)
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isModalOpen])

  // Track scroll to show/hide floating button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowFloatingButton(scrollY > SCROLL_THRESHOLD)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (!folderExists) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
        <h2 className="mb-2 text-xl font-semibold">Folder Not Found</h2>
        <p className="text-muted-foreground mb-4">This folder may have been deleted</p>
        <button
          onClick={handleBack}
          className="bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-primary/50 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:cursor-pointer focus:ring-2 focus:outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Folders
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <header className="flex items-center justify-between" role="banner">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            aria-label="Go back to folders"
            className="text-muted-foreground hover:text-foreground focus:ring-primary/50 cursor-pointer rounded-lg p-2 transition-colors focus:ring-2 focus:outline-none"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{folderName}</h1>
            <p className="text-muted-foreground">
              {filteredBookmarks.length} {filteredBookmarks.length === 1 ? "bookmark" : "bookmarks"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          aria-label="Add new bookmark"
          className="bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-primary/50 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:cursor-pointer focus:ring-2 focus:outline-none"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Bookmark
        </button>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/50 h-64 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div
          className="border-border/40 flex flex-col items-center justify-center rounded-xl border border-dashed py-16"
          role="status"
          aria-live="polite"
        >
          <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Plus className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No bookmarks yet</h3>
          <p className="text-muted-foreground mb-4 text-center text-sm">
            Start saving your favorite tweets and articles
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="Add your first bookmark"
            className="bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-primary/50 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:outline-none"
          >
            <Plus className="h-4 w-4" />
            Add Your First Bookmark
          </button>
        </div>
      ) : (
        <>
          <section
            className="grid auto-rows-min items-start gap-4 md:grid-cols-2 xl:grid-cols-3"
            aria-label="Bookmarks grid"
          >
            {displayedBookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} onUpdate={fetchBookmarks} />
            ))}
          </section>

          {hasMore && (
            <div className="flex justify-center pt-6">
              <button
                onClick={handleLoadMore}
                className="border-border/40 bg-background/95 hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-colors focus:ring-2 focus:outline-none"
              >
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
                Load More
              </button>
            </div>
          )}
        </>
      )}

      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleBookmarkAdded}
      />

      {/* Floating Add Bookmark Button */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: showFloatingButton ? 1 : 0,
          scale: showFloatingButton ? 1 : 0.8,
          y: showFloatingButton ? 0 : 20,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        aria-label="Add new bookmark"
        className="bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-primary/50 fixed right-6 bottom-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-lg transition-colors focus:ring-2 focus:outline-none sm:right-8 sm:bottom-8 sm:h-16 sm:w-16"
      >
        <Plus className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
      </motion.button>
    </div>
  )
}
