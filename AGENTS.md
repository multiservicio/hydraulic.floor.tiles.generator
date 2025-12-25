# Hydraulic Floor Generator - Project Brief

## Overview
- Purpose: Interactive web app to design hex-tile hydraulic floors by painting tiles or auto-generating patterns.
- Stack: Static HTML/CSS/JS. No build tooling or server required.
- Run: Open `index.html` in a modern browser.

## Repository Map
- `index.html`: App shell and controls (size inputs, palette, grid, summary).
- `assets/css/styles.css`: Hex tile layout, responsive styles, UI polish.
- `assets/js/main.js`: `HydraulicFloorGenerator` (grid creation, interactions, auto-fill algorithm, summary).
- `docs/pseudo.md`: Pseudocode/spec for auto-generation algorithm.
- `NEXT_STEPS.md`: Roadmap and acceptance criteria for upcoming work.
- `biome.json`: Formatter/linter config (Biome).
- `package.json`: Dev tooling scripts (Biome).

## How It Works
- Hex grid: Rows of hex tiles; every other row is offset to form a honeycomb. Shapes are built with `:before`/`:after` triangles.
- Defaults: `gridRows` and `gridCols` default to 20 in `assets/js/main.js`, and the input values in `index.html` are overwritten on load.
- Painting: Mouse-based click and click-drag; selected palette color is applied to tile background and borders.
- Resizing: Width/height validated (Width 5-50, Height 5-30) before rebuilding the grid.
- Auto-generate: Accent clusters, then medium clusters, then weighted fill adjusted by neighbor colors and complement pairs.
- Summary: Counts colored tiles by reading inline styles; default color is `#ecf0f1` (tracked as `rgb(236, 240, 241)`).

## Known Issues / Notes
- Touch/pointer events are not wired; interactions use mouse events only.
- Auto-fill paints many tiles and updates the summary each time; consider batching if performance becomes an issue.

## Roadmap
- See `NEXT_STEPS.md` for the authoritative plan and acceptance criteria.

## Integration Placeholders
- GA4 Measurement ID: `G-XXXXXXXXXX`
- AdSense Publisher ID: `ca-pub-XXXXXXXXXXXX`
- Site canonical URL: `https://example.com/` (also used in sitemap and OG image URL)

## Event Tracking Plan (GA4)
- `tile_painted`: { color }
- `auto_fill_used`: { rows, cols }
- `resize_grid`: { rows, cols }
- `export_clicked`: { format: 'png' | 'svg' }

## Developer Pointers
- Keep palette definitions in `assets/js/main.js` synchronized with the palette UI in `index.html`.
- Complementary color pairs are defined in `assets/js/main.js`.
- Use Biome for formatting and linting (`npm run format`, `npm run lint`).
