-- Migration: Support multiple folders per bookmark

-- Create junction table for many-to-many relationship between bookmarks and folders
CREATE TABLE IF NOT EXISTS public.bookmark_folders (
  bookmark_id UUID REFERENCES public.bookmarks(id) ON DELETE CASCADE NOT NULL,
  folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  PRIMARY KEY (bookmark_id, folder_id)
);

-- Remove the old folder_id foreign key constraint from bookmarks table
ALTER TABLE public.bookmarks DROP CONSTRAINT IF EXISTS bookmarks_folder_id_fkey;

-- Drop the old folder_id column from bookmarks table
ALTER TABLE public.bookmarks DROP COLUMN IF EXISTS folder_id;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmark_folders_bookmark_id ON public.bookmark_folders(bookmark_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_folders_folder_id ON public.bookmark_folders(folder_id);

-- Enable RLS on the junction table
ALTER TABLE public.bookmark_folders ENABLE ROW LEVEL SECURITY;

-- Policies for bookmark_folders
CREATE POLICY "Users can view bookmark folders for own bookmarks"
  ON public.bookmark_folders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookmarks
      WHERE bookmarks.id = bookmark_folders.bookmark_id
      AND bookmarks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add folders to own bookmarks"
  ON public.bookmark_folders FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookmarks
      WHERE bookmarks.id = bookmark_folders.bookmark_id
      AND bookmarks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove folders from own bookmarks"
  ON public.bookmark_folders FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.bookmarks
      WHERE bookmarks.id = bookmark_folders.bookmark_id
      AND bookmarks.user_id = auth.uid()
    )
  );

-- Drop old index that is no longer needed
DROP INDEX IF EXISTS idx_bookmarks_folder_id;