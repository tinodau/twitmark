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
  - Thin 1px border with `rgba(255, 255, 255, 0.1)`.

## 3. Typography

- **Headings**: Sans-serif, Bold (Inter or Geist Sans).
- **Body**: Sans-serif, Regular (Geist Sans).

## 4. Components & Motion (Magic UI / Framer Motion)

- **Buttons**: Shiny effects on hover, slight scale-down on click (`0.95`).
- **Modals**: "Zoom-in" spring animation from center. Background overlay should be a heavy blur.
- **Cards**: Hover lift effect using Framer Motion (`y: -4`).
- **Landing Page**: Use `AuroraBackground` from Magic UI for Hero section.

## 5. Specific Feature UI

- **Tweet Cards**: Use `react-tweet` at natural dimensions with familiar X layout.
- **Card Structure**: Header bar (folder badge + actions) + Tweet embed + Footer bar (folder name + date).
- **Reading List**: Distinct border/ring highlight for bookmarks marked as "To Read".

## 6. Icons

- Use **Lucide React** icons with `stroke-width={1.5}` for a thin, premium look.
- **Accessibility**: Decorative icons must have `aria-hidden="true"`, interactive icons need `aria-label`

## 7. Accessibility (WCAG 2.1 AA)

### Keyboard Navigation

- **Tab Order**: Logical focus flow from top-left to bottom-right
- **Focus Visible**: All interactive elements must show `focus:ring-2 focus:ring-primary/50` on keyboard focus
- **Escape Key**: All modals must close on Escape key press
- **Enter Key**: Buttons and links activate on Enter key

### Semantic HTML

- **Landmarks**: Use proper semantic elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- **Headings**: Proper heading hierarchy (`h1` → `h2` → `h3`) without skipping levels
- **Buttons**: Use `<button>` elements, not `<div>` with click handlers
- **Forms**: Every input must have associated `<label>` or `aria-label`

### ARIA Attributes

- **Navigation**: `role="navigation"` with `aria-label` describing purpose
- **Dialogs**: `role="dialog"` with `aria-modal="true"` and `aria-labelledby`
- **Forms**: `fieldset` with `legend` for grouping related controls
- **States**: `aria-expanded` for toggles, `aria-pressed` for buttons
- **Live Regions**: `aria-live="polite"` for error messages
- **Loading**: `aria-busy="true"` during async operations

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

### Testing Checklist

- [ ] Navigate entire interface with Tab key
- [ ] All interactive elements visible when focused
- [ ] Escape key closes all modals
- [ ] Forms announce errors to screen readers
- [ ] All images have alt text or are decorative
- [ ] Skip navigation link works
- [ ] Focus order is logical
