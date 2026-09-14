<script lang="ts">
  import DocView from '$lib/components/docs/DocView.svelte'
  import { DOCS, manifest } from '$lib/docs/docs'
  import { SITE, SITE_URL } from '$lib/constants'
  import { breadcrumbJsonLd, jsonLdScript, techArticleJsonLd } from '$lib/jsonld'

  let { data }: { data: { slug: string } } = $props()

  const meta = $derived(DOCS.find((d) => d.slug === data.slug))
  const title = $derived(`${meta?.title ?? 'Docs'} | ${SITE.name}`)
  const jsonLd = $derived(
    jsonLdScript([
      techArticleJsonLd({
        title: meta?.title ?? 'Documentation',
        slug: data.slug,
        dateModified: manifest.syncedAt,
      }),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Docs', path: '/docs' },
        { name: meta?.title ?? data.slug, path: `/docs/${data.slug}` },
      ]),
    ]),
  )
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content="{meta?.title ?? 'Documentation'} for {SITE.name}" />
  <link rel="canonical" href="{SITE_URL}/docs/{data.slug}" />
  <meta property="og:title" content={title} />
  <meta property="og:url" content="{SITE_URL}/docs/{data.slug}" />
  <meta property="og:image" content="{SITE_URL}/og/docs-{data.slug}.png" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:image" content="{SITE_URL}/og/docs-{data.slug}.png" />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonLd}
</svelte:head>

<DocView slug={data.slug} />
