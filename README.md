# Hydraulic Floor Generator

A small, static web app to design hex‑tile "hydraulic" floors. Paint tiles manually or auto‑generate patterns.

## Quick Start
- Open `index.html` in a modern browser.
- Pick a color and click/drag to paint tiles.
- Adjust size with Width/Height, then click "Resize Floor".
- Click "Generate Beautiful Design" to auto‑fill the grid.

## Features
- Hexagonal grid with row offset (pure CSS/JS).
- Manual painting with live color summary.
- Auto-generate with clustering and neighbor-aware weighting.

## Tooling
- Run `npm install` to grab the dev tooling (Biome).
- `npm run format` formats JS, CSS, HTML, JSON, MD; use `npm run format:check` for CI-style validation without writing.
- `npm run lint` runs Biome's linter; `npm run check` combines lint + format checks.
- For automatic on-save formatting, enable the Biome extension in your editor (e.g. VS Code) and set it as the default formatter, or point your editor's format-on-save command to `biome format`.

## License
AGPL-3.0-or-later © 2025 Pedro Díaz Sanmartín. See `LICENSE`.
