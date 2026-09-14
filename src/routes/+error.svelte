<script lang="ts">
  import { page } from '$app/state'
  import ErrorPage from '$lib/components/site/ErrorPage.svelte'
  import { SITE, SITE_URL } from '$lib/constants'

  const title = `${page.status} | ${SITE.name}`
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="robots" content="noindex" />
  <link rel="canonical" href="{SITE_URL}{page.url.pathname}" />
</svelte:head>

<ErrorPage status={page.status} message={page.error?.message} />
