"use server"

import { revalidatePath } from "next/cache"
import {
  createBookmark as dbCreateBookmark,
  deleteBookmark as dbDeleteBookmark,
  toggleReadingList as dbToggleReadingList,
  getUserBookmarks as dbGetUserBookmarks,
  addBookmarkToFolders as dbAddBookmarkToFolders,
  removeBookmarkFromFolders as dbRemoveBookmarkFromFolders,
  updateBookmark as dbUpdateBookmark,
} from "@/lib/supabase/database"

// Create a new bookmark
export async function createBookmark(formData: FormData) {
  const url = formData.get("url") as string
  const title = formData.get("title") as string | null
  const folderIds = formData.getAll("folderIds") as string[] | null

  const result = await dbCreateBookmark(
    url,
    folderIds && folderIds.length > 0 ? folderIds : null,
    title || undefined
  )

  if (result.error) {
    return result
  }

  revalidatePath("/dashboard")
  return result
}

// Delete a bookmark
export async function deleteBookmark(id: string) {
  const result = await dbDeleteBookmark(id)

  if (result.error) {
    return result
  }

  revalidatePath("/dashboard")
  return result
}

// Add bookmark to folders
export async function addBookmarkToFolders(bookmarkId: string, folderIds: string[]) {
  const result = await dbAddBookmarkToFolders(bookmarkId, folderIds)

  if (result.error) {
    return result
  }

  revalidatePath("/dashboard")
  return result
}

// Remove bookmark from folders
export async function removeBookmarkFromFolders(bookmarkId: string, folderIds: string[]) {
  const result = await dbRemoveBookmarkFromFolders(bookmarkId, folderIds)

  if (result.error) {
    return result
  }

  revalidatePath("/dashboard")
  return result
}

// Toggle reading list
export async function toggleReadingList(bookmarkId: string) {
  const result = await dbToggleReadingList(bookmarkId)

  if (result.error) {
    return result
  }

  revalidatePath("/dashboard")
  return result
}

// Get all bookmarks for user
export async function getUserBookmarks() {
  return await dbGetUserBookmarks()
}

// Update bookmark title and folders
export async function updateBookmark(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const folderIds = formData.getAll("folderIds") as string[]

  if (!title || title.trim() === "") {
    return { error: "Title is required" }
  }

  const result = await dbUpdateBookmark(id, title.trim())

  if (result.error) {
    return result
  }

  // Get current bookmark's folders
  const bookmarks = await dbGetUserBookmarks()
  const bookmark = bookmarks.find((b) => b.id === id)
  const currentFolderIds = bookmark?.folders.map((f) => f.id) || []

  // Calculate folders to add and remove
  const foldersToAdd = folderIds.filter((id) => !currentFolderIds.includes(id))
  const foldersToRemove = currentFolderIds.filter((id) => !folderIds.includes(id))

  // Add new folders
  if (foldersToAdd.length > 0) {
    const addResult = await dbAddBookmarkToFolders(id, foldersToAdd)
    if (addResult.error) {
      return addResult
    }
  }

  // Remove folders
  if (foldersToRemove.length > 0) {
    const removeResult = await dbRemoveBookmarkFromFolders(id, foldersToRemove)
    if (removeResult.error) {
      return removeResult
    }
  }

  revalidatePath("/dashboard")
  return result
}
