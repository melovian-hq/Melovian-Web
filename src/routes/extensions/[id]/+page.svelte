<script lang="ts">
  import { asset, resolve } from '$app/paths'
  import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
  import CodeIcon from '@lucide/svelte/icons/code'
  import DownloadIcon from '@lucide/svelte/icons/download'
  import ExternalLinkIcon from '@lucide/svelte/icons/external-link'
  import GlobeIcon from '@lucide/svelte/icons/globe'
  import PuzzleIcon from '@lucide/svelte/icons/puzzle'
  import RssIcon from '@lucide/svelte/icons/rss'
  import ShieldCheckIcon from '@lucide/svelte/icons/shield-check'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card'
  import { Separator } from '$lib/components/ui/separator'
  import { SITE, SITE_URL, LINKS } from '$lib/constants'
  import {
    capabilityBadges,
    deepLinkUrl,
    extensionSourceUrl,
    findExtension,
    formatBytes,
    releasedDate,
  } from '$lib/extensions/registry'
  import { breadcrumbJsonLd, jsonLdScript } from '$lib/jsonld'

  let { data }: { data: { id: string } } = $props()

  const entry = $derived(findExtension(data.id))
  const title = $derived(`${entry?.name ?? 'Extension'} | ${SITE.name}`)
  const jsonLd = $derived(
    entry
      ? jsonLdScript([
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: entry.name,
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'any',
            softwareVersion: entry.version,
            description: entry.description,
            author: entry.author ? { '@type': 'Organization', name: entry.author } : undefined,
            url: `${SITE_URL}/extensions/${entry.id}`,
            downloadUrl: entry.package.url,
          },
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Extensions', path: '/extensions' },
            { name: entry.name, path: `/extensions/${entry.id}` },
          ]),
        ])
      : '',
  )
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={entry?.description ?? `Melovian extension ${data.id}`} />
  <link rel="canonical" href="{SITE_URL}/extensions/{data.id}" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={entry?.description ?? ''} />
  <meta property="og:url" content="{SITE_URL}/extensions/{data.id}" />
  <meta name="twitter:title" content={title} />
  <link
    rel="alternate"
    type="application/rss+xml"
    title="{entry?.name ?? 'Extension'} releases"
    href="{SITE_URL}/extensions/{data.id}/rss.xml"
  />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonLd}
</svelte:head>

{#if entry}
  <section class="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
    <a
      href={resolve('/extensions')}
      class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
    >
      <ArrowLeftIcon class="size-4" />
      All extensions
    </a>

    <div class="mt-6 flex flex-wrap items-start gap-5">
      {#if entry.icon}
        <img src={asset(entry.icon)} alt="" class="size-20 shrink-0 rounded-2xl object-contain" />
      {:else}
        <div
          class="bg-primary/10 text-primary flex size-20 shrink-0 items-center justify-center rounded-2xl"
        >
          <PuzzleIcon class="size-9" />
        </div>
      {/if}
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-3xl font-bold tracking-tight text-balance">{entry.name}</h1>
          <Badge variant="outline" class="shrink-0">v{entry.version}</Badge>
          <Badge variant="secondary" class="gap-1">
            <ShieldCheckIcon />
            audited
          </Badge>
          {#if entry.package.signature}
            <Badge variant="secondary">signed</Badge>
          {/if}
          {#if entry.risk}
            <Badge variant="outline">{entry.risk} risk</Badge>
          {/if}
        </div>
        {#if entry.description}
          <p class="text-muted-foreground mt-3 max-w-2xl text-pretty leading-relaxed">
            {entry.description}
          </p>
        {/if}
        <div class="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {#if entry.author}<span>by {entry.author}</span>{/if}
          {#if entry.license}<span>{entry.license}</span>{/if}
          {#if releasedDate(entry)}<span>released {releasedDate(entry)}</span>{/if}
          {#if entry.homepage}
            <a
              href={entry.homepage}
              target="_blank"
              rel="external noopener noreferrer"
              class="text-primary decoration-primary/40 inline-flex items-center gap-1 underline underline-offset-4 hover:decoration-primary"
            >
              <GlobeIcon class="size-3.5" />
              Homepage
            </a>
          {/if}
        </div>
        {#if entry.tags?.length}
          <div class="mt-3 flex flex-wrap gap-1.5">
            {#each entry.tags as tag (tag)}
              <Badge variant="outline" class="text-muted-foreground">#{tag}</Badge>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="mt-8 flex flex-wrap gap-2">
      <Button href={deepLinkUrl(entry.id)} class="gap-2">
        <PuzzleIcon />
        Install in Melovian
      </Button>
      <Button variant="outline" href={entry.package.url} download class="gap-2">
        <DownloadIcon />
        .zip{formatBytes(entry.package.bytes) ? ` · ${formatBytes(entry.package.bytes)}` : ''}
      </Button>
      <Button
        variant="outline"
        href={extensionSourceUrl(entry.id)}
        target="_blank"
        rel="external noopener noreferrer"
        class="gap-2"
      >
        <CodeIcon />
        Source
      </Button>
      <Button
        variant="ghost"
        href="{SITE_URL}/extensions/{entry.id}/rss.xml"
        rel="external noopener noreferrer"
        class="gap-2"
        aria-label="RSS feed for {entry.name} releases"
      >
        <RssIcon />
        Release feed
      </Button>
    </div>
    <p class="text-muted-foreground mt-3 text-sm">
      Install opens the desktop app at the extensions tab with a confirmation prompt. The zip can
      also be dropped onto the upload box in Settings, Extensions.
    </p>

    {#if entry.screenshots?.length}
      <Separator class="my-10" />
      <h2 class="mb-5 text-xl font-semibold tracking-tight">Screenshots</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        {#each entry.screenshots as shot (shot)}
          <img
            src={asset(shot)}
            alt="{entry.name} screenshot"
            class="border-border w-full rounded-xl border object-cover"
            loading="lazy"
          />
        {/each}
      </div>
    {/if}

    <Separator class="my-10" />

    <div class="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-lg">
            <ShieldCheckIcon class="text-primary size-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3 text-sm">
          <div class="flex justify-between gap-4">
            <span class="text-muted-foreground">Audit</span>
            <span>{entry.audit.status === 'pass' ? 'passed' : entry.audit.status}</span>
          </div>
          <div class="flex justify-between gap-4">
            <span class="text-muted-foreground">Signature</span>
            <span>{entry.package.signature ? 'Ed25519 signed' : 'unsigned'}</span>
          </div>
          <div class="flex justify-between gap-4">
            <span class="text-muted-foreground">SHA-256</span>
            <code class="max-w-[16rem] truncate font-mono text-xs">{entry.package.sha256}</code>
          </div>
          <div class="flex justify-between gap-4">
            <span class="text-muted-foreground">Capabilities</span>
            <span class="text-right">{capabilityBadges(entry).join(', ') || 'none'}</span>
          </div>
          {#if entry.audit.warnings.length > 0}
            <div>
              <span class="text-muted-foreground">Audit warnings</span>
              <ul class="mt-1 list-inside list-disc">
                {#each entry.audit.warnings as warning (warning)}
                  <li>{warning}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-lg">
            <GlobeIcon class="text-primary size-5" />
            Privacy
          </CardTitle>
        </CardHeader>
        <CardContent class="text-sm">
          {#if entry.externalUrls?.length}
            <p class="text-muted-foreground mb-3">
              The audit found these external URLs in the package source. Melovian blocks network
              access from extension scripts, so these are references, not live calls.
            </p>
            <ul class="space-y-1.5">
              {#each entry.externalUrls as url (url)}
                <li>
                  <a
                    href={url}
                    target="_blank"
                    rel="external noopener noreferrer"
                    class="text-primary decoration-primary/40 inline-flex items-center gap-1 break-all underline underline-offset-4 hover:decoration-primary"
                  >
                    <ExternalLinkIcon class="size-3.5 shrink-0" />
                    {url}
                  </a>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="text-muted-foreground">
              No external URLs were detected in this package. Extension scripts cannot reach the
              network regardless.
            </p>
          {/if}
        </CardContent>
      </Card>
    </div>

    {#if entry.versions && entry.versions.length > 0}
      <Separator class="my-10" />
      <h2 class="mb-5 text-xl font-semibold tracking-tight">Version history</h2>
      <div class="border-border overflow-hidden rounded-xl border">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-border bg-muted/50 border-b text-left">
              <th class="px-4 py-2.5 font-medium">Version</th>
              <th class="px-4 py-2.5 font-medium">Released</th>
              <th class="px-4 py-2.5 font-medium">Size</th>
              <th class="px-4 py-2.5 text-right font-medium">Package</th>
            </tr>
          </thead>
          <tbody>
            {#each entry.versions as version (version.version)}
              <tr class="border-border border-b last:border-0">
                <td class="px-4 py-2.5 font-medium">
                  v{version.version}
                  {#if version.version === entry.version}
                    <Badge variant="secondary" class="ml-2">latest</Badge>
                  {/if}
                </td>
                <td class="text-muted-foreground px-4 py-2.5">{version.releasedAt ?? ''}</td>
                <td class="text-muted-foreground px-4 py-2.5">{formatBytes(version.bytes)}</td>
                <td class="px-4 py-2.5 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    href={version.url}
                    download
                    class="gap-1.5"
                    aria-label="Download {entry.name} {version.version}"
                  >
                    <DownloadIcon class="size-4" />
                    .zip
                  </Button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}

    {#if entry.changelog && entry.changelog.length > 0}
      <Separator class="my-10" />
      <h2 class="mb-5 text-xl font-semibold tracking-tight">Changelog</h2>
      <div class="space-y-6">
        {#each entry.changelog as change (change.version)}
          <div>
            <div class="flex flex-wrap items-baseline gap-3">
              <h3 class="font-semibold">v{change.version}</h3>
              {#if change.date}
                <span class="text-muted-foreground text-sm">{change.date}</span>
              {/if}
            </div>
            {#if change.notes}
              <p class="text-muted-foreground mt-1.5 text-sm leading-relaxed">{change.notes}</p>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    <Separator class="my-10" />
    <p class="text-muted-foreground text-sm">
      Something look off? Report it through the
      <a
        class="text-primary decoration-primary/40 underline underline-offset-4 hover:decoration-primary"
        href="{LINKS.extensionsRepo}/blob/master/SECURITY.md"
        target="_blank"
        rel="external noopener noreferrer">security policy</a
      >.
    </p>
  </section>
{/if}
