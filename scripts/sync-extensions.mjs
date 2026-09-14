#!/usr/bin/env node
/*
 * Pulls the extension registry index and icon assets from the
 * Melovian-Extensions repo so the site can render the gallery without a
 * runtime fetch. Re-run manually with `pnpm extensions:sync`; it also
 * runs on install, dev, and build hooks.
 *
 * Source resolution order:
 *   1. --extensions <dir> CLI arg
 *   2. MELOVIAN_EXTENSIONS_DIR env var
 *   3. ../Melovian-Extensions relative to this repo
 *
 * Writes src/lib/extensions/registry.json with icon and image fields
 * rewritten to site-absolute paths, and copies those assets into
 * static/extensions/<id>/. Both outputs are committed on purpose so the
 * site still builds and deploys when the registry checkout is not around.
 */

import { existsSync } from 'node:fs'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(new URL('.', import.meta.url)))
const outFile = path.join(root, 'src/lib/extensions/registry.json')
const assetDir = path.join(root, 'static/extensions')

const argIdx = process.argv.indexOf('--extensions')
const sourceDir =
  argIdx > -1 && process.argv[argIdx + 1]
    ? path.resolve(process.argv[argIdx + 1])
    : process.env.MELOVIAN_EXTENSIONS_DIR
      ? path.resolve(process.env.MELOVIAN_EXTENSIONS_DIR)
      : path.resolve(root, '../Melovian-Extensions')

const registryPath = path.join(sourceDir, 'registry.json')

async function writeFallback() {
  await mkdir(path.dirname(outFile), { recursive: true })
  if (!existsSync(outFile)) {
    await writeFile(
      outFile,
      JSON.stringify({ version: 1, generatedAt: null, source: null, extensions: [] }, null, 2) +
        '\n',
    )
  }
}

if (!existsSync(registryPath)) {
  console.warn(`extension registry not found at ${registryPath}`)
  console.warn('Set MELOVIAN_EXTENSIONS_DIR or pass --extensions <dir>. Skipping sync.')
  await writeFallback()
  process.exit(0)
}

const registry = JSON.parse(await readFile(registryPath, 'utf8'))
const entries = Array.isArray(registry.extensions) ? registry.extensions : []

// Rebuild the asset dir from scratch so removed extensions drop their files.
await rm(assetDir, { recursive: true, force: true })

const synced = []
for (const entry of entries) {
  const next = { ...entry }
  for (const key of ['icon', 'image']) {
    const rel = entry[key]
    if (typeof rel !== 'string' || rel === '') continue
    const source = path.join(sourceDir, rel)
    if (!existsSync(source)) {
      console.warn(`${entry.id}: ${key} points at missing file ${rel}`)
      continue
    }
    const dest = path.join(assetDir, entry.id, path.basename(rel))
    await mkdir(path.dirname(dest), { recursive: true })
    await cp(source, dest)
    next[key] = `/extensions/${entry.id}/${path.basename(rel)}`
  }
  synced.push(next)
}

const out = {
  version: registry.version ?? 1,
  generatedAt: registry.generatedAt ?? null,
  source: path.relative(root, sourceDir),
  extensions: synced,
}

await mkdir(path.dirname(outFile), { recursive: true })
await writeFile(outFile, JSON.stringify(out, null, 2) + '\n')
console.log(`synced ${synced.length} extensions from ${out.source}`)
