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

- **Next.js 16.1.6** - App Router with Edge Runtime support
- **Turbopack** - Lightning-fast bundler
- **TypeScript 5.x** - Strict mode enabled
- **Node.js 20+** - Compatible with Cloudflare Pages

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
- **@cloudflare/next-on-pages** - Cloudflare Pages adapter for Next.js

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
│   ├── testing-plan.md      # Testing strategy
│   ├── performance.md       # Performance optimization
│   ├── deployment.md       # Cloudflare Pages deployment guide
│   ├── mcp-tools.md       # MCP server documentation
│   └── database.md        # Database setup
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

- Node.js 20+ LTS
- npm, yarn, pnpm, or bun
- Supabase account (free tier works)

### Installation

```bash
# Clone repository
git clone https://github.com/tinodau/twitmark.git
cd twitmark

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build with Cloudflare Pages adapter
npx @cloudflare/next-on-pages@1

# Or regular Next.js build
npm run build
npm start
```

## 🌐 Deployment

Twitmark is deployed on **Cloudflare Pages** with Edge Runtime support.

### Quick Deploy to Cloudflare Pages

1. **Create Supabase project**:
   - Single `twitmark` project used for both development and production

2. **Run migrations** on the project (see `.docs/database.md`)

3. **Configure Cloudflare Pages**:
   - Build command: `npx @cloudflare/next-on-pages@1`
   - Build directory: `.vercel/output/static`
   - Add production environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

4. **Deploy**: Push to `main` branch and Cloudflare auto-deploys

**Full deployment guide:** See [`.docs/deployment.md`](./.docs/deployment.md)

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

### Local Development

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
# Supabase Project (shared for dev and prod)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

### Production (Cloudflare Pages)

Set these in Cloudflare Dashboard → Workers & Pages → Settings → Environment Variables → Production:

```env
# Supabase Project (same as local development)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

**Detailed setup:** See [`.docs/deployment.md`](./.docs/deployment.md) for complete Supabase project setup.

## 📄 License

MIT License - see LICENSE file for details
