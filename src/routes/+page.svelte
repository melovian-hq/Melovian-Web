<script lang="ts">
  import CompatStrip from '$lib/components/site/CompatStrip.svelte'
  import CtaBand from '$lib/components/site/CtaBand.svelte'
  import Faq from '$lib/components/site/Faq.svelte'
  import FeatureGrid from '$lib/components/site/FeatureGrid.svelte'
  import Hero from '$lib/components/site/Hero.svelte'
  import Platforms from '$lib/components/site/Platforms.svelte'
  import Screenshots from '$lib/components/site/Screenshots.svelte'
  import { JSON_LD, SITE, SITE_URL } from '$lib/constants'

  const title = `${SITE.name} | ${SITE.tagline}`
  const jsonLd = JSON.stringify(JSON_LD)
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={SITE.description} />
  <link rel="canonical" href="{SITE_URL}/" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={SITE.description} />
  <meta property="og:url" content="{SITE_URL}/" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={SITE.description} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<script type="application/ld+json">${jsonLd}${'<'}/script>`}
</svelte:head>

<Hero />
<CompatStrip />
<FeatureGrid />
<Screenshots />
<Platforms />
<Faq />
<CtaBand />
