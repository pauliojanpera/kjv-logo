# Technical Reference: KJV logo coloring application
*Date: March 11, 2025*  
*Prepared for: Discussions with Grok 3 (xAI)*

## Overview
A TypeScript-based web application for reassigning colors to SVG elements within `kjv-logo.svg`. Key features include real-time SVG updates, offline support via a service worker, and deployment automation using GitHub Actions.

## Core components
- **Source files**:
  - `src/kjv-logo.mts`: Loads SVG, manages color assignments, and handles UI interactions.
  - `src/service-worker.mts`: Implements caching for offline access.
  - `public/index.html`: Entry point with embedded styles.
  - `public/data/kjv-logo.svg`: SVG asset with predefined element IDs (e.g., `#waves`, `#sky`). [Note: Present in codebase, omitted here.]
- **Configuration**:
  - `tsconfig.json`: `target: "esnext"`, `module: "NodeNext"`, `strict: true`.
  - `package.json`: Defines build (`tsc && tsc-alias`), serve (`http-server`), and deploy scripts.

## Implementation details
- **Color management**:
  - Fixed palette: 7 colors (`#434b72ff`, `#bfd5e2ff`, `#00000000`, `#231f20ff`, `#f3df59ff`, `#689674ff`, `#ffffffff`).
  - Initial assignments in `COLOR_GROUPS` (e.g., `#waves: "#434b72ff"`).
  - Dynamic updates via `updateElementColors`, overriding SVG `fill` and `stroke`.
- **SVG handling**:
  - Loaded via `fetch` and parsed with `DOMParser`.
  - Inline `style` attributes cleaned to ensure programmatic control.
  - Scaled with `preserveAspectRatio="xMidYMid meet"`.
- **UI interaction**:
  - Click events on SVG elements trigger a dialog (`#color-picker`) with color options.
  - Selected element highlighted with CSS `pulse` animation (red/white cycle).
  - Transparent color visualized as a checkerboard pattern.
- **Offline support**:
  - Service worker caches `index.html`, `dist/kjv-logo.mjs`, `data/kjv-logo.svg`, `icon-192.png`.
  - Fallback response on network failure: `503 Service Unavailable`.
- **Deployment**:
  - `scripts/deploy.sh`: Builds, commits, and pushes to `main`.
  - `.github/workflows/static.yml`: Deploys `public/` to GitHub Pages.

## Build process
- **Command**: `pnpm run build`.
- **Steps**: 
  1. `tsc`: Compiles `.mts` to `.mjs`.
  2. `tsc-alias`: Resolves `@/*` paths.
  3. Post-processing: Adjusts service worker output (`public/service-worker.js`).

## Dependencies
- `typescript`: Compilation.
- `tsc-alias`: Path resolution.
- `nodemon`: Watch mode.
- `http-server`: Local serving.

## Notes
- Assumes `kjv-logo.svg` exists with required IDs.
- No tests or persistence implemented—potential extension points.
- GitHub Pages URL pending deployment configuration.

## Usage with Grok 3
Reference this document to discuss enhancements, analyze code snippets, or evaluate architectural decisions. Specify files or features (e.g., "analyze `kjv-logo.mts` SVG logic") for targeted responses.