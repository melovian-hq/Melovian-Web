# melovian-web

Marketing site for [Melovian](https://github.com/melovian-hq/Melovian), the open source music player for Subsonic-compatible servers and local folders.

Prerendered static site: SvelteKit + adapter-static + Svelte 5 (runes) + Tailwind CSS v4 + bits-ui + runed, with shadcn-svelte-style components and `@lucide/svelte` icons. Every page is rendered to plain HTML at build time into `dist/`; the client then hydrates for instant navigation.

## Commands

```bash
pnpm install     # install deps (enforces pnpm-workspace.yaml policies)
pnpm dev         # dev server with hot reload
pnpm build       # prerender all pages to dist/
pnpm preview     # serve the production build locally
pnpm check       # svelte-kit sync + svelte-check
pnpm lint        # eslint
pnpm format      # prettier
pnpm lighthouse  # build + Lighthouse CI assertions
```

## Configuration

Set the canonical origin in `.env`:

```bash
PUBLIC_SITE_URL=https://your-domain.example
```

That one value feeds `src/app.html` meta/canonical/OG URLs (via `%sveltekit.env.PUBLIC_SITE_URL%` tokens) and the `robots.txt`, `sitemap.xml`, and `llms.txt` routes prerendered from `src/routes/` server files.

## Content

All copy, links, feature lists, platform cards, screenshots, and FAQ entries live in `src/lib/constants.ts`. Sections and components read from there; do not hardcode strings in components.

`src/lib/components/ui/` holds shadcn-svelte-compatible primitives (button, badge, card, accordion, tabs, separator). New ones can be generated with `pnpm dlx shadcn-svelte@latest add <component>`; `components.json` is already configured for this project.

`src/lib/components/site/` holds landing sections (header, hero, features, screenshots, platforms, FAQ, CTA, footer). `src/lib/components/docs/` holds the docs UI.

Theming: `src/app.css` defines light/dark CSS variables consumed through the `@theme inline` mapping. The theme toggle persists to localStorage via runed `PersistedState`; the inline script in `src/app.html` applies the class before first paint.

## Supply-chain policy

`pnpm-workspace.yaml` pins the security posture (pnpm 11 reads config here, not `.npmrc`):

- `minimumReleaseAge: 2880` skips releases younger than 2 days
- `trustPolicy: no-downgrade` rejects versions with weaker publish attestations than earlier releases (this already caught `chokidar@4.0.3`; see the `overrides` pin to `4.0.1`)
- `blockExoticSubdeps` keeps transitive deps on registry sources
- `strictDepBuilds` + `allowBuilds` gate dependency install scripts
- `verifyStoreIntegrity`, `verifyDepsBeforeRun: error`

To add a dependency, use `pnpm add <pkg>`; if it legitimately needs a build script, approve it in `allowBuilds` after reviewing what it runs.

## Docs

`pnpm docs:sync` pulls the markdown guides from the Melovian repo into `src/lib/docs/` (manifest + content). It runs automatically on install, dev, and build. Point it elsewhere with `MELOVIAN_DOCS_DIR=/path/to/docs` or `--docs <dir>`. The synced files are committed so the site deploys without the source repo.

Docs render at `/docs/<slug>` as real prerendered pages (crawlable, in the sitemap), with a sidebar, per-page table of contents, prev/next links, and fuzzy search (Cmd+K or /).

Screenshots are refreshed from `../Melovian/showcase` and converted to WebP in `static/` on every build (`MELOVIAN_SHOWCASE_DIR` or `--showcase <dir>` overrides). Keep source PNGs out of `static/`.

## Extensions

`pnpm extensions:sync` pulls the registry index from the Melovian-Extensions repo into `src/lib/extensions/registry.json` and copies icons into `static/extensions/`. It runs automatically on install, dev, and build. Point it elsewhere with `MELOVIAN_EXTENSIONS_DIR=/path/to/repo` or `--extensions <dir>`.

The gallery renders at `/extensions`. The app fetches the same index for remote installs and verifies package sha256 before unpacking.

## Deploy

Any static host works: `pnpm build`, publish `dist/`. Remember to set `PUBLIC_SITE_URL` for the real domain so canonical and OG URLs are absolute and correct.

## Credits

Navidrome, Airsonic, and Jellyfin icons in the compatibility strip come from [selfh.st/icons](https://selfh.st/icons) (CC-BY-4.0).
