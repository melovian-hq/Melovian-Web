import data from './releases.json'

export type Release = {
  tag: string
  title: string
  url: string | null
  published: string
  notes: string
}

export const fetchedAt = (data as { fetchedAt: string }).fetchedAt
export const RELEASES = data.releases as Release[]

export function isNightly(tag: string) {
  return tag.startsWith('nightly')
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
