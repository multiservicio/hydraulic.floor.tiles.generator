# Hydraulic Floor Generator

Interactive, static web app to design hex-tile "hydraulic" floors. Paint tiles manually or auto-generate patterns with a neighbor-aware algorithm.

## Quick Start
- Open `index.html` in a modern browser.
- Pick a color and click/drag on tiles to paint.
- Adjust size with Width/Height, then click "Resize Floor".
- Click "Generate Beautiful Design" to auto-fill the grid.

## Features
- Hexagonal grid with alternating row offsets (pure HTML/CSS/JS).
- Manual painting with live color summary.
- Auto-generation with clustering and neighbor-weighted randomness.
- Responsive layout for smaller screens.

## How It Works
- The grid is a stack of rows; every other row gets an offset to form a honeycomb.
- Hex tiles are drawn using CSS pseudo-elements (`:before`/`:after`).
- Auto-generation places accent clusters first, then medium clusters, then fills remaining tiles with weighted colors influenced by neighbors and complement pairs.
- The color summary reads inline tile styles and aggregates counts by color.

## Project Structure
- `index.html`: App shell, controls, palette, and summary.
- `assets/css/styles.css`: Hex tile styling and UI layout.
- `assets/js/main.js`: `HydraulicFloorGenerator` logic.
- `docs/pseudo.md`: Pseudocode/spec for the auto-generation algorithm.
- `NEXT_STEPS.md`: Roadmap and acceptance criteria.

## Development
No build step is required; open the HTML file directly. Optional tooling:
- `npm install`
- `npm run format` / `npm run format:check`
- `npm run lint`
- `npm run check`

## Notes
- Interactions are mouse-based only; pointer/touch events are not wired yet.
- The grid defaults to 20x20 from `assets/js/main.js`; input values in `index.html` are overwritten on load.

## License
AGPL-3.0-or-later. See `LICENSE`.
