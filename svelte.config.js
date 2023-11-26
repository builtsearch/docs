import adapter from "@sveltejs/adapter-static";
import svelte_preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: [".svelte", ".md"],

	kit: {
		adapter: adapter({
			pages: "build",
			assets: "build",
			fallback: undefined,
			precompress: false,
			strict: true
		}),

		prerender: {
			entries: ["*"],
			handleMissingId: "warn"
		}
	},
	preprocess: [
		svelte_preprocess({
			scss: {}
		})
	]
};

export default config;
