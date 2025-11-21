# Microsim Web Component

[![Release](https://img.shields.io/github/v/release/tlambert03/microsim-web-component)](https://github.com/tlambert03/microsim-web-component/releases)
[![Build and Release](https://github.com/tlambert03/microsim-web-component/actions/workflows/release.yml/badge.svg)](https://github.com/tlambert03/microsim-web-component/actions/workflows/release.yml)

A minimal Lit.js web component example using WebAwesome UI components.

## Setup for Development

If you don't have Node.js installed, download it from
[nodejs.org](https://nodejs.org/), or run `brew install node` if you use
Homebrew on macOS.

Then clone this repo (or fork it and clone your fork), cd in this project
directory, and run:

```bash
npm install
npm run dev
```

This will open `http://localhost:5173/` in your browser.

## Creating a Release

Maintainers can create a new release by clicking the button below:

[![Create
Release](https://img.shields.io/badge/Create%20Release-blue?style=for-the-badge)](https://github.com/tlambert03/microsim-web-component/actions/workflows/release.yml)

Click **Run workflow**, enter a version tag (e.g., `v1.0.0`), and the built
files will be attached to a new GitHub release.

## Usage

### Basic Usage

The component automatically detects where it's loaded from and looks for images in
an `images/` folder relative to the script. Simply add the component and script
tag (replace `vX.Y.Z` with the desired version):

```html
<microsim-viewer></microsim-viewer>
<!-- alternatively... for pages that purify HTML and remove custom elements: -->
<div data-component="microsim-viewer"></div>

<script type="module" src="https://cdn.jsdelivr.net/gh/tlambert03/microsim-web-component@vX.Y.Z/dist/microsim-viewer.js"></script>
```

### Troubleshooting

- **Component not loading**: Check browser console for CORS errors. Ensure your
  hosting server allows cross-origin requests.
- **Images not displaying**: Verify image paths are correct relative to where
  the component is hosted.
- **Styling issues**: The component uses Shadow DOM, so external CSS won't
  affect its internal styles.

## Project Structure

- `index.html` - Entry point for testing the component
- `src/microsim-viewer.js` - Lit web component with slider and image display
- `src/public/images/` - Sample images (image0.png, image1.png, image2.png)
- `vite.config.js` - Dev server configuration
- `dist/` - Production build output (created by `npm run build`)
