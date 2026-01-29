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
- **Reading Mode (Special)**: Switch to **Serif font** (e.g., Playfair Display or Charter) with increased line-height (1.8) and narrower container (65ch) for maximum readability.

## 4. Components & Motion (Magic UI / Framer Motion)

- **Buttons**: Shiny effects on hover, slight scale-down on click (`0.95`).
- **Modals**: "Zoom-in" spring animation from the center. Background overlay should be a heavy blur.
- **Cards**: "Tilt" effect on hover using Framer Motion.
- **Landing Page**: Use `AuroraBackground` or `AnimatedBeam` from Magic UI for the Hero section.

## 5. Specific Feature UI

- **Tweet Cards**: Maintain the familiar X layout but stripped of "Noise" (no reply/retweet counts unless hovered).
- **Article Modal**:
  - Full-screen or large-center modal.
  - Large cover image from metadata.
  - Clean typography focus.
  - "Reading Progress Bar" at the top.

## 6. Icons

- Use **Lucide React** icons with `stroke-width={1.5}` for a thin, premium look.
