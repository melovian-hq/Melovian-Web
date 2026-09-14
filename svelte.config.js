import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ pages: 'dist', assets: 'dist', strict: true }),
    // Deploys under a subpath (GitHub Pages project site) set BASE_PATH,
    // for example BASE_PATH=/Melovian-Web. Custom domains leave it empty.
    paths: { base: process.env.BASE_PATH || '' },
    // Every route is prerendered at build time; the site is fully static.
    prerender: { handleMissingId: 'warn' },
  },
}
