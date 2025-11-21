import { resolve } from "node:path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default {
	publicDir: "src/public",
	plugins: [cssInjectedByJsPlugin()],
	server: {
		open: true,
	},
	build: {
		lib: {
			entry: resolve(__dirname, "src/microsim-viewer.js"),
			name: "ImageViewer",
			fileName: "microsim-viewer",
			formats: ["es"],
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
	},
};
