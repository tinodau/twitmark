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
- `testing-plan.md`: Testing strategy and implementation plan.

### 2. The "Skills" (.skills/)

- `clean-code.md`: Follow clean code standards.
- `frontend-design.md`: Frontend, UI and Animation standards.

### 3. The "Work" (src/)

- `app/`: Next.js App Router (Landing page, Auth, Dashboard).
- `components/`: UI components (Atomic design).
- `lib/`: Shared utilities and Supabase config.
- `hooks/`: Custom React hooks (TanStack Query for state management).

### 4. The "State" (Source of Truth)

- `TODO.md`: Current tasks, completed features, and immediate roadmap.
- `.memory/lessons-learned.md`: Critical fixes and architectural decisions.

## 🛠️ Current Operational Mode

- **Strategy**: Copy-Paste X URLs
- **Rendering**: Using `react-tweet` for all tweet embeds (no custom styling, follows natural dimensions)
- **Database**: Supabase (PostgreSQL with direct client access)
- **Auth**: Supabase Auth with Google OAuth
- **State Management**: TanStack Query with optimistic updates
- **UI Framework**: Tailwind CSS 4.x with Prettier + tailwindcss-prettier plugin

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
- Pagination for large bookmark lists

### Phase 4: Folder System ✅

- Create folder modal with color picker
- Folder context for state management
- Folder sidebar with bookmark counts
- Filter by folder on dashboard
- Assign folder on bookmark creation
- Edit folder name and color
- Delete folder

### Phase 5: Reading List ✅

- Toggle reading list on bookmarks
- Dedicated reading list view
- Visual indicators for reading list items
- Empty states

### Phase 7: Refinement & Polish ✅

#### Accessibility Improvements

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management for modals
- Screen reader compatible

#### Toast Notifications ✅

- Custom toast context and component
- Success and error variants
- Auto-dismiss with timer
- Smooth animations with Framer Motion

#### UI/UX Refinement ✅

- Consistent cursor pointers on all clickable elements
- Glassmorphism 2.0 implementation across all components
- 60fps animations with GPU acceleration
- Spring physics for smooth, natural motion
- `willChange` property for optimized rendering
- Saturate-180 backdrop filter for glass effects

#### Code Quality ✅

- Prettier configured for code formatting
- tailwindcss-prettier plugin for Tailwind class sorting
- Auto-format on save enabled

#### State Management with TanStack Query ✅

- QueryClient provider set up with optimal defaults
- Custom hooks for bookmark operations (create, delete, toggle reading list, manage folders)
- Custom hooks for folder operations (create, update, delete)
- Optimistic updates for instant UI feedback
- Automatic cache invalidation and rollback on errors

## 🚀 Getting Started for AI

Before performing any task:

1. Read `TODO.md` to see what's next.
2. Check `tech-stack.md` to ensure library compatibility.
3. Follow "Vibe-Coding" flow: prioritize beautiful UI and smooth animations.
4. Review `.memory/lessons-learned.md` to avoid repeating past mistakes.
5. Use TanStack Query hooks for data operations (see `src/hooks/`)

## 📝 Key Design Decisions (for reference)

1. **Removed Article Support**: Originally planned to scrape article metadata and show custom article reader. Simplified to tweet-only with `react-tweet` embeds.

2. **Natural Card Size**: Bookmark cards follow the natural dimensions of tweet embeds. Fixed dimensions caused cropping issues.

3. **Supabase Direct Access**: Using Supabase client directly in server actions (no ORM/Prisma layer).

4. **Folder Context**: Using React Context for folder state management across dashboard components.

5. **TanStack Query**: Client-side state management with optimistic updates for instant UI feedback. Server actions handle mutations, while TanStack Query manages cache.

6. **Glassmorphism 2.0**: Consistent use of `backdrop-blur`, `saturate-180`, and `bg-white/5` (or `bg-background/95`) for glass effects across all components.

7. **GPU Acceleration**: Using `willChange: "transform"` and spring physics for 60fps animations on interactive elements.

## 🔧 Recent Improvements

### Performance Optimizations

- Pagination implemented for bookmark lists to handle large datasets
- Optimistic updates reduce perceived latency
- Cache management with TanStack Query reduces unnecessary API calls

### Visual Enhancements

- Consistent glassmorphism implementation throughout app
- Smooth 60fps animations with proper GPU acceleration
- Enhanced contrast ratios for better readability
- Interactive hover states with spring physics

### Code Quality

- Prettier integration for consistent code formatting
- Tailwind class sorting for maintainable CSS
- Type-safe custom hooks with TypeScript
