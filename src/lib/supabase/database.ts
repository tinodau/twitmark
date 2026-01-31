import { createClient } from "@/lib/supabase/server";
import type { BookmarkWithFolder } from "@/types";

// Database types (snake_case from Supabase)
type Bookmark = {
  id: string;
  url: string;
  content_type: "tweet" | "article";
  metadata: Record<string, unknown> | null;
  folder_id: string | null;
  user_id: string;
  reading_list: boolean;
  created_at: string;
  folders?: {
    name: string;
    color: string;
  } | null;
};

type Folder = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
};

// Ensure user has a profile
async function ensureUserProfile(userId: string, email: string) {
  const supabase = await createClient();

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single();

  // If profile doesn't exist, create it
  if (!existingProfile) {
    await supabase.from("profiles").insert({
      id: userId,
      email: email,
    });
  }
}

// Validate X/Twitter URL
export function isValidTwitterUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    return (
      hostname === "x.com" ||
      hostname === "www.x.com" ||
      hostname === "twitter.com" ||
      hostname === "www.twitter.com" ||
      hostname === "mobile.twitter.com"
    );
  } catch {
    return false;
  }
}

// Extract tweet/article ID from URL
export function extractTweetId(url: string): string | null {
  const patterns = [
    /x\.com\/i\/article\/(\d+)/, // Article ID
    /x\.com\/\w+\/status\/(\d+)/, // Tweet ID
    /twitter\.com\/\w+\/status\/(\d+)/,
    /mobile\.twitter\.com\/\w+\/status\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Fetch tweet metadata using Twitter oEmbed API
async function fetchTweetMetadata(url: string) {
  try {
    const response = await fetch(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`,
    );
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

// Create a new bookmark
export async function createBookmark(
  url: string,
  folderId: string | null,
  title?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Ensure user profile exists
  await ensureUserProfile(user.id, user.email || "");

  if (!isValidTwitterUrl(url)) {
    return { error: "Invalid URL. Only X/Twitter URLs are allowed." };
  }

  const tweetId = extractTweetId(url);

  // Fetch tweet metadata (raw oEmbed response)
  const tweetMetadata = await fetchTweetMetadata(url);

  // Determine title: use provided title, or default to "<author>'s tweet"
  const bookmarkTitle =
    title ||
    (tweetMetadata?.author_name
      ? `${tweetMetadata.author_name}'s tweet`
      : "Tweet");

  const metadata: Record<string, unknown> = {
    tweetId,
    title: bookmarkTitle,
  };
  if (tweetMetadata) {
    Object.assign(metadata, tweetMetadata);
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      url,
      content_type: "tweet",
      user_id: user.id,
      folder_id: folderId,
      metadata,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating bookmark:", error);
    return { error: "Failed to create bookmark" };
  }

  return { success: true, bookmark: data };
}

// Delete a bookmark
export async function deleteBookmark(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting bookmark:", error);
    return { error: "Failed to delete bookmark" };
  }

  return { success: true };
}

// Move bookmark to folder
export async function moveBookmark(
  bookmarkId: string,
  folderId: string | null,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("bookmarks")
    .update({ folder_id: folderId })
    .eq("id", bookmarkId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error moving bookmark:", error);
    return { error: "Failed to move bookmark" };
  }

  return { success: true };
}

// Toggle reading list
export async function toggleReadingList(bookmarkId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Get current value
  const { data: current } = await supabase
    .from("bookmarks")
    .select("reading_list")
    .eq("id", bookmarkId)
    .eq("user_id", user.id)
    .single();

  if (!current) {
    return { error: "Bookmark not found" };
  }

  const { error } = await supabase
    .from("bookmarks")
    .update({ reading_list: !current.reading_list })
    .eq("id", bookmarkId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error toggling reading list:", error);
    return { error: "Failed to update reading list" };
  }

  return { success: true, readingList: !current.reading_list };
}

// Get all bookmarks for user
export async function getUserBookmarks(): Promise<BookmarkWithFolder[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select(
      `
      *,
      folders (
        name,
        color
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }

  // Transform to camelCase for components
  return data.map((bookmark) => ({
    id: bookmark.id,
    url: bookmark.url,
    contentType: bookmark.content_type,
    metadata: bookmark.metadata,
    folderId: bookmark.folder_id,
    userId: bookmark.user_id,
    readingList: bookmark.reading_list,
    createdAt: new Date(bookmark.created_at),
    folder: bookmark.folders
      ? {
          name: bookmark.folders.name,
          color: bookmark.folders.color,
        }
      : null,
  }));
}
