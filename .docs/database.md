# Database Setup Instructions

Follow these steps to set up your Supabase database with Twitmark schema.

## Step 1: Run SQL Schema

1. Go to your Supabase project dashboard: [supabase.com/dashboard](https://supabase.com/dashboard)

2. Select your project

3. Navigate to **SQL Editor** in left sidebar

4. Click **New Query**

5. Copy entire contents of `supabase/schema.sql` file and paste it into SQL Editor

6. Click **Run** (or press `Cmd/Ctrl + Enter`)

7. Verify you see "Success" message with no errors

## What Schema Creates:

### Tables:

- **`profiles`** - Extended user data (name, avatar, email)
- **`folders`** - User-created bookmark folders with custom colors
- **`bookmarks`** - Saved X links with metadata and reading list status

### Features:

- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **Auto Profile Creation** - Triggers automatically create profile on signup
- ✅ **Performance Indexes** - Optimized queries for user_id, folder_id, reading_list
- ✅ **Cascading Deletes** - Clean up related data when folders/users are deleted

## Step 2: Verify Setup

After running the schema, verify tables exist:

1. Go to **Database** in left sidebar
2. Click on **Tables**
3. You should see:
   - `public.profiles`
   - `public.folders`
   - `public.bookmarks`

## Step 3: Test Row Level Security

1. Click on **`bookmarks`** table
2. Click on **RLS Policies** tab
3. Verify these policies exist:
   - "Users can view own bookmarks"
   - "Users can create own bookmarks"
   - "Users can update own bookmarks"
   - "Users can delete own bookmarks"

## Step 4: Test Google OAuth Setup

1. Go to **Authentication → Providers**
2. Click on **Google**
3. Ensure:
   - **Enable Sign in with Google** is ON
   - **Client ID** is set
   - **Client Secret** is set
   - **Redirect URL** matches your Supabase project URL

## Troubleshooting

### Schema Run Failed

**Error: "permission denied for schema public"**

- Make sure you're project owner
- Check you're in correct project

**Error: "function generate_uuid() already exists"**

- This is normal! The script uses `IF NOT EXISTS` so it's safe

### RLS Policies Not Working

**Can't insert data:**

- Make sure you're logged in to test
- Check RLS policies are enabled on all tables

### Google OAuth Not Working

**"Invalid redirect_uri" error:**

- Copy redirect URL from Supabase Google provider page
- Paste it into Google Cloud Console OAuth settings

**"Access denied" error:**

- Ensure Google OAuth is enabled in Supabase
- Check Client ID and Secret are correct

## Next Steps

Once schema is set up successfully:

1. Run this command to confirm connection works:

   ```bash
   npm run dev
   ```

2. I'll create auth pages and dashboard next!

---

**Need help?** Check [Supabase docs](https://supabase.com/docs) or ask me! 🚀
