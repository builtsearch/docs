<script>
import "@svelteness/kit-docs/client/polyfills/index.js";
import "@svelteness/kit-docs/client/styles/normalize.css";
import "@svelteness/kit-docs/client/styles/fonts.css";
import "@svelteness/kit-docs/client/styles/theme.css";
import "@svelteness/kit-docs/client/styles/vars.css";
import "../app.css";
import { page } from "$app/stores";

import { Button, KitDocs, KitDocsLayout, createSidebarContext } from "@svelteness/kit-docs";

/** @type {import('./$types').LayoutData} */
export let data;

$: ({ meta, sidebar } = data);

/** @type {import('@svelteness/kit-docs').NavbarConfig} */
const navbar = {
	links: [{ title: "Documentation", slug: "/docs", match: /\/docs/ }]
};

const { activeCategory } = createSidebarContext(sidebar);

$: category = $activeCategory ? `${$activeCategory}: ` : "";
$: title = meta ? `${category}${meta.title} | BuiltSearch Docs` : null;
$: description = meta?.description;
</script>

<svelte:head>
	{#key $page.url.pathname}
		{#if title}
			<title>{title}</title>
		{/if}
		{#if description}
			<meta name="description" content={description} />
		{/if}
	{/key}
</svelte:head>

<KitDocs {meta}>
	<KitDocsLayout {navbar} {sidebar}>
		<div class="logo" slot="navbar-left">
			<a class="header_logo" href="/">
				<img src="/logo_dev.svg" alt="BuiltSearch Logo" />
				<span>Developer Docs</span>
			</a>
		</div>

		<slot />
	</KitDocsLayout>
</KitDocs>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap");
:global(:root) {
	--kd-color-brand-rgb: 0, 150, 255;
	--kd-color-brand: 0 150 255;

	// --kd-color-brand: 255, 133, 0;
}

:global(:root.dark) {
	--kd-color-brand-rgb: 213, 149, 76;
	--kd-color-brand: 0 150 255;
	// --kd-color-brand: 71, 147, 209;
}

.logo :global(a) {
	display: flex;
	align-items: center;
	justify-content: center;
}

.logo :global(svg) {
	height: 36px;
	overflow: hidden;
}

.header_logo {
	display: flex;
	gap: 0.5rem;
	font-family: "Montserrat";
	img {
		height: 48px;
	}
	span {
		font-size: 1.25rem;
	}
}
</style>
