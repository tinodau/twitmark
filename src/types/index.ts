// Folder type
export type Folder = {
  id: string
  name: string
  color: string
  icon: string
  userId: string
  createdAt: Date
  bookmarkCount?: number
}

// Tweet metadata - Raw Twitter oEmbed response
export type TweetMetadata = {
  tweetId?: string
  [key: string]: unknown // Allow any field from oEmbed
}

// Database types (exported separately from server actions)
export type BookmarkWithFolders = {
  id: string
  url: string
  contentType: "tweet"
  metadata: TweetMetadata | null
  userId: string
  readingList: boolean
  createdAt: Date
  folders: Array<{
    id: string
    name: string
    color: string
    icon: string
  }>
}

// Legacy type for backward compatibility
export type BookmarkWithFolder = BookmarkWithFolders
