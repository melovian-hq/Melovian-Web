import { LINKS, SITE, SITE_URL } from '$lib/constants'
import { DOCS } from '$lib/docs/docs'
import { EXTENSIONS } from '$lib/extensions/registry'
import type { RequestHandler } from './$types'

export const prerender = true

// llms.txt convention: a compact markdown map of the site for LLM agents.
export const GET: RequestHandler = () => {
  const docLines = DOCS.map((d) => `- [${d.title}](${SITE_URL}/docs/${d.slug})`)
  const extLines = EXTENSIONS.map((e) => `- [${e.name}](${SITE_URL}/extensions/${e.id})`)
  return new Response(
    `# ${SITE.name}

> ${SITE.description}

## Docs
${docLines.join('\n')}

## Extensions
${extLines.join('\n')}
- [Extension releases feed (RSS)](${SITE_URL}/extensions/rss.xml)

## Links
- [Changelog](${SITE_URL}/changelog)
- [Extensions](${SITE_URL}/extensions)
- [Extension registry](${LINKS.extensionsRepo})
- [Live demo](${LINKS.demo})
- [Releases](${LINKS.releases})
- [Release feed (Atom)](${LINKS.releasesAtom})
- [GitHub](${LINKS.github})
- [Issues](${LINKS.issues})
- [License](${LINKS.license})
`,
    { headers: { 'content-type': 'text/plain; charset=utf-8' } },
  )
}
