<script lang="ts">
  import { resolve } from '$app/paths'
  import CodeIcon from '@lucide/svelte/icons/code'
  import DownloadIcon from '@lucide/svelte/icons/download'
  import PuzzleIcon from '@lucide/svelte/icons/puzzle'
  import ShieldCheckIcon from '@lucide/svelte/icons/shield-check'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card'
  import {
    capabilityBadges,
    extensionSourceUrl,
    formatBytes,
    type RegistryEntry,
  } from '$lib/extensions/registry'

  let { entry }: { entry: RegistryEntry } = $props()
</script>

<Card class="hover:border-primary/40 hover:bg-card/80 flex h-full flex-col transition-colors">
  <CardHeader>
    <div class="flex items-start justify-between gap-3">
      {#if entry.icon}
        <img
          src={entry.icon}
          alt=""
          class="size-10 shrink-0 rounded-lg object-contain"
          loading="lazy"
        />
      {:else}
        <div
          class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg"
        >
          <PuzzleIcon class="size-5" />
        </div>
      {/if}
      <Badge variant="outline" class="shrink-0">v{entry.version}</Badge>
    </div>
    <CardTitle class="text-base">
      <a href={resolve(`/extensions/${entry.id}`)} class="hover:text-primary transition-colors">
        {entry.name}
      </a>
    </CardTitle>
    <CardDescription class="line-clamp-2 text-pretty">
      {entry.description ?? entry.id}
    </CardDescription>
  </CardHeader>
  <CardContent class="flex-1">
    <div class="flex flex-wrap items-center gap-1.5">
      <Badge variant="secondary" class="gap-1">
        <ShieldCheckIcon />
        audited
      </Badge>
      {#if entry.risk && entry.risk !== 'low'}
        <Badge variant="outline">{entry.risk} risk</Badge>
      {/if}
      {#each capabilityBadges(entry) as badge (badge)}
        <Badge variant="outline">{badge}</Badge>
      {/each}
      {#if entry.author}
        <span class="text-muted-foreground ml-auto text-xs">{entry.author}</span>
      {/if}
    </div>
  </CardContent>
  <CardFooter class="gap-2">
    <Button size="sm" href={resolve(`/extensions/${entry.id}`)} variant="default" class="flex-1">
      Details
    </Button>
    <Button
      size="sm"
      variant="outline"
      href={entry.package.url}
      download
      aria-label="Download {entry.name} zip{formatBytes(entry.package.bytes)
        ? `, ${formatBytes(entry.package.bytes)}`
        : ''}"
      title="Download .zip"
    >
      <DownloadIcon />
    </Button>
    <Button
      size="sm"
      variant="outline"
      href={extensionSourceUrl(entry.id)}
      target="_blank"
      rel="external noopener noreferrer"
      aria-label="View source for {entry.name}"
      title="View source"
    >
      <CodeIcon />
    </Button>
  </CardFooter>
</Card>
