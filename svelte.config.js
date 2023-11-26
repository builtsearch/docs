import adapter from "@sveltejs/adapter-auto";
import svelte_preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: [".svelte", ".md"],

	kit: {
		adapter: adapter(),

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
