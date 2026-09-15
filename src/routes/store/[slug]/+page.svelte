<script lang="ts">
  import { resolve } from '$app/paths'
  import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
  import CheckIcon from '@lucide/svelte/icons/check'
  import RssIcon from '@lucide/svelte/icons/rss'
  import BigBox3D from '$lib/components/store/BigBox3D.svelte'
  import MoneroIcon from '$lib/components/store/icons/MoneroIcon.svelte'
  import StripeIcon from '$lib/components/store/icons/StripeIcon.svelte'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card'
  import { SITE, SITE_URL } from '$lib/constants'
  import { breadcrumbJsonLd, jsonLdScript } from '$lib/jsonld'
  import { findItem, priceLabel, statusLabel, stockLabel } from '$lib/store/store'

  let { data }: { data: { slug: string } } = $props()

  const item = $derived(findItem(data.slug))
  const title = $derived(`${item?.name ?? 'Item'} | ${SITE.name} store`)
  const jsonLd = $derived(
    item
      ? jsonLdScript([
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: item.name,
            description: item.description,
            image: `${SITE_URL}/og/store-${item.id}.png`,
            url: `${SITE_URL}/store/${item.id}`,
            brand: { '@type': 'Organization', name: SITE.name, url: SITE_URL },
            offers: {
              '@type': 'Offer',
              url: `${SITE_URL}/store/${item.id}`,
              priceCurrency: item.currency,
              price: item.price ?? undefined,
              availability:
                item.status === 'available'
                  ? 'https://schema.org/InStock'
                  : item.status === 'sold-out'
                    ? 'https://schema.org/SoldOut'
                    : 'https://schema.org/PreOrder',
            },
          },
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Store', path: '/store' },
            { name: item.name, path: `/store/${item.id}` },
          ]),
        ])
      : '',
  )
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={item?.tagline ?? ''} />
  <link rel="canonical" href="{SITE_URL}/store/{data.slug}" />
  <link
    rel="alternate"
    type="application/rss+xml"
    title="Melovian store"
    href="{SITE_URL}/store/rss.xml"
  />
  <meta property="og:type" content="product" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={item?.tagline ?? ''} />
  <meta property="og:url" content="{SITE_URL}/store/{data.slug}" />
  <meta property="og:image" content="{SITE_URL}/og/store-{data.slug}.png" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={item?.tagline ?? ''} />
  <meta name="twitter:image" content="{SITE_URL}/og/store-{data.slug}.png" />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonLd}
</svelte:head>

{#if item}
  <div class="mx-auto w-full max-w-6xl px-4 pt-6 pb-10 sm:px-6">
    <a
      href={resolve('/store')}
      class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
    >
      <ArrowLeftIcon class="size-4" />
      Store
    </a>

    <div class="mt-6">
      <div class="flex flex-wrap items-center gap-2">
        <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
          {statusLabel(item)}
        </Badge>
        {#if item.edition}
          <Badge variant="outline" class="border-amber-500/50 text-amber-600 dark:text-amber-400">
            {item.edition}
          </Badge>
        {/if}
      </div>
      <h1 class="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {item.name}
      </h1>
      <p class="text-muted-foreground mt-2 text-lg">{item.tagline}</p>
      <p class="text-muted-foreground mt-3 max-w-2xl leading-relaxed">{item.description}</p>
    </div>

    <div class="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div class="border-border bg-card/40 overflow-hidden rounded-2xl border">
        <BigBox3D />
      </div>

      <div class="space-y-6">
        <Card class="gap-3">
          <CardHeader class="pb-0">
            <CardTitle class="text-base">Availability</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 text-sm">
            <dl class="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <dt class="text-muted-foreground">Price</dt>
                <dd class="mt-0.5 font-semibold">{priceLabel(item)}</dd>
              </div>
              <div>
                <dt class="text-muted-foreground">Stock</dt>
                <dd class="mt-0.5 font-semibold">{stockLabel(item)}</dd>
              </div>
              <div class="col-span-2">
                <dt class="text-muted-foreground">When</dt>
                <dd class="mt-0.5">{item.availabilityNote}</dd>
              </div>
            </dl>
            <div class="border-border border-t pt-4">
              <p class="text-muted-foreground mb-2 text-xs tracking-wide uppercase">Pay with</p>
              <div class="flex items-center gap-4">
                <span class="inline-flex items-center gap-1.5 font-medium">
                  <StripeIcon />Stripe
                </span>
                <span class="inline-flex items-center gap-1.5 font-medium">
                  <MoneroIcon />Monero
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="gap-3">
          <CardHeader class="pb-0">
            <CardTitle class="text-base">In the box</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="space-y-2 text-sm">
              {#each item.includes as line (line)}
                <li class="flex items-start gap-2.5">
                  <CheckIcon class="text-primary mt-0.5 size-4 shrink-0" />
                  <span class="text-muted-foreground">{line}</span>
                </li>
              {/each}
            </ul>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          href="{SITE_URL}/store/rss.xml"
          rel="external noopener noreferrer"
          class="w-full gap-2"
        >
          <RssIcon class="size-4" />
          Get notified through the store feed
        </Button>
      </div>
    </div>
  </div>
{/if}
