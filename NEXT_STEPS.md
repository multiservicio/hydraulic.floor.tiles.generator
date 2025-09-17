# Project Roadmap — Hydraulic Floor Generator

This document outlines the next steps for features, integrations, and fixes. Each item includes a short rationale and concrete acceptance criteria so the next agent can deliver confidently.

## 0) Priorities Snapshot
- High: GDPR consent, Google Analytics (GA4) with Consent Mode v2, Bug fix: weathering and tile counter, Basic SEO meta.
- Medium: Google AdSense (consent-gated), export/share flows, performance and CLS improvements, accessibility pass.
- Low: PWA, i18n, preset patterns, undo/redo, pricing estimator.

---

## 1) GDPR/Privacy & Consent (Consent Mode v2)
- Goal: Load analytics/ads only after explicit consent (EU-compliant), store preferences, and allow changes.
- Implementation notes:
  - Add a small consent banner component with granular toggles: "Analytics" and "Advertising". Default: denied.
  - Persist consent in `localStorage` under `consent.v1 = { analytics: boolean, ads: boolean, ts: number }`.
  - Initialize Google Consent Mode v2 with `denied` until user consents, then update.
  - Add a lightweight Privacy Policy page or section (can be a modal for now) and a footer link.
  - Defer all third-party scripts until consent is granted (load dynamically).
- Files to touch/create:
  - `index.html`: inject consent banner container and footer link to policy.
  - `assets/js/consent.js`: consent state, UI, and script loader helpers.
  - `assets/css/styles.css`: basic banner styling (non-intrusive, accessible).
- Acceptance criteria:
  - On first visit: banner appears; analytics/ads are not loaded.
  - When user accepts analytics only: GA initializes; ads remain blocked.
  - When user accepts ads (and analytics, if required by AdSense): both initialize.
  - User can reopen preferences from footer and change consent; changes apply immediately.

## 2) Google Analytics (GA4)
- Goal: Measure usage while honoring consent.
- Implementation notes:
  - Use gtag.js with GA4 Measurement ID (placeholder `G-XXXXXXXXXX`).
  - Configure Consent Mode with `ad_storage`/`analytics_storage` set per consent.
  - Track key events: `tile_painted`, `auto_fill_used`, `resize_grid`, `weathering_toggled`, `export_clicked`.
  - Ensure IP anonymization and no PII.
- Files to touch/create:
  - `assets/js/analytics.js`: `initAnalytics(id)`, `trackEvent(name, params)`; guard on consent.
  - `index.html`: do not inline GA; load via `consent.js` after consent.
- Acceptance criteria:
  - No GA requests before consent.
  - After granting analytics, page_view and custom events are visible in GA DebugView.

## 3) Google AdSense (Non-intrusive, CLS-safe)
- Goal: Monetize responsibly, with minimal layout shift and consent gating.
- Implementation notes:
  - Define reserved ad slots to avoid CLS: fixed-height containers.
  - Suggested placements: below color palette, and at page bottom; skip on narrow mobile widths.
  - Load AdSense script only after ads consent, using client ID placeholder `ca-pub-XXXXXXXXXXXX`.
  - Respect `analytics`/`ads` consent; do not load if denied.
- Files to touch/create:
  - `index.html`: ad slot containers with reserved space.
  - `assets/js/ads.js`: `initAds()` guarded by consent.
- Acceptance criteria:
  - No AdSense network calls before ads consent.
  - No visible layout shift when ads load.

## 4) SEO Foundations
- Goal: Improve discoverability and social sharing.
- Implementation notes:
  - Add `<title>`, meta description, canonical URL, robots meta (index, follow).
  - Add Open Graph + Twitter Card tags: title, description, preview image placeholder `assets/og/preview.png`.
  - Add JSON-LD `SoftwareApplication` schema with app name, category, operatingSystem: "Web".
  - Add `robots.txt` and a minimal `sitemap.xml` (single-page for now).
  - Ensure fast LCP: preload main CSS, defer non-critical JS.
- Files to touch/create:
  - `index.html`: meta tags and JSON-LD.
  - `robots.txt`, `sitemap.xml` (static for now; update URL placeholders).
- Acceptance criteria:
  - Meta present and valid per Lighthouse SEO audit.
  - OG/Twitter tags render in a validator (manual check acceptable).

## 5) Bug Fix: Weathering breaks tile counter
- Symptom: When weathering is on, small color variations inflate the color summary with many near-duplicate colors.
- Approach A (recommended): Count by base palette color regardless of weathering.
  - Store base color on paint: `tile.dataset.baseColor = baseColorHex`.
  - `updateColorSummary()` uses `dataset.baseColor` when present; fallback to current color otherwise.
- Approach B: Snap weathered RGB back to nearest palette color using Euclidean distance in RGB.
  - Provide a map from hex to name; pick the closest within tolerance.
- Acceptance criteria:
  - With weathering enabled at any intensity, the counter groups tiles by the original palette colors and totals are correct.

## 6) UX & Design Tools
- Undo/redo (last 50 actions): paint, resize, auto-fill.
- Eyedropper: click a colored tile to set active color.
- Eraser: set tile back to default background.
- Preset patterns: a few curated templates (e.g., borders, motifs) in a dropdown.
- Export: download PNG and SVG snapshot; include color legend.
- Share: generate URL with encoded state (grid size, placements, weathering, palette).
- Acceptance criteria:
  - Undo/redo works across actions; export produces correct image with legend.

## 7) Performance & Quality
- Virtualize rendering for large grids (>40x25) to keep interactions smooth.
- Debounce resize and summary updates to reduce reflow work.
- Precompute neighbor lookups; avoid repeated DOM queries.
- Add a simple perf mark/measure for `generateBeautifulDesign()`.
- Acceptance criteria:
  - 60fps interaction on 50x30 grid on a mid-range laptop; Lighthouse Performance > 90.

## 8) Accessibility & i18n
- Keyboard navigation for palette and grid (arrow keys to move, Enter to paint).
- Focus states and ARIA labels for controls.
- Contrast-safe default theme; prefers-reduced-motion.
- Basic i18n scaffold (en as default; strings in a JSON map).
- Acceptance criteria:
  - Axe or Lighthouse Accessibility score ≥ 95; basic keyboard-only flow works.

## 9) PWA (Optional, later)
- Add `manifest.webmanifest`, icons, and offline caching for static assets.
- Installable experience; lightweight service worker with cache-first for assets.
- Acceptance criteria:
  - Lighthouse PWA installable; works offline for core UI.

## 10) Documentation & Ops
- Update `README.md` with features, privacy policy link, and local dev notes.
- Add `CONTRIBUTING.md` with code style and commit tips.
- Add simple `docs/PRIVACY.md` and link from footer.

---

## Concrete Task Breakdown (first pass)
1. Consent foundation
   - Build `assets/js/consent.js` with: state read/write, banner UI, `onConsentChange(cb)`.
   - Initialize Consent Mode v2 with `denied` on boot; update on acceptance.
2. Analytics integration
   - Add `assets/js/analytics.js` with `initAnalytics` and `trackEvent` wrappers; wire event hooks in `assets/js/main.js`.
3. AdSense integration
   - Define reserved ad slots in `index.html`; add `assets/js/ads.js` loader gated by consent.
4. SEO essentials
   - Add meta/OG/Twitter/JSON-LD to `index.html`; commit `robots.txt` and `sitemap.xml` with placeholder URLs.
5. Weathering counter fix
   - Implement dataset-based counting in `updateColorSummary()`; ensure all paint paths set `dataset.baseColor`.
6. Export & share
   - Add `assets/js/export.js` for PNG/SVG; add URL state serializer/deserializer.
7. Accessibility pass
   - Keyboard interactions, focus states, aria labels; verify with Lighthouse/Axe.

---

## Placeholders to Replace at Integration Time
- GA4 Measurement ID: `G-XXXXXXXXXX`
- AdSense Publisher ID: `ca-pub-XXXXXXXXXXXX`
- Site canonical URL: `https://example.com/` (also for `sitemap.xml` and OG image absolute URL)

## Notes for the Next Agent
- Keep third-party scripts deferred and consent-gated; no inline script tags that execute before consent.
- Avoid CLS: reserve ad slots and image dimensions; consider `min-height` placeholders.
- When modifying `assets/js/main.js`, keep functions small and avoid unrelated refactors; add minimal helpers if needed (e.g., color utils).
- If adding new files, follow existing structure under `assets/js` and `assets/css`.
