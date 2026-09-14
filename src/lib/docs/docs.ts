import manifestJson from './manifest.json'
import { renderMarkdown } from '../markdown'

export type DocMeta = {
  slug: string
  title: string
  file: string
}

export type DocsManifest = {
  syncedAt: string | null
  source: string | null
  docs: DocMeta[]
}

export const manifest = manifestJson as DocsManifest
export const DOCS = manifest.docs

// Raw markdown bodies, bundled at build time from src/lib/docs/content/.
const rawModules = import.meta.glob('./content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const rawBySlug = new Map<string, string>()
for (const [path, raw] of Object.entries(rawModules)) {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  rawBySlug.set(slug, raw)
}

export function docRaw(slug: string): string | null {
  return rawBySlug.get(slug) ?? null
}

export function docHtml(slug: string): string | null {
  const raw = docRaw(slug)
  return raw === null ? null : renderMarkdown(raw)
}

export function docPager(slug: string): {
  prev: DocMeta | null
  next: DocMeta | null
} {
  const i = DOCS.findIndex((d) => d.slug === slug)
  return {
    prev: i > 0 ? DOCS[i - 1] : null,
    next: i >= 0 && i < DOCS.length - 1 ? DOCS[i + 1] : null,
  }
}

export function editUrl(slug: string): string {
  return `https://github.com/melovian-hq/Melovian/blob/main/docs/en/${slug}.md`
}

export type SearchEntry = {
  slug: string
  docTitle: string
  kind: 'page' | 'heading' | 'text'
  title: string
  anchor: string | null
  body: string
}

function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
}

// One entry per page, per h2/h3 heading, and per body chunk between
// headings so fuzzy hits can deep-link to the right heading.
export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = []
  for (const doc of DOCS) {
    const raw = docRaw(doc.slug)
    if (!raw) continue
    entries.push({
      slug: doc.slug,
      docTitle: doc.title,
      kind: 'page',
      title: doc.title,
      anchor: null,
      body: plainText(raw),
    })
    const sections = raw.split(/^(?=#{2,3}\s)/m)
    let currentAnchor: string | null = null
    for (const section of sections) {
      const h = section.match(/^#{2,3}\s+(.+)$/m)
      if (h) currentAnchor = slugify(h[1])
      const body = plainText(section)
      if (!body) continue
      entries.push({
        slug: doc.slug,
        docTitle: doc.title,
        kind: h ? 'heading' : 'text',
        title: h ? h[1].trim() : doc.title,
        anchor: currentAnchor,
        body: body.slice(0, 600),
      })
    }
  }
  return entries
}
