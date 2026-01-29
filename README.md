# Twitmark 📌

Your personal X bookmark manager. Save tweets, read later, never lose gems.

## 🌟 Overview

Twitmark is a premium personal bookmark manager for X (Twitter) content, designed for power users who find the native X bookmarking system cluttered and hard to navigate. It focuses on:

- **Organization** - Smart folder system for structured curation
- **Intentionality** - Reading List feature for "read-it-later" workflow
- **Superior Reading** - Optimized Article Mode with clean typography

### Target Audience

- Power users of X who consume high-value threads and articles
- Researchers, developers, and creators who need structured "Digital Asset" management
- Users looking for a distraction-free reading experience

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

## 🎨 Design System

### Visual Identity

- **Aesthetic**: "Cyber-Minimalism" - Clean, dark, high-contrast
- **Background**: `#050505` (Deep Black)
- **Primary**: `#1D9BF0` (X-Blue)
- **Accent**: Linear gradient from `#1D9BF0` to `#8E2DE2`
- **Typography**: Geist Sans (Sans) + Serif for Reading Mode

### Glassmorphism 2.0

- Frosted glass effects with `backdrop-filter: blur(12px) saturate(180%)`
- Subtle 1px borders with `rgba(255, 255, 255, 0.1)`
- Depth through layered transparency

### Component Patterns

- **Bento Grid** - Responsive grid layout for features and dashboard
- **Aurora Background** - Animated gradient effects for hero sections
- **Hover Effects** - Scale animations (1.02), micro-interactions
- **Modal Animations** - Zoom-in spring from center with backdrop blur

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

## 📊 Current Progress

### Completed Phases

✅ **Phase 1: Project Setup & Foundation** (6/6 tasks)

- Next.js 16 with Turbopack initialized
- TypeScript strict mode configured
- Tailwind CSS 4.x custom design system
- Shadcn/UI components installed
- Magic UI components created (bento grid, aurora background)
- Framer Motion 12 configured

✅ **Phase 2: Landing Page** (13/13 tasks)

- High-impact hero with aurora effects
- Feature highlights with bento grid
- Scrolling testimonials marquee
- Responsive navigation with mobile menu
- Call-to-action sections
- Footer component
- Full responsiveness (mobile & desktop)

### In Progress

🚧 **Phase 3: Dashboard Core** (0/19 tasks)

- Database setup (Neon.tech + Prisma)
- Authentication (Auth.js v5 + Google OAuth)
- Dashboard layout with sidebar
- Bookmark card component with react-tweet
- Add bookmark modal with URL validation

### Remaining Phases

- **Phase 4**: Folder System (11 tasks)
- **Phase 5**: Reading List Feature (7 tasks)
- **Phase 6**: Advanced Reading Mode (12 tasks)
- **Phase 7**: Polish & Testing (15 tasks)
- **Phase 8**: Deployment (9 tasks)

**Overall Progress**: 22% (19/87 tasks)

See [TODO.md](TODO.md) for detailed roadmap.

## 🎯 MVP Features

### Authentication & Onboarding

- [x] Google OAuth via Auth.js v5
- [ ] User profile management
- [ ] Empty-state onboarding flow

### Bookmark Management

- [ ] Manual URL input with modal
- [ ] Tweet rendering with react-tweet
- [ ] Metadata display (date, folder)
- [ ] Delete, move, and reading list actions

### Folder System

- [ ] Create, edit, delete folders
- [ ] Color picker for folder organization
- [ ] Folder-based filtering
- [ ] Bookmark count per folder

### Reading List

- [ ] Toggle "To Read" status
- [ ] Dedicated Reading List view
- [ ] Mark as read functionality
- [ ] Progress tracking

### Article Mode

- [ ] URL detection for X Articles
- [ ] Optimized serif typography
- [ ] Full-screen modal overlay
- [ "Open on X" button

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

## 📚 Documentation

- [Architecture](.docs/architecture.md) - System design and data flow
- [Design System](.docs/design-system.md) - UI/UX guidelines and patterns
- [Specification](.docs/spec.md) - Functional requirements and user stories
- [Tech Stack](.docs/tech-stack.md) - Technology choices and rationale
- [Testing Plan](.docs/testing-plan.md) - Testing strategy and coverage
- [TODO](TODO.md) - MVP roadmap and progress tracking

## 🤖 AI Development Workflow

This project uses Cline/Cursor with Model Context Protocol (MCP) for AI-assisted development:

1. **Context Awareness** - AI reads `.clinerules` for behavior guidelines
2. **Documentation-First** - All decisions reference `.docs/` specifications
3. **Clean Code** - Adheres to `.skills/clean-code.md` principles
4. **Type Safety** - Strict TypeScript with Prisma-generated types
5. **Performance** - React Server Components by default, client only when needed

## 🌐 Deployment

The project is optimized for Vercel deployment:

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy (Vercel handles the rest)

Vercel automatically:

- Enables Edge Runtime where applicable
- Optimizes images and assets
- Configures caching headers
- Scales globally

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Read [`.clinerules`](.clinerules) for coding standards
2. Check [`.docs/spec.md`](.docs/spec.md) for feature requirements
3. Follow [`.docs/design-system.md`](.docs/design-system.md) for UI consistency
4. Ensure TypeScript strict mode compliance
5. Test changes before submitting PRs

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Vercel** - For hosting and deployment platform
- **Shadcn** - For beautiful component primitives
- **Framer Motion** - For smooth animations
- **Lucide** - For premium icon set
- **X/Twitter** - For the platform we're building on

---

**Built with Next.js 16, Tailwind CSS 4, and Framer Motion** ❤️
