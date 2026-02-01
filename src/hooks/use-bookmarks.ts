"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createBookmark,
  deleteBookmark,
  toggleReadingList,
  addBookmarkToFolders,
  removeBookmarkFromFolders,
} from "@/app/actions/bookmarks"
import type { BookmarkWithFolder } from "@/types"
import { useToast } from "@/contexts/toast-context"

// Query keys
export const bookmarksKeys = {
  all: ["bookmarks"] as const,
  lists: () => [...bookmarksKeys.all, "list"] as const,
  readingList: () => [...bookmarksKeys.all, "reading-list"] as const,
}

// Server actions can't be used directly with useQuery, so we'll use mutations and fetch via server components
// For now, we'll focus on mutations with optimistic updates

export function useCreateBookmark() {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()

  return useMutation({
    mutationFn: async (data: { url: string; folderIds?: string[]; title?: string }) => {
      const formData = new FormData()
      formData.append("url", data.url)
      if (data.title) formData.append("title", data.title)
      if (data.folderIds && data.folderIds.length > 0) {
        data.folderIds.forEach((id) => formData.append("folderIds", id))
      }
      return createBookmark(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarksKeys.lists() })
      success("Bookmark added")
    },
    onError: (error: Error) => {
      showError("Failed to add bookmark", error.message)
    },
  })
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()

  return useMutation({
    mutationFn: deleteBookmark,
    onMutate: async (bookmarkId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookmarksKeys.lists() })

      // Snapshot previous value
      const previousBookmarks = queryClient.getQueryData(bookmarksKeys.lists())

      // Optimistically remove bookmark from cache
      queryClient.setQueryData(bookmarksKeys.lists(), (old: BookmarkWithFolder[] | undefined) => {
        if (!old) return old
        return old.filter((b) => b.id !== bookmarkId)
      })

      return { previousBookmarks }
    },
    onError: (error, variables, context) => {
      // Rollback to previous value
      queryClient.setQueryData(bookmarksKeys.lists(), context?.previousBookmarks)
      showError("Failed to delete bookmark", error.message)
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: bookmarksKeys.lists() })
      success("Bookmark deleted")
    },
  })
}

export function useToggleReadingList() {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()

  return useMutation({
    mutationFn: toggleReadingList,
    onMutate: async (bookmarkId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookmarksKeys.lists() })

      // Snapshot previous value
      const previousBookmarks = queryClient.getQueryData(bookmarksKeys.lists())

      // Optimistically update reading list status
      queryClient.setQueryData(bookmarksKeys.lists(), (old: BookmarkWithFolder[] | undefined) => {
        if (!old) return old
        return old.map((b) => (b.id === bookmarkId ? { ...b, readingList: !b.readingList } : b))
      })

      return { previousBookmarks }
    },
    onError: (error, variables, context) => {
      // Rollback to previous value
      queryClient.setQueryData(bookmarksKeys.lists(), context?.previousBookmarks)
      showError("Failed to update reading list", error.message)
    },
    onSettled: async () => {
      // Always refetch after error or success
      await queryClient.invalidateQueries({ queryKey: bookmarksKeys.lists() })
    },
  })
}

export function useAddBookmarkToFolders() {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()

  return useMutation({
    mutationFn: ({ bookmarkId, folderIds }: { bookmarkId: string; folderIds: string[] }) =>
      addBookmarkToFolders(bookmarkId, folderIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarksKeys.lists() })
      success("Folders updated")
    },
    onError: (error: Error) => {
      showError("Failed to update folders", error.message)
    },
  })
}

export function useRemoveBookmarkFromFolders() {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()

  return useMutation({
    mutationFn: ({ bookmarkId, folderIds }: { bookmarkId: string; folderIds: string[] }) =>
      removeBookmarkFromFolders(bookmarkId, folderIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarksKeys.lists() })
      success("Folders updated")
    },
    onError: (error: Error) => {
      showError("Failed to update folders", error.message)
    },
  })
}
