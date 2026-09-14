/*
 * Vendored copy of the Melovian-Extensions registry index, synced by
 * scripts/sync-extensions.mjs. registry.json is regenerated on install,
 * dev, and build; do not edit it by hand.
 */
import registryJson from './registry.json'
import { LINKS } from '$lib/constants'

export type RegistryPackage = {
  url: string
  sha256: string
  bytes: number
}

export type RegistryCapabilities = {
  script: boolean
  wasm: boolean
  styles: number
  appTheme: boolean
  trackRules: number
  playerHooks: number
}

export type RegistryAudit = {
  status: 'pass'
  warnings: string[]
}

export type RegistryEntry = {
  id: string
  name: string
  version: string
  description?: string
  author?: string
  icon?: string
  image?: string
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

export function extensionSourceUrl(id: string): string {
  return `${LINKS.extensionsRepo}/tree/main/extensions/${id}`
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
