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
│   └── testing-plan.md
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
│   │   └── page.tsx      # Landing page
│   ├── components/     # React Components
│   │   ├── dashboard/  # Dashboard-specific components
│   │   │   ├── add-bookmark-modal.tsx
│   │   │   ├── add-folder-modal.tsx
│   │   │   ├── bookmark-card.tsx
│   │   │   ├── header.tsx
│   │   │   └── sidebar.tsx
│   │   ├── ui/         # Shadcn/Magic UI primitives
│   │   │   ├── aurora-background.tsx
│   │   │   └── bento-grid.tsx
│   │   ├── navbar.tsx   # Main navigation
│   │   └── testimonials-marquee.tsx
│   ├── contexts/       # React Context providers
│   │   └── folder-context.tsx
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
│   └── schema.sql
```

## 2. Component Design Pattern

- **Server Components (RSC)**: Used for all pages in `src/app` to fetch initial data from Supabase directly.
- **Client Components**: Marked with `"use client"`. Used for:
  - **Interactive Modals (Magic UI)**.
  - **Forms (Server Actions)**.
  - **Real-time animations (Framer Motion)**.
  - **Context Providers** (FolderContext).
  - **Colocation**: Keep components close to where they are used. If a component is only used in Dashboard, put it in `components/dashboard`.

## 3. Data Flow Strategy

- **Input**: User pastes X/Twitter link in `AddBookmarkModal` component.
- **Action**: Invokes a Server Action in `actions/bookmarks.ts`.
- **Validation**: Server validates URL format (x.com/twitter.com only).
- **Persistence**: Saved to Supabase directly via Supabase client.
- **Rendering**: `BookmarkCard` component uses `react-tweet` to render tweet embed.
- **Update**: Server action revalidates path, triggering UI refresh.

## 4. State Management

- **Server State**: Managed by Next.js 16 cache and Server Actions.
- **UI State**: Local `useState` for modals and React Context for folder state.
- **Persistent UI**: URL state for folder filtering (`/dashboard?folder=id`).

## 5. Database Layer

- **Access Pattern**: Direct Supabase client (`@supabase/ssr` for server, `@supabase/supabase-js` for client)
- **Server Components**: Use `createClient()` from `@/lib/supabase/server`
- **Client Components**: Use `createClient()` from `@/lib/supabase/client`
- **Type Safety**: Shared types in `@/types/index.ts`

## 6. Authentication Flow

1. User clicks "Sign in with Google" on `/login`
2. Supabase Auth handles OAuth flow
3. Redirects to `/auth/callback` with code
4. Server exchanges code for session
5. Redirects to `/dashboard`
6. Database trigger auto-creates user profile

## 7. Security

- **Row Level Security (RLS)**: Enabled on all Supabase tables
- **Policies**: Users can only CRUD their own data
- **Auth**: Supabase Auth handles JWT verification
- **Type Safety**: No `any` types, strict TypeScript mode

## 8. Key Design Decisions

- **No ORM**: Direct Supabase client access instead of Prisma/TypeORM
- **Tweet-Only**: Removed article/metadata scraping - focuses on `react-tweet` embeds
- **Natural Card Size**: Bookmark cards follow tweet dimensions, no fixed sizing
- **Context for Folders**: React Context for folder state across dashboard components
