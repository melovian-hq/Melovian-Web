#!/usr/bin/env node
/*
 * Generates one 1200x630 Open Graph card per page into static/og/.
 * Pages reference them through og:image meta tags. Runs on install,
 * dev, and build hooks.
 *
 * satori lays out the card and bakes text to paths with the bundled
 * Inter woff files, resvg rasterizes to PNG. No system fonts needed,
 * so output is deterministic on any host.
 */

import './lib/env.mjs'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const root = path.dirname(fileURLToPath(new URL('.', import.meta.url)))
const outDir = path.join(root, 'static/og')
const fontDir = path.join(root, 'node_modules/@fontsource/inter/files')

const W = 1200
const H = 630

const font = (weight) =>
  readFile(path.join(fontDir, `inter-latin-${weight}-normal.woff`)).then((data) => ({
    name: 'Inter',
    data,
    weight,
    style: 'normal',
  }))

const fonts = await Promise.all([font(400), font(500), font(600), font(700)])

// Logo mark rasterized once, then embedded as an image in each card.
const logoSvg = await readFile(path.join(root, 'static/logo-mark.svg'))
const logoPng = new Resvg(logoSvg, { fitTo: { mode: 'width', value: 144 } }).render().asPng()
const logoUri = `data:image/png;base64,${logoPng.toString('base64')}`

// Deterministic equalizer bars so every card shares the hero motif.
const BAR_HEIGHTS = [
  18, 34, 52, 30, 64, 44, 22, 58, 40, 26, 66, 36, 20, 48, 60, 28, 42, 54, 24, 38, 50, 32, 46, 16,
]

const bar = (h, i) => ({
  type: 'div',
  props: {
    style: {
      width: '12px',
      height: `${h}px`,
      borderRadius: '6px',
      background: '#a468f3',
      opacity: 0.25 + (i % 5) * 0.15,
    },
  },
})

function card({ title, sub }) {
  const size = title.length <= 18 ? 76 : title.length <= 30 ? 60 : 48
  return {
    type: 'div',
    props: {
      style: {
        width: W,
        height: H,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #16111f 55%, #1d1428 100%)',
        padding: '72px 80px 64px',
        fontFamily: 'Inter',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: '20px' },
            children: [
              { type: 'img', props: { src: logoUri, width: 64, height: 64 } },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#a1a1aa',
                    letterSpacing: '6px',
                  },
                  children: 'MELOVIAN',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '20px' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: `${size}px`,
                    fontWeight: 700,
                    color: '#f5f5f5',
                    letterSpacing: '-2px',
                    lineHeight: 1.1,
                  },
                  children: title,
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: '30px', fontWeight: 400, color: '#a1a1aa' },
                  children: sub,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'flex-end', gap: '10px', height: '80px' },
                  children: BAR_HEIGHTS.map(bar),
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: '22px', fontWeight: 500, color: '#71717a' },
                  children: 'melovian',
                },
              },
            ],
          },
        },
      ],
    },
  }
}

const docManifest = JSON.parse(
  await readFile(path.join(root, 'src/lib/docs/manifest.json'), 'utf8'),
)

const pages = [
  { file: 'docs', title: 'Documentation', sub: 'Install, configure, and run it anywhere' },
  ...docManifest.docs.map((d) => ({
    file: `docs-${d.slug}`,
    title: d.title,
    sub: 'Melovian documentation',
  })),
  { file: 'extensions', title: 'Extensions', sub: 'Audited community packages for the player' },
  { file: 'changelog', title: 'Changelog', sub: 'Every release, newest first' },
]

await mkdir(outDir, { recursive: true })
for (const p of pages) {
  const svg = await satori(card(p), { width: W, height: H, fonts })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng()
  await writeFile(path.join(outDir, `${p.file}.png`), png)
  console.log(`og/${p.file}.png`)
}
