/*
 * Store catalog. Items are declared here and rendered by the store
 * routes; add an entry and it gets a card, a detail page at
 * /store/<id>, an OG image, a sitemap entry, and an RSS item.
 */

import { SITE_URL } from '$lib/constants'
import items from './items.json'

type StoreStatus = 'coming-soon' | 'available' | 'sold-out'

type PaymentMethod = 'stripe' | 'monero'

export type StoreItem = {
  id: string
  name: string
  tagline: string
  description: string
  /** Edition label shown as a badge, for example Limited run. */
  edition?: string
  /** 3D model key rendered on the detail page. */
  model?: 'big-box'
  status: StoreStatus
  /** Display price. Null means not announced yet. */
  price: number | null
  currency: 'USD'
  /** Units in the run. Null means the count is not announced yet. */
  stock: number | null
  /** Human note on when it ships. */
  availabilityNote: string
  payments: PaymentMethod[]
  includes: string[]
  /** RFC 822 date used as the feed pubDate. Bump when details change. */
  updated: string
}

// Authored in items.json so the OG image script can read it too.
export const STORE_ITEMS = items as StoreItem[]

export function findItem(id: string): StoreItem | undefined {
  return STORE_ITEMS.find((item) => item.id === id)
}

function itemPath(item: StoreItem): string {
  return `/store/${item.id}`
}

export function statusLabel(item: StoreItem): string {
  if (item.status === 'available') return 'In stock'
  if (item.status === 'sold-out') return 'Sold out'
  return 'Coming soon'
}

export function priceLabel(item: StoreItem): string {
  if (item.price === null) return 'TBA'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: item.currency,
    maximumFractionDigits: item.price % 1 === 0 ? 0 : 2,
  }).format(item.price)
}

export function stockLabel(item: StoreItem): string {
  if (item.stock === null) return 'Coming soon'
  return `${item.stock} units`
}

function escXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Feed readers poll this to learn when items go on sale, so every item
// carries status, price, and stock in both the title and the body.
export function storeRssXml(): string {
  const items = STORE_ITEMS.map(
    (item) => `    <item>
      <title>${escXml(`${item.name}: ${statusLabel(item)}`)}</title>
      <link>${SITE_URL}${itemPath(item)}</link>
      <guid isPermaLink="false">melovian-store-${item.id}</guid>
      <pubDate>${item.updated}</pubDate>
      <description>${escXml(
        `${item.tagline} Status: ${statusLabel(item)}. Price: ${priceLabel(item)} ${item.currency}. Stock: ${stockLabel(item)}. ${item.availabilityNote}`,
      )}</description>
    </item>`,
  )
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Melovian store</title>
    <link>${SITE_URL}/store</link>
    <atom:link href="${SITE_URL}/store/rss.xml" rel="self" type="application/rss+xml" />
    <description>Availability, price, and stock updates for Melovian physical releases</description>
${items.join('\n')}
  </channel>
</rss>
`
}
