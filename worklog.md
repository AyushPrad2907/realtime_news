---
Task ID: news-portal-frontend
Agent: main (Super Z)
Task: Build the frontend of a National News Portal web app based on the user's
  comprehensive UI/UX blueprint. Mobile-first, fully responsive, premium
  editorial aesthetic. Backend to be done afterwards.

Work Log:
- Loaded and read the 1,862-line Master UI/UX Blueprint covering design
  philosophy, user types, information architecture, navigation, page
  blueprints (homepage, article, live, podcasts, search, advertise,
  careers, admin/editor panels), responsive behavior, design system,
  animation, accessibility, and performance.
- Decided scope for this pass: public-facing pages only. Admin/Editor
  panels are auth-protected apps and are deferred.
- Loaded the fullstack-dev skill and initialized the Next.js 16 project
  environment.
- Built the design system per blueprint Section 19:
  - Fonts: Playfair Display (headings), Source Serif 4 (body), Inter (UI)
  - Brand palette: deep editorial red `oklch(0.52 0.19 27)` with light/dark
    variants, semantic ink scale, per-category accent colors, status colors
    (live / breaking / success).
  - Tailwind tokens mapped to CSS variables for dark mode.
  - Typography helpers (.article-body with drop-cap, .h-display, .h-section,
    .label-eyebrow, .pull-quote, .key-points) implemented in globals.css.
  - Animations: live-pulse, ticker-scroll, shimmer skeleton, highlight-flash,
    image zoom, card hover lift, nav-link underline grow, reading progress bar.
  - Reduced-motion media query disables animations.
- Built the mock data layer (`src/lib/mock-data.ts`):
  - 18 articles across 9 categories with rich HTML bodies (drop-cap, blockquotes,
    key-points boxes, H2/H3 subheads), hero captions and credits, reading times,
    views, tags, state tags, audio attachments, breaking/featured flags.
  - 6 podcast series, 6 podcast episodes with chapter markers and show notes.
  - 6 job postings across 4 departments with full responsibilities/requirements.
  - Live updates timeline (6 entries), breaking ticker headlines, trending topics.
  - Audience stats, ad formats, advertise FAQ, advertise process steps.
- Built client-side navigation with Zustand (`src/lib/store.ts`): all "routes"
  are state transitions because the sandbox only exposes the `/` route.
  History stack supports back navigation. Audio mini-player state, search
  overlay state, mobile menu state, reading progress all live in the store.
- Built layout components:
  - Header: sticky, transparent at top / blurred when scrolled, desktop nav
    (Home/Live/Breaking/National/International/Podcasts), search + theme
    toggle, mobile: search icon + logo + menu icon. Active nav link has
    animated underline.
  - CategoryBar: sticky below header, horizontally scrollable category pills
    with desktop fade-arrow scroll affordances.
  - BreakingTicker: full-width red band, auto-scrolling headlines, pause on
    hover, dismiss button, clickable headlines.
  - Footer: 4-column footer with newsletter mini-form, social icons, legal.
  - MobileNav: fixed bottom nav with 5 items (Home/Live/Search/Podcasts/Menu),
    live red pulse indicator, respects iOS safe-area.
  - MobileMenu: full-screen right-slide-in drawer with sections (primary nav,
    categories, state news pills, utility links).
  - SearchOverlay: keyboard-shortcut (⌘K), trending suggestions, live article
    + category suggestions, arrow-key navigation, no-results state.
  - MiniPlayer: persistent audio bar with progress, play/pause, expand, close.
  - ReadingProgress: 3px bar at top of viewport that fills as user reads.
- Built card components: ArticleCard (4 variants: default / compact / list /
  small), PodcastCard (default / compact), SponsoredCard, CategoryBadge.
- Built homepage sections per blueprint Section 6:
  - HeroStory: full-bleed image with gradient overlay, category badge,
    breaking badge, H1 headline, standfirst, author/time/reading-time,
    "Read story" CTA.
  - TopStories: 3-column desktop grid with 1 lead + 4 secondary cards;
    mobile horizontal scroll with snap.
  - LatestNews: 2-column list with inline leaderboard ad after 4th item;
    pulsing green live dot.
  - CategoryRibbon: per-category section with desktop 4-column grid + mobile
    horizontal scroll.
  - StateNews: state selector (vertical desktop / horizontal pills mobile)
    with reactive article list.
  - LiveSection: dark hero block with thumbnail, viewer count, "Watch Live"
    CTA, channel description.
  - PodcastSection: 4-column desktop grid with play button overlay on cover.
  - TrendingNow: numbered 1-10 list sorted by views, large faded rank
    numbers, animated entrance.
  - EditorsPicks: lead + 3 small cards with subtle left-border accent
    differentiating from algorithmic Top Stories.
  - Newsletter: dark CTA section with inline form and success state.
  - AdBanner: leaderboard/rectangle/native/mobile variants with subtle
    "Advertisement" label.
- Built page views:
  - HomePage: orchestrates all sections with desktop sidebar (Most Read + ads).
  - ArticlePage: breadcrumb, back button, category badge, H1, standfirst,
    metadata row (author avatar/name, date, updated, reading time, views),
    hero image with caption/credit, audio player, share row, article body
    with drop-cap + key-points boxes, mid-article ad, tags, author card,
    end-of-article ad, related stories, next-article preview card, sidebar
    with Most Read + ads.
  - LivePage: 16:9 video player area with live badge + viewer count,
    program info, live-updates timeline (sidebar desktop / below mobile)
    with new-update notification, related stories, upcoming broadcasts.
  - PodcastsPage: hero, series grid, filter chips, episodes grid.
  - PodcastDetailPage: cover + title + meta, sticky audio player with seek
    bar, show notes, chapter markers (clickable to seek), sponsor mention,
    more-from-series list, sidebar with other series.
  - SearchPage: input + filter bar (type, date, sort) + article grid +
    podcast grid + no-results state with trending suggestions.
  - AdvertisePage: dark hero, audience stats, benefits, ad formats grid,
    process timeline, FAQ accordion, dark inquiry form with multi-select
    format chips, budget dropdown, success state.
  - CareersPage: hero, values, filter bar (department/type), job cards,
    speculative application CTA.
  - CareerDetailPage: breadcrumb, header with badges, description,
    responsibilities/requirements/nice-to-haves/benefits, application form
    with file upload, success state, mobile sticky apply button.
  - AboutPage: hero, mission, stats, editorial team, standards, CTA.
  - ContactPage: contact channels aside + message form.
  - StaticPage (Privacy/Terms): reusable legal template with numbered sections.
  - CategoryPage and SectionPage (breaking/national/international/podcasts/live).
- Wired up `src/app/page.tsx` as the state-driven router with AnimatePresence
  for smooth page transitions, and conditional display of BreakingTicker /
  CategoryBar based on current view.
- Ran ESLint: fixed 5 errors (circular require, hooks-rules violation,
  setState-in-effect, manual-memoization). Created `useHydrated` hook to
  replace `useEffect(() => setMounted(true))`. Refactored MiniPlayer to
  use the React `key` reset pattern instead of resetting state in an effect.
  Extracted NewsSectionPage from SectionPage to satisfy rules-of-hooks.
  All lint passes cleanly now.
- Browser-tested with agent-browser:
  - Homepage renders correctly on desktop (1440x900) and mobile (390x844).
  - Article navigation works (click featured story -> article page loads).
  - Mobile bottom nav, mobile menu drawer, search overlay all functional.
  - Dark mode toggle works.
  - Search overlay with live suggestions and trending topics works.
  - Live page, search results page verified.
  - No runtime errors or console errors.

Stage Summary:
- Deliverable: A complete, mobile-responsive frontend for a premium national
  news portal — built in Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui
  + Framer Motion. All public-facing pages from the blueprint are implemented:
  Home, Article Detail, Live, Podcasts (listing + episode), Search, Advertise,
  Careers (listing + detail + apply), About, Contact, Privacy, Terms, plus
  Category and Section landing pages.
- Design system follows the blueprint: Playfair Display + Source Serif + Inter,
  deep editorial red brand, dark mode, base-8 spacing scale, custom shadows,
  full animation blueprint (live pulse, ticker, shimmer skeletons, card hover
  zoom, animated underlines), prefers-reduced-motion respected.
- Mobile-first throughout: bottom nav, mobile menu drawer, horizontal-scroll
  card rows, 44px touch targets, safe-area inset support.
- All navigation is client-side state (Zustand) because the sandbox only
  exposes the `/` route. History stack supports back navigation. The state
  model is ready to be swapped for real Next.js routes when the backend is
  wired up.
- Ready for backend handoff: replace mock-data with real API calls, replace
  Zustand navigation with Next.js App Router routes, replace mock auth with
  NextAuth for editor/admin panels.
