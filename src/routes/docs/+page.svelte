<script lang="ts">
  import DocsIndex from '$lib/components/docs/DocsIndex.svelte'
  import { SITE, SITE_URL } from '$lib/constants'

  const title = `Documentation | ${SITE.name}`
  const description = `Guides for installing, configuring, and running ${SITE.name}: desktop, mobile, Docker web mode, and development.`
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="{SITE_URL}/docs" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content="{SITE_URL}/docs" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
</svelte:head>

<DocsIndex />
