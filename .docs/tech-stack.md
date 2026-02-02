# Tech Stack Specification: Twitmark (2026 Edition)

## 1. Core Framework

- **Framework**: Next.js 16.x (App Router with Edge Runtime support)
- **Runtime**: Edge Runtime (Cloudflare Pages) / Node.js 20+ (local development)
- **Language**: TypeScript 5.7+ (Strict Mode)
- **Bundler**: Turbopack (Default)

## 2. Frontend & Styling

- **Styling**: Tailwind CSS 4.x (Zero-runtime CSS-in-JS capabilities)
- **Components**: Shadcn/UI (Latest 2026 Radix primitives)
- **Animations**: Framer Motion 12 + Magic UI (For bento grids and aurora effects)
- **Icons**: Lucide React
- **Tweet Rendering**: `react-tweet` (Optimized for Next.js 16 Server Components)

## 3. Backend & Infrastructure

- **Database**: **Supabase** (PostgreSQL with built-in authentication, single project for dev and prod)
- **Authentication**: Supabase Auth (Google OAuth)
- **Real-time**: Supabase Realtime (For live updates)
- **Storage**: Supabase Storage (For future avatar/file uploads)
- **Deployment**: Cloudflare Pages with Edge Runtime (@cloudflare/next-on-pages)
- **Build Adapter**: @cloudflare/next-on-pages@1

## 4. Data Fetching & State Management

- **Server Side**: Next.js Server Actions for all mutations (Bookmark CRUD, Folder CRUD)
- **Database Access**: Direct Supabase client (TypeScript SDK) in Server Components
- **Client Side**: @tanstack/react-query v6 for state management with optimistic updates
- **Validation**: Custom URL validation for X/Twitter links
- **Cache Management**: TanStack Query with automatic cache invalidation

## 5. Database Schema (Supabase PostgreSQL)

### Tables

**profiles**

- `id` (UUID, PRIMARY KEY, REFERENCES auth.users)
- `email` (TEXT)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMP)

**folders**

- `id` (UUID, PRIMARY KEY)
- `user_id` (UUID, REFERENCES profiles, ON DELETE CASCADE)
- `name` (TEXT, NOT NULL)
- `color` (TEXT, DEFAULT '#1D9BF0')
- `created_at` (TIMESTAMP)

**bookmarks**

- `id` (UUID, PRIMARY KEY)
- `url` (TEXT, NOT NULL)
- `folder_id` (UUID, REFERENCES folders, ON DELETE SET NULL)
- `user_id` (UUID, REFERENCES profiles, ON DELETE CASCADE)
- `reading_list` (BOOLEAN, DEFAULT false)
- `created_at` (TIMESTAMP)

**Note**: `content_type` and `metadata` columns have been removed. The app now focuses exclusively on tweet bookmarking with `react-tweet` for rendering.

### Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Policies**: Users can only access their own data
- **Trigger**: Auto-creates profile on user signup via Supabase Auth

## 6. Development Tools

- **Linter**: ESLint 9+
- **Testing**: Vitest (unit tests) + Playwright (E2E tests)
- **Code Formatting**: Prettier with tailwindcss-prettier plugin
- **AI Tools**: Cursor/Cline with MCP (Model Context Protocol) enabled
- **Database Management**: Supabase SQL Editor + Supabase CLI
- **Environment**: Separate dev and prod Supabase projects

## 7. Edge Runtime Configuration

### Server Components (Edge Runtime)

- `src/app/layout.tsx`: Root layout with `export const runtime = "edge"`
- `src/app/auth/callback/route.ts`: OAuth callback with `export const runtime = "edge"`

### Client Components (No Runtime Export)

- `src/app/page.tsx`: Landing page
- `src/app/login/page.tsx`: Login page
- `src/app/dashboard/layout.tsx`: Dashboard layout
- `src/app/dashboard/page.tsx`: Dashboard page

### Cloudflare Pages Compatibility

- Removed incompatible Next.js configs: `cacheComponents`, `output: "standalone"`, `serverExternalPackages`
- Build command: `npx @cloudflare/next-on-pages@1`
- Build output: `.vercel/output/static`
- All routes run on Edge Runtime for maximum performance
