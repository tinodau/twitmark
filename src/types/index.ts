// Folder type
export type Folder = {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  bookmarkCount?: number;
};

// Tweet metadata - Raw Twitter oEmbed response
export type TweetMetadata = {
  tweetId?: string;
  [key: string]: unknown; // Allow any field from oEmbed
};

// Database types (exported separately from server actions)
export type BookmarkWithFolder = {
  id: string;
  url: string;
  contentType: "tweet";
  metadata: TweetMetadata | null;
  folderId: string | null;
  userId: string;
  readingList: boolean;
  createdAt: Date;
  folder: {
    name: string;
    color: string;
  } | null;
};
