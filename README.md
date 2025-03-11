# KJV logo coloring application

A web-based tool for reassigning colors to predefined elements of the KJV logo SVG, implemented with TypeScript and modern web standards. This project enables dynamic SVG manipulation, offline functionality via a service worker, and automated deployment through GitHub Actions.

## Purpose and functionality
The application renders the `kjv-logo.svg` in a browser, allowing users to select SVG elements (e.g., `#waves`, `#sky`) and assign one of seven predefined colors (dark blue, light blue, transparent, black, yellow, green, white). Color changes are applied in real-time, with offline support provided by a service worker. It serves as a practical utility for SVG customization and a demonstration of contemporary web development techniques.

## User instructions
### Online access
- **URL**: [Live at GitHub Pages](https://pauliojanpera.github.io/kjv-logo/) (to be updated post-deployment).
- **Usage**:
  1. Click an SVG element to activate a selection indicator (pulsing animation).
  2. Choose a color from the dialog (transparent rendered as a checkerboard pattern).
  3. Observe immediate updates to the SVG.
- **Offline mode**: Functional after initial load due to cached assets.

### Local execution
- **Prerequisites**: Node.js (v16+), pnpm (`npm install -g pnpm`).
- **Steps**:
  1. Clone: `git clone <repository-url>` && `cd kjv-logo-coloring`.
  2. Install: `pnpm install`.
  3. Build: `pnpm run build`.
  4. Serve: `pnpm start` → visit `http://localhost:8080`.

## Contributor guidelines
- **Setup**: Follow "Local Execution" above.
- **Structure**:
  - `src/kjv-logo.mts`: Core logic for SVG loading and color management.
  - `src/service-worker.mts`: Service worker for asset caching.
  - `public/`: Static assets (HTML, SVG, etc.).
- **Technologies**: TypeScript (strict), ES modules, service worker, GitHub Actions.
- **Contributions**: Enhance functionality (e.g., persistence), resolve issues, or refine documentation. Submit pull requests with clear commit messages.

## Technical highlights
- **TypeScript**: Employs strict typing and `NodeNext` module resolution.
- **SVG manipulation**: Dynamically updates element attributes, overriding inline styles.
- **Offline capability**: Service worker caches critical assets with fallback responses.
- **Static hosting**: Operates fully from a static server.
- **Automation**: GitHub Actions deploys to GitHub Pages on `main` branch updates.

## Notes
- Requires `kjv-logo.svg` with IDs matching `COLOR_GROUPS` (e.g., `#waves`).
- Colors are fixed but reassignable across elements.

## License
This project is licensed under the MIT License.
