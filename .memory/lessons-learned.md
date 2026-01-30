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

1. Phase 4: Folder System implementation
2. Phase 5: Reading List View enhancement
3. Phase 6: Advanced Reading Mode (Article View)

---

## 2026-01-30 | Architecture Migration: Prisma → Supabase-Only

### Decision Context

Initial implementation used **Prisma ORM + Supabase** for database access. This created unnecessary complexity and redundancy.

### Why the Change?

- **Supabase Provides ORM-Like Features**: Built-in TypeScript client with type inference
- **Simplified Stack**: Eliminates need for separate ORM layer, migrations, and schema synchronization
- **Better Performance**: Direct Supabase client access reduces abstraction overhead
- **Reduced Bundle Size**: No need for Prisma client runtime

### Migration Steps Taken

1. **Uninstalled Prisma Packages**:

   ```bash
   npm uninstall @prisma/client prisma
   ```

2. **Removed Prisma Files**:
   - Deleted `prisma/` directory (schema.prisma, migrations)
   - Removed `lib/prisma.ts` client singleton
   - Deleted `services/` directory (db-actions.ts, metadata-fetcher.ts)

3. **Updated Database Access**:
   - Created `lib/supabase/database.ts` for direct Supabase operations
   - Updated all server actions to use Supabase client
   - Replaced Prisma-generated types with custom types in `src/types/index.ts`

4. **Type Safety Without Prisma**:
   - Defined custom TypeScript interfaces for database entities
   - Used Supabase's TypeScript client with proper generic types
   - Maintained type safety for all database operations

5. **Cleaned Up Documentation**:
   - Updated `tech-stack.md` to remove Prisma references
   - Updated `architecture.md` to reflect Supabase-only data flow
   - Updated all root files (README, TODO, context, .clinerules, .env files)

### Key Learnings

- **Supabase Client is Sufficient**: For this project's complexity, Supabase TypeScript client provides all needed functionality
- **Keep Stack Simple**: Each additional layer adds maintenance burden
- **Type Safety Doesn't Require ORM**: Custom TypeScript types + Supabase generics provide equal type safety
- **Document Changes Early**: Updating documentation during migration prevents confusion later

### Technical Details

#### Database Functions (Supabase vs Prisma)

**Before (Prisma)**:

```typescript
const bookmark = await prisma.bookmark.create({
  data: {
    url: input.url,
    userId: user.id,
    // ...
  },
});
```

**After (Supabase)**:

```typescript
const { data: bookmark, error } = await supabase
  .from("bookmarks")
  .insert({
    url: input.url,
    user_id: user.id,
    // ...
  })
  .select()
  .single();
```

#### Type Definitions

**Before (Prisma-generated)**:

```typescript
// Auto-generated from schema.prisma
type Bookmark = {
  id: string;
  url: string;
  // ...
};
```

**After (Custom)**:

```typescript
// src/types/index.ts
export type Bookmark = {
  id: string;
  url: string;
  userId: string;
  // ...
};
```

### Remaining Work

- [ ] Update folder system implementation to use Supabase
- [ ] Implement folder management server actions
- [ ] Update all components to use camelCase types consistently

---

_Last Updated: 2026-01-30 10:14 AM (Asia/Jakarta, UTC+7:00)_
