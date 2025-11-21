import { resolve } from "node:path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default {
	publicDir: "src/public",
	// cssInjectedByJsPlugin includes CSS in the JS bundle
	// (so we can serve a single JS file)
	plugins: [cssInjectedByJsPlugin()],
	server: {
		open: true,
	},
	build: {
		lib: {
			entry: resolve(__dirname, "src/image-viewer.js"),
			name: "ImageViewer",
			fileName: "image-viewer",
			formats: ["es"],
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
		cssCodeSplit: false,
		copyPublicDir: true,
	},
};
