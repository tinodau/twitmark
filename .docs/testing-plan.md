# Testing Plan: Twitmark

## 1. Testing Strategy Overview

We use a pyramid testing strategy to ensure reliability while maintaining high development speed.

- **Unit Testing**: Testing individual logic (URL Parsers, Metadata Extractors).
- **Integration Testing**: Testing to interaction between Supabase, Server Actions, and React components.
- **E2E Testing**: Testing critical user journeys (Login -> Add Link -> View in Folder).

## 2. Testing Stack (2026 Standards)

- **Vitest**: Fast unit testing for utility functions.
- **Playwright**: For End-to-End (E2E) testing across different browsers.
- **React Testing Library**: For testing critical UI components (e.g., Article Modal).

## 3. Critical Test Scenarios

### 3.1 Authentication

- [ ] Verify Google Login redirects correctly.
- [ ] Ensure protected routes (`/dashboard`) are inaccessible without a session.
- [ ] Check session persistence after page refresh.

### 3.2 Link Processing (The Core Logic)

- [ ] **Valid URL**: Test with standard `x.com` and `twitter.com` status links.
- [ ] **Invalid URL**: Ensure to system rejects non-X links (e.g., Facebook, YouTube) with a clear error message.

### 3.3 Dashboard & CRUD

- [ ] **Create Bookmark**: Verify a new card appears immediately after pasting a link (Optimistic UI check).
- [ ] **Folder Management**: Test creating a folder and moving a bookmark into it.
- [ ] **Reading List**: Toggle a bookmark to "To Read" and verify it appears in Reading List view.
- [ ] **Delete**: Ensure bookmarks are removed from the database and UI simultaneously.

### 3.4 UI/UX & Responsiveness

- [ ] **Tweet Rendering**: Verify `react-tweet` renders tweets correctly at natural dimensions.
- [ ] **Mobile View**: Ensure to Bento Grid layout stacks correctly on small screens.
- [ ] **Infinite Scroll**: Verify that more bookmarks load when user reaches bottom of page.

## 4. Performance Benchmarks (QA Acceptance)

- **Lighthouse Score**: Minimum 90+ for Performance and Accessibility.
- **FCP (First Contentful Paint)**: < 1.2s on Landing Page.
- **Interaction to Next Paint (INP)**: < 200ms for bookmark additions.

## 5. Bug Reporting Protocol

When a bug is found:

1. Document issue in `.memory/lessons-learned.md`.
2. Add a regression test in: `tests/` folder.
3. Update `TODO.md` to track fix.
