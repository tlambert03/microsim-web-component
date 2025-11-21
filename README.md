# Microsim Web Component

[![Release](https://img.shields.io/github/v/release/tlambert03/microsim-web-component)](https://github.com/tlambert03/microsim-web-component/releases)
[![Build and Release](https://github.com/tlambert03/microsim-web-component/actions/workflows/release.yml/badge.svg)](https://github.com/tlambert03/microsim-web-component/actions/workflows/release.yml)

A web component for viewing Microsim images.

## Setup for Development

> If you don't have `node` and/or `gh` installed run `brew install node gh`.

Clone this repo (or fork it and clone your fork), cd in this project
directory, and run:

```bash
gh repo clone tlambert03/microsim-web-component  # or your fork
cd microsim-web-component
npm install
```

Now, to run the development server with hot-reloading, run:

```bash
npm run dev
```

This will open `http://localhost:5173/` in your browser.

## Creating a Release

Maintainers can create a new release by clicking the button below:

[![Create
Release](https://img.shields.io/badge/Create%20Release-blue?style=for-the-badge)](https://github.com/tlambert03/microsim-web-component/actions/workflows/release.yml)

Click **Run workflow**, enter a version tag (e.g., `v1.0.0`), and the built
files will be attached to a new [GitHub release](https://github.com/tlambert03/microsim-web-component/releases).

## Usage

To embed the `microsim-viewer` web component in your HTML page, include the following snippet in your HTML file, replacing `vX.Y.Z` with the desired version number:

```html
<microsim-viewer></microsim-viewer>
<script type="module" src="https://cdn.jsdelivr.net/gh/tlambert03/microsim-web-component@vX.Y.Z/dist/microsim-viewer.js"></script>
```

> [!NOTE]
> For CMS platforms that do not allow custom elements directly in HTML, you can
> use a `div` with a `data-component` attribute as shown below:
>
> ```html
> <div data-component="microsim-viewer"></div>
> <script type="module" src="https://cdn.jsdelivr.net/gh/tlambert03/microsim-web-component@vX.Y.Z/dist/microsim-viewer.js"></script>
> ```

### Troubleshooting

- **Component not loading**: Check browser console for errors. Ensure your
  hosting server allows cross-origin requests.  Open an issue.

## Project Structure

- `index.html` - Entry point for testing the component
- `src/microsim-viewer.js` - Lit web component with slider and image display
- `src/public/images/` - Pre-generated images loaded by viewer
- `package.json` - Javascript dependencies and metadata
- `pyproject.toml` - Python dependencies and metadata
- `vite.config.js` - Dev server configuration
- `scripts/` - Python scripts for image generation
