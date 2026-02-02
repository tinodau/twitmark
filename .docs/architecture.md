# Architectural Blueprint: Twitmark

## 1. Directory Structure (The Source of Truth)

We follow a strict modular structure to ensure AI can locate files efficiently.

```text
twitmark/
├── .clinerules           # AI Behavior filters
├── context.md            # Main entry point
├── TODO.md               # Progress tracker
├── .docs/                # Specifications
│   ├── spec.md
│   ├── tech-stack.md
│   ├── architecture.md   # <--- You are here
│   ├── design-system.md
│   ├── testing-plan.md
│   ├── performance.md
│   ├── mcp-tools.md
│   └── database.md
├── .memory/              # Lessons learned
├── src/
│   ├── app/               # Next.js 16 App Router
│   │   ├── actions/      # Next.js Server Actions
│   │   │   ├── bookmarks.ts # Bookmark CRUD operations
│   │   │   └── folders.ts  # Folder CRUD operations
│   │   ├── auth/         # Auth routes (callback)
│   │   ├── dashboard/    # Main app (layout, page)
│   │   ├── login/        # Login page (Google OAuth)
│   │   ├── globals.css   # Tailwind + custom styles
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Landing page
│   │   ├── query-provider.tsx # TanStack Query provider
│   │   └── toast-provider.tsx # Toast notification provider
│   ├── components/     # React Components
│   │   ├── dashboard/  # Dashboard-specific components
│   │   │   ├── add-bookmark-modal.tsx
│   │   │   ├── add-folder-modal.tsx
│   │   │   ├── bookmark-card.tsx
│   │   │   ├── edit-folder-modal.tsx
│   │   │   ├── header.tsx
│   │   │   ├── manage-folders-modal.tsx
│   │   │   └── sidebar.tsx
│   │   ├── ui/         # Shadcn/Magic UI primitives
│   │   │   ├── aurora-background.tsx
│   │   │   ├── bento-grid.tsx
│   │   │   ├── confirm-modal.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── toast.tsx
│   │   ├── navbar.tsx   # Main navigation
│   │   └── testimonials-marquee.tsx
│   ├── contexts/       # React Context providers
│   │   ├── folder-context.tsx
│   │   └── toast-context.tsx
│   ├── hooks/          # Custom React hooks (TanStack Query)
│   │   ├── use-bookmarks.ts
│   │   └── use-folders.ts
│   ├── lib/           # Shared logic
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── database.ts
│   │   │   └── server.ts
│   │   └── utils.ts
│   └── types/         # TypeScript type definitions
│       └── index.ts
├── public/            # Static assets
├── supabase/          # Database schema
│   ├── schema.sql
│   └── migrations/    # Database migrations
├── .prettierrc        # Prettier config
└── tailwind.config.ts  # Tailwind CSS config
```

## 2. Component Design Pattern

- **Server Components (RSC)**: Used for all pages in `src/app` to fetch initial data from Supabase directly.
- **Client Components**: Marked with `"use client"`. Used for:
  - **Interactive Modals** (Magic UI).
  - **Forms** (Server Actions).
  - **Real-time animations** (Framer Motion).
  - **Context Providers** (FolderContext, ToastContext).
  - **TanStack Query Hooks** (useBookmarks, useFolders).
- **Colocation**: Keep components close to where they are used. If a component is only used in Dashboard, put it in `components/dashboard`.

## 3. Deployment & Infrastructure

### Cloudflare Pages

- **Platform**: Cloudflare Pages with Edge Runtime support
- **Build Adapter**: @cloudflare/next-on-pages@1
- **Build Command**: `npx @cloudflare/next-on-pages@1`
- **Build Output**: `.vercel/output/static`
- **Auto-Deployment**: Git push to `main` branch triggers automatic deployment

### Edge Runtime Configuration

**Server Components** (require Edge Runtime export):

- `src/app/layout.tsx`: Root layout with `export const runtime = "edge"`
- `src/app/auth/callback/route.ts`: OAuth callback with `export const runtime = "edge"`

**Client Components** (no runtime export needed):

- `src/app/page.tsx`: Landing page
- `src/app/login/page.tsx`: Login page
- `src/app/dashboard/layout.tsx`: Dashboard layout
- `src/app/dashboard/page.tsx`: Dashboard page

### Supabase Project

- **Single Project**: One Supabase project (`twitmark`) used for both development and production
- **Environment Configuration**:
  - Local development uses `.env.local` with Supabase credentials
  - Production uses Cloudflare Pages environment variables with same Supabase credentials
- **Migration Process**: Apply migrations once to the project (see `.docs/deployment.md`)

### Environment Variables

**Local Development** (`.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Production** (Cloudflare Pages):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Data Flow Strategy

### User Interactions (Client-Side)

- **Input**: User pastes X/Twitter link in `AddBookmarkModal` component.
- **Optimistic UI**: TanStack Query immediately updates UI for instant feedback.
- **Action**: Invokes Server Action in `actions/bookmarks.ts`.
- **Validation**: Server validates URL format (x.com/twitter.com only).
- **Persistence**: Saved to Supabase directly via Supabase client.
- **Cache**: TanStack Query invalidates cache and refetches data.

### Rendering

- **BookmarkCard**: Uses `react-tweet` to render tweet embed.
- **Pagination**: Handles large bookmark lists efficiently.
- **Update**: Server action revalidates path, triggering UI refresh.

## 5. State Management

### Client-Side (TanStack Query)

- **QueryClient Provider**: Wraps app at root level (`src/app/layout.tsx`).
- **Custom Hooks**: Located in `src/hooks/`
  - `useBookmarks`: Create, delete, toggle reading list, manage folders
  - `useFolders`: Create, update, delete folders
- **Optimistic Updates**: Instant UI feedback before server confirmation
- **Cache Management**: Automatic invalidation and rollback on errors
- **Query Keys**: Structured keys for efficient cache invalidation

### Server State

- **Next.js 16 Cache**: Server component data caching
- **Server Actions**: Mutate data with automatic revalidation

### UI State

- **Local State**: `useState` for modals and form inputs
- **React Context**: FolderContext for folder selection across dashboard
- **URL State**: Folder filtering via query params (`/dashboard?folder=id`)
- **Toast Context**: Notification system for user feedback

## 6. Database Layer

- **Access Pattern**: Direct Supabase client (`@supabase/ssr` for server, `@supabase/supabase-js` for client)
- **Server Components**: Use `createClient()` from `@/lib/supabase/server`
- **Client Components**: Use `createClient()` from `@/lib/supabase/client`
- **Type Safety**: Shared types in `@/types/index.ts`
- **Migrations**: Located in `supabase/migrations/` for schema evolution

## 7. Authentication Flow

1. User clicks "Sign in with Google" on `/login`
2. Supabase Auth handles OAuth flow
3. Redirects to `/auth/callback` with code
4. Server exchanges code for session
5. Redirects to `/dashboard`
6. Database trigger auto-creates user profile
7. Dashboard layout checks auth and redirects unauthenticated users

## 8. Security

- **Row Level Security (RLS)**: Enabled on all Supabase tables
- **Policies**: Users can only CRUD their own data
- **Auth**: Supabase Auth handles JWT verification
- **Type Safety**: No `any` types, strict TypeScript mode
- **Environment Variables**: Secrets stored in `.env.local` (never committed)

## 9. Performance Optimizations

### Rendering

- **GPU Acceleration**: `willChange` property on animated elements
- **Spring Physics**: 60fps animations using Framer Motion
- **Pagination**: Efficient handling of large bookmark lists
- **Code Splitting**: Next.js automatic code splitting

### Data Fetching

- **TanStack Query**: Intelligent caching and deduplication
- **Optimistic Updates**: Instant UI feedback
- **Stale Time**: 1 minute cache to reduce API calls
- **Refetch on Focus**: Disabled for better UX

### Styling

- **Tailwind CSS**: Production-optimized via JIT compiler
- **Glassmorphism 2.0**: Efficient backdrop-filter with saturate-180
- **Prettier**: Consistent code formatting for maintainability

## 10. Key Design Decisions

- **No ORM**: Direct Supabase client access instead of Prisma/TypeORM
- **Tweet-Only**: Removed article/metadata scraping - focuses on `react-tweet` embeds
- **Natural Card Size**: Bookmark cards follow tweet dimensions, no fixed sizing
- **Context for Folders**: React Context for folder state across dashboard components
- **TanStack Query**: Client-side state management with optimistic updates
- **Glassmorphism 2.0**: Consistent `backdrop-blur`, `saturate-180`, and `bg-white/5` or `bg-background/95` for glass effects
- **GPU Acceleration**: Using `willChange: "transform"` and spring physics for 60fps animations
- **Server Actions**: Handle mutations while TanStack Query manages cache
- **Type-Safe Hooks**: Custom hooks with full TypeScript support
- **Edge Runtime**: All server components run on Edge Runtime for Cloudflare Pages compatibility
- **Single Supabase Project**: One project used for both development and production environments

## 11. Code Quality Standards

- **Prettier**: Auto-formatting with project standards
- **Tailwind Plugin**: `tailwindcss-prettier` for class sorting
- **Strict TypeScript**: No `any` types, proper typing everywhere
- **Clean Code**: Follow `.skills/clean-code.md` guidelines
- **Component Modularity**: Single responsibility per component
- **Accessibility**: ARIA labels, keyboard navigation, focus management

## 12. Animation Standards

- **Framer Motion**: All animations use Framer Motion 12
- **Spring Physics**: `{ stiffness: 300, damping: 20 }` for smooth, natural motion
- **GPU Layer**: `willChange: "transform"` for hardware acceleration
- **Consistent Duration**: 60fps target for all interactive elements
- **Smooth Transitions**: No jarring cuts, always animated
