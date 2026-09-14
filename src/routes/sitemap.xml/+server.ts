import { SITE_URL } from '$lib/constants'
import { DOCS, manifest } from '$lib/docs/docs'
import type { RequestHandler } from './$types'

export const prerender = true

const lastmod = manifest.syncedAt?.slice(0, 10)

function url(path: string, priority: string) {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>\n    ` : ''}<changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export const GET: RequestHandler = () => {
  const urls = [
    url('/', '1.0'),
    url('/extensions', '0.8'),
    url('/docs', '0.8'),
    ...DOCS.map((d) => url(`/docs/${d.slug}`, '0.7')),
  ]
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`,
    { headers: { 'content-type': 'application/xml' } },
  )
}
