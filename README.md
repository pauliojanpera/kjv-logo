# KJV logo

A simple web application for coloring the KJV logo SVG. Users can reassign predefined color categories to different elements of the logo, with the SVG dynamically updating based on their selections. Built with TypeScript, this project leverages modern web standards and includes offline support via a service worker.

## Features
- Display and scale the `kjv-logo.svg` to fit the browser window.
- Seven fixed colors (dark blue, light blue, transparent, black, yellow, green, white) assignable to SVG elements.
- Interactive UI with a list of element IDs; click an ID to open a color picker dialog.
- Offline caching using a service worker.
- TypeScript-based with strict type checking.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [pnpm](https://pnpm.io/) (installed globally: `npm install -g pnpm`)

## Installation
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd kjv-logo-coloring
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

## Usage
1. **Build the project**:
   ```bash
   pnpm run build
   ```
   This compiles the TypeScript files (`.mts`) to JavaScript (`.mjs`) and adjusts the service worker output.

2. **Serve the application**:
   Start the static server to view the app:
   ```bash
   pnpm start
   ```
   Open your browser to `http://localhost:8080`.

3. **Interact with the app**:
3. **Interact with the app**:
   - The SVG will load and scale to fit the window.
   - Click an element ID in the list under `#color-controls` (e.g., `#waves`) to open a color picker.
   - Select one of the 7 colors from the pop-up dialog to reassign it to the element.
   - Changes update the SVG in real-time.

4. **Deploy (optional)**:
   ```bash
   pnpm run deploy "Your commit message"
   ```
   This builds the project, commits changes, and pushes to the `main` branch. Adjust `scripts/deploy.sh` if your remote or branch differs.

## Project Structure
```
kjv-logo-coloring/
├── public/              # Static assets
│   ├── data/            # SVG file location
│   │   └── kjv-logo.svg # The logo SVG
│   ├── dist/            # Compiled JS (generated)
│   ├── index.html       # Main HTML entry point
│   ├── manifest.json    # Web app manifest
│   └── icon-192.png     # App icon
├── scripts/             # Build and deploy scripts
│   └── deploy.sh        # Deployment script
├── src/                 # Source code
│   ├── kjv-logo.mts     # Main app logic
│   └── service-worker.mts # Service worker logic
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## Development
- **Watch mode**: Rebuilds on file changes:
  ```bash
  pnpm run watch
  ```
- **TypeScript**: Uses `module: "NodeNext"` and `target: "esnext"` with strict type checking.
- **Dependencies**:
  - `typescript`: For compilation.
  - `tsc-alias`: Resolves `@/*` aliases in `src/`.
  - `nodemon`: Watches for changes in development.
  - `http-server`: Serves the static app locally.

## Notes
- The app relies on `kjv-logo.svg` having elements matching the IDs in `COLOR_GROUPS` (`#waves`, `#sky`, etc.).
- Colors are fixed but can be reassigned to any SVG element via the UI.
- Offline support is provided by the service worker, caching the SVG, HTML, and JS.

## License
This project is unlicensed by default. Add a `LICENSE` file if you wish to specify terms.

## Contributing
Feel free to fork and submit pull requests or open issues for bugs/features!