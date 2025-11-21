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

## Using in Moodle

### Step 1: Host the Built Files

After building, you need to host the component files somewhere accessible:

1. Upload the contents of the `dist/` folder to a web server or CDN
2. Note the base URL where the files are hosted (e.g.,
   `https://example.com/microsim/`)

### Step 2: Add to Moodle Page

In your Moodle page editor, switch to HTML mode and add (replace the v1.0.0 with
the desired version)

```html
<script type="module"
  src="https://cdn.jsdelivr.net/gh/tlambert03/microsim-web-component@v1.0.0/image-viewer.js">
</script>
<image-viewer img-url="https://cdn.jsdelivr.net/gh/tlambert03/microsim-web-component@v1.0.0/images"></image-viewer>

<!-- Load the web component -->
<script type="module" src="https://example.com/microsim/image-viewer.js"></script>

<!-- Use the component -->
<image-viewer img-url="https://cdn.jsdelivr.net/gh/user/repo@main/images"></image-viewer>
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
- `src/image-viewer.js` - Lit web component with slider and image display
- `src/public/images/` - Sample images (image0.png, image1.png, image2.png)
- `vite.config.js` - Dev server configuration
- `dist/` - Production build output (created by `npm run build`)
