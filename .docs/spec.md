# Project Specification: Twitmark

## 1. Product Vision

Twitmark is a premium personal bookmark manager for X (Twitter) content, designed for users who find native X bookmarking system cluttered and hard to navigate. It focuses on organization (Folders), intentionality (Reading List), and clean tweet embeds using `react-tweet`.

## 2. Target Audience

- Power users of X who consume high-value threads and articles.
- Researchers, developers, and creators who need a structured way to save "Digital Assets" from X.
- Users looking for a "Read-it-later" experience specifically optimized for X.

## 3. Functional Requirements

### 3.1 Authentication & Onboarding

- **Google OAuth**: Primary login method via Supabase Auth.
- **User Profile**: Store basic info (name, email, avatar).
- **Onboarding**: A simple empty-state dashboard that guides the user to "Paste your first link."

### 3.2 Landing Page (The "Hook")

- **Hero Section**: High-impact animation (Magic UI) with a clear value proposition.
- **Feature Highlights**: 3-4 cards showing Folder organization and Reading List.
- **Testimonials**: A scrolling "Marquee" of placeholder X posts from satisfied users.
- **Visuals**: Use "Bento Grid" layout and "Glassmorphism" effects.

### 3.3 The Dashboard (Core Engine)

- **Manual Input**: A prominent "Add Bookmark" button that opens a modal to paste an X URL.
- **Dashboard Layout**:
  - **Responsive Sidebar**:
    - Mobile: Full-screen overlay with hamburger menu toggle
    - Desktop: Toggleable visibility with collapse functionality (256px ↔ 64px)
    - Header automatically adjusts positioning based on sidebar state
  - **User Dropdown**: Shows user name, email, and Sign Out (accessible on all screen sizes)
  - **Navigation**: Folder-based filtering with active state indicators
- **Bookmark Card**:
  - Uses `react-tweet` for standard rendering at natural dimensions.
  - Shows metadata (Date added, Folder name).
  - Quick actions: Delete, Toggle Reading List.
- **Pagination/Infinite Scroll**: Automatically handle large volumes of bookmarks to maintain performance.

### 3.4 Folder System (Organization)

- **CRUD Operations**: Create folders with color picker.
- **Assignment**: Users can assign bookmarks to specific folders.
- **Navigation**: Sidebar navigation to filter bookmarks by folder.

### 3.5 Reading List (The "Todo" Feature)

- **Toggle Mechanism**: Any bookmark can be marked as "To Read."
- **Dedicated View**: A specific tab/view for bookmarks that haven't been "completed" yet.
- **Visual Feedback**: Distinct UI indicators for items in Reading List.

**Note**: Advanced Reading Mode (Article View) has been removed. The app now focuses exclusively on tweet bookmarking with `react-tweet` for clean, native-style tweet embeds.

## 4. Technical Constraints & Logic

- **URL Processing**: System must validate that link is a valid `x.com` or `twitter.com` URL.
- **Tweet Rendering**: Use `react-tweet` for all tweet embeds with natural sizing.
- **State Management**: Local `useState` for modals and React Context for folder state across dashboard components.

## 5. UI/UX Standards (2026 Trends)

- **Glassmorphism 2.0**: Frosted glass effects with subtle borders.
- **Micro-interactions**: Hover effects on cards, smooth modal transitions via Framer Motion.
- **Dark Mode First**: The aesthetic should be sleek, dark-themed by default with high-contrast accents.

## 6. Success Metrics (MVP)

- Successful Google Login.
- Ability to save and render an X link within < 2 seconds.
- Functional folder filtering.
- Responsive design (Mobile and Desktop).
- Deployed to production (Cloudflare Pages).
- Single Supabase project used for both dev and production.

## 7. Deployment & Infrastructure

### 7.1 Cloudflare Pages

- **Platform**: Cloudflare Pages with Edge Runtime support
- **Build Command**: `npx @cloudflare/next-on-pages@1`
- **Build Output**: `.vercel/output/static`
- **Runtime**: Edge Runtime for all server components
- **Auto-Deployment**: Git push to `main` branch triggers automatic deployment

### 7.2 Supabase Project

- **Single Project**: One Supabase project (`twitmark`) used for both development and production
- **Environment Configuration**:
  - Local development uses `.env.local` with Supabase credentials
  - Production uses Cloudflare Pages environment variables with same Supabase credentials
- **Migration Process**: Apply migrations once to the project (see `.docs/deployment.md`)

### 7.3 Environment Variables

**Local Development (`.env.local`)**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Production (Cloudflare Pages)**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Detailed Setup**: See [`.docs/deployment.md`](./deployment.md) for complete deployment guide.

## 8. Testing & Quality Assurance

### 8.1 Unit Testing (Vitest)

- **URL Validation**: 16 tests covering valid and invalid URL patterns
- **Test Coverage**: Critical utility functions

### 8.2 E2E Testing (Playwright)

- **Authentication Flow**: Sign in with Google, sign out
- **Dashboard Operations**: Create/delete bookmarks, folder management
- **Responsive Design**: Mobile, tablet, desktop layouts
- **Total Tests**: 15 E2E tests

### 8.3 Performance

- **Lighthouse Score**: Target > 90 (post-launch audit)
- **Build Time**: < 10 seconds
- **Animation Performance**: 60fps with GPU acceleration
- **Bundle Size**: Optimized with code splitting and tree shaking
