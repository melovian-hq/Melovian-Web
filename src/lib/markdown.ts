import { Marked, type Tokens } from 'marked'

const REPO_BLOB = 'https://github.com/melovian-hq/Melovian'
const DOCS_DIR = 'docs/en/'

// Resolves a link written relative to docs/en/<page>.md into a repo path.
function resolveRepoPath(rel: string): string {
  const out: string[] = []
  for (const part of (DOCS_DIR + rel).split('/')) {
    if (part === '..') out.pop()
    else if (part && part !== '.') out.push(part)
  }
  return out.join('/')
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
}

const marked = new Marked({ gfm: true })

marked.use({
  renderer: {
    heading({ tokens, depth }: Tokens.Heading) {
      const inner = this.parser.parseInline(tokens)
      const id = slugify(inner)
      return `<h${depth} id="${id}" class="doc-heading"><a href="#${id}" class="doc-anchor" aria-hidden="true" tabindex="-1">#</a>${inner}</h${depth}>\n`
    },
    link({ href, title, tokens }: Tokens.Link) {
      const inner = this.parser.parseInline(tokens)
      const titleAttr = title ? ` title="${title}"` : ''
      if (!href) return inner
      if (href.startsWith('#')) {
        return `<a href="${href}"${titleAttr}>${inner}</a>`
      }
      if (/^https?:\/\//.test(href)) {
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${inner}</a>`
      }
      const [pathPart, anchor] = href.split('#')
      const repoPath = resolveRepoPath(pathPart)
      if (repoPath.startsWith(DOCS_DIR) && repoPath.endsWith('.md')) {
        const slug = repoPath.slice(DOCS_DIR.length, -3)
        const to = `/docs/${slug}${anchor ? `#${anchor}` : ''}`
        return `<a href="${to}"${titleAttr}>${inner}</a>`
      }
      const kind = /\.[a-zA-Z0-9]+$/.test(repoPath) ? 'blob' : 'tree'
      const url = `${REPO_BLOB}/${kind}/main/${repoPath}${anchor ? `#${anchor}` : ''}`
      return `<a href="${url}"${titleAttr} target="_blank" rel="noopener noreferrer">${inner}</a>`
    },
  },
})

export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false })
}
