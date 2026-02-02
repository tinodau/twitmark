# Database Setup Instructions

Follow these steps to set up your Supabase database with Twitmark schema.

## Prerequisites

Twitmark uses a **single Supabase project** for both development and production environments. Row Level Security (RLS) ensures each user can only access their own data, so development and production data coexist safely.

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Create your project (e.g., `twitmark`)
4. Wait for the project to be created (~2 minutes)

## Step 2: Run SQL Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/schema.sql` file and paste it into the SQL Editor
5. Click **Run** (or press `Cmd/Ctrl + Enter`)
6. Verify you see "Success" message with no errors

**Alternative: Using Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push schema
supabase db push
```

## Step 3: Apply Migrations

Your project includes migration files in `supabase/migrations/`. Run these in order:

1. `001_initial_schema.sql` (if exists)
2. `002_add_multiple_folders.sql`
3. `003_add_folder_icon.sql`
4. Any additional migrations

**Or use Supabase CLI:**

```bash
# Run all migrations
supabase db push
```

## Step 4: Get Credentials

1. Go to **Settings** → **API**
2. Copy:
   - Project URL → Save for `.env.local`
   - anon/public key → Save for `.env.local`

See [`.env.example`](../../.env.example) for the exact format.

## Step 5: Configure Environment Variables

**Local Development:**

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

**Production (Cloudflare Pages):**

1. Go to Cloudflare Dashboard → Workers & Pages → twitmark → Settings → Environment Variables
2. Add for **Production** environment:
   - `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`

See [`.docs/deployment.md`](./deployment.md) for complete deployment guide.

## Step 6: Verify Setup

1. Go to **Database** in the left sidebar
2. Click on **Tables**
3. You should see:
   - `public.profiles`
   - `public.folders`
   - `public.bookmarks`

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

## Step 7: Test Row Level Security

1. Click on **`bookmarks`** table
2. Click on **RLS Policies** tab
3. Verify these policies exist:
   - "Users can view own bookmarks"
   - "Users can create own bookmarks"
   - "Users can update own bookmarks"
   - "Users can delete own bookmarks"

## Step 8: Test Google OAuth Setup

1. Go to **Authentication** → **Providers**
2. Click on **Google**
3. Ensure:
   - **Enable Sign in with Google** is ON
   - **Client ID** is set
   - **Client Secret** is set
   - **Redirect URL** matches your Supabase project URL

## Migration Management

### Creating New Migrations

When making database changes:

1. **Create migration file:**

```bash
supabase migration new your_migration_name
```

2. **Test locally:**

```bash
# Link to project (if not already)
supabase link --project-ref YOUR_PROJECT_REF

# Push changes
supabase db push

# Test locally
npm run dev
```

3. **Commit migration files:**

```bash
git add supabase/migrations/
git commit -m "Add migration for new feature"
git push
```

### Migration Checklist

Before applying migrations:

- [ ] Migration tested locally
- [ ] No breaking changes to existing data
- [ ] RLS policies updated (if needed)
- [ ] Backed up production data (if risky change)
- [ ] Tested locally with sample data
- [ ] Committed migration files to git
- [ ] Documented changes in migration file

See [`.docs/deployment.md`](./deployment.md) for more information.

## Environment Configuration

### Local Development

Uses your Supabase project via `.env.local`:

```bash
npm run dev
```

### Production Deployment

Uses same Supabase project via Cloudflare Pages environment variables:

```bash
git push origin main
# Cloudflare auto-deploys
```

**Important**: Since we use a single Supabase project, both development and production share the same database. Row Level Security (RLS) ensures users can only access their own data, so there's no risk of data mixing between users.

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

### Migration Issues

**Migration fails:**

- Verify migration was tested locally first
- Check for data conflicts
- Use Supabase SQL Editor to manually fix issues if needed

**Schema out of sync:**

- Check which migrations have run
- Run missing migrations manually if needed
- Always run migrations in order

## Next Steps

Once schema is set up successfully:

1. Run local development:

   ```bash
   npm run dev
   ```

2. Deploy to production:

   ```bash
   git push origin main
   ```

---

**Need help?** Check [Supabase docs](https://supabase.com/docs) or [`.docs/deployment.md`](./deployment.md)! 🚀
