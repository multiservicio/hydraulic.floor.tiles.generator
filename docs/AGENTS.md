# Hydraulic Floor Generator — Project Brief

## Overview
- Purpose: Interactive web app to design hex‑tile hydraulic floors by painting tiles manually or generating patterns automatically, with optional weathering (subtle per‑tile variation).
- Stack: Static site with plain HTML/CSS/JS. No build tooling or server required.
- Run: Open `index.html` in any modern browser.

- `index.html`: App shell and controls (size inputs, palette, grid, summary, effects).
- `assets/css/styles.css`: Hex tile layout (CSS pseudo‑elements), responsive styles, UI polish.
- `assets/js/main.js`: Main logic in `HydraulicFloorGenerator` class (grid creation, interactions, auto‑fill algorithm, color summary).
- `docs/pseudo.md`: Pseudocode/spec for the auto‑generation algorithm and potential enhancements (e.g., weathering).

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
- Touch/pointer events: Current interactions use mouse events only; consider pointer events for better mobile support.

## Roadmap / TODOs
- Add save/load (e.g., localStorage, JSON export/import).
- Add image export (rasterize grid to PNG via canvas).
- Add undo/redo and an eyedropper tool.
- Improve accessibility (focus styles, keyboard painting, labels).
- Performance review for large grids; consider lightweight virtualisation if needed.

## Developer Pointers
- Grid constraints: width 5-50, height 5-30.
- Complementary color pairs used by the algorithm can be tuned in `assets/js/main.js`.
- Color summary counts tiles by inline `backgroundColor`; default/unpainted tiles are ignored.
 - Weathering controls: `#weathering-enabled`, `#weathering-intensity`, `#weathering-intensity-value`; logic in `setupWeatheringControls()` and `applyWeathering()`.
