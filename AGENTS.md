# Hydraulic Floor Generator — Project Brief

## Overview
- Purpose: Interactive web app to design hex‑tile hydraulic floors by painting tiles manually or generating patterns automatically, with optional weathering (subtle per‑tile variation).
- Stack: Static site with plain HTML/CSS/JS. No build tooling or server required.
- Run: Open `index.html` in any modern browser.

Repository map
- `index.html`: App shell and controls (size inputs, palette, grid, summary, effects).
- `assets/css/styles.css`: Hex tile layout (CSS pseudo‑elements), responsive styles, UI polish.
- `assets/js/main.js`: Main logic in `HydraulicFloorGenerator` (grid creation, interactions, auto‑fill algorithm, color summary).
- `docs/pseudo.md`: Pseudocode/spec for auto‑generation algorithm and enhancements.
- `NEXT_STEPS.md`: Current roadmap and acceptance criteria (authoritative plan for next work).

## How It Works
- Hex grid: Rows of hex tiles; every other row is offset to form a honeycomb. Hex shapes use `:before`/`:after` triangles.
- Painting: Click or click‑drag to paint tiles with the selected palette color.
- Resizing: Width/height inputs (Width 5-50, Height 5-30) rebuild the grid.
- Auto‑Generate: Algorithm creates clusters for accent/medium colors, then fills remaining tiles by weighted randomness adjusted by neighbor colors (prefers complementary, avoids repeats). When Weathering is enabled, each tile color is varied ±intensity before painting.
- Summary: Counts colored tiles, groups by color name, shows swatches and totals.
 - Effects (Weathering): Toggle and intensity slider (0-30%) in the controls panel.

## Quick Start
1) Open `index.html`.
2) Pick a color in the palette.
3) Click or drag on tiles to paint.
4) Adjust grid size if needed and click "Resize Floor".
5) Optionally enable Weathering and choose an intensity.
6) Click "Generate Beautiful Design" for an auto‑generated pattern.

## Recent Changes
- Fixed manual painting bug by unifying `paintTile(tile, color = this.selectedColor)` and updating summary on paint.
- Removed duplicate `paintTile` and `clearGrid` definitions for clarity.
- Added Weathering effect UI and implementation (`applyWeathering`, `hexToRgb`, `clamp`).

## Known Issues / Notes
- Weathering breaks color counter: Weathering introduces slight RGB variations, so `updateColorSummary()` treats many near‑identical colors as unique. See "Immediate Fix" below.
- Touch/pointer events: Current interactions use mouse events only; consider pointer events for better mobile support.

## Immediate Fix (Bug)
- Problem: Weathering inflates the color summary with many almost‑duplicate colors.
- Recommended fix (A): Track base palette color per tile and count by it.
  - On paint, set `tile.dataset.baseColor = baseColorHex` before any weathering variation.
  - In `updateColorSummary()`, prefer `dataset.baseColor` when counting; fall back to computed color if absent.
- Alternative (B): Map current RGB to nearest palette color using Euclidean distance; use a small tolerance.
- Done when: With any weathering intensity, summary groups by palette colors and totals match visual tiles.

## Roadmap (See `NEXT_STEPS.md` for details)
- Privacy & Consent (high): GDPR banner with granular toggles; Google Consent Mode v2; defer loading until consent.
- Analytics (high): GA4 via `gtag.js`, consent‑gated; track `tile_painted`, `auto_fill_used`, `resize_grid`, `weathering_toggled`, `export_clicked`.
- SEO (high): Title/description/canonical, OG/Twitter, JSON‑LD SoftwareApplication, robots.txt, sitemap.xml.
- AdSense (medium): Consent‑gated, CLS‑safe reserved slots; skip on small viewports.
- UX tools (medium): Undo/redo, eyedropper, eraser, preset patterns; export PNG/SVG; sharable URL state.
- Perf & Quality (medium): Debounce summary/resize, precompute neighbors, perf marks; virtualize large grids.
- Accessibility & i18n (medium): Keyboard navigation, ARIA, contrast; string map scaffold.
- PWA (low): Manifest, icons, offline cache for static assets.
- Docs (ongoing): README, CONTRIBUTING, simple privacy policy.

## Entrypoints for New Work
- Consent: `assets/js/consent.js` (new) — banner UI, state, `onConsentChange(cb)`, dynamic script loading.
- Analytics: `assets/js/analytics.js` (new) — `initAnalytics(id)`, `trackEvent(name, params)` guarded by consent.
- Ads: `assets/js/ads.js` (new) — `initAds()` after ads consent; ensure reserved ad slots in `index.html`.
- SEO: Update `index.html` head; add `robots.txt`, `sitemap.xml` at project root.
- Weathering counter fix: Update `assets/js/main.js` (`paintTile`, `updateColorSummary`).
- Export/share: `assets/js/export.js` (new) for PNG/SVG and URL state encode/decode.

## Integration Placeholders
- GA4 Measurement ID: `G-XXXXXXXXXX`
- AdSense Publisher ID: `ca-pub-XXXXXXXXXXXX`
- Site canonical URL: `https://example.com/` (also used in sitemap and absolute OG image URL)

## Event Tracking Plan (GA4)
- `tile_painted`: { color, weathered: boolean }
- `auto_fill_used`: { rows, cols, weathering_intensity }
- `resize_grid`: { rows, cols }
- `weathering_toggled`: { enabled: boolean, intensity }
- `export_clicked`: { format: 'png' | 'svg' }

## Developer Pointers
- Grid constraints: width 5-50, height 5-30.
- Complementary color pairs used by the algorithm can be tuned in `assets/js/main.js`.
- Color summary should count by base palette color once the weathering fix is applied.
 - Weathering controls: `#weathering-enabled`, `#weathering-intensity`, `#weathering-intensity-value`; logic in `setupWeatheringControls()` and `applyWeathering()`.
