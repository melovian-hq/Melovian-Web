<script lang="ts">
  import { asset, resolve } from '$app/paths'
  import ArrowRightIcon from '@lucide/svelte/icons/arrow-right'
  import PuzzleIcon from '@lucide/svelte/icons/puzzle'
  import ShieldCheckIcon from '@lucide/svelte/icons/shield-check'
  import { Badge } from '$lib/components/ui/badge'
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card'
  import { capabilityBadges, type RegistryEntry } from '$lib/extensions/registry'

  let { entry }: { entry: RegistryEntry } = $props()
</script>

<a
  href={resolve(`/extensions/${entry.id}`)}
  class="group focus-visible:ring-ring block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
>
  <Card
    class="group-hover:border-primary/40 group-hover:bg-card/80 flex h-full flex-col transition-colors"
  >
    <CardHeader>
      <div class="flex items-start justify-between gap-3">
        {#if entry.icon}
          <img
            src={asset(entry.icon)}
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
      <CardTitle class="text-base transition-colors group-hover:text-primary">
        {entry.name}
      </CardTitle>
      <CardDescription class="line-clamp-2 text-pretty">
        {entry.description ?? entry.id}
      </CardDescription>
    </CardHeader>
    <CardContent class="flex-1">
      <div class="flex flex-wrap items-center gap-1.5">
        <Badge
          variant="secondary"
          class="gap-1 border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
        >
          <ShieldCheckIcon />
          audited
        </Badge>
        {#if entry.risk && entry.risk !== 'low'}
          <Badge variant="outline">{entry.risk} risk</Badge>
        {/if}
        {#each capabilityBadges(entry) as badge (badge)}
          <Badge variant="outline">{badge}</Badge>
        {/each}
        <span
          class="text-muted-foreground group-hover:text-primary ml-auto inline-flex items-center gap-1.5 text-xs transition-colors"
        >
          {#if entry.author}{entry.author}{/if}
          <ArrowRightIcon
            class="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </CardContent>
  </Card>
</a>
