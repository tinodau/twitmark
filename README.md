# Twitmark 📌

Your personal X bookmark manager. Save tweets, read later, never lose gems.

## 🌟 Overview

Twitmark is a premium personal bookmark manager for X (Twitter) content, designed for power users who find the native X bookmarking system cluttered and hard to navigate. It focuses on:

- **Organization** - Smart folder system for structured curation
- **Intentionality** - Reading List feature for "read-it-later" workflow
- **Superior Reading** - Optimized Article Mode with clean typography

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

- **PostgreSQL** - Via Neon.tech (serverless, autoscaling)
- **Prisma 6.x** - Type-safe ORM with Edge runtime support
- **Auth.js v5** - NextAuth with Google OAuth provider
- **TanStack Query 5.90.20** - Optimistic updates and caching
- **Zod 4.3.6** - Schema-based validation
- **react-tweet 3.3.0** - Optimized tweet rendering for Next.js 16

### Development Tools

- **ESLint 9+** - Code quality and consistency
- **Vitest** - Unit testing framework
- **Playwright** - E2E UI testing
- **Cline/Cursor with MCP** - AI-powered development workflow

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
│   │   ├── globals.css      # Tailwind + custom utilities
│   │   ├── layout.tsx       # Root layout with dark mode
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── ui/             # Base UI components
│   │   │   ├── aurora-background.tsx
│   │   │   └── bento-grid.tsx
│   │   ├── navbar.tsx       # Responsive navigation
│   │   └── testimonials-marquee.tsx
│   └── lib/               # Utility functions
│       └── utils.ts
├── .clinerules             # AI development behavior
├── TODO.md                # MVP roadmap & progress
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 24.x LTS
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
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

## 🧪 Testing

### Unit Testing

```bash
npm run test
```

### E2E Testing

```bash
npm run test:e2e
```

### Linting

```bash
npm run lint
```

## 🔐 Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication (Google OAuth)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Optional: Open Graph metadata scraping (for Article Mode)
OG_SCRAPER_API_KEY="..."
```

## 📄 License

MIT License - see LICENSE file for details
