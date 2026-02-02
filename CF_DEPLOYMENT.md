# Cloudflare Pages Deployment Guide for Twitmark

This guide will walk you through deploying Twitmark to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (free tier works)
2. GitHub account
3. Supabase project credentials

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

| Setting                    | Value                           |
| -------------------------- | ------------------------------- |
| **Project name**           | `twitmark` (or your preference) |
| **Production branch**      | `main`                          |
| **Framework preset**       | `Next.js`                       |
| **Build command**          | `npm run build`                 |
| **Build output directory** | `.next`                         |
| **Root directory**         | `/` (leave blank)               |

### Advanced Configuration (Optional)

Click **Show advanced** and configure:

| Setting                   | Value           |
| ------------------------- | --------------- |
| **Node.js version**       | `18` or `20`    |
| **Environment variables** | See below       |
| **Build command**         | `npm run build` |
| **Output directory**      | `.next`         |

## Step 4: Set Environment Variables

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
