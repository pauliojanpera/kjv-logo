# Technical reference: KJV logo coloring application
*Date: March 11, 2025*  
*Prepared for: Discussions with Grok 3 (xAI)*

## Overview
A TypeScript-powered web app for dynamically reassigning colors to SVG elements in `kjv-logo.svg`. Lean as hell, but built with fierce ambition—real-time interactivity, offline grit, and automated deployment, all in a modern, extensible frame.

## Core components
- **Source files**:
  - `src/kjv-logo.mts`: Runs SVG loading, color reassignment, UI logic—tight, modular, scalable. Now includes service worker registration.
  - `src/service-worker.mts`: Caches assets, intercepts fetches—key for offline and data flow, not the whole show.
  - `public/index.html`: Bare entry with styles and module kicks.
  - `public/data/kjv-logo.svg`: SVG with IDs (e.g., `#waves`, `#sky`) for precise control. [Omitted here, in codebase.]
- **Configuration**:
  - `tsconfig.json`: `esnext`, `nodenext`, `strict: true`—modern, safe, no compromise.
  - `package.json`: Lean scripts: build (`tsc && tsc-alias`), serve (`http-server`), deploy—pure efficiency.

## Implementation details
- **Dynamic SVG control**:
  - Fetches `kjv-logo.svg`, parses with `DOMParser`, rewires `fill`/`stroke` live.
  - Scales via `preserveAspectRatio="xMidYMid meet"`.
- **Color system**:
  - 7 colors: `#434b72ff`, `#bfd5e2ff`, `#00000000`, `#231f20ff`, `#f3df59ff`, `#689674ff`, `#ffffffff`.
  - `COLOR_GROUPS` maps IDs to colors, updated with `updateElementColors`.
- **UI**:
  - Click-to-color dialog (`#color-picker`), pulsing highlights, checkerboard transparency—clean, no fluff.
- **Service worker**:
  - Registers early in `src/kjv-logo.mts`, caches `index.html`, `dist/kjv-logo.mjs`, `data/kjv-logo.svg`, `icon-192.png`, intercepts fetches.
  - Network-first, cache fallback—flexible for bigger data roles.
- **Deployment**:
  - `scripts/deploy.sh`: Builds, ships to `main`.
  - `.github/workflows/static.yml`: Pushes `public/` to GitHub Pages—automated, relentless.

## Service worker registration
- **Implementation**:
  - Added to `src/kjv-logo.mts` with `registerServiceWorker()` function.
  - Executes on app initialization before SVG loading.
  - Path: Registers `/service-worker.js` (post-build location).
  - Scope: `/kjv-logo/` aligns with `manifest.json` `start_url`.
- **Assumptions**:
  - Service worker file is moved to `public/service-worker.js` by build script (`package.json`).
  - Scope matches GitHub Pages deployment context (`/kjv-logo/`).
  - Early registration ensures offline capability is available before other operations.
- **Behavior**:
  - Checks for browser support (`'serviceWorker' in navigator`).
  - Logs success or failure to console for debugging.
  - Fallback: Warns if service workers aren’t supported.

## Cache Busting Strategy
- **Approach**: UUID-based cache naming + forced service worker updates.
- **Implementation**:
  - `./scripts/postbuild.js` generates a UUID per build, injects it into `CACHE_NAME` in `service-worker.mts` and `kjv-logo.mts`.
  - Service worker uses `kjv-logo-<UUID>` as cache name, cleans old caches on activation.
  - `kjv-logo.mts` forces new service worker to skip waiting and activate immediately.
- **Build Integration**:
  - `package.json` `build` script runs `tsc && tsc-alias && node ./scripts/postbuild.js`.
  - Post-build script handles UUID injection and file cleanup.
- **Benefits**: Automatic, unique cache per deployment; no manual versioning; ensures fresh content.
- **Notes**: Old caches persist until activation; users may need a refresh for immediate updates.

## Architectural vision
Lean but mean—this is built to roar:
- **Real-time power**: SVG tweaks are the start—think live updates, user-driven customization, data-driven visuals.
- **Offline backbone**: Service worker keeps it running anywhere, ready for full PWA status.
- **Extensibility**: TypeScript and ES modules scream for persistence, APIs, multi-user tricks—bring it.
- **Automation**: GitHub Actions ships it fast, no babysitting.
- **Lean, not weak**: Small footprint, huge potential—every line’s a launchpad.

## Build process
- **Command**: `pnpm run build`.
- **Steps**: 
  1. `tsc`: `.mts` to `.mjs`.
  2. `tsc-alias`: Path resolution.
  3. Post-processes `service-worker.js` for static hosting.

## Dependencies
- `typescript`: Hardcore compilation.
- `tsc-alias`: Path smarts.
- `nodemon`: Dev speed.
- `http-server`: Local proving ground.

## Notes
- Assumes `kjv-logo.svg` with matching IDs.
- Service worker registration in `src/kjv-logo.mts`—no delays, tight execution.
- Untapped: persistence, testing, dynamic data—expansion bait.

## Notes for Grok 3 (Self-Instructions)
- **Recording Process**: 
  - Document the *current implementation state* and *key technical decisions* in `REFERENCE.md`.
  - Focus on: architecture, critical configurations, and actionable usage notes.
  - Avoid exhaustive change history; only include updates that reflect the latest setup or significant design choices.
  - Update existing sections rather than appending redundant details; keep it concise to fit context limits.
- **Format**: Use clear headings, bullet points, and minimal code snippets (only when essential for clarity).
- **Scope**: Align with the project’s lean, modern ethos—prioritize practicality over verbosity.
- **User Updates**: If the user modifies files (e.g., "I updated X"), acknowledge and integrate their changes into the current state description without duplicating their work.