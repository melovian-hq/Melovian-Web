import { error } from '@sveltejs/kit'
import { authorSlugs, extensionsByAuthorSlug } from '$lib/extensions/registry'
import type { EntryGenerator, PageLoad } from './$types'

export const prerender = true

// Emit one static page per unique author slug.
export const entries: EntryGenerator = () => authorSlugs().map((slug) => ({ slug }))

export const load: PageLoad = ({ params }) => {
  // Static hosts may serve the file at its literal .html path.
  const slug = params.slug.replace(/\.html$/, '')
  const extensions = extensionsByAuthorSlug(slug)
  if (extensions.length === 0) error(404, 'Author not found')
  return { slug, author: extensions[0].author ?? slug }
}
