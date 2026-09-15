<script lang="ts">
  import RssIcon from '@lucide/svelte/icons/rss'
  import Section from '$lib/components/site/Section.svelte'
  import StoreItemCard from '$lib/components/store/StoreItemCard.svelte'
  import { Button } from '$lib/components/ui/button'
  import { SITE, SITE_URL } from '$lib/constants'
  import { STORE_ITEMS } from '$lib/store/store'
  import { breadcrumbJsonLd, jsonLdScript } from '$lib/jsonld'
  import { reveal } from '$lib/reveal'

  const title = `Store | ${SITE.name}`
  const description =
    'Physical Melovian releases. Limited runs, real packaging, disc and USB inside. Pay with Stripe or Monero when items go on sale.'
  const jsonLd = jsonLdScript([
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Melovian store',
      url: `${SITE_URL}/store`,
      isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE_URL },
    },
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Store', path: '/store' },
    ]),
  ])
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="{SITE_URL}/store" />
  <link
    rel="alternate"
    type="application/rss+xml"
    title="Melovian store"
    href="{SITE_URL}/store/rss.xml"
  />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content="{SITE_URL}/store" />
  <meta property="og:image" content="{SITE_URL}/og/store.png" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content="{SITE_URL}/og/store.png" />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonLd}
</svelte:head>

<Section
  id="store"
  eyebrow="Store"
  title="Melovian, in a box"
  description="Physical releases in limited runs. Subscribe to the feed and you will know the moment something goes on sale, what it costs, and how many exist."
>
  <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {#each STORE_ITEMS as item, i (item.id)}
      <div {@attach reveal} style="transition-delay: {(i % 3) * 80}ms">
        <StoreItemCard {item} />
      </div>
    {/each}
  </div>

  <div
    class="border-border bg-card/50 mt-10 flex flex-col items-start justify-between gap-4 rounded-xl border p-5 sm:flex-row sm:items-center"
  >
    <p class="text-muted-foreground max-w-xl text-sm">
      Nothing is on sale yet. The first run lands sometime after Melovian reaches v1.0, and the feed
      below announces availability, price, and stock the moment they are set.
    </p>
    <Button
      variant="outline"
      href="{SITE_URL}/store/rss.xml"
      rel="external noopener noreferrer"
      class="shrink-0 gap-2"
    >
      <RssIcon class="size-4" />
      Watch the store feed
    </Button>
  </div>
</Section>
