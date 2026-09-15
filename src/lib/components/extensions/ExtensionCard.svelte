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
  import {
    AUTHOR_ROUTE,
    authorSlug,
    capabilityBadges,
    riskBadgeClass,
    type RegistryEntry,
  } from '$lib/extensions/registry'

  let { entry }: { entry: RegistryEntry } = $props()
</script>

<div
  class="group focus-within:ring-ring relative h-full rounded-xl focus-within:ring-2 focus-within:ring-offset-2"
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
        <a
          href={resolve(`/extensions/${entry.id}`)}
          class="outline-none after:absolute after:inset-0"
        >
          {entry.name}
        </a>
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
          <Badge variant="outline" class={riskBadgeClass(entry.risk)}>{entry.risk} risk</Badge>
        {/if}
        {#each capabilityBadges(entry) as badge (badge)}
          <Badge variant="outline">{badge}</Badge>
        {/each}
      </div>
      {#if entry.tags?.length}
        <div class="mt-2 flex flex-wrap gap-1.5">
          {#each entry.tags as tag (tag)}
            <a
              href={resolve(`/extensions?tag=${encodeURIComponent(tag)}`)}
              class="text-muted-foreground hover:text-primary relative z-10 rounded text-xs underline-offset-2 hover:underline"
            >
              #{tag}
            </a>
          {/each}
        </div>
      {/if}
      <div class="mt-2 flex items-center justify-between gap-2">
        {#if entry.author}
          <a
            href={resolve(AUTHOR_ROUTE, { slug: authorSlug(entry.author) })}
            class="text-muted-foreground hover:text-primary relative z-10 text-xs underline-offset-2 hover:underline"
          >
            {entry.author}
          </a>
        {:else}
          <span></span>
        {/if}
        <ArrowRightIcon
          class="text-muted-foreground group-hover:text-primary size-3.5 transition-all duration-200 group-hover:translate-x-0.5"
        />
      </div>
    </CardContent>
  </Card>
</div>
