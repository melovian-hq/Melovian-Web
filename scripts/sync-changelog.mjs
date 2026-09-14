#!/usr/bin/env node
/*
 * Fetches the GitHub releases Atom feed and caches it as
 * src/lib/changelog/releases.json. The cache is committed on purpose:
 * when the network or GitHub is unreachable the site still builds with
 * the last known releases. Runs on install, dev, and build hooks.
 *
 * Override the feed with MELOVIAN_RELEASES_FEED or --feed <url>.
 */

import './lib/env.mjs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(new URL('.', import.meta.url)))
const outFile = path.join(root, 'src/lib/changelog/releases.json')

const argIdx = process.argv.indexOf('--feed')
const feedUrl =
  argIdx > -1 && process.argv[argIdx + 1]
    ? process.argv[argIdx + 1]
    : (process.env.MELOVIAN_RELEASES_FEED ??
      'https://github.com/melovian-hq/Melovian/releases.atom')

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

function field(entry, tag) {
  const m = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return m ? m[1].trim() : null
}

function parseFeed(xml) {
  const entries = xml.split(/<entry>/).slice(1)
  return entries.map((entry) => {
    const body = entry.split(/<\/entry>/)[0]
    const link = body.match(/<link[^>]*href="([^"]+)"/)
    const id = field(body, 'id') ?? ''
    return {
      tag: id.split('/').pop() || (field(body, 'title') ?? 'release'),
      title: field(body, 'title') ?? 'Release',
      url: link ? link[1] : null,
      published: field(body, 'updated'),
      notes: decodeEntities(field(body, 'content') ?? ''),
    }
  })
}

async function main() {
  let xml
  try {
    const res = await fetch(feedUrl, {
      headers: { 'user-agent': 'melovian-web changelog sync' },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    xml = await res.text()
  } catch (err) {
    console.log(`release feed unreachable (${err.message}), keeping cached changelog`)
    return
  }

  const releases = parseFeed(xml).filter((r) => r.tag && r.published)
  if (releases.length === 0) {
    console.log('release feed parsed empty, keeping cached changelog')
    return
  }

  await mkdir(path.dirname(outFile), { recursive: true })
  await writeFile(
    outFile,
    JSON.stringify({ fetchedAt: new Date().toISOString(), source: feedUrl, releases }, null, 2) +
      '\n',
  )
  console.log(`synced ${releases.length} releases from ${feedUrl}`)
}

await main()
