# Lessons Learned: Twitmark Development

## 2026-01-29 | Project Initialization & Landing Page

### Setup & Configuration

- **Node.js Version Matters**: Initially used Node.js 18.x, but needed to upgrade to 24.x for compatibility with Next.js 16
- **Type Definitions**: Must update `@types/node` to match Node.js version (v20 → v22)
- **Tailwind CSS 4.x**: Zero-runtime CSS-in-JS requires different configuration than v3 - uses `@theme inline` instead of `theme` in `tailwind.config.js`

### Component Development

- **Aurora Background Effects**: Use multiple `motion.div` elements with different animation timings (rotate, scale, opacity) for layered gradient effects
- **Bento Grid Layout**: Grid with `auto-rows-[22rem]` and `md:col-span-*` classes creates responsive bento-style layouts
- **Glassmorphism Implementation**:
  - Base: `bg-[rgba(18,18,18,0.5)] backdrop-blur(12px) saturate(180%)`
  - Border: `border border-white/10` for subtle definition
  - Strong variant: Higher opacity (0.8) and blur (16px) for important elements

### Animation Patterns

- **Hover Effects**: Use `whileHover={{ scale: 1.02, y: -4 }}` with spring transitions for smooth card interactions
- **Scroll Animations**: Infinite marquee using `animate={{ x: [0, -2000] }}` with `repeat: Number.POSITIVE_INFINITY`
- **Entrance Animations**: Stagger animations using `transition={{ delay: 0.2, 0.4 }}` for sequential element reveals

### Responsive Design

- **Navigation**: Desktop nav hidden on mobile, replaced with hamburger menu using conditional rendering
- **Mobile Menu**: Animate height from 0 to auto with opacity fade for smooth dropdown
- **Typography**: Use `sm:text-xl` and responsive container classes for adaptive layouts

### File Organization

- **UI Components**: Keep reusable UI patterns in `src/components/ui/` (AuroraBackground, BentoGrid)
- **Feature Components**: Specific features in `src/components/` (Navbar, TestimonialsMarquee)
- **Layout**: Root layout in `src/app/layout.tsx` with dark mode `className="dark"` on `<html>`

### Code Quality

- **ESLint with JSX**: Use HTML entities for quotes (`&ldquo;`, `&rdquo;`) instead of straight quotes in JSX
- **Import Organization**: Group imports by type (framework, components, utilities)
- **TypeScript Strict**: Always use strict mode - catches bugs early
- **Lucide Icons**: Use `stroke-width={1.5}` for premium, thin look

### Performance Considerations

- **Framer Motion**: Use `viewport={{ once: true }}` for scroll-triggered animations to prevent re-triggering
- **CSS Variables**: Define colors in `:root` and `.dark` for consistent theming
- **Image Optimization**: Use emoji for simple graphics (search icon) instead of loading images

### Documentation

- **README.md**: Should be comprehensive - include tech stack, design system, getting started, progress tracking
- **TODO.md**: Keep detailed checkboxes for tracking; update progress percentage after each phase
- **Clinerules**: Define AI behavior upfront for consistent development workflow

### Development Workflow

- **Vibe-Coding Mode**: When user says "let's continue", move to next logical phase without asking
- **Context Awareness**: Always check `.clinerules`, `TODO.md`, and `.docs/` before starting new tasks
- **Incremental Progress**: Complete one phase at a time, update progress, then move to next

### Common Pitfalls

- **Auto-formatting Conflicts**: Tailwind CSS 4.x with Prettier may format CSS variables differently - use final_file_content for SEARCH/REPLACE reference
- **Missing Imports**: Framer Motion components need `"use client"` directive at top of file
- **Tailwind Variants**: CSS 4.x uses `@custom-variant` instead of standard variant syntax

### Next Steps

1. Phase 3: Database setup (Neon.tech + Prisma schema)
2. Phase 3: Authentication (Auth.js v5 + Google OAuth)
3. Phase 3: Dashboard layout with sidebar navigation

---

_Last Updated: 2026-01-29_
