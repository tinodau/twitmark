# Project Specification: Twitmark

## 1. Product Vision

Twitmark is a premium personal bookmark manager for X (Twitter) content, designed for users who find the native X bookmarking system cluttered and hard to navigate. It focuses on organization (Folders), intentionality (Reading List), and a superior reading experience (Article Mode).

## 2. Target Audience

- Power users of X who consume high-value threads and articles.
- Researchers, developers, and creators who need a structured way to save "Digital Assets" from X.
- Users looking for a "Read-it-later" experience specifically optimized for X.

## 3. Functional Requirements

### 3.1 Authentication & Onboarding

- **Google OAuth**: Primary login method via Auth.js/Supabase.
- **User Profile**: Store basic info (name, email, avatar).
- **Onboarding**: A simple empty-state dashboard that guides the user to "Paste your first link."

### 3.2 Landing Page (The "Hook")

- **Hero Section**: High-impact animation (Magic UI) with a clear value proposition.
- **Feature Highlights**: 3-4 cards showing Folder organization, Reading List, and Article Mode.
- **Testimonials**: A scrolling "Marquee" of placeholder X posts from satisfied users.
- **Visuals**: Use "Bento Grid" layout and "Glassmorphism" effects.

### 3.3 The Dashboard (Core Engine)

- **Manual Input**: A prominent "Add Bookmark" button that opens a modal to paste an X URL.
- **Bookmark Card**:
  - Uses `react-tweet` for standard rendering.
  - Shows metadata (Date added, Folder name).
  - Quick actions: Move to folder, Add to Reading List, Delete.
- **Pagination/Infinite Scroll**: Automatically handle large volumes of bookmarks to maintain performance.

### 3.4 Folder System (Organization)

- **CRUD Operations**: Create, Read, Update, Delete folders.
- **Assignment**: Users can move bookmarks into specific folders.
- **Navigation**: Sidebar navigation to filter bookmarks by folder.

### 3.5 Reading List (The "Todo" Feature)

- **Toggle Mechanism**: Any bookmark can be marked as "To Read."
- **Dedicated View**: A specific tab/view for bookmarks that haven't been "completed" yet.
- **Visual Feedback**: Distinct UI indicators for items in the Reading List.

### 3.6 Advanced Reading Mode (The "Article" View)

- **Logic**: If the pasted URL is an "X Article" (detected via URL pattern or metadata), apply a specific UI.
- **Optimized UI**:
  - Focus on typography (Serif fonts, optimal line height).
  - Minimalist layout (hide sidebar/clutter).
  - "Open on X" button clearly visible.
- **Modal Overlay**: All tweets/articles open in a high-fidelity modal rather than a new tab.

## 4. Technical Constraints & Logic

- **URL Processing**: System must validate that the link is a valid `x.com` or `twitter.com` URL.
- **Metadata Scraping**: Use a server-side utility to fetch Open Graph data for X Articles to populate the "Reading Mode" view.
- **State Management**: Use TanStack Query for caching and optimistic UI updates (e.g., when moving a tweet to a folder).

## 5. UI/UX Standards (2026 Trends)

- **Glassmorphism 2.0**: Frosted glass effects with subtle borders.
- **Micro-interactions**: Hover effects on cards, smooth modal transitions via Framer Motion.
- **Dark Mode First**: The aesthetic should be sleek, dark-themed by default with high-contrast accents.

## 6. Success Metrics (MVP)

- Successful Google Login.
- Ability to save and render an X link within < 2 seconds.
- Functional folder filtering.
- Responsive design (Mobile and Desktop).
