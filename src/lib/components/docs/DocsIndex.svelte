<script lang="ts">
  import { resolve } from '$app/paths'
  import ArrowRightIcon from '@lucide/svelte/icons/arrow-right'
  import BookOpenIcon from '@lucide/svelte/icons/book-open'
  import { Card, CardHeader, CardTitle } from '$lib/components/ui/card'
  import { DOCS, manifest } from '$lib/docs/docs'
</script>

<div class="max-w-3xl">
  <p class="text-primary text-sm font-semibold tracking-widest uppercase">Documentation</p>
  <h1 class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Melovian docs</h1>
  <p class="text-muted-foreground mt-4 text-lg text-pretty">
    {#if DOCS.length > 0}
      {DOCS.length} guides pulled from the main repository
      {#if manifest.syncedAt}
        and last synced {new Date(manifest.syncedAt).toLocaleDateString('en', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}{/if}. Press
      <kbd class="bg-muted rounded border px-1.5 py-0.5 font-mono text-xs">⌘K</kbd>
      or <kbd class="bg-muted rounded border px-1.5 py-0.5 font-mono text-xs">/</kbd> to search.
    {:else}
      No docs are synced yet. Run
      <code class="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">pnpm docs:sync</code> to pull them
      from the main repository.
    {/if}
  </p>
</div>

<div class="mt-10 grid gap-4 sm:grid-cols-2">
  {#each DOCS as doc (doc.slug)}
    <a href={resolve(`/docs/${doc.slug}`)} class="group block">
      <Card class="hover:border-primary/40 h-full transition-colors">
        <CardHeader>
          <CardTitle class="group-hover:text-primary flex items-center gap-2 text-base">
            <BookOpenIcon class="text-muted-foreground size-4" />
            {doc.title}
            <ArrowRightIcon class="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </CardTitle>
        </CardHeader>
      </Card>
    </a>
  {/each}
</div>
