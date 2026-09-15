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
