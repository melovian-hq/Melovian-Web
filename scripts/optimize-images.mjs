#!/usr/bin/env node
/*
 * Pulls showcase screenshots from the Melovian repo into
 * assets-src/screenshots/, then converts everything under assets-src/
 * to WebP in static/. Runs as a postinstall/predev/prebuild hook and
 * skips work when outputs are newer than inputs. Keep raw PNGs out of
 * static/ so only the optimized files ship.
 *
 * Override the screenshot source with MELOVIAN_SHOWCASE_DIR or
 * --showcase <dir>. When the source is missing (deployed without the
 * repo checked out next to it) the committed assets-src/ copies are
 * used as-is.
 */

import './lib/env.mjs'
import { copyFile, mkdir, readdir, stat, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.dirname(fileURLToPath(new URL('.', import.meta.url)))
const jobs = [{ src: 'assets-src/screenshots', out: 'static/screenshots', quality: 82 }]

const flagIndex = process.argv.indexOf('--showcase')
const showcaseDir =
  process.env.MELOVIAN_SHOWCASE_DIR ??
  (flagIndex > -1 ? process.argv[flagIndex + 1] : path.join(root, '../Melovian/showcase'))

async function newerThan(file, other) {
  if (!existsSync(other)) return false
  const [a, b] = await Promise.all([stat(file), stat(other)])
  return b.mtimeMs >= a.mtimeMs
}

// Refresh the source PNGs from the main repo so the site always shows
// current screenshots.
const screenshotSrc = path.join(root, 'assets-src/screenshots')
if (existsSync(showcaseDir)) {
  await mkdir(screenshotSrc, { recursive: true })
  const upstream = (await readdir(showcaseDir)).filter((f) => f.endsWith('.png'))
  let copied = 0
  for (const file of upstream) {
    const dest = path.join(screenshotSrc, file)
    if (await newerThan(path.join(showcaseDir, file), dest)) continue
    await copyFile(path.join(showcaseDir, file), dest)
    copied++
  }
  for (const file of await readdir(screenshotSrc)) {
    if (file.endsWith('.png') && !upstream.includes(file)) {
      await unlink(path.join(screenshotSrc, file))
      console.log(`removed stale source ${file}`)
    }
  }
  if (copied) console.log(`synced ${copied} screenshot(s) from ${showcaseDir}`)
} else {
  console.log(`showcase dir ${showcaseDir} not found, using committed screenshots`)
}

let converted = 0
for (const job of jobs) {
  const srcDir = path.join(root, job.src)
  const outDir = path.join(root, job.out)
  if (!existsSync(srcDir)) continue
  await mkdir(outDir, { recursive: true })

  const pngs = (await readdir(srcDir)).filter((f) => f.endsWith('.png'))
  const wanted = new Set()

  for (const file of pngs) {
    const name = file.replace(/\.png$/, '.webp')
    wanted.add(name)
    const src = path.join(srcDir, file)
    const out = path.join(outDir, name)
    if (await newerThan(src, out)) continue
    await sharp(src).webp({ quality: job.quality }).toFile(out)
    converted++
    const [s, o] = await Promise.all([stat(src), stat(out)])
    console.log(
      `${file} -> ${name}  ${(s.size / 1024).toFixed(0)}k -> ${(o.size / 1024).toFixed(0)}k`,
    )
  }

  // Remove stale outputs whose source was deleted.
  for (const file of await readdir(outDir)) {
    if (file.endsWith('.webp') && !wanted.has(file)) {
      await unlink(path.join(outDir, file))
      console.log(`removed stale ${file}`)
    }
  }
}

console.log(converted ? `optimized ${converted} image(s)` : 'images up to date')
