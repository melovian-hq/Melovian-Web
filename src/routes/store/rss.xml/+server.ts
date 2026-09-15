import { storeRssXml } from '$lib/store/store'
import type { RequestHandler } from './$types'

export const prerender = true

export const GET: RequestHandler = () =>
  new Response(storeRssXml(), {
    headers: { 'content-type': 'application/rss+xml' },
  })
