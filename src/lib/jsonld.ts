import { LINKS, SITE, SITE_URL, type Faq } from '$lib/constants'

// JSON-LD must escape < so a stray </script> in content cannot break out.
export function jsonLdScript(data: object | object[]): string {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">${json}${'<'}/script>`
}

const publisher = {
  '@type': 'Organization',
  name: SITE.name,
  url: SITE_URL,
  logo: `${SITE_URL}/og.png`,
}

export function faqPageJsonLd(faqs: readonly Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function techArticleJsonLd(opts: {
  title: string
  slug: string
  dateModified?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: opts.title,
    url: `${SITE_URL}/docs/${opts.slug}`,
    dateModified: opts.dateModified ?? undefined,
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE_URL },
    publisher,
    author: publisher,
    about: { '@type': 'SoftwareApplication', name: SITE.name, url: LINKS.github },
  }
}
