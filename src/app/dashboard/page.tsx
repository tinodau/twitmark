"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, ChevronDown, Clock, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { AddBookmarkModal } from "@/components/dashboard/add-bookmark-modal"
import { BookmarkCard } from "@/components/dashboard/bookmark-card"
import { getUserBookmarks } from "@/app/actions/bookmarks"
import { getFolderById } from "@/app/actions/folders"
import { useFolder } from "@/contexts/folder-context"
import type { BookmarkWithFolder } from "@/types"

const ITEMS_PER_PAGE = 12
const SCROLL_THRESHOLD = 80 // Show floating button after scrolling 80px

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [allBookmarks, setAllBookmarks] = useState<BookmarkWithFolder[]>([])
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [folderName, setFolderName] = useState<string>("")
  const [showFloatingButton, setShowFloatingButton] = useState(false)
  const { selectedFolderId, setSelectedFolderId } = useFolder()
  const mountedRef = useRef(true)

  const fetchBookmarks = async () => {
    if (!mountedRef.current) return
    setIsLoading(true)
    const data = await getUserBookmarks()
    if (mountedRef.current) {
      setAllBookmarks(data as BookmarkWithFolder[])
      setIsLoading(false)
    }
  }

  useEffect(() => {
    mountedRef.current = true
    ;(async () => {
      await fetchBookmarks()

      // Load folder name when a folder is selected
      if (selectedFolderId && selectedFolderId !== "reading-list") {
        const folder = await getFolderById(selectedFolderId)
        if (mountedRef.current && folder) {
          setFolderName(folder.name)
        }
      } else {
        if (mountedRef.current) {
          setFolderName("")
        }
      }
    })()
    return () => {
      mountedRef.current = false
    }
  }, [selectedFolderId])

  const handleModalClose = () => {
    setIsModalOpen(false)
    setTimeout(fetchBookmarks, 100)
  }

  // Get filtered bookmarks based on selected folder/reading list
  const getFilteredBookmarks = () => {
    let filtered = allBookmarks

    if (selectedFolderId) {
      filtered = filtered.filter((b) => b.folders.some((f) => f.id === selectedFolderId))
    }

    return filtered
  }

  const filteredBookmarks = getFilteredBookmarks()
  const displayedBookmarks = filteredBookmarks.slice(0, displayCount)
  const hasMore = filteredBookmarks.length > displayCount

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE)
  }

  const getTitle = () => {
    if (selectedFolderId === null) return "All Bookmarks"
    return folderName || "Folder"
  }

  const getDescription = () => {
    if (selectedFolderId === null) return "Your saved tweets and articles"
    return `${filteredBookmarks.length} ${filteredBookmarks.length === 1 ? "bookmark" : "bookmarks"} in this folder`
  }

  const getEmptyStateTitle = () => {
    return "No bookmarks yet"
  }

  const getEmptyStateDescription = () => {
    return "Start saving your favorite tweets and articles"
  }

  const getEmptyStateButtonText = () => {
    return "Add Your First Bookmark"
  }

  const handleEmptyStateClick = () => {
    setIsModalOpen(true)
  }

  // Accessibility keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isModalOpen) {
      setIsModalOpen(false)
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          handleModalClose()
        }
      })
    }
    return () => {
      document.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          handleModalClose()
        }
      })
    }
  }, [isModalOpen])

  // Track scroll to show/hide floating button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowFloatingButton(scrollY > SCROLL_THRESHOLD)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial state

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      {selectedFolderId !== "reading-list" && (
        <header className="flex items-center justify-between" role="banner">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{getTitle()}</h1>
            <p className="text-muted-foreground">{getDescription()}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="Add new bookmark"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:cursor-pointer focus:ring-2 focus:outline-none"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Bookmark
          </button>
        </header>
      )}

      {selectedFolderId === "reading-list" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border/40 bg-background/95 relative overflow-hidden rounded-2xl border p-12 text-center backdrop-blur"
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="bg-primary/5 absolute -top-24 -right-24 h-48 w-48 animate-pulse rounded-full" />
            <div
              className="absolute -bottom-24 -left-24 h-48 w-48 animate-pulse rounded-full bg-cyan-500/5"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="relative">
            <div className="from-primary/20 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br to-cyan-500/20">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Clock className="text-primary h-12 w-12" />
              </motion.div>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-3 text-2xl font-bold"
            >
              Reading List
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mx-auto mb-6 max-w-md"
            >
              Track and manage your bookmarks that you want to read later. This feature is coming
              soon.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>Stay tuned for updates</span>
            </motion.div>
          </div>
        </motion.div>
      ) : isLoading ? (
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
          <h3 className="mb-2 text-lg font-semibold">{getEmptyStateTitle()}</h3>
          <p className="text-muted-foreground mb-4 text-center text-sm">
            {getEmptyStateDescription()}
          </p>
          <button
            onClick={handleEmptyStateClick}
            aria-label="Add your first bookmark"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:outline-none"
          >
            <Plus className="h-4 w-4" />
            {getEmptyStateButtonText()}
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

      {selectedFolderId !== "reading-list" && (
        <AddBookmarkModal isOpen={isModalOpen} onClose={handleModalClose} />
      )}

      {/* Floating Add Bookmark Button */}
      {selectedFolderId !== "reading-list" && (
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
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 fixed right-6 bottom-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-lg transition-colors focus:ring-2 focus:outline-none sm:right-8 sm:bottom-8 sm:h-16 sm:w-16"
        >
          <Plus className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
        </motion.button>
      )}
    </div>
  )
}
