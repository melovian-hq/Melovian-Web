#!/usr/bin/env node
/*
 * Pulls markdown docs from the Melovian repo into src/lib/docs/ so the
 * site can serve them without a runtime fetch. Re-run manually with
 * `pnpm docs:sync`; it also runs on install, dev, and build hooks.
 *
 * Source resolution order:
 *   1. --docs <dir> CLI arg
 *   2. MELOVIAN_DOCS_DIR env var
 *   3. ../Melovian/docs/en relative to this repo
 *
 * Writes src/lib/docs/manifest.json and src/lib/docs/content/<slug>.md.
 * Both are committed on purpose: the manifest and content act as the
 * local cache, so the site still builds and deploys when the Melovian
 * checkout is not around.
 */

import './lib/env.mjs'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(new URL('.', import.meta.url)))
const outDir = path.join(root, 'src/lib/docs')
const contentDir = path.join(outDir, 'content')

const argIdx = process.argv.indexOf('--docs')
const sourceDir =
  argIdx > -1 && process.argv[argIdx + 1]
    ? path.resolve(process.argv[argIdx + 1])
    : process.env.MELOVIAN_DOCS_DIR
      ? path.resolve(process.env.MELOVIAN_DOCS_DIR)
      : path.resolve(root, '../Melovian/docs/en')

// Sidebar order. Anything not listed appends alphabetically after these.
const ORDER = [
  'getting-started',
  'requirements',
  'features',
  'configuration',
  'docker',
  'build',
  'development',
]

function titleFrom(markdown, slug) {
  const h1 = markdown.match(/^#\s+(.+)$/m)
  if (h1) return h1[1].trim()
  return slug
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

if (!existsSync(sourceDir)) {
  console.warn(`docs source not found at ${sourceDir}`)
  console.warn('Set MELOVIAN_DOCS_DIR or pass --docs <dir>. Skipping sync.')
  if (!existsSync(path.join(outDir, 'manifest.json'))) {
    await mkdir(outDir, { recursive: true })
    await writeFile(
      path.join(outDir, 'manifest.json'),
      JSON.stringify({ syncedAt: null, source: null, docs: [] }, null, 2) + '\n',
    )
  }
  process.exit(0)
}

const files = (await readdir(sourceDir))
  .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
  .sort()

await mkdir(contentDir, { recursive: true })

// Drop stale copies so deletions upstream propagate.
for (const f of await readdir(contentDir)) {
  if (f.endsWith('.md') && !files.includes(f)) {
    await rm(path.join(contentDir, f))
    console.log(`removed stale ${f}`)
  }
}

const docs = []
for (const file of files) {
  const slug = file.replace(/\.md$/, '')
  const text = await readFile(path.join(sourceDir, file), 'utf8')
  docs.push({ slug, title: titleFrom(text, slug), file: `${slug}.md` })
  await writeFile(path.join(contentDir, `${slug}.md`), text)
}

docs.sort(
  (a, b) =>
    (ORDER.indexOf(a.slug) === -1 ? ORDER.length : ORDER.indexOf(a.slug)) -
    (ORDER.indexOf(b.slug) === -1 ? ORDER.length : ORDER.indexOf(b.slug)),
)

const manifest = {
  syncedAt: new Date().toISOString(),
  source: path.relative(root, sourceDir),
  docs,
}

await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(`synced ${docs.length} docs from ${manifest.source}`)
