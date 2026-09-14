import { error } from '@sveltejs/kit'
import { EXTENSIONS, findExtension } from '$lib/extensions/registry'
import type { EntryGenerator, PageLoad } from './$types'

export const prerender = true

// Emit one static page per registry extension.
export const entries: EntryGenerator = () => EXTENSIONS.map((entry) => ({ id: entry.id }))

export const load: PageLoad = ({ params }) => {
  // Static hosts may serve the file at its literal .html path.
  const id = params.id.replace(/\.html$/, '')
  if (!findExtension(id)) error(404, 'Extension not found')
  return { id }
}
