"use client"

import { motion } from "framer-motion"
import { Trash2, BookOpen, CheckCircle2, ExternalLink, MoreVertical, PenLine } from "lucide-react"
import { Tweet } from "react-tweet"
import type { BookmarkWithFolder } from "@/types"
import { deleteBookmark, toggleReadingList } from "@/app/actions/bookmarks"
import { useToast } from "@/contexts/toast-context"
import { useModal } from "@/contexts/modal-context"
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface BookmarkCardProps {
  bookmark: BookmarkWithFolder
  onUpdate?: () => void
}

export function BookmarkCard({ bookmark, onUpdate }: BookmarkCardProps) {
  const { success, error: showError } = useToast()
  const { confirmModal, openModal } = useModal()

  // Helper function to convert hex to rgba with opacity
  function hexToRgba(hex: string, opacity: number): string {
    const cleanHex = hex.replace("#", "")
    const r = Number.parseInt(cleanHex.substring(0, 2), 16)
    const g = Number.parseInt(cleanHex.substring(2, 4), 16)
    const b = Number.parseInt(cleanHex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  const handleToggleReadingList = async () => {
    const result = await toggleReadingList(bookmark.id)
    if (result.error) {
      showError("Failed to update reading list", result.error)
    } else {
      const message = bookmark.readingList ? "Removed from Reading List" : "Added to Reading List"
      success(message)
      onUpdate?.()
    }
  }

  const handleEditBookmark = () => {
    openModal({
      type: "edit-bookmark",
      bookmark,
      onSuccess: onUpdate,
    })
  }

  const handleDeleteBookmark = () => {
    confirmModal(
      "Delete Bookmark",
      "This action cannot be undone. Are you sure you want to delete this bookmark?",
      async () => {
        const result = await deleteBookmark(bookmark.id)
        if (result.error) {
          showError("Failed to delete bookmark", result.error)
        } else {
          success("Bookmark deleted")
          onUpdate?.()
        }
      }
    )
  }

  const handleOpenTweet = () => {
    window.open(bookmark.url, "_blank", "noopener,noreferrer")
  }

  const extractTweetId = (url: string): string | null => {
    const patterns = [
      /x\.com\/\w+\/status\/(\d+)/,
      /twitter\.com\/\w+\/status\/(\d+)/,
      /mobile\.twitter\.com\/\w+\/status\/(\d+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const tweetId = extractTweetId(bookmark.url)
  const bookmarkTitle = (bookmark.metadata?.title as string) || "Untitled"

  const formatDateTime = (date: Date) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    return `${formattedDate} at ${formattedTime}`
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`group relative flex h-fit min-h-80 flex-col overflow-hidden rounded-xl border backdrop-blur-sm transition-colors ${
          bookmark.readingList
            ? "border-primary/40 ring-primary/10 bg-primary/5 ring-2"
            : "border-border/40 bg-card/50"
        }`}
        style={{ willChange: "transform" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 pt-3">
          {/* Title */}
          <div className="flex-1 pr-4">
            <h3 className="text-foreground line-clamp-2 text-lg font-semibold">{bookmarkTitle}</h3>
          </div>

          {/* Dropdown Menu */}
          <DropdownMenu
            trigger={
              <button
                className="text-muted-foreground hover:bg-accent hover:text-seconary-foreground focus:ring-primary/50 cursor-pointer rounded-lg p-1.5 transition-colors focus:ring-2 focus:outline-none"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            }
          >
            <DropdownMenuItem
              onClick={handleToggleReadingList}
              icon={<BookOpen className="h-4 w-4" />}
            >
              {bookmark.readingList ? "Remove from Reading List" : "Add to Reading List"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditBookmark} icon={<PenLine className="h-4 w-4" />}>
              Edit Bookmark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenTweet} icon={<ExternalLink className="h-4 w-4" />}>
              Open Tweet
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteBookmark}
              icon={<Trash2 className="h-4 w-4" />}
              variant="danger"
            >
              Delete Bookmark
            </DropdownMenuItem>
          </DropdownMenu>
        </div>

        {/* Metadata Bar - Row 1: Time & Reading List */}
        <div className="text-muted-foreground z-10 flex items-center justify-between px-4 pt-2 text-xs">
          {/* Time (Left) */}
          <time dateTime={bookmark.createdAt.toISOString()}>
            {formatDateTime(bookmark.createdAt)}
          </time>

          {/* Reading List Icon (Right) - Only show if in reading list */}
          {bookmark.readingList && (
            <span className="text-primary flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>In Reading List</span>
            </span>
          )}
        </div>

        {/* Metadata Bar - Row 2: Folders */}
        {bookmark.folders && bookmark.folders.length > 0 && (
          <div className="z-10 px-4 py-2">
            <div className="flex flex-wrap gap-2">
              {bookmark.folders.map((folder) => (
                <span
                  key={folder.name}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: hexToRgba(folder.color, 0.15),
                    color: folder.color,
                  }}
                >
                  {folder.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tweet Content */}
        <div className="-my-6 flex-1 p-4">
          {tweetId ? (
            <Tweet
              id={tweetId}
              fallback={
                <div className="text-muted-foreground p-8 text-center text-sm">
                  Loading tweet...
                </div>
              }
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center p-8 text-center text-sm">
              Could not load tweet
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
