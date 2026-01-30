"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FolderContextType {
  selectedFolderId: string | null;
  setSelectedFolderId: (folderId: string | null) => void;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export function FolderProvider({ children }: { children: ReactNode }) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  return (
    <FolderContext.Provider value={{ selectedFolderId, setSelectedFolderId }}>
      {children}
    </FolderContext.Provider>
  );
}

export function useFolder() {
  const context = useContext(FolderContext);
  if (context === undefined) {
    throw new Error("useFolder must be used within a FolderProvider");
  }
  return context;
}
