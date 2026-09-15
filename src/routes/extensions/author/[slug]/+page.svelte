<script lang="ts">
  import { resolve } from '$app/paths'
  import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
  import ExtensionCard from '$lib/components/extensions/ExtensionCard.svelte'
  import Section from '$lib/components/site/Section.svelte'
  import { SITE, SITE_URL } from '$lib/constants'
  import { extensionsByAuthorSlug } from '$lib/extensions/registry'
  import { breadcrumbJsonLd, jsonLdScript } from '$lib/jsonld'
  import { reveal } from '$lib/reveal'

  let { data }: { data: { slug: string; author: string } } = $props()

  const extensions = $derived(extensionsByAuthorSlug(data.slug))
  const title = $derived(`${data.author} extensions | ${SITE.name}`)
  const description = $derived(
    `Melovian extensions published by ${data.author}. Audited, signed, and verified by sha256 on install.`,
  )
  const jsonLd = $derived(
    jsonLdScript(
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Extensions', path: '/extensions' },
        { name: data.author, path: `/extensions/author/${data.slug}` },
      ]),
    ),
  )
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="{SITE_URL}/extensions/author/{data.slug}" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content="{SITE_URL}/extensions/author/{data.slug}" />
  <meta property="og:image" content="{SITE_URL}/og/extensions.png" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content="{SITE_URL}/og/extensions.png" />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonLd}
</svelte:head>

<Section
  id="author"
  eyebrow="Extension author"
  title={data.author}
  description="{extensions.length} {extensions.length === 1
    ? 'extension'
    : 'extensions'} in the registry."
  contentClass="mt-6"
>
  <a
    href={resolve('/extensions')}
    class="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
  >
    <ArrowLeftIcon class="size-4" />
    All extensions
  </a>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {#each extensions as entry, i (entry.id)}
      <div {@attach reveal} style="transition-delay: {(i % 4) * 70}ms">
        <ExtensionCard {entry} />
      </div>
    {/each}
  </div>
</Section>
