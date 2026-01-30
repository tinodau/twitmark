// Folder type
export type Folder = {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  bookmarkCount?: number;
};

// Database types (exported separately from server actions)
export type BookmarkWithFolder = {
  id: string;
  url: string;
  contentType: "tweet" | "article";
  metadata: Record<string, unknown> | null;
  folderId: string | null;
  userId: string;
  readingList: boolean;
  createdAt: Date;
  folder: {
    name: string;
    color: string;
  } | null;
};
