"use server";

import { revalidatePath } from "next/cache";
import type { BookmarkWithFolder } from "@/types";
import {
  createBookmark as dbCreateBookmark,
  deleteBookmark as dbDeleteBookmark,
  moveBookmark as dbMoveBookmark,
  toggleReadingList as dbToggleReadingList,
  getUserBookmarks as dbGetUserBookmarks,
} from "@/lib/supabase/database";

// Create a new bookmark
export async function createBookmark(formData: FormData) {
  const url = formData.get("url") as string;
  const title = formData.get("title") as string | null;
  const folderId = formData.get("folderId") as string | null;

  const result = await dbCreateBookmark(url, folderId, title || undefined);

  if (result.error) {
    return result;
  }

  revalidatePath("/dashboard");
  return result;
}

// Delete a bookmark
export async function deleteBookmark(id: string) {
  const result = await dbDeleteBookmark(id);

  if (result.error) {
    return result;
  }

  revalidatePath("/dashboard");
  return result;
}

// Move bookmark to folder
export async function moveBookmark(
  bookmarkId: string,
  folderId: string | null,
) {
  const result = await dbMoveBookmark(bookmarkId, folderId);

  if (result.error) {
    return result;
  }

  revalidatePath("/dashboard");
  return result;
}

// Toggle reading list
export async function toggleReadingList(bookmarkId: string) {
  const result = await dbToggleReadingList(bookmarkId);

  if (result.error) {
    return result;
  }

  revalidatePath("/dashboard");
  return result;
}

// Get all bookmarks for user
export async function getUserBookmarks() {
  return await dbGetUserBookmarks();
}
