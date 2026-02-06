import { createClient } from "@/lib/supabase/server"
import type { BookmarkWithFolders } from "@/types"

// Ensure user has a profile
async function ensureUserProfile(userId: string, email: string) {
  const supabase = await createClient()

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single()

  // If profile doesn't exist, create it
  if (!existingProfile) {
    await supabase.from("profiles").insert({
      id: userId,
      email: email,
    })
  }
}

// Validate X/Twitter URL
export function isValidTwitterUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.toLowerCase()
    return (
      hostname === "x.com" ||
      hostname === "www.x.com" ||
      hostname === "twitter.com" ||
      hostname === "www.twitter.com" ||
      hostname === "mobile.twitter.com"
    )
  } catch {
    return false
  }
}

// Extract tweet/article ID from URL
export function extractTweetId(url: string): string | null {
  const patterns = [
    /x\.com\/i\/article\/(\d+)/, // Article ID
    /x\.com\/\w+\/status\/(\d+)/, // Tweet ID
    /twitter\.com\/\w+\/status\/(\d+)/,
    /mobile\.twitter\.com\/\w+\/status\/(\d+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// Fetch tweet metadata using Twitter oEmbed API
async function fetchTweetMetadata(url: string) {
  try {
    const response = await fetch(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`
    )
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return data
  } catch {
    return null
  }
}

// Create a new bookmark
export async function createBookmark(url: string, folderIds: string[] | null, title?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Ensure user profile exists
  await ensureUserProfile(user.id, user.email || "")

  if (!isValidTwitterUrl(url)) {
    return { error: "Invalid URL. Only X/Twitter URLs are allowed." }
  }

  const tweetId = extractTweetId(url)

  // Fetch tweet metadata (raw oEmbed response)
  const tweetMetadata = await fetchTweetMetadata(url)

  // Determine title: use provided title, or default to "<author>'s tweet"
  const bookmarkTitle =
    title || (tweetMetadata?.author_name ? `${tweetMetadata.author_name}'s tweet` : "Tweet")

  const metadata: Record<string, unknown> = {
    tweetId,
    title: bookmarkTitle,
  }
  if (tweetMetadata) {
    Object.assign(metadata, tweetMetadata)
  }

  // Insert bookmark
  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      url,
      content_type: "tweet",
      user_id: user.id,
      metadata,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating bookmark:", error)
    return { error: "Failed to create bookmark" }
  }

  // Add bookmark to folders if provided
  if (folderIds && folderIds.length > 0) {
    const bookmarkFolders = folderIds.map((folderId) => ({
      bookmark_id: data.id,
      folder_id: folderId,
    }))

    const { error: folderError } = await supabase.from("bookmark_folders").insert(bookmarkFolders)

    if (folderError) {
      console.error("Error adding bookmark to folders:", folderError)
      // Don't fail the entire operation if folder assignment fails
    }
  }

  return { success: true, bookmark: data }
}

// Delete a bookmark
export async function deleteBookmark(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase.from("bookmarks").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting bookmark:", error)
    return { error: "Failed to delete bookmark" }
  }

  return { success: true }
}

// Add bookmark to folders
export async function addBookmarkToFolders(bookmarkId: string, folderIds: string[]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Verify bookmark belongs to user
  const { data: bookmark } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("id", bookmarkId)
    .eq("user_id", user.id)
    .single()

  if (!bookmark) {
    return { error: "Bookmark not found" }
  }

  // Add bookmark to folders
  const bookmarkFolders = folderIds.map((folderId) => ({
    bookmark_id: bookmarkId,
    folder_id: folderId,
  }))

  const { error } = await supabase.from("bookmark_folders").insert(bookmarkFolders)

  if (error) {
    console.error("Error adding bookmark to folders:", error)
    return { error: "Failed to add bookmark to folders" }
  }

  return { success: true }
}

// Remove bookmark from folders
export async function removeBookmarkFromFolders(bookmarkId: string, folderIds: string[]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("bookmark_folders")
    .delete()
    .eq("bookmark_id", bookmarkId)
    .in("folder_id", folderIds)

  if (error) {
    console.error("Error removing bookmark from folders:", error)
    return { error: "Failed to remove bookmark from folders" }
  }

  return { success: true }
}

// Toggle reading list
export async function toggleReadingList(bookmarkId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Get current value
  const { data: current } = await supabase
    .from("bookmarks")
    .select("reading_list")
    .eq("id", bookmarkId)
    .eq("user_id", user.id)
    .single()

  if (!current) {
    return { error: "Bookmark not found" }
  }

  const { error } = await supabase
    .from("bookmarks")
    .update({ reading_list: !current.reading_list })
    .eq("id", bookmarkId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error toggling reading list:", error)
    return { error: "Failed to update reading list" }
  }

  return { success: true, readingList: !current.reading_list }
}

// Get all bookmarks for user
export async function getUserBookmarks(): Promise<BookmarkWithFolders[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select(
      `
      *,
      bookmark_folders (
        folders (
          id,
          name,
          color,
          icon
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bookmarks:", error)
    return []
  }

  // Transform to camelCase for components
  return data.map((bookmark) => ({
    id: bookmark.id,
    url: bookmark.url,
    contentType: bookmark.content_type,
    metadata: bookmark.metadata,
    userId: bookmark.user_id,
    readingList: bookmark.reading_list,
    createdAt: new Date(bookmark.created_at),
    folders:
      bookmark.bookmark_folders?.map(
        (bf: { folders: { id: string; name: string; color: string; icon: string } }) => ({
          id: bf.folders.id,
          name: bf.folders.name,
          color: bf.folders.color,
          icon: bf.folders.icon,
        })
      ) || [],
  }))
}

// Update a folder
export async function updateFolder(folderId: string, name: string, color: string, icon: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Verify folder belongs to user
  const { data: folder } = await supabase
    .from("folders")
    .select("user_id")
    .eq("id", folderId)
    .eq("user_id", user.id)
    .single()

  if (!folder) {
    return { error: "Folder not found" }
  }

  const { error } = await supabase
    .from("folders")
    .update({
      name: name.trim(),
      color,
      icon,
    })
    .eq("id", folderId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating folder:", error)
    return { error: "Failed to update folder" }
  }

  return { success: true }
}

// Delete a folder
export async function deleteFolder(folderId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Verify folder belongs to user
  const { data: folder } = await supabase
    .from("folders")
    .select("user_id")
    .eq("id", folderId)
    .eq("user_id", user.id)
    .single()

  if (!folder) {
    return { error: "Folder not found" }
  }

  const { error } = await supabase
    .from("folders")
    .delete()
    .eq("id", folderId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error deleting folder:", error)
    return { error: "Failed to delete folder" }
  }

  return { success: true }
}
