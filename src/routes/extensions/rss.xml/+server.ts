import { registryRssXml } from '$lib/extensions/registry'
import type { RequestHandler } from './$types'

export const prerender = true

export const GET: RequestHandler = () =>
  new Response(registryRssXml(), {
    headers: { 'content-type': 'application/rss+xml' },
  })
