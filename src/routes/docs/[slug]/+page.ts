import { DOCS } from '$lib/docs/docs'
import type { EntryGenerator, PageLoad } from './$types'

// Emit one static page per synced doc.
export const entries: EntryGenerator = () => DOCS.map((d) => ({ slug: d.slug }))

// Static hosts may serve the prerendered file at its literal .html path,
// which the router then parses into the slug.
export const load: PageLoad = ({ params }) => ({
  slug: params.slug.replace(/\.html$/, ''),
})
