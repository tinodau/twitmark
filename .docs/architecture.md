# Architectural Blueprint: Twitmark

## 1. Directory Structure (The Source of Truth)

We follow a strict modular structure to ensure AI can locate files efficiently.

```text
twitmark/
├── .cursorrules          # AI Behavior filters
├── context.md            # Main entry point
├── TODO.md               # Progress tracker
├── .docs/                # Specifications
│   ├── spec.md
│   ├── tech-stack.md
│   ├── architecture.md   # <--- You are here
│   ├── design-system.md
│   └── testing-plan.md
├── .skills/              # Expertise logic
├── .memory/              # Learning log
├── src/
│   ├── app/              # Next.js 16 App Router
│   │   ├── (auth)/       # Auth routes (login, callback)
│   │   ├── dashboard/    # Main app (layout with sidebar)
│   │   │   ├── folders/  # Folder-specific views
│   │   │   ├── reading/  # Reading list view
│   │   │   └── page.tsx  # Main feed
│   │   ├── login/         # Login page (Google OAuth)
│   │   ├── layout.tsx    # Root layout (Providers)
│   │   └── page.tsx      # Landing page (Marketing)
│   ├── actions/          # Next.js Server Actions
│   │   └── bookmarks.ts  # Bookmark CRUD operations
│   ├── components/       # React Components
│   │   ├── ui/           # Shadcn/Magic UI primitives
│   │   ├── dashboard/    # Sidebar, Header, BookmarkCard, AddBookmark
│   │   ├── shared/       # Navbar, LoadingStates
│   │   └── tweet/        # TweetCard (react-tweet)
│   ├── lib/              # Shared logic (supabase/, utils.ts, types/)
│   │   ├── supabase/     # Supabase client setup
│   │   └── types/        # TypeScript type definitions
│   └── styles/           # Global CSS and Tailwind configs
├── public/               # Static assets (logos, images)
├── supabase/             # Database schema & migrations
└── tests/                # Unit & E2E Tests
```

## 2. Component Design Pattern

- **Server Components (RSC)**: Used for all pages in `src/app` to fetch initial data from Supabase directly.
- **Client Components**: Marked with `"use client"`. Used for:
  - **Interactive Modals (Magic UI)**.
  - **Forms (Server Actions)**.
  - **Real-time animations (Framer Motion)**.
  - **Colocation**: Keep components close to where they are used. If a component is only used in Dashboard, put it in `components/dashboard`.

## 3. Data Flow Strategy

- **Input**: User pastes link in `AddBookmark` component.
- **Action**: Invokes a Server Action in `actions/bookmarks.ts`.
- **Processing**: Server extracts tweet ID from URL.
- **Persistence**: Saved to Supabase directly via Supabase client.
- **Update**: Server action revalidates path, triggering UI refresh.

## 4. State Management

- **Server State**: Managed by Next.js 16 cache and Server Actions.
- **UI State**: Local `useState` for modals and simple toggles.
- **Persistent UI**: Use URL params for folder filtering (e.g., `/dashboard?folder=tech`).

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
