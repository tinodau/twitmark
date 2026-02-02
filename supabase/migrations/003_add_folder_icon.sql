-- Add icon field to folders table
ALTER TABLE public.folders ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'folder';

-- Update RLS policies to allow reading/writing the new icon field
-- (The existing policies already cover all columns, so no new policies needed)