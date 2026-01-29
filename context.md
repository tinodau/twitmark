# Twitmark Project Context

## 📌 Overview

Twitmark is a high-end personal bookmark manager for X (Twitter) content. It solves the "lost in bookmarks" problem by allowing users to manually save, categorize into folders, and manage a "Reading List" with a premium, article-optimized UI.

## 🗺️ Project Map & Navigation

### 1. The "Brain" (.docs/)

- `spec.md`: Detailed business logic and user flows.
- `tech-stack.md`: The 2026 tech stack (Next.js 16, Supabase, Prisma, Magic UI).
- `architecture.md`: Data flow and folder structure conventions.
- `design-system.md`: Visual guidelines (Bento Grid, Glassmorphism 2.0).

### 2. The "Skills" (.skills/)

- `clean-code.md`: Follow clean code standards.
- `frontend-design.md`: Frontend, UI and Animation standards.

### 3. The "Work" (src/)

- `app/`: Next.js App Router (Landing page, Auth, Dashboard).
- `components/`: UI components (Atomic design).
- `lib/`: Shared utilities, Prisma client, and Supabase config.

### 4. The "State" (Source of Truth)

- `TODO.md`: Current tasks, completed features, and the immediate roadmap.
- `.memory/lessons-learned.md`: Critical fixes and architectural decisions.

## 🛠️ Current Operational Mode

- **Strategy**: Manual Link Entry (Copy-Paste URL).
- **Rendering**: Using `react-tweet` for standard tweets and custom optimized view for "X Articles".
- **Database**: Supabase + Prisma ORM.
- **Auth**: Auth.js with Google Provider.

## 🚀 Getting Started for AI

Before performing any task:

1. Read `TODO.md` to see what's next.
2. Check `tech-stack.md` to ensure library compatibility.
3. Follow the "Vibe-Coding" flow: prioritize beautiful UI and smooth animations.
