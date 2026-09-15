import { error } from '@sveltejs/kit'
import { findItem, STORE_ITEMS } from '$lib/store/store'
import type { EntryGenerator, PageLoad } from './$types'

export const prerender = true

// Emit one static page per catalog item.
export const entries: EntryGenerator = () => STORE_ITEMS.map((item) => ({ slug: item.id }))

export const load: PageLoad = ({ params }) => {
  // Static hosts may serve the file at its literal .html path.
  const slug = params.slug.replace(/\.html$/, '')
  if (!findItem(slug)) error(404, 'Item not found')
  return { slug }
}
