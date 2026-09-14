<script lang="ts">
  import ExternalLinkIcon from '@lucide/svelte/icons/external-link'
  import Section from '$lib/components/site/Section.svelte'
  import { Badge } from '$lib/components/ui/badge'
  import { fetchedAt, formatDate, isNightly, RELEASES } from '$lib/changelog/changelog'
  import { LINKS, SITE, SITE_URL } from '$lib/constants'
  import { breadcrumbJsonLd, jsonLdScript } from '$lib/jsonld'

  const title = `Changelog | ${SITE.name}`
  const description = `Every ${SITE.name} release, newest first. Nightly builds track the master branch; versioned tags are the ones to install.`
  const fetchedLabel = fetchedAt ? formatDate(fetchedAt) : null
  const jsonLd = jsonLdScript(
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Changelog', path: '/changelog' },
    ]),
  )
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="{SITE_URL}/changelog" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content="{SITE_URL}/changelog" />
  <meta property="og:image" content="{SITE_URL}/og/changelog.png" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content="{SITE_URL}/og/changelog.png" />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonLd}
</svelte:head>

<Section
  id="changelog"
  eyebrow="Changelog"
  title="What's new"
  description="Every release, newest first. Nightly builds track the master branch; versioned tags are the ones to install."
>
  <ol class="relative space-y-10">
    {#each RELEASES as release (release.tag)}
      <li class="border-border relative rounded-xl border p-5 sm:p-6">
        <div class="flex flex-wrap items-center gap-3">
          <h2 class="font-mono text-lg font-semibold tracking-tight">{release.tag}</h2>
          {#if isNightly(release.tag)}
            <Badge variant="secondary">nightly</Badge>
          {:else}
            <Badge>release</Badge>
          {/if}
          <span class="text-muted-foreground text-sm">{formatDate(release.published)}</span>
          {#if release.url}
            <a
              href={release.url}
              target="_blank"
              rel="external noopener noreferrer"
              class="text-muted-foreground hover:text-foreground ml-auto inline-flex items-center gap-1 text-sm transition-colors"
            >
              GitHub <ExternalLinkIcon class="size-3.5" />
            </a>
          {/if}
        </div>
        {#if release.notes}
          <div class="prose prose-neutral dark:prose-invert doc-content mt-4 max-w-[75ch] text-sm">
            <!-- release notes come from our own GitHub releases feed -->
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html release.notes}
          </div>
        {/if}
      </li>
    {/each}
  </ol>

  <p class="text-muted-foreground mt-8 text-sm">
    {#if fetchedLabel}Feed synced {fetchedLabel}.{/if}
    Older releases and full assets live on
    <a
      class="text-primary decoration-primary/40 underline underline-offset-4 transition-colors hover:decoration-primary"
      href={LINKS.releases}
      target="_blank"
      rel="external noopener noreferrer">GitHub Releases</a
    >, or subscribe to the
    <a
      class="text-primary decoration-primary/40 underline underline-offset-4 transition-colors hover:decoration-primary"
      href={LINKS.releasesAtom}
      target="_blank"
      rel="external noopener noreferrer">Atom feed</a
    >.
  </p>
</Section>
