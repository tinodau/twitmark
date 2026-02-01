"use server"

import { revalidatePath } from "next/cache"
import type { BookmarkWithFolder } from "@/types"
import {
  createBookmark as dbCreateBookmark,
  deleteBookmark as dbDeleteBookmark,
  toggleReadingList as dbToggleReadingList,
  getUserBookmarks as dbGetUserBookmarks,
  addBookmarkToFolders as dbAddBookmarkToFolders,
  removeBookmarkFromFolders as dbRemoveBookmarkFromFolders,
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
