"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Folder } from "@/types";

// Get all folders for current user
export async function getFolders(): Promise<Folder[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: folders, error } = await supabase
    .from("folders")
    .select(
      `
      *,
      bookmarks(count)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching folders:", error);
    return [];
  }

  // Transform to camelCase and add bookmark count
  return (
    folders?.map((folder) => ({
      id: folder.id,
      name: folder.name,
      color: folder.color,
      userId: folder.user_id,
      createdAt: new Date(folder.created_at),
      bookmarkCount: folder.bookmarks?.[0]?.count || 0,
    })) || []
  );
}

// Create a new folder
export async function createFolder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a folder" };
  }

  const name = formData.get("name") as string;
  const color = (formData.get("color") as string) || "#1D9BF0";

  if (!name || name.trim().length === 0) {
    return { error: "Folder name is required" };
  }

  if (name.length > 50) {
    return { error: "Folder name must be less than 50 characters" };
  }

  const { error } = await supabase.from("folders").insert({
    name: name.trim(),
    color,
    user_id: user.id,
  });

  if (error) {
    console.error("Error creating folder:", error);
    return { error: "Failed to create folder" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

// Update a folder
export async function updateFolder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update a folder" };
  }

  const folderId = formData.get("id") as string;
  const name = formData.get("name") as string;
  const color = formData.get("color") as string;

  if (!folderId) {
    return { error: "Folder ID is required" };
  }

  if (!name || name.trim().length === 0) {
    return { error: "Folder name is required" };
  }

  // Verify folder belongs to user
  const { data: folder } = await supabase
    .from("folders")
    .select("user_id")
    .eq("id", folderId)
    .single();

  if (!folder || folder.user_id !== user.id) {
    return { error: "Folder not found" };
  }

  const { error } = await supabase
    .from("folders")
    .update({
      name: name.trim(),
      color,
    })
    .eq("id", folderId);

  if (error) {
    console.error("Error updating folder:", error);
    return { error: "Failed to update folder" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

// Delete a folder
export async function deleteFolder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete a folder" };
  }

  const folderId = formData.get("id") as string;

  if (!folderId) {
    return { error: "Folder ID is required" };
  }

  // Verify folder belongs to user
  const { data: folder } = await supabase
    .from("folders")
    .select("user_id")
    .eq("id", folderId)
    .single();

  if (!folder || folder.user_id !== user.id) {
    return { error: "Folder not found" };
  }

  const { error } = await supabase.from("folders").delete().eq("id", folderId);

  if (error) {
    console.error("Error deleting folder:", error);
    return { error: "Failed to delete folder" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

// Get folder by ID
export async function getFolderById(id: string): Promise<Folder | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: folder, error } = await supabase
    .from("folders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !folder) {
    return null;
  }

  return {
    id: folder.id,
    name: folder.name,
    color: folder.color,
    userId: folder.user_id,
    createdAt: new Date(folder.created_at),
  };
}
