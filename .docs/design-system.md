# Design System: Twitmark (2026 Edition)

## 1. Visual Identity & Vibe

- **Core Aesthetic**: "Cyber-Minimalism". Clean, dark, high-contrast, with depth created through blurs and shadows.
- **Color Palette**:
  - **Background**: `#050505` (Deep Black)
  - **Surface**: `#121212` (Card background with 0.5 opacity for glass effect)
  - **Primary**: `#1D9BF0` (X-Blue) for accents.
  - **Accent**: Linear gradient `linear-gradient(135deg, #1D9BF0 0%, #8E2DE2 100%)`.
  - **Text**: `#FFFFFF` (Primary), `#A0A0A0` (Secondary/Muted).

## 2. Layout & Grids

- **Hero Section**: Use **Bento Grid** layout to showcase feature snippets (Folder icons, Reading list preview, etc.).
- **Dashboard Grid**: Responsive Masonry or Bento Grid for Bookmark cards.
- **Glassmorphism 2.0**:
  - `backdrop-filter: blur(12px) saturate(180%)`.
  - `bg-white/5` or `bg-background/95` for glass effect.
  - Thin 1px border with `rgba(255, 255, 255, 0.1)` or `border-border/40`.
  - Consistent across all components (cards, modals, dropdowns).

## 3. Typography

- **Headings**: Sans-serif, Bold (Geist Sans).
- **Body**: Sans-serif, Regular (Geist Sans).

## 4. Components & Motion (Magic UI / Framer Motion)

### Buttons

- Shiny effects on hover
- Slight scale-down on click (`0.95`)
- `cursor-pointer` class on all interactive elements

### Modals

- "Zoom-in" spring animation from center
- `initial={{ opacity: 0, scale: 0.95, y: 20 }}`
- `animate={{ opacity: 1, scale: 1, y: 0 }}`
- `transition={{ type: "spring", damping: 25, stiffness: 300 }}`
- Background overlay with blur and fade
- Close on Escape key
- Focus management (trap focus, return focus)

### Cards

- Hover lift effect using Framer Motion (`y: -4`)
- Spring physics for smooth motion: `{ stiffness: 300, damping: 20 }`
- GPU acceleration with `style={{ willChange: "transform" }}`
- Glassmorphism 2.0 styling

### Toast Notifications

- Slide-in animation from bottom-right
- Auto-dismiss after 5 seconds
- Success (green), Error (red), Info (blue), Warning (yellow) variants
- Smooth exit animation

### Landing Page

- Use `AuroraBackground` from Magic UI for Hero section
- Testimonials marquee with smooth scrolling
- Feature bento grid with hover animations

## 5. Specific Feature UI

### Tweet Cards

- Use `react-tweet` at natural dimensions with familiar X layout
- Minimum height: `300px`
- Responsive width
- Glassmorphism card styling

### Card Structure

- Header bar (title, folder badge, actions dropdown, date)
- Tweet embed (react-tweet)
- Footer bar (folder tags, reading list indicator)
- Hover state: `border-primary/40 ring-primary/10 ring-2` for reading list items

### Reading List

- Distinct border/ring highlight for bookmarks marked as "To Read"
- CheckCircle2 icon with primary color
- Badge: "In Reading List"

### Folders

- Color picker with predefined palette
- Folder sidebar with bookmark counts
- Active state styling for selected folder
- Folder tags with `hexToRgba(color, 0.15)` background

## 6. Icons

- Use **Lucide React** icons with `stroke-width={1.5}` for a thin, premium look
- **Accessibility**:
  - Decorative icons: `aria-hidden="true"`
  - Interactive icons: `aria-label` describing purpose
  - All buttons with icons need proper labels

## 7. Animation Standards

### Performance

- **Target**: 60fps for all animations
- **GPU Acceleration**: `willChange: "transform"` on animated elements
- **Spring Physics**:
  - Standard: `{ stiffness: 300, damping: 20 }`
  - Modals: `{ stiffness: 300, damping: 25 }`
  - Smooth, natural motion feel

### Transitions

- Always use Framer Motion for animations
- No jarring cuts - everything animated
- Consistent easing across components
- Staggered animations for lists (staggerChildren)

### Micro-interactions

- Hover states on all interactive elements
- Scale effects on buttons (`0.98` on active, `1.02` on hover)
- Color transitions (not abrupt changes)
- Smooth modal open/close

## 8. Code Quality

### Formatting

- **Prettier**: Auto-format on save
- **Tailwind Plugin**: `tailwindcss-prettier` for class sorting
- **Configuration**: `.prettierrc` with project standards

### TypeScript

- **Strict Mode**: No `any` types
- **Type Safety**: Proper typing for all components and functions
- **Shared Types**: `src/types/index.ts` for database entities

### Clean Code

- **Single Responsibility**: Each component does one thing well
- **DRY**: Extract reusable logic into hooks and utilities
- **Colocation**: Keep components near where they're used
- **Descriptive Names**: Clear, intention-revealing variable names

## 9. State Management (TanStack Query)

### Optimistic Updates

- Instant UI feedback before server confirmation
- Automatic rollback on errors
- Cache invalidation after mutations

### Custom Hooks

- `useBookmarks`: Create, delete, toggle reading list, manage folders
- `useFolders`: Create, update, delete folders
- Type-safe mutations with error handling

### Cache Strategy

- 1 minute stale time for data
- Disable refetch on window focus
- Single retry on failure
- Structured query keys for invalidation

## 10. Accessibility (WCAG 2.1 AA)

### Keyboard Navigation

- **Tab Order**: Logical focus flow from top-left to bottom-right
- **Focus Visible**: All interactive elements must show `focus:ring-2 focus:ring-primary/50 focus:outline-none` on keyboard focus
- **Escape Key**: All modals must close on Escape key press
- **Enter Key**: Buttons and links activate on Enter key

### Semantic HTML

- **Landmarks**: Use proper semantic elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- **Headings**: Proper heading hierarchy (`h1` → `h2` → `h3`) without skipping levels
- **Buttons**: Use `<button>` elements with `type="button"` or `type="submit"`, not `<div>` with click handlers
- **Forms**: Every input must have associated `<label>` or `aria-label`

### ARIA Attributes

- **Navigation**: `role="navigation"` with `aria-label` describing purpose
- **Dialogs**: `role="dialog"` with `aria-modal="true"` and `aria-labelledby`
- **Forms**: `fieldset` with `legend` for grouping related controls
- **States**: `aria-expanded` for toggles, `aria-pressed` for buttons
- **Live Regions**: `aria-live="polite"` for error messages and toasts
- **Loading**: `aria-busy="true"` during async operations
- **Decorative**: `aria-hidden="true"` on visual-only icons

### Focus Management

- **Skip Links**: "Skip to main content" link at top of page (`sr-only`, visible on focus)
- **Auto-focus**: Modal inputs receive focus when opened
- **Focus Trap**: Modals must keep focus within dialog boundaries
- **Focus Restoration**: Return focus to trigger element after modal closes
- **Body Scroll**: Prevent body scroll when modals are open (`overflow: hidden`)

### Color & Contrast

- **Text Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Interactive Elements**: Minimum 3:1 contrast ratio for focus indicators
- **Color-Only**: Never use color alone to convey meaning (use icons, labels, patterns)
- **Glassmorphism**: Ensure text remains readable on glass backgrounds

### Testing Checklist

- [x] Navigate entire interface with Tab key
- [x] All interactive elements visible when focused
- [x] Escape key closes all modals
- [x] Forms announce errors to screen readers
- [x] All images have alt text or are decorative
- [x] Skip navigation link works
- [x] Focus order is logical
- [x] All clickable elements have `cursor-pointer`
- [x] ARIA labels on all interactive elements

## 11. Responsive Design

### Breakpoints

- **Mobile**: `sm` (640px)
- **Tablet**: `md` (768px)
- **Desktop**: `lg` (1024px)
- **Wide**: `xl` (1280px)

### Mobile Considerations

- Full-width cards on small screens
- **Dashboard Sidebar**: Full-screen overlay (w-72) with hamburger menu toggle in header
- **User Menu**: Dropdown accessible via avatar click on right side of header
- Touch-friendly tap targets (min 44x44px)
- Proper spacing for thumb reach
- Smooth slide transitions for sidebar overlay

### Desktop Enhancements

- Hover states only on desktop
- **Dashboard Sidebar**:
  - Toggleable visibility using Menu icon in header
  - Collapsible width (256px expanded ↔ 64px collapsed)
  - Collapse button beside logo when sidebar is open
  - Header automatically adjusts left padding based on sidebar state
- **User Menu**: Dropdown in header shows user name, email, and Sign Out
- Grid layouts expand to show more content
- Proper cursor pointers on all interactive elements

## 12. Performance

### Bundle Size

- Code splitting with Next.js automatic splitting
- Dynamic imports for heavy components
- Tree shaking for unused code

### Rendering

- Server Components by default (RSC)
- Client Components only when necessary
- Optimize re-renders with React.memo, useMemo, useCallback
- GPU acceleration for animations

### Asset Optimization

- Next.js Image component for images
- Lazy loading for offscreen content
- Optimize fonts with Next.js font optimization

## 13. Design Tokens

### Spacing

- **XS**: `0.25rem` (4px)
- **SM**: `0.5rem` (8px)
- **MD**: `1rem` (16px)
- **LG**: `1.5rem` (24px)
- **XL**: `2rem` (32px)

### Border Radius

- **SM**: `0.5rem` (8px)
- **MD**: `0.75rem` (12px)
- **LG**: `1rem` (16px)
- **XL**: `1.5rem` (24px)
- **2XL**: `2rem` (32px) - for modals

### Shadows

- **SM**: `0 1px 2px rgba(0, 0, 0, 0.05)`
- **MD**: `0 4px 6px rgba(0, 0, 0, 0.1)`
- **LG**: `0 10px 15px rgba(0, 0, 0, 0.1)`
- **XL**: `0 25px 50px rgba(0, 0, 0, 0.25)` - for modals
