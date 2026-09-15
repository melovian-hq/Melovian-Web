<script lang="ts">
  import RssIcon from '@lucide/svelte/icons/rss'
  import SearchIcon from '@lucide/svelte/icons/search'
  import ExtensionCard from '$lib/components/extensions/ExtensionCard.svelte'
  import Section from '$lib/components/site/Section.svelte'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { SITE, SITE_URL, LINKS } from '$lib/constants'
  import { allTags, EXTENSIONS, REGISTRY } from '$lib/extensions/registry'
  import { breadcrumbJsonLd, jsonLdScript } from '$lib/jsonld'
  import { reveal } from '$lib/reveal'

  const title = `Extensions | ${SITE.name}`
  const description =
    'Community extensions for Melovian. Each package is audited in CI, signed, packaged as a zip, and verified by sha256 on install.'
  const jsonLd = jsonLdScript(
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Extensions', path: '/extensions' },
    ]),
  )

  let query = $state('')
  let activeTag = $state('')

  const filtered = $derived(
    EXTENSIONS.filter((entry) => {
      if (activeTag && !(entry.tags ?? []).includes(activeTag)) return false
      const q = query.trim().toLowerCase()
      if (!q) return true
      return [entry.name, entry.description ?? '', entry.author ?? '', entry.id]
        .join(' ')
        .toLowerCase()
        .includes(q)
    }),
  )
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="{SITE_URL}/extensions" />
  <link
    rel="alternate"
    type="application/rss+xml"
    title="Melovian extension releases"
    href="{SITE_URL}/extensions/rss.xml"
  />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content="{SITE_URL}/extensions" />
  <meta property="og:image" content="{SITE_URL}/og/extensions.png" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content="{SITE_URL}/og/extensions.png" />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonLd}
</svelte:head>

<Section
  id="extensions"
  eyebrow="Extensions"
  title="Customize the player"
  description="Extensions restyle tracks, inject themes, and decorate the player. Every package passes a strict CI audit, ships signed, and is verified by sha256 and signature at install time."
  contentClass="mt-6"
>
  {#if EXTENSIONS.length === 0}
    <p class="text-muted-foreground">
      No extensions are listed yet. The registry lives in the
      <a
        class="text-primary decoration-primary/40 underline underline-offset-4 transition-colors hover:decoration-primary"
        href={LINKS.extensionsRepo}
        target="_blank"
        rel="external noopener noreferrer"
      >
        Melovian-Extensions repo</a
      >.
    </p>
  {:else}
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-xs">
        <SearchIcon
          class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
        <input
          type="search"
          bind:value={query}
          placeholder="Search extensions"
          aria-label="Search extensions"
          class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border py-2 pr-3 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        />
      </div>
      <div class="flex flex-wrap items-center gap-1.5">
        {#each allTags() as tag (tag)}
          <button
            type="button"
            onclick={() => (activeTag = activeTag === tag ? '' : tag)}
            aria-pressed={activeTag === tag}
            class="focus-visible:ring-ring rounded-full outline-none focus-visible:ring-2"
          >
            <Badge variant={activeTag === tag ? 'default' : 'outline'}>#{tag}</Badge>
          </button>
        {/each}
        <Button
          variant="ghost"
          size="icon"
          href="{SITE_URL}/extensions/rss.xml"
          rel="external noopener noreferrer"
          aria-label="RSS feed for extension releases"
          title="RSS feed"
        >
          <RssIcon class="size-4" />
        </Button>
      </div>
    </div>

    {#if filtered.length === 0}
      <p class="text-muted-foreground">
        Nothing matches{query ? ` "${query}"` : ''}{activeTag ? ` in #${activeTag}` : ''}.
      </p>
    {:else}
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each filtered as entry, i (entry.id)}
          <div {@attach reveal} style="transition-delay: {(i % 3) * 80}ms">
            <ExtensionCard {entry} />
          </div>
        {/each}
      </div>
    {/if}

    <p class="text-muted-foreground mt-6 text-sm">
      Install in Melovian under Settings, Extensions: use the registry browser, open an extension
      page and choose Install in Melovian, or drop the downloaded .zip on the upload box. Package
      checksums and signatures are verified before install.
      {#if REGISTRY.generatedAt}
        Registry updated {REGISTRY.generatedAt.slice(0, 10)}.
      {/if}
      Want to publish one? Read the
      <a
        class="text-primary decoration-primary/40 underline underline-offset-4 transition-colors hover:decoration-primary"
        href="{LINKS.extensionsRepo}/blob/master/CONTRIBUTING.md"
        target="_blank"
        rel="external noopener noreferrer">contribution guide</a
      >.
    </p>
    <div class="mt-4">
      <Button
        variant="outline"
        href={LINKS.extensionsRepo}
        target="_blank"
        rel="external noopener noreferrer"
        class="w-fit"
      >
        Browse the registry repo
      </Button>
    </div>
  {/if}
</Section>
