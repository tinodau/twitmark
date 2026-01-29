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

- **Database & Auth**: **Supabase** (PostgreSQL with built-in authentication)
- **ORM**: Prisma 7.x (With optimized TypeScript support)
- **Authentication**: Supabase Auth (Google OAuth)
- **Deployment**: Vercel (Optimized for Next.js 16 PPR)

## 4. Data Fetching & State Management

- **Server Side**: Next.js Server Actions for all mutations (Folder CRUD, Saving Links).
- **Client Side**: TanStack Query v6 (For optimistic updates and infinite scroll caching).
- **Validation**: Zod (For schema-based URL and form validation).

## 5. Database Schema (Prisma + Supabase)

- **Profile** (extends Supabase auth.users): ID, Email, FullName, AvatarURL, CreatedAt
- **Bookmark**:
  - ID, URL, ContentType (Tweet/Article), Metadata (JSON)
  - FolderID (Relation), UserID (Relation), ReadingList (Boolean), CreatedAt
- **Folder**:
  - ID, Name, Color, UserID (Relation), CreatedAt

**Note**: Profile model extends Supabase's auth.users table with additional fields. Row Level Security (RLS) ensures users can only access their own data.

## 6. Development Tools

- **Linter**: ESLint 10+
- **Testing**: Vitest + Playwright (For E2E UI testing)
- **AI Tools**: Cursor/Cline with MCP (Model Context Protocol) enabled.
