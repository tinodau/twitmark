"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFolder, updateFolder, deleteFolder } from "@/app/actions/folders"
import type { Folder } from "@/types"
import { useToast } from "@/contexts/toast-context"

// Query keys
export const foldersKeys = {
  all: ["folders"] as const,
  lists: () => [...foldersKeys.all, "list"] as const,
  details: () => [...foldersKeys.all, "detail"] as const,
  detail: (id: string) => [...foldersKeys.details(), id] as const,
}

export function useCreateFolder() {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()

  return useMutation({
    mutationFn: async (data: { name: string; color: string }) => {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("color", data.color)
      return createFolder(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersKeys.lists() })
      success("Folder created")
    },
    onError: (error: Error) => {
      showError("Failed to create folder", error.message)
    },
  })
}

export function useUpdateFolder() {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()

  return useMutation({
    mutationFn: ({ id, name, color }: { id: string; name: string; color: string }) =>
      updateFolder(id, name, color),
    onMutate: async ({ id, name, color }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: foldersKeys.lists() })

      // Snapshot previous value
      const previousFolders = queryClient.getQueryData(foldersKeys.lists())

      // Optimistically update folder
      queryClient.setQueryData(foldersKeys.lists(), (old: Folder[] | undefined) => {
        if (!old) return old
        return old.map((f) => (f.id === id ? { ...f, name, color } : f))
      })

      return { previousFolders }
    },
    onError: (error, variables, context) => {
      // Rollback to previous value
      queryClient.setQueryData(foldersKeys.lists(), context?.previousFolders)
      showError("Failed to update folder", error.message)
    },
    onSettled: async () => {
      // Always refetch after error or success
      await queryClient.invalidateQueries({ queryKey: foldersKeys.lists() })
      success("Folder updated")
    },
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToast()

  return useMutation({
    mutationFn: deleteFolder,
    onMutate: async (folderId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: foldersKeys.lists() })

      // Snapshot previous value
      const previousFolders = queryClient.getQueryData(foldersKeys.lists())

      // Optimistically remove folder
      queryClient.setQueryData(foldersKeys.lists(), (old: Folder[] | undefined) => {
        if (!old) return old
        return old.filter((f) => f.id !== folderId)
      })

      return { previousFolders }
    },
    onError: (error, variables, context) => {
      // Rollback to previous value
      queryClient.setQueryData(foldersKeys.lists(), context?.previousFolders)
      showError("Failed to delete folder", error.message)
    },
    onSettled: async () => {
      // Always refetch after error or success
      await queryClient.invalidateQueries({ queryKey: foldersKeys.lists() })
      success("Folder deleted")
    },
  })
}
