# Twitmark Project Context

## 📌 Overview

Twitmark is a premium personal bookmark manager for X (Twitter) content. It allows users to save tweets, organize them into color-coded folders, and maintain a "Reading List" for tweets to read later.

**Key Design Decision**: After implementation, we removed article/metadata scraping. The app now focuses on tweet bookmarking with `react-tweet` for content display. No URL scraping or article reader modal.

## 🗺️ Project Map & Navigation

### 1. The "Brain" (.docs/)

- `spec.md`: Detailed business logic and user flows.
- `tech-stack.md`: The 2026 tech stack (Next.js 16, Supabase, Magic UI, Cloudflare Pages).
- `architecture.md`: Data flow and folder structure conventions.
- `design-system.md`: Visual guidelines (Bento Grid, Glassmorphism 2.0).
- `testing-plan.md`: Testing strategy and implementation plan.
- `performance.md`: Performance optimization details and best practices.
- `deployment.md`: Cloudflare Pages deployment guide.
- `mcp-tools.md`: MCP server documentation.
- `database.md`: Database setup instructions and schema guide.

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
- **Database**: Supabase (PostgreSQL with single project for dev and prod)
- **Auth**: Supabase Auth with Google OAuth
- **State Management**: TanStack Query with optimistic updates
- **UI Framework**: Tailwind CSS 4.x with Prettier + tailwindcss-prettier plugin
- **Deployment**: Cloudflare Pages with Edge Runtime (@cloudflare/next-on-pages)
- **Runtime**: Edge Runtime for all server components

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

- Dashboard layout with responsive sidebar
  - Mobile: Full-screen overlay with hamburger menu toggle
  - Desktop: Sidebar with open/close toggle and collapse functionality (256px ↔ 64px)
  - Header automatically adjusts positioning based on sidebar state
- Add bookmark modal (URL validation for x.com/twitter.com)
- Bookmark cards with `react-tweet` embed
- Delete bookmark action
- Loading states
- Pagination for large bookmark lists
- User dropdown menu (name, email, Sign Out) - visible on both mobile and desktop
- Proper cursor pointers on all interactive elements

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

### Phase 6: Deployment & Infrastructure ✅

#### Cloudflare Pages Deployment ✅

- Configured for Cloudflare Pages with Edge Runtime support
- Build command: `npx @cloudflare/next-on-pages@1`
- Build output: `.vercel/output/static`
- Edge Runtime configured on `src/app/layout.tsx` and `src/app/auth/callback/route.ts`
- Removed incompatible Next.js configs (cacheComponents, output standalone, serverExternalPackages)

#### Supabase Configuration ✅

- Single Supabase project: `twitmark`
- Shared project for development and production environments
- Configuration documented in `.docs/deployment.md`
- Migration process with Supabase CLI

#### Environment Variables ✅

- `.env.example` template with Supabase credentials
- Local development and production use same Supabase project
- Security notes and setup instructions included

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
- Glassmorphism2.0 implementation across all components
- 60fps animations with GPU acceleration
- Spring physics for smooth, natural motion
- `willChange` property for optimized rendering
- Saturate-180 backdrop filter for glass effects
- Enhanced dashboard layout with improved responsive behavior
  - Mobile sidebar as full-screen overlay with smooth transitions
  - Desktop sidebar with toggleable visibility and collapsible width
  - Header with user dropdown accessible on all screen sizes

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

8. **Single Supabase Project**: Using one project for both development and production environments.

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
