# Microsim Web Component

A minimal Lit.js web component example using WebAwesome UI components.

## Setup

```bash
npm install
npm run dev
```

## Structure

- `index.html` - Entry point
- `src/image-viewer.js` - Lit web component with slider and image display
- `src/style.css` - Minimal global styles
- `src/public/images/` - Sample images (image0.png, image1.png, image2.png)
- `vite.config.js` - Dev server configuration

## Key Patterns

**Lit Component**: Uses `LitElement` base class with decorators for reactive properties
**WebAwesome**: Imports pre-built slider component from `@awesome.me/webawesome`
**Vite**: Zero-config dev server with hot module replacement

Add your own PNG images to `src/public/images/` and update the `images` array in `src/image-viewer.js`.
