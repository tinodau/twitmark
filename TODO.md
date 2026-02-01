# TODO: Twitmark MVP Roadmap

## 🚀 Phase1: Project Setup & Foundation ✅ COMPLETED

### 1.1 Project Initialization

- [x] Initialize Next.js 16 project with Turbopack
- [x] Configure TypeScript (strict mode) and ESLint
- [x] Set up Tailwind CSS 4.x with custom design system
- [x] Install and configure Shadcn/UI components
- [x] Install Magic UI components (bento grids, aurora effects)
- [x] Configure Framer Motion 12 for animations

### 1.2 Database & Backend Setup ✅ COMPLETED

- [x] Set up Supabase PostgreSQL database
- [x] Create database schema (Profile, Folder, Bookmark)
- [x] Run SQL schema in Supabase dashboard
- [x] Create Supabase client utilities
- [x] Set up Row Level Security (RLS)

### 1.3 Authentication Setup

- [x] Install and configure Supabase Auth
- [x] Set up Google OAuth provider in Supabase
- [x] Create authentication pages (`/login`, `/auth/callback`)
- [x] Implement protected route layout
- [x] Test sign-in/sign-out flow

---

## 🎨 Phase 2: Landing Page (The "Hook") ✅ COMPLETED

### 2.1 Core Layout

- [x] Create base layout component with glassmorphism styling
- [x] Implement responsive navigation bar
- [x] Set up dark mode as default

### 2.2 Hero Section

- [x] Design high-impact hero with Magic UI aurora effects
- [x] Add clear value proposition copy
- [x] Create "Get Started" CTA button

### 2.3 Feature Highlights

- [x] Build bento grid layout for features
- [x] Create 3-4 feature cards (Folders, Reading List)
- [x] Add smooth hover animations with Framer Motion

### 2.4 Testimonials

- [x] Implement scrolling marquee of placeholder X posts
- [x] Style testimonial cards with glassmorphism

### 2.5 Landing Polish

- [x] Add footer component
- [x] Ensure full responsiveness (mobile & desktop)
- [x] Optimize images and assets

---

## 📊 Phase 3: Dashboard Core (The "Engine") ✅ COMPLETED

### 3.1 Dashboard Layout ✅ COMPLETED

- [x] Create dashboard layout with sidebar navigation
- [x] Implement collapsible folder sidebar
- [x] Set up main content area
- [x] Add "Add Bookmark" prominent button with modal

### 3.2 Bookmark Card Component ✅ COMPLETED

- [x] Design bookmark card with glassmorphism style
- [x] Integrate `react-tweet` for rendering
- [x] Display metadata (Date added, Folder name)
- [x] Add hover micro-interactions

### 3.3 Add Bookmark Flow ✅ COMPLETED

- [x] Create modal component for URL input
- [x] Implement URL validation (x.com/twitter.com only)
- [x] Build server action to save bookmark
- [x] Save bookmark to Supabase database
- [x] Add loading states and error handling

### 3.4 Bookmark Management ✅ COMPLETED

- [x] Implement delete bookmark action
- [x] Create "Move to Folder" dropdown
- [x] Add "Add to Reading List" toggle
- [x] Show success notifications (toast)

### 3.5 Performance ✅ COMPLETED

- [ ] Implement pagination or infinite scroll
- [x] Optimize database queries with Supabase
- [x] Add loading skeletons

---

## 📁 Phase 4: Folder System ✅ COMPLETED

### 4.1 Folder CRUD ✅ COMPLETED

- [x] Create "New Folder" modal/form
- [x] Implement create folder server action
- [x] Build folder card component with color picker
- [x] Add edit folder (rename, change color)
- [x] Implement delete folder with confirmation

### 4.2 Folder Navigation ✅ COMPLETED

- [x] Display folders in sidebar
- [x] Implement folder filtering on dashboard
- [x] Show bookmark count per folder
- [x] Add active folder state styling

### 4.3 Bookmark Assignment ✅ COMPLETED

- [x] Move bookmark to folder on creation
- [x] Update bookmark's folder via dropdown
- [x] Handle bookmark count updates

---

## 📖 Phase 5: Reading List Feature ✅ COMPLETED

### 5.1 Reading List Toggle ✅ COMPLETED

- [x] Add "To Read" indicator to bookmark cards
- [x] Implement toggle action (add/remove from Reading List)
- [x] Show distinct UI for Reading List items

### 5.2 Reading List View ✅ COMPLETED

- [x] Create dedicated Reading List tab/view
- [x] Filter bookmarks by `readingList: true`
- [x] Add item count display
- [x] Show empty state with browse action

### 5.3 Visual Feedback ✅ COMPLETED

- [x] Add badges/icons for Reading List status
- [x] Show empty state when list is empty
- [x] Add visual highlight (border/ring) for Reading List items

---

## ✅ Phase 7: Polish & Testing

### 7.1 UI/UX Refinement

- [ ] Audit all components for consistent glassmorphism styling
- [ ] Ensure all animations are smooth (60fps)
- [x] Check accessibility (ARIA labels, keyboard navigation)
- [ ] Verify dark mode contrast ratios

**Accessibility Improvements Completed:**

- Added skip-to-content links on all pages
- Implemented ARIA labels and roles throughout
- Added focus management and focus trapping in modals
- Implemented keyboard navigation support (Enter, Escape, Tab)
- Added proper form labels and fieldsets
- Improved error announcements with aria-live
- Added proper heading hierarchy and section landmarks
- Implemented aria-busy for loading states
- Added aria-hidden to decorative icons
- Implemented focus-visible indicators

### 7.2 Toast Notifications ✅ COMPLETED

- [x] Create toast component with animations
- [x] Implement toast context with variants (success, error, info, warning)
- [x] Add toast notifications to all CRUD operations
- [x] Integrate toast container in root layout

### 7.3 State Management

- [ ] Integrate TanStack Query v6 for caching
- [ ] Implement optimistic updates for all mutations
- [ ] Handle loading and error states globally
- [ ] Add proper revalidation strategies

### 7.3 Error Handling

- [ ] Add global error boundaries
- [ ] Create user-friendly error pages
- [ ] Implement retry logic for failed requests
- [ ] Add toast notifications for all actions

### 7.4 Testing

- [ ] Write Vitest unit tests for utilities
- [ ] Create Playwright E2E tests for critical flows:
  - [ ] Authentication flow
  - [ ] Add bookmark flow
  - [ ] Folder CRUD
  - [ ] Reading List toggle
- [ ] Test responsive design on various screen sizes

### 7.5 Performance Optimization

- [ ] Run Lighthouse audit
- [ ] Optimize images and assets
- [ ] Implement code splitting
- [ ] Add proper caching headers
- [ ] Ensure PPR (Partial Prerendering) benefits

---

## 🚢 Phase 8: Deployment

### 8.1 Deployment Prep

- [ ] Configure environment variables (`.env.local`)
- [ ] Set up Vercel project
- [ ] Configure custom domain (if needed)
- [ ] Set up Supabase production database

### 8.2 Deploy

- [ ] Deploy to Vercel
- [ ] Run database migrations on production
- [ ] Configure authentication providers in production
- [ ] Test all features in production environment

### 8.3 Post-Deploy

- [ ] Set up monitoring (Vercel Analytics)
- [ ] Configure error tracking (Sentry optional)
- [ ] Document any known issues
- [ ] Plan for v1.1 features

---

## 📊 Progress Tracking

**Current Phase**: Phase 7 - Polish & Testing (In Progress)
**Overall Progress**: 75% (65/86 tasks)

---

## 🎯 MVP Success Criteria

- [x] User can sign in with Google
- [x] User can add an X bookmark URL
- [x] Bookmark renders correctly with `react-tweet`
- [x] User can create and manage folders
- [x] User can toggle bookmarks to/from Reading List
- [ ] Full mobile responsiveness
- [ ] All animations are smooth (60fps)
- [ ] Loading states and error handling are robust

---

**Note**: Phase 6 (Advanced Reading Mode) has been removed. The app now focuses on tweet bookmarking with `react-tweet` for content display. No metadata scraping or article reader modal needed.

_Last Updated: 2026-01-31 4:44 PM (Asia/Jakarta, UTC+7:00)_
