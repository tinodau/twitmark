# Twitmark Project Context

## 📌 Overview

Twitmark is a premium personal bookmark manager for X (Twitter) content. It allows users to save tweets, organize them into color-coded folders, and maintain a "Reading List" for tweets to read later.

**Key Design Decision**: After implementation, we removed article/metadata scraping. The app now focuses on tweet bookmarking with `react-tweet` for content display. No URL scraping or article reader modal.

## 🗺️ Project Map & Navigation

### 1. The "Brain" (.docs/)

- `spec.md`: Detailed business logic and user flows.
- `tech-stack.md`: The 2026 tech stack (Next.js 16, Supabase, Magic UI).
- `architecture.md`: Data flow and folder structure conventions.
- `design-system.md`: Visual guidelines (Bento Grid, Glassmorphism 2.0).

### 2. The "Skills" (.skills/)

- `clean-code.md`: Follow clean code standards.
- `frontend-design.md`: Frontend, UI and Animation standards.

### 3. The "Work" (src/)

- `app/`: Next.js App Router (Landing page, Auth, Dashboard).
- `components/`: UI components (Atomic design).
- `lib/`: Shared utilities and Supabase config.

### 4. The "State" (Source of Truth)

- `TODO.md`: Current tasks, completed features, and immediate roadmap.
- `.memory/lessons-learned.md`: Critical fixes and architectural decisions.

## 🛠️ Current Operational Mode

- **Strategy**: Copy-Paste X URLs
- **Rendering**: Using `react-tweet` for all tweet embeds (no custom styling, follows natural dimensions)
- **Database**: Supabase (PostgreSQL with direct client access)
- **Auth**: Supabase Auth with Google OAuth

## 📦 Completed Features

### Phase 1: Project Setup ✅

- Next.js 16 with Turbopack
- TypeScript strict mode
- Tailwind CSS 4.x + Shadcn/UI + Magic UI
- Supabase database schema (Profile, Folder, Bookmark)
- Supabase Auth + Google OAuth

### Phase 2: Landing Page ✅

- Hero section with aurora effects
- Feature bento grid
- Testimonials marquee
- Footer component

### Phase 3: Dashboard Core ✅

- Dashboard layout with sidebar
- Add bookmark modal (URL validation for x.com/twitter.com)
- Bookmark cards with `react-tweet` embed
- Delete bookmark action
- Loading states

### Phase 4: Folder System ✅

- Create folder modal with color picker
- Folder context for state management
- Folder sidebar with bookmark counts
- Filter by folder on dashboard
- Assign folder on bookmark creation

### Phase 5: Reading List ✅

- Toggle reading list on bookmarks
- Dedicated reading list view
- Visual indicators for reading list items
- Empty states

## 🚀 Getting Started for AI

Before performing any task:

1. Read `TODO.md` to see what's next.
2. Check `tech-stack.md` to ensure library compatibility.
3. Follow "Vibe-Coding" flow: prioritize beautiful UI and smooth animations.
4. Review `.memory/lessons-learned.md` to avoid repeating past mistakes.

## 📝 Key Design Decisions (for reference)

1. **Removed Article Support**: Originally planned to scrape article metadata and show custom article reader. Simplified to tweet-only with `react-tweet` embeds.

2. **Natural Card Size**: Bookmark cards follow the natural dimensions of tweet embeds. Fixed dimensions caused cropping issues.

3. **Supabase Direct Access**: Using Supabase client directly in server actions (no ORM/Prisma layer).

4. **Folder Context**: Using React Context for folder state management across dashboard components.
