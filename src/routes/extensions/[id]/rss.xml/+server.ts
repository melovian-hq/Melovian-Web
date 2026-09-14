import { error } from '@sveltejs/kit'
import { EXTENSIONS, extensionRssXml, findExtension } from '$lib/extensions/registry'
import type { EntryGenerator, RequestHandler } from './$types'

export const prerender = true

export const entries: EntryGenerator = () => EXTENSIONS.map((entry) => ({ id: entry.id }))

export const GET: RequestHandler = ({ params }) => {
  const entry = findExtension(params.id.replace(/\.xml$/, ''))
  if (!entry) error(404, 'Extension not found')
  return new Response(extensionRssXml(entry), {
    headers: { 'content-type': 'application/rss+xml' },
  })
}
