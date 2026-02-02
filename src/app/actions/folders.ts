"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  updateFolder as dbUpdateFolder,
  deleteFolder as dbDeleteFolder,
} from "@/lib/supabase/database"
import type { Folder } from "@/types"

// Update a folder with direct parameters
export async function updateFolder(folderId: string, name: string, color: string, icon: string) {
  const result = await dbUpdateFolder(folderId, name, color, icon)

  if (result.error) {
    return result
  }

  revalidatePath("/dashboard")
  return { success: true }
}

// Delete a folder with direct parameter
export async function deleteFolder(folderId: string) {
  const result = await dbDeleteFolder(folderId)

  if (result.error) {
    return result
  }

  revalidatePath("/dashboard")
  return { success: true }
}

// Get all folders for current user
export async function getFolders(): Promise<Folder[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: folders, error } = await supabase
    .from("folders")
    .select(
      `
      *,
      bookmarks(count)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching folders:", error)
    return []
  }

  // Transform to camelCase and add bookmark count
  return (
    folders?.map((folder) => ({
      id: folder.id,
      name: folder.name,
      color: folder.color,
      icon: folder.icon || "folder",
      userId: folder.user_id,
      createdAt: new Date(folder.created_at),
      bookmarkCount: folder.bookmarks?.[0]?.count || 0,
    })) || []
  )
}

// Create a new folder
export async function createFolder(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to create a folder" }
  }

  const name = formData.get("name") as string
  const color = (formData.get("color") as string) || "#1D9BF0"
  const icon = (formData.get("icon") as string) || "folder"

  if (!name || name.trim().length === 0) {
    return { error: "Folder name is required" }
  }

  if (name.length > 50) {
    return { error: "Folder name must be less than 50 characters" }
  }

  const { error } = await supabase.from("folders").insert({
    name: name.trim(),
    color,
    icon,
    user_id: user.id,
  })

  if (error) {
    console.error("Error creating folder:", error)
    return { error: "Failed to create folder" }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

// Get folder by ID
export async function getFolderById(id: string): Promise<Folder | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: folder, error } = await supabase
    .from("folders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !folder) {
    return null
  }

  return {
    id: folder.id,
    name: folder.name,
    color: folder.color,
    icon: folder.icon || "folder",
    userId: folder.user_id,
    createdAt: new Date(folder.created_at),
  }
}
