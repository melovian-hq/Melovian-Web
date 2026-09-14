<script lang="ts">
  import ErrorPage from '$lib/components/site/ErrorPage.svelte'
  import { SITE, SITE_URL } from '$lib/constants'
</script>

<!-- Static hosts serve /404.html for unmatched paths. -->
<svelte:head>
  <title>404 | {SITE.name}</title>
  <meta name="robots" content="noindex" />
  <meta name="description" content="Page not found." />
  <link rel="canonical" href="{SITE_URL}/404" />
</svelte:head>

<ErrorPage status={404} />
