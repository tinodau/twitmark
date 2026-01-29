# Architectural Blueprint: Twitmark

## 1. Directory Structure (The Source of Truth)

We follow a strict modular structure to ensure the AI can locate files efficiently.

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
│   │   ├── (auth)/       # Auth routes (login, register)
│   │   ├── (dashboard)/  # Main app (layout with sidebar)
│   │   │   ├── folders/  # Folder-specific views
│   │   │   ├── reading/  # Reading list view
│   │   │   └── page.tsx  # Main feed
│   │   ├── api/          # Webhooks/Metadata scrapers
│   │   ├── layout.tsx    # Root layout (Providers)
│   │   └── page.tsx      # Landing page (Marketing)
│   ├── components/       # React Components
│   │   ├── ui/           # Shadcn/Magic UI primitives
│   │   ├── dashboard/    # Sidebar, FolderList, AddBookmark
│   │   ├── shared/       # Navbar, Footer, LoadingStates
│   │   └── tweet/        # TweetCard, ArticleModal, ThreadViewer
│   ├── hooks/            # Custom React Hooks (useBookmarks, etc.)
│   ├── lib/              # Shared logic (prisma.ts, supabase.ts, utils.ts)
│   ├── services/         # Business logic (metadata-fetcher.ts, db-actions.ts)
│   └── styles/           # Global CSS and Tailwind configs
├── prisma/               # Schema and Migrations
├── public/               # Static assets (logos, images)
└── tests/                # Unit & E2E Tests
```

## 2. Component Design Pattern

- **Server Components (RSC)**: Used for all pages in `src/app` to fetch initial data from Supabase via Prisma.
- **Client Components**: Marked with `"use client"`. Used for:
  - **Interactive Modals (Magic UI)**.
  - **Forms (Zod + Server Actions)**.
  - **Real-time animations (Framer Motion)**.
  - **Colocation**: Keep components close to where they are used. If a component is only used in the Dashboard, put it in `components/dashboard`.

## 3. Data Flow Strategy

- **Input**: User pastes link in `AddBookmark` component.
- **Action**: Invokes a Server Action in `services/db-actions.ts`.
- **Processing**: Server fetches metadata (Open Graph) if it's an article.
- **Persistence**: Saved to Supabase via Prisma.
- **Update**: TanStack Query triggers an optimistic update to the UI.

## 4. State Management

- **Server State**: Managed by Next.js 16 cache and TanStack Query.
- **UI State**: Local `useState` for modals and simple toggles.
- **Persistent UI**: Use URL params for folder filtering (e.g., `/dashboard?folder=tech`).
