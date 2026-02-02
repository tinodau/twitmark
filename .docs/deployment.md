# Cloudflare Pages Deployment Guide for Twitmark

This guide will walk you through deploying Twitmark to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (free tier works)
2. GitHub account
3. **Two** Supabase projects (one for development, one for production)

## Supabase Projects Setup

This project uses **separate Supabase projects** for development and production to ensure complete data isolation.

### Step 1: Create Development Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Name it `twitmark-dev` (or similar)
4. Choose a region close to you
5. Set database password (save it securely)
6. Wait for project to be created (~2 minutes)

### Step 2: Create Production Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Name it `twitmark-prod` (or similar)
4. Choose the same region as dev project
5. Set database password (save it securely)
6. Wait for project to be created (~2 minutes)

### Step 3: Run Migrations on Both Projects

For **each project** (dev and prod):

1. Go to **SQL Editor** in Supabase Dashboard
2. Run each migration file from `supabase/migrations/` in order:
   - `001_initial_schema.sql` (if exists)
   - `002_add_multiple_folders.sql`
   - `003_add_folder_icon.sql`
   - Any additional migrations

Or use Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to development project
supabase link --project-ref YOUR_DEV_PROJECT_REF

# Push migrations to dev
supabase db push

# Link to production project
supabase link --project-ref YOUR_PROD_PROJECT_REF

# Push migrations to prod
supabase db push
```

### Step 4: Get Credentials for Both Projects

For **each project**, go to **Settings** → **API** and copy:

**Development Project:**

- Project URL → Save as `DEV_SUPABASE_URL`
- anon/public key → Save as `DEV_SUPABASE_ANON_KEY`
- Project reference (from URL) → Save as `DEV_SUPABASE_PROJECT_REF`

**Production Project:**

- Project URL → Save as `PROD_SUPABASE_URL`
- anon/public key → Save as `PROD_SUPABASE_ANON_KEY`
- Project reference (from URL) → Save as `PROD_SUPABASE_PROJECT_REF`

### Step 5: Configure Local Development

Create `.env.local` (or copy from `.env.example`):

```bash
# Local Development - Uses Dev Project
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
```

### Step 6: Configure Cloudflare Pages (Production)

In Cloudflare Dashboard → **Settings** → **Environment Variables** → **Production**:

```bash
# Production - Uses Prod Project
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
```

## Environment Switching Guide

### Development (Local)

```bash
# Uses .env.local (Dev Project)
npm run dev
```

- Development data stays in `twitmark-dev`
- Safe to test, delete, modify anything
- No risk to production data

### Production (Cloudflare Pages)

```bash
# Uses Cloudflare env vars (Prod Project)
git push origin main
# Cloudflare auto-deploys
```

- Production data stays in `twitmark-prod`
- Clean separation from dev data
- Real users access this

### Switching Between Projects for Testing

If you need to test against production data locally:

```bash
# Temporarily change .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key

# Or use a different file
cp .env.prod .env.local
npm run dev
```

⚠️ **Be careful** - any changes you make will affect production data!

## Migration Sync Process

When you make database changes:

1. **Create new migration:**

```bash
# Create migration file
supabase migration new your_migration_name
```

2. **Test on dev project:**

```bash
# Link to dev project (if not already)
supabase link --project-ref DEV_PROJECT_REF

# Push to dev
supabase db push

# Test locally
npm run dev
```

3. **Deploy to production:**

```bash
# Commit migration files
git add supabase/migrations/
git commit -m "Add migration for new feature"
git push

# Link to prod project
supabase link --project-ref PROD_PROJECT_REF

# Push to prod
supabase db push
```

4. **Verify production:**
   - Check Cloudflare deployment succeeded
   - Test production site manually
   - Verify data integrity

### Migration Checklist

Before deploying to production:

- [ ] Migration tested on dev project
- [ ] No breaking changes to existing data
- [ ] RLS policies updated (if needed)
- [ ] Backed up production data (if risky change)
- [ ] Tested locally with dev data
- [ ] Committed migration files to git
- [ ] Documented changes in migration file

## Why Separate Projects?

### Benefits:

1. **Complete Data Isolation**
   - Development data never mixes with production
   - Safe to test destructive operations
   - Real users never see test data

2. **Safe Testing**
   - Can test auth flows with test accounts
   - Can delete/recreate data freely
   - No risk to user data

3. **Clear Separation**
   - Easy to know which environment you're in
   - Different projects have different users
   - Billing separated (dev can be on free tier)

### Considerations:

1. **Need to Sync Migrations**
   - Must apply migrations to both projects
   - Need to track which migrations ran where
   - Consider using Supabase CLI for easier sync

2. **More Setup**
   - Two projects to manage
   - Two sets of credentials
   - Need to keep schema in sync

3. **Testing Against Prod**
   - Requires switching env vars
   - Riskier if not careful
   - Recommend using prod only for final verification

## Step 1: Prepare Your Repository

1. Commit all changes:

```bash
git add .
git commit -m "Add Cloudflare Pages configuration"
git push
```

2. Files created:
   - `wrangler.toml` - Cloudflare Pages configuration
   - `.cfignore` - Files to exclude from deployment
   - Updated `next.config.ts` - Cloudflare compatibility settings

## Step 2: Connect GitHub to Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Create Application**
3. Click **Connect to Git**
4. Authorize Cloudflare to access your GitHub account
5. Select the `tinodau/twitmark` repository

## Step 3: Configure Build Settings

### Basic Configuration

| Setting                    | Value                             |
| -------------------------- | --------------------------------- |
| **Project name**           | `twitmark` (or your preference)   |
| **Production branch**      | `main`                            |
| **Framework preset**       | `Next.js`                         |
| **Build command**          | `npx @cloudflare/next-on-pages@1` |
| **Build output directory** | `.vercel/output/static`           |
| **Root directory**         | `/` (leave blank)                 |

### Advanced Configuration (Optional)

Click **Show advanced** and configure:

| Setting                   | Value                             |
| ------------------------- | --------------------------------- |
| **Node.js version**       | `20` or higher                    |
| **Environment variables** | See below (Production Supabase)   |
| **Build command**         | `npx @cloudflare/next-on-pages@1` |
| **Output directory**      | `.vercel/output/static`           |

### ⚠️ Important: Edge Runtime

This project uses **Edge Runtime** for Cloudflare Pages compatibility. The following have been configured:

- `src/app/layout.tsx` - Added `export const runtime = "edge"`
- `src/app/auth/callback/route.ts` - Added `export const runtime = "edge"`
- Client components (page.tsx, login/page.tsx, dashboard/\*) don't need this

This allows all routes to run on Cloudflare's Edge Runtime for maximum performance.

## Step 4: Set Environment Variables ⚠️ **CRITICAL**

**You MUST set these environment variables BEFORE deploying, or the build will fail.**

Add these in **Settings** → **Environment Variables**:

### Production Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Get these from:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Settings → API
4. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ⚠️ Important Notes

- **Set these BEFORE clicking "Save and Deploy"**
- Without these variables, the build will fail with: "Supabase URL and Anon Key are required"
- These variables are available both at **build time** and **runtime**
- Make sure you're setting them for **Production** (not just Preview)

### Optional: Preview Environment Variables

Same values, but set for **Preview** deployments.

## Step 5: Deploy

1. Click **Save and Deploy**
2. Wait for the build to complete (2-5 minutes)
3. Your site will be live at: `https://twitmark.pages.dev`

## Troubleshooting

### Build Errors

**Error: "Module not found"**

- Check that `node_modules` is not in `.gitignore`
- Ensure all dependencies are in `package.json`

**Error: "Image optimization failed"**

- Set `unoptimized: true` in `next.config.ts`:

```typescript
images: {
  unoptimized: true,
  // ... other config
}
```

**Error: "Edge runtime compatibility"**

- Cloudflare Pages uses Edge runtime. Some Node.js APIs aren't available.
- Check the console for specific errors
- Consider using dynamic imports with `{ ssr: false }` for client-only code

### Runtime Errors

**Error: "Supabase connection failed"**

- Verify environment variables are set correctly
- Check Supabase project status
- Ensure RLS policies are configured

**Error: "404 Not Found"**

- Check that `output: "standalone"` is in `next.config.ts`
- Verify build output directory is `.next`

### Performance Issues

**Slow cold starts:**

- This is normal on free tier
- Pro plan has faster cold starts (3-5s)

**Large bundle size:**

- Run `npm run build` locally first
- Check the build output for large chunks
- Consider code splitting

## Custom Domain (Optional)

1. Go to **Workers & Pages** → **twitmark** → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `twitmark.yourdomain.com`)
4. Update DNS records as instructed
5. Wait for DNS propagation (5-30 minutes)

## Preview Deployments

Every commit to `main` creates a production deployment.

For preview deployments:

1. Create a new branch: `git checkout -b feature/test`
2. Make changes and push
3. Cloudflare automatically creates a preview URL
4. Share preview URL for testing

## Monitoring

- **Build logs**: Workers & Pages → twitmark → Deployments
- **Analytics**: Workers & Pages → twitmark → Analytics
- **Real User Monitoring (RUM)**: Enable in settings

## Rollback

To rollback to a previous deployment:

1. Go to **Deployments**
2. Click the three dots on the deployment
3. Click **Rollback to this deployment**

## Important Notes

### Next.js 16 + React Compiler Compatibility

- Cloudflare Pages has **experimental** Next.js 16 support
- React Compiler should work, but test thoroughly
- Some edge cases may require adjustments

### Server Actions

- Server Actions should work on Cloudflare Pages
- Edge runtime has limitations on some Node.js APIs
- Test all server actions in production before relying on them

### Supabase SSR

- Supabase client should work with SSR
- If you encounter issues, try client-side only:

```typescript
// In components, use 'use client' directive
// Or wrap Supabase calls in dynamic imports
```

### Image Optimization

- Cloudflare Pages has limited image optimization
- Consider using Cloudflare Images for optimization
- Or set `unoptimized: true` and use external CDN

## Alternative: Manual Deployment with Wrangler CLI

If you prefer CLI deployment:

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy .next --project-name=twitmark
```

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## Support

If you encounter issues:

1. Check Cloudflare Pages status: https://www.cloudflarestatus.com
2. Review build logs in Cloudflare Dashboard
3. Search Cloudflare Community: https://community.cloudflare.com
4. Open an issue on GitHub: https://github.com/tinodau/twitmark/issues
