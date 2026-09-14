<script lang="ts">
  import DocView from '$lib/components/docs/DocView.svelte'
  import { DOCS } from '$lib/docs/docs'
  import { SITE, SITE_URL } from '$lib/constants'

  let { data }: { data: { slug: string } } = $props()

  const meta = $derived(DOCS.find((d) => d.slug === data.slug))
  const title = $derived(`${meta?.title ?? 'Docs'} | ${SITE.name}`)
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content="{meta?.title ?? 'Documentation'} for {SITE.name}" />
  <link rel="canonical" href="{SITE_URL}/docs/{data.slug}" />
  <meta property="og:title" content={title} />
  <meta property="og:url" content="{SITE_URL}/docs/{data.slug}" />
  <meta name="twitter:title" content={title} />
</svelte:head>

<DocView slug={data.slug} />
