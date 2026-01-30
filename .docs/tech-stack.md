# Tech Stack Specification: Twitmark (2026 Edition)

## 1. Core Framework

- **Framework**: Next.js 16.x (App Router)
- **Runtime**: Node.js 24.x LTS
- **Language**: TypeScript 5.7+ (Strict Mode)
- **Bundler**: Turbopack (Default)

## 2. Frontend & Styling

- **Styling**: Tailwind CSS 4.x (Zero-runtime CSS-in-JS capabilities)
- **Components**: Shadcn/UI (Latest 2026 Radix primitives)
- **Animations**: Framer Motion 12 + Magic UI (For bento grids and aurora effects)
- **Icons**: Lucide React
- **Tweet Rendering**: `react-tweet` (Optimized for Next.js 16 Server Components)

## 3. Backend & Infrastructure

- **Database**: **Supabase** (PostgreSQL with built-in authentication)
- **Authentication**: Supabase Auth (Google OAuth)
- **Real-time**: Supabase Realtime (For live updates)
- **Storage**: Supabase Storage (For future avatar/file uploads)
- **Deployment**: Vercel (Optimized for Next.js 16 PPR)

## 4. Data Fetching & State Management

- **Server Side**: Next.js Server Actions for all mutations (Bookmark CRUD, Folder CRUD)
- **Database Access**: Direct Supabase client (TypeScript SDK) in Server Components
- **Client Side**: React hooks for state management
- **Validation**: Custom URL validation for X/Twitter links

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
- `content_type` (TEXT, DEFAULT 'tweet') - 'tweet' or 'article'
- `metadata` (JSONB) - Tweet ID, OpenGraph data, etc.
- `folder_id` (UUID, REFERENCES folders, ON DELETE SET NULL)
- `user_id` (UUID, REFERENCES profiles, ON DELETE CASCADE)
- `reading_list` (BOOLEAN, DEFAULT false)
- `created_at` (TIMESTAMP)

### Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Policies**: Users can only access their own data
- **Trigger**: Auto-creates profile on user signup via Supabase Auth

## 6. Development Tools

- **Linter**: ESLint 10+
- **Testing**: Vitest + Playwright (For E2E UI testing)
- **AI Tools**: Cursor/Cline with MCP (Model Context Protocol) enabled
- **Database Management**: Supabase SQL Editor
- **Environment**: Supabase Local (for local development - optional)
