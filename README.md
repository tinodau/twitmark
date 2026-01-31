# Twitmark 📌

Your personal X bookmark manager. Save tweets, organize with folders, read later.

## 🌟 Overview

Twitmark is a premium personal bookmark manager for X (Twitter) content, designed for power users who find native X bookmarking system cluttered and hard to navigate. It focuses on:

- **Organization** - Smart folder system for structured curation with color coding
- **Intentionality** - Reading List feature for "read-it-later" workflow
- **Visual Experience** - Clean, glassmorphic design with smooth animations
- **Simplicity** - Paste X link, save, done. No scraping, no clutter.

## 🛠️ Tech Stack

### Core Framework

- **Next.js 16.1.6** - App Router with Partial Prerendering (PPR)
- **Turbopack** - Lightning-fast bundler
- **TypeScript 5.x** - Strict mode enabled
- **Node.js 24.x** - Latest LTS runtime

### Frontend & Styling

- **Tailwind CSS 4.x** - Zero-runtime CSS-in-JS with custom design system
- **Shadcn/UI** - Beautiful, accessible component library
- **Framer Motion 12.29.2** - Smooth animations and micro-interactions
- **Lucide React 0.563.0** - Premium icon set
- **Magic UI Components** - Custom bento grids and aurora effects

### Backend & Infrastructure

- **Supabase** - PostgreSQL database with built-in authentication
- **Supabase Auth** - Google OAuth provider with secure session management
- **Zod 4.3.6** - Schema-based validation
- **react-tweet 3.3.0** - Optimized tweet rendering for Next.js 16

### Development Tools

- **ESLint 9+** - Code quality and consistency
- **Vitest** - Unit testing framework
- **Playwright** - E2E UI testing

## 📁 Project Structure

```
twitmark/
├── .docs/                   # Documentation
│   ├── architecture.md        # System architecture
│   ├── design-system.md      # UI/UX guidelines
│   ├── spec.md             # Functional requirements
│   ├── tech-stack.md        # Technology choices
│   └── testing-plan.md      # Testing strategy
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── actions/        # Server Actions
│   │   │   ├── bookmarks.ts # Bookmark operations
│   │   │   └── folders.ts  # Folder operations
│   │   ├── auth/           # Auth routes
│   │   │   └── callback/  # OAuth callback handler
│   │   ├── dashboard/      # Dashboard pages
│   │   │   ├── layout.tsx   # Dashboard shell
│   │   │   └── page.tsx    # Main dashboard
│   │   ├── globals.css      # Tailwind + custom utilities
│   │   ├── layout.tsx       # Root layout with dark mode
│   │   ├── login/          # Login page
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── dashboard/       # Dashboard components
│   │   │   ├── add-bookmark-modal.tsx
│   │   │   ├── add-folder-modal.tsx
│   │   │   ├── bookmark-card.tsx
│   │   │   ├── header.tsx
│   │   │   └── sidebar.tsx
│   │   ├── ui/             # Base UI components
│   │   │   ├── aurora-background.tsx
│   │   │   └── bento-grid.tsx
│   │   ├── navbar.tsx       # Responsive navigation
│   │   └── testimonials-marquee.tsx
│   ├── contexts/           # React contexts
│   │   └── folder-context.tsx
│   ├── lib/               # Utility functions
│   │   ├── supabase/
│   │   │   ├── database.ts  # Database operations
│   │   │   ├── server.ts    # Supabase server client
│   │   │   └── client.ts    # Supabase client client
│   │   └── utils.ts       # General utilities
│   └── types/             # TypeScript types
│       └── index.ts
├── .clinerules             # AI development behavior
├── TODO.md                # MVP roadmap & progress
├── context.md             # Project context & memory
├── supabase/              # Supabase configuration
│   └── schema.sql         # SQL schema for setup
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 24.x LTS
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/twitmark.git
cd twitmark

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Features

### Bookmark Management

- **Save tweets** - Paste any X/Twitter URL to save
- **Folder organization** - Create color-coded folders for categorization
- **Reading List** - Mark tweets to read later with visual indicator
- **Quick actions** - Delete, move, or toggle reading status on hover

### Dashboard

- **Responsive design** - Works on desktop, tablet, and mobile
- **Real-time updates** - Instant feedback on all actions
- **Folder filtering** - View bookmarks by folder
- **Reading List view** - Dedicated view for to-read items

### Authentication

- **Google OAuth** - Secure sign-in with Google account
- **Protected routes** - Dashboard requires authentication
- **Session management** - Automatic token refresh

## 🔐 Environment Variables

Create a `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET="https://your-project.supabase.co/auth/v1/callback"

# Application
NODE_ENV="development"
```

See `SUPABASE_SETUP.md` for detailed setup instructions.

## 📄 License

MIT License - see LICENSE file for details
