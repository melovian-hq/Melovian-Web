/*
 * Vendored copy of the Melovian-Extensions registry index, synced by
 * scripts/sync-extensions.mjs. registry.json is regenerated on install,
 * dev, and build; do not edit it by hand.
 */
import registryJson from './registry.json'
import { LINKS, SITE_URL } from '$lib/constants'

type RegistryPackage = {
  url: string
  sha256: string
  bytes: number
  signature?: string
}

type RegistryCapabilities = {
  script: boolean
  wasm: boolean
  styles: number
  appTheme: boolean
  trackRules: number
  playerHooks: number
}

type RegistryAudit = {
  status: 'pass'
  warnings: string[]
}

type RegistryVersion = {
  version: string
  url: string
  sha256: string
  bytes: number
  signature?: string
  releasedAt?: string
  notes?: string
}

type RegistryChangelog = {
  version: string
  date?: string
  notes?: string
}

export type RegistryEntry = {
  id: string
  name: string
  version: string
  description?: string
  author?: string
  homepage?: string
  license?: string
  tags?: string[]
  icon?: string
  image?: string
  screenshots?: string[]
  risk?: 'low' | 'medium' | 'high'
  externalUrls?: string[]
  permissions?: string[]
  minAppVersion?: string
  requires?: string[]
  delisted?: { reason: string; at: string }
  versions?: RegistryVersion[]
  changelog?: RegistryChangelog[]
  package: RegistryPackage
  capabilities: RegistryCapabilities
  audit: RegistryAudit
}

export type RegistryIndex = {
  version: number
  generatedAt: string | null
  source: string | null
  extensions: RegistryEntry[]
}

export const REGISTRY = registryJson as RegistryIndex
export const EXTENSIONS = REGISTRY.extensions

export function findExtension(id: string): RegistryEntry | undefined {
  return EXTENSIONS.find((entry) => entry.id === id)
}

export function extensionSourceUrl(id: string): string {
  return `${LINKS.extensionsRepo}/tree/master/extensions/${id}`
}

// melovian://install-extension/<id> opens the desktop app straight into the
// extensions tab with an install prompt.
export function deepLinkUrl(id: string): string {
  return `melovian://install-extension/${id}`
}

function extensionPageUrl(id: string): string {
  return `/extensions/${id}`
}

export function capabilityBadges(entry: RegistryEntry): string[] {
  const caps = entry.capabilities
  const out: string[] = []
  if (caps.trackRules > 0) out.push(`${caps.trackRules} rules`)
  if (caps.styles > 0) out.push(`${caps.styles} styles`)
  if (caps.script) out.push('script')
  if (caps.wasm) out.push('wasm')
  if (caps.appTheme) out.push('theme')
  return out
}

export type CapabilityDetail = { label: string; explain: string }

// Clickable capability chips on the extension page get a plain-language
// explanation each.
export function capabilityDetails(entry: RegistryEntry): CapabilityDetail[] {
  const caps = entry.capabilities
  const out: CapabilityDetail[] = []
  if (caps.trackRules > 0)
    out.push({
      label: `${caps.trackRules} rules`,
      explain: 'CSS rules that restyle matching tracks, like badges or progress bars.',
    })
  if (caps.styles > 0)
    out.push({
      label: `${caps.styles} styles`,
      explain: 'Stylesheets injected into the player interface.',
    })
  if (caps.script)
    out.push({
      label: 'script',
      explain: 'A sandboxed TypeScript entry point. It cannot reach the network or filesystem.',
    })
  if (caps.wasm)
    out.push({
      label: 'wasm',
      explain: 'A compiled WebAssembly module running inside the same sandbox.',
    })
  if (caps.appTheme)
    out.push({
      label: 'theme',
      explain: 'Can restyle the whole app chrome, not just track rows.',
    })
  return out
}

// Badge colors per risk level.
export function riskBadgeClass(risk: RegistryEntry['risk']): string {
  if (risk === 'high') return 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400'
  if (risk === 'medium')
    return 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'
  return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`
}

export function releasedDate(entry: RegistryEntry): string {
  return entry.versions?.[0]?.releasedAt ?? entry.changelog?.[0]?.date ?? ''
}

// Extensions sharing at least one tag with entry, ranked by overlap.
export function relatedExtensions(entry: RegistryEntry | undefined, limit = 3): RegistryEntry[] {
  if (!entry?.tags?.length) return []
  const wanted = new Set(entry.tags)
  return EXTENSIONS.filter((other) => other.id !== entry.id)
    .map((other) => ({
      other,
      shared: (other.tags ?? []).filter((tag) => wanted.has(tag)).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared || a.other.name.localeCompare(b.other.name))
    .slice(0, limit)
    .map(({ other }) => other)
}

// Every unique tag across the registry, sorted.
export function allTags(): string[] {
  const tags = new Set<string>()
  for (const entry of EXTENSIONS) {
    for (const tag of entry.tags ?? []) tags.add(tag)
  }
  return [...tags].sort()
}

// Author names are free-form in manifests, so author pages key on a
// slugified form. Two names that slugify the same share one page.
export function authorSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'unknown'
  )
}

// Route template for author pages. Pair with resolve():
// resolve('/extensions/author/[slug]', { slug: authorSlug(name) })
export const AUTHOR_ROUTE = '/extensions/author/[slug]'

// Unique author slugs for prerendering.
export function authorSlugs(): string[] {
  const slugs = new Set<string>()
  for (const entry of EXTENSIONS) {
    if (entry.author) slugs.add(authorSlug(entry.author))
  }
  return [...slugs].sort()
}

export function extensionsByAuthorSlug(slug: string): RegistryEntry[] {
  return EXTENSIONS.filter((entry) => entry.author && authorSlug(entry.author) === slug)
}

// Ordered-subsequence score for one term against one token. Consecutive
// hits and hits at the token start score higher. 0 means no match.
function subseqScore(term: string, token: string): number {
  let score = 0
  let ti = 0
  let streak = 0
  for (const ch of term) {
    const found = token.indexOf(ch, ti)
    if (found === -1) return 0
    streak = found === ti ? streak + 1 : 0
    score += 1 + streak + (found === 0 ? 4 : 0)
    ti = found + 1
  }
  return score
}

// Fuzzy match a query against a field. A literal substring wins highest.
// Otherwise every whitespace-separated query term must subsequence-match
// some token of the field, which keeps typo-tolerant matches without
// letting a query smear across a whole description. 0 means no match.
function fuzzyScore(query: string, text: string): number {
  const q = query.trim().toLowerCase()
  const t = text.toLowerCase()
  if (!q || !t) return 0
  const substringAt = t.indexOf(q)
  if (substringAt === 0) return 100 + q.length
  if (substringAt > 0) {
    const wordStart = t[substringAt - 1] === ' ' || t[substringAt - 1] === '-'
    return (wordStart ? 70 : 50) + q.length
  }
  const tokens = t.split(/[^a-z0-9]+/).filter(Boolean)
  const terms = q.split(/\s+/).filter(Boolean)
  let total = 0
  for (const term of terms) {
    let best = 0
    for (const token of tokens) {
      const s = subseqScore(term, token)
      if (s > best) best = s
    }
    if (best === 0) return 0
    total += best
  }
  return total
}

// Fuzzy search over name, description, author, tags, and id. Returns
// entries with score, best first.
export function searchExtensions(query: string): RegistryEntry[] {
  const q = query.trim()
  if (!q) return []
  return EXTENSIONS.map((entry) => {
    const fields: [string, number][] = [
      [entry.name, 4],
      [entry.id, 3],
      [entry.author ?? '', 2],
      [(entry.tags ?? []).join(' '), 3],
      [entry.description ?? '', 1],
    ]
    const score = Math.max(...fields.map(([text, weight]) => fuzzyScore(q, text) * weight))
    return { entry, score }
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
    .map(({ entry }) => entry)
}

function escXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function rssDate(date: string | undefined): string {
  const parsed = date ? Date.parse(date) : NaN
  const fallback = REGISTRY.generatedAt ? Date.parse(REGISTRY.generatedAt) : 0
  return new Date(Number.isNaN(parsed) ? fallback : parsed).toUTCString()
}

// RSS item per released version, newest first.
function rssItems(entries: RegistryEntry[]): string {
  const items: { entry: RegistryEntry; version: RegistryVersion }[] = []
  for (const entry of entries) {
    for (const version of entry.versions ?? []) {
      items.push({ entry, version })
    }
  }
  items.sort((a, b) => (a.version.releasedAt ?? '').localeCompare(b.version.releasedAt ?? ''))
  items.reverse()
  return items
    .map(
      ({ entry, version }) => `    <item>
      <title>${escXml(entry.name)} ${escXml(version.version)}</title>
      <link>${SITE_URL}${extensionPageUrl(entry.id)}</link>
      <guid isPermaLink="false">${escXml(entry.id)}-${escXml(version.version)}</guid>
      <pubDate>${rssDate(version.releasedAt)}</pubDate>
      <description>${escXml(version.notes || entry.description || '')}</description>
    </item>`,
    )
    .join('\n')
}

export function registryRssXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Melovian extensions</title>
    <link>${SITE_URL}/extensions</link>
    <description>New extension releases in the Melovian registry</description>
${rssItems(EXTENSIONS)}
  </channel>
</rss>
`
}

export function extensionRssXml(entry: RegistryEntry): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escXml(entry.name)} releases</title>
    <link>${SITE_URL}${extensionPageUrl(entry.id)}</link>
    <description>${escXml(entry.description ?? `Releases for ${entry.name}`)}</description>
${rssItems([entry])}
  </channel>
</rss>
`
}
