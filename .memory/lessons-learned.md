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
})
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
  .single()
```

#### Type Definitions

**Before (Prisma-generated)**:

```typescript
// Auto-generated from schema.prisma
type Bookmark = {
  id: string
  url: string
  // ...
}
```

**After (Custom)**:

```typescript
// src/types/index.ts
export type Bookmark = {
  id: string
  url: string
  userId: string
  // ...
}
```

### Remaining Work

- [x] Update folder system implementation to use Supabase
- [x] Implement folder management server actions
- [x] Update all components to use camelCase types consistently

---

## 2026-01-31 | Bookmark Card Design Iteration

### Problem Statement

Initial bookmark card implementation attempted to force a fixed size (320px × 200px) with minimal tweet styling using custom CSS. This approach:

1. Required complex CSS overrides for `react-tweet` classes
2. Cropped tweet content (media, footer, actions)
3. Created inconsistent card heights
4. Overall poor visual result

### Solution Applied

Simplified to natural card sizing:

1. **Removed fixed dimensions**: Cards now grow/shrink to fit tweet content
2. **Eliminated custom CSS**: Let `react-tweet` render at its natural dimensions
3. **Simplified structure**: Header bar + Tweet content + Footer bar
4. **Cleaner layout**: Borders separate sections naturally

### Key Learnings

- **Don't Fight Library Defaults**: `react-tweet` is designed to display tweets naturally. Forcing custom styling creates complexity without clear benefit.
- **Natural Size is Better UX**: Users expect tweet embeds to look like they do on Twitter. Custom sizing breaks that mental model.
- **CSS Global Pollution**: Adding library-specific overrides to `globals.css` is fragile - library updates can break styles.
- **Iterative Feedback**: If a design feels "ridiculous" or overly complex, step back and simplify.

### Technical Details

#### Before (Fixed Size + Custom CSS)

```tsx
// Fixed card dimensions
className="h-[200px] w-[320px] flex-col overflow-hidden rounded-xl"

// CSS in globals.css
.min-tweet {
  max-width: 280px !important;
  max-height: 180px !important;
}
.min-tweet .react-tweet-media { display: none !important; }
```

#### After (Natural Size)

```tsx
// Natural dimensions
className="flex flex-col overflow-hidden rounded-xl"

// No custom CSS needed
<Tweet id={tweetId} />
```

### CSS Cleanup

Removed all `min-tweet` related classes from `globals.css`:

- Max-width/max-height constraints
- Media hiding
- Footer/action button hiding
- Verified badge hiding
- Custom font sizes

### Impact

- **Better visual result**: Tweets display as expected
- **Simpler code**: Removed ~30 lines of CSS
- **More maintainable**: No fragile class overrides
- **Better accessibility**: Users see full tweet content

### Design Principles Applied

1. **Content First**: Design around content (tweets), not around arbitrary dimensions
2. **Simplicity Over Control**: Don't force design patterns that fight the medium
3. **Library Integration**: Trust the library's design decisions unless there's a clear reason to override

---

## 2026-01-31 | Accessibility Implementation (WCAG 2.1 AA)

### Problem Statement

Initial implementation lacked accessibility features, making the app difficult to use with keyboard navigation and screen readers.

### Solution Applied

Implemented comprehensive accessibility features across all components to meet WCAG 2.1 AA standards.

### Key Implementations

#### Skip Navigation

- Added "Skip to main content" links on all pages
- Hidden by default (`sr-only`), visible on focus
- Allows keyboard users to bypass navigation

#### Keyboard Navigation

- **Escape key**: Closes all modals
- **Enter key**: Activates buttons and links
- **Tab navigation**: Logical focus order throughout
- **Focus trapping**: In modals to keep focus within dialog

#### ARIA Attributes

- **Landmarks**: `role="navigation"`, `role="dialog"`, `role="contentinfo"`, `role="main"`, `role="section"`
- **Labels**: `aria-label` for icons without text, `aria-labelledby` for form sections
- **States**: `aria-expanded` for mobile menu, `aria-pressed` for toggle buttons
- **Live regions**: `aria-live="polite"` for error announcements
- **Busy states**: `aria-busy` for loading indicators
- **Hidden decorative**: `aria-hidden="true"` for purely visual icons

#### Focus Management

- **Auto-focus**: Modal inputs focused when opened
- **Focus trapping**: Tab cycles within modal boundaries
- **Focus restoration**: Returns focus to trigger element after modal close
- **Visible indicators**: `focus-visible` rings on all interactive elements

#### Forms & Inputs

- **Proper labeling**: All inputs have associated `<label>` elements
- **Fieldsets**: Grouped related form controls with `<fieldset>` and `<legend>`
- **Error states**: `aria-invalid` with `aria-describedby` pointing to error messages
- **Disabled states**: `disabled` attribute on buttons during loading

### Technical Patterns

#### Focus Trap Implementation

```tsx
useEffect(() => {
  const modal = modalRef.current
  if (!modal || !isOpen) return

  const focusableElements = modal.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  modal.addEventListener("keydown", handleTab)
  return () => modal.removeEventListener("keydown", handleTab)
}, [isOpen])
```

#### Escape Key Handler

```tsx
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      onClose()
    }
  }
  document.addEventListener("keydown", handleEscape)
  return () => document.removeEventListener("keydown", handleEscape)
}, [isOpen, onClose])
```

#### Skip-to-Content Link

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
>
  Skip to main content
</a>
<main id="main-content" className="...">
```

### Key Learnings

- **Accessibility is Part of UX**: Good accessibility = good UX for everyone
- **Keyboard-First Design**: If it works with keyboard, it's likely accessible
- **ARIA Completes the Picture**: Semantic HTML + ARIA = screen reader understanding
- **Focus is Critical**: Users need to know where they are in the interface
- **Test with Keyboard**: Try navigating without mouse to catch issues early
- **Progressive Enhancement**: Build for keyboard, add mouse enhancements

### Components Updated

1. **Landing Page** (`src/app/page.tsx`)
   - Skip navigation link
   - Section landmarks
   - ARIA labels on decorative icons
   - Focus indicators on all CTAs

2. **Navbar** (`src/components/navbar.tsx`)
   - Proper navigation role
   - Mobile menu with aria-expanded/controls
   - List structure for links
   - Body scroll lock when menu open

3. **Login Page** (`src/app/login/page.tsx`)
   - Form with proper labels
   - Error announcements
   - Loading state with aria-busy
   - Focus management on mount

4. **Add Bookmark Modal** (`src/components/dashboard/add-bookmark-modal.tsx`)
   - Full focus trap
   - Dialog role
   - Folder selection with aria-pressed
   - Character counter with aria-live

5. **Add Folder Modal** (`src/components/dashboard/add-folder-modal.tsx`)
   - Focus trap
   - Color buttons with aria-label
   - Live region for preview
   - Form fieldsets

### Testing Checklist

- [x] Tab through entire interface - logical order
- [x] Escape key closes modals
- [x] Enter activates buttons
- [x] Focus visible on all interactive elements
- [x] All images have alt text or are decorative
- [x] Forms have proper labels
- [x] Error messages are announced
- [x] Skip navigation works
- [x] Mobile menu works with keyboard
- [x] Loading states announced

### Best Practices Established

1. **Semantic HTML First**: Use proper elements (`<nav>`, `<main>`, `<section>`, `<button>`)
2. **ARIA as Supplement**: Only use when semantic HTML isn't enough
3. **Visible Focus States**: Always show keyboard focus
4. **Error Accessibility**: Use `role="alert"` and `aria-live` for errors
5. **Icon Accessibility**: Decorative icons get `aria-hidden`, interactive icons get `aria-label`
6. **Form Validation**: Always provide `aria-describedby` for error messages
7. **Modal Patterns**: Always implement focus trap and escape handler

### Common Pitfalls Avoided

- **Hidden text**: Don't use `display: none` for screen readers
- **Fake buttons**: Don't use `<div>` with click handler - use `<button>`
- **Missing labels**: Every input needs a label or `aria-label`
- **Color-only indicators**: Don't rely on color alone to convey meaning
- **No keyboard trap**: Don't prevent keyboard navigation

---

_Last Updated: 2026-01-31 4:20 PM (Asia/Jakarta, UTC+7:00)_
