-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom function to auto-generate UUID
CREATE OR REPLACE FUNCTION generate_uuid()
RETURNS UUID AS $$
BEGIN
  RETURN uuid_generate_v4();
END;
$$ LANGUAGE plpgsql;

-- Users table (Supabase auth.users is used, this is for extended user data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Folders table
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID DEFAULT generate_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#1D9BF0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT generate_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  content_type TEXT DEFAULT 'tweet', -- currently only 'tweet' is used
  metadata JSONB,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reading_list BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Junction table for many-to-many relationship between bookmarks and folders
CREATE TABLE IF NOT EXISTS public.bookmark_folders (
  bookmark_id UUID REFERENCES public.bookmarks(id) ON DELETE CASCADE NOT NULL,
  folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  PRIMARY KEY (bookmark_id, folder_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_reading_list ON public.bookmarks(reading_list);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON public.bookmarks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON public.folders(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_folders_bookmark_id ON public.bookmark_folders(bookmark_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_folders_folder_id ON public.bookmark_folders(folder_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Folders policies
CREATE POLICY "Users can view own folders"
  ON public.folders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own folders"
  ON public.folders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders"
  ON public.folders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders"
  ON public.folders FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on junction table
ALTER TABLE public.bookmark_folders ENABLE ROW LEVEL SECURITY;

-- Bookmark_folders policies
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

-- Bookmarks policies
CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
  ON public.bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();