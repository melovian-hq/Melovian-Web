import { SITE_URL } from '$lib/constants'
import type { RequestHandler } from './$types'

export const prerender = true

export const GET: RequestHandler = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, {
    headers: { 'content-type': 'text/plain' },
  })
