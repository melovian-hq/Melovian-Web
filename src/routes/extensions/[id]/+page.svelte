<script lang="ts">
  import { asset, resolve } from '$app/paths'
  import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
  import CodeIcon from '@lucide/svelte/icons/code'
  import DownloadIcon from '@lucide/svelte/icons/download'
  import ExternalLinkIcon from '@lucide/svelte/icons/external-link'
  import GlobeIcon from '@lucide/svelte/icons/globe'
  import HashIcon from '@lucide/svelte/icons/hash'
  import KeyRoundIcon from '@lucide/svelte/icons/key-round'
  import ListChecksIcon from '@lucide/svelte/icons/list-checks'
  import PuzzleIcon from '@lucide/svelte/icons/puzzle'
  import RssIcon from '@lucide/svelte/icons/rss'
  import ShieldCheckIcon from '@lucide/svelte/icons/shield-check'
  import ShieldXIcon from '@lucide/svelte/icons/shield-x'
  import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert'
  import { cn } from '$lib/utils'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card'
  import { Separator } from '$lib/components/ui/separator'
  import { SITE, SITE_URL, LINKS } from '$lib/constants'
  import {
    AUTHOR_ROUTE,
    authorSlug,
    capabilityDetails,
    deepLinkUrl,
    extensionSourceUrl,
    findExtension,
    formatBytes,
    relatedExtensions,
    releasedDate,
    riskBadgeClass,
  } from '$lib/extensions/registry'
  import { breadcrumbJsonLd, jsonLdScript } from '$lib/jsonld'

  let { data }: { data: { id: string } } = $props()

  let installFallback = $state(false)
  let linkCopied = $state(false)
  let openCap = $state<string | null>(null)

  // Custom protocols fail silently when nothing claims them. If the page
  // is still visible and focused after a beat, the app is probably not
  // installed, so surface the manual path.
  function handleInstallClick(event: MouseEvent, id: string) {
    event.preventDefault()
    installFallback = false
    linkCopied = false
    window.location.href = deepLinkUrl(id)
    window.setTimeout(() => {
      if (!document.hidden && document.hasFocus()) installFallback = true
    }, 1600)
  }

  async function copyDeepLink(id: string) {
    try {
      await navigator.clipboard.writeText(deepLinkUrl(id))
      linkCopied = true
    } catch {
      linkCopied = false
    }
  }

  const entry = $derived(findExtension(data.id))
  const related = $derived(relatedExtensions(entry))
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
  <meta property="og:image" content="{SITE_URL}/og/extensions-{data.id}.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:image" content="{SITE_URL}/og/extensions-{data.id}.png" />
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
  <section class="mx-auto w-full max-w-6xl px-6 pt-6 pb-12 md:pt-8 md:pb-16">
    {#if entry.delisted}
      <div
        class="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
        role="alert"
      >
        This extension was delisted{entry.delisted.at ? ` on ${entry.delisted.at}` : ''}.
        {entry.delisted.reason || 'No reason was given.'} Installed copies keep working but no new installs
        are offered.
      </div>
    {/if}
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
          <Badge
            variant="secondary"
            class="gap-1 border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          >
            <ShieldCheckIcon />
            audited
          </Badge>
          {#if entry.package.signature}
            <Badge
              variant="secondary"
              class="gap-1 border border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400"
            >
              <KeyRoundIcon />
              signed
            </Badge>
          {/if}
          {#if entry.risk}
            <Badge variant="outline" class={riskBadgeClass(entry.risk)}>{entry.risk} risk</Badge>
          {/if}
        </div>
        {#if entry.description}
          <p class="text-muted-foreground mt-3 max-w-2xl text-pretty leading-relaxed">
            {entry.description}
          </p>
        {/if}
        <div class="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {#if entry.author}
            <a
              href={resolve(AUTHOR_ROUTE, { slug: authorSlug(entry.author) })}
              class="text-primary decoration-primary/40 underline underline-offset-4 transition-colors hover:decoration-primary"
            >
              by {entry.author}
            </a>
          {/if}
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
              <a href={resolve(`/extensions?tag=${encodeURIComponent(tag)}`)}>
                <Badge
                  variant="outline"
                  class="text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                >
                  #{tag}
                </Badge>
              </a>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="mt-8 flex flex-wrap gap-2">
      {#if !entry.delisted}
        <Button
          href={deepLinkUrl(entry.id)}
          onclick={(e) => handleInstallClick(e, entry.id)}
          class="gap-2"
        >
          <PuzzleIcon />
          Install in Melovian
        </Button>
        <Button variant="outline" href={entry.package.url} download class="gap-2">
          <DownloadIcon />
          .zip{formatBytes(entry.package.bytes) ? ` · ${formatBytes(entry.package.bytes)}` : ''}
        </Button>
      {/if}
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
        variant="outline"
        size="icon"
        href="{SITE_URL}/extensions/{entry.id}/rss.xml"
        rel="external noopener noreferrer"
        aria-label="RSS feed for {entry.name} releases"
        title="Release feed"
      >
        <RssIcon />
      </Button>
    </div>
    <p class="text-muted-foreground mt-3 text-sm">
      Install opens the desktop app at the extensions tab with a confirmation prompt. The zip can
      also be dropped onto the upload box in Settings, Extensions.
    </p>
    {#if installFallback}
      <div
        class="border-border bg-muted/40 mt-3 flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3 text-sm"
      >
        <span class="text-muted-foreground">
          Nothing opened. Melovian may not be installed yet.
        </span>
        <Button size="sm" variant="outline" href={resolve('/#platforms')} class="gap-1.5">
          Get Melovian
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onclick={() => void copyDeepLink(entry.id)}
          class="gap-1.5"
        >
          {linkCopied ? 'Copied' : 'Copy install link'}
        </Button>
      </div>
    {/if}

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
          <CardTitle class="flex items-center gap-2.5 text-lg">
            <span
              class="flex size-8 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <ShieldCheckIcon class="size-4.5" />
            </span>
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="divide-border -my-1 divide-y text-sm">
            <li class="flex items-center gap-3 py-2.5">
              <ShieldCheckIcon
                class={cn(
                  'size-4 shrink-0',
                  entry.audit.status === 'pass' ? 'text-emerald-500' : 'text-amber-500',
                )}
              />
              <span class="text-muted-foreground">Audit</span>
              <span
                class={cn(
                  'ml-auto font-medium',
                  entry.audit.status === 'pass'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400',
                )}
              >
                {entry.audit.status === 'pass' ? 'passed' : entry.audit.status}
              </span>
            </li>
            <li class="flex items-center gap-3 py-2.5">
              <KeyRoundIcon
                class={cn(
                  'size-4 shrink-0',
                  entry.package.signature ? 'text-sky-500' : 'text-muted-foreground',
                )}
              />
              <span class="text-muted-foreground">Signature</span>
              <span
                class={cn(
                  'ml-auto font-medium',
                  entry.package.signature && 'text-sky-600 dark:text-sky-400',
                )}
              >
                {entry.package.signature ? 'Ed25519' : 'unsigned'}
              </span>
            </li>
            <li class="flex items-center gap-3 py-2.5">
              <HashIcon class="text-muted-foreground size-4 shrink-0" />
              <span class="text-muted-foreground">SHA-256</span>
              <code
                class="bg-muted/60 ml-auto max-w-[14rem] truncate rounded px-1.5 py-0.5 font-mono text-xs"
                title={entry.package.sha256}>{entry.package.sha256}</code
              >
            </li>
            <li class="py-2.5">
              <div class="flex items-start gap-3">
                <ListChecksIcon class="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <span class="text-muted-foreground">Capabilities</span>
                <div class="ml-auto flex flex-wrap justify-end gap-1.5">
                  {#each capabilityDetails(entry) as cap (cap.label)}
                    <button
                      type="button"
                      class={cn(
                        'border-border hover:border-primary/50 hover:text-primary cursor-pointer rounded-md border px-1.5 py-0.5 text-xs transition-colors',
                        openCap === cap.label && 'border-primary/60 bg-primary/5 text-primary',
                      )}
                      aria-expanded={openCap === cap.label}
                      onclick={() => (openCap = openCap === cap.label ? null : cap.label)}
                    >
                      {cap.label}
                    </button>
                  {:else}
                    <span>none</span>
                  {/each}
                </div>
              </div>
              {#if openCap}
                <p class="text-muted-foreground mt-2 text-xs leading-relaxed">
                  {capabilityDetails(entry).find((c) => c.label === openCap)?.explain}
                </p>
              {/if}
            </li>
          </ul>
          {#if entry.audit.warnings.length > 0}
            <div
              class="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2.5 text-sm"
            >
              <p class="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                <TriangleAlertIcon class="size-4" />
                Audit warnings
              </p>
              <ul class="text-muted-foreground mt-1.5 list-inside list-disc">
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
          <CardTitle class="flex items-center gap-2.5 text-lg">
            <span
              class="flex size-8 items-center justify-center rounded-lg border border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400"
            >
              <GlobeIcon class="size-4.5" />
            </span>
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
                    class="border-border bg-muted/40 hover:border-primary/40 inline-flex max-w-full items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-xs break-all transition-colors"
                  >
                    <ExternalLinkIcon class="text-muted-foreground size-3.5 shrink-0" />
                    {url}
                  </a>
                </li>
              {/each}
            </ul>
          {:else}
            <div
              class="flex items-start gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2.5"
            >
              <ShieldCheckIcon class="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <p class="text-emerald-700 dark:text-emerald-300">
                No external URLs detected in this package.
              </p>
            </div>
            <p class="text-muted-foreground mt-3">
              Extension scripts cannot reach the network regardless.
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
              <th class="px-4 py-2.5 font-medium">Signed</th>
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
                <td class="px-4 py-2.5">
                  {#if version.signature}
                    <span
                      class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
                      title="Ed25519 signed"
                    >
                      <ShieldCheckIcon class="size-4" />
                      <span class="text-xs font-medium">signed</span>
                    </span>
                  {:else}
                    <span
                      class="inline-flex items-center gap-1.5 text-red-500 dark:text-red-400"
                      title="No signature"
                    >
                      <ShieldXIcon class="size-4" />
                      <span class="text-xs font-medium">unsigned</span>
                    </span>
                  {/if}
                </td>
                <td class="px-4 py-2.5 text-right">
                  {#if !entry.delisted}
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
                  {:else}
                    <span class="text-muted-foreground text-xs">pulled</span>
                  {/if}
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

    {#if related.length > 0}
      <Separator class="my-10" />
      <h2 class="mb-5 text-xl font-semibold tracking-tight">Related extensions</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each related as other (other.id)}
          <a
            href={resolve(`/extensions/${other.id}`)}
            class="border-border hover:border-primary/50 group rounded-xl border p-4 transition-colors"
          >
            <div class="flex items-center gap-3">
              {#if other.icon}
                <img
                  src={asset(other.icon)}
                  alt=""
                  class="size-10 shrink-0 rounded-lg object-contain"
                />
              {:else}
                <div
                  class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg"
                >
                  <PuzzleIcon class="size-5" />
                </div>
              {/if}
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold group-hover:text-primary">
                  {other.name}
                </p>
                <p class="text-muted-foreground text-xs">v{other.version}</p>
              </div>
            </div>
            {#if other.description}
              <p class="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
                {other.description}
              </p>
            {/if}
          </a>
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
