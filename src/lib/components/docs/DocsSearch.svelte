<script lang="ts">
  import { Dialog } from 'bits-ui'
  import Fuse from 'fuse.js'
  import FileTextIcon from '@lucide/svelte/icons/file-text'
  import HashIcon from '@lucide/svelte/icons/hash'
  import SearchIcon from '@lucide/svelte/icons/search'
  import { tick } from 'svelte'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { buildSearchIndex, DOCS, type SearchEntry } from '$lib/docs/docs'
  import { cn } from '$lib/utils'

  let open = $state(false)
  let query = $state('')
  let activeIndex = $state(0)
  let inputEl = $state<HTMLInputElement | null>(null)

  const fuse = new Fuse<SearchEntry>(buildSearchIndex(), {
    keys: [
      { name: 'title', weight: 0.55 },
      { name: 'docTitle', weight: 0.25 },
      { name: 'body', weight: 0.2 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })

  type Result = { item: SearchEntry; score?: number }

  const defaults: Result[] = DOCS.map((d) => ({
    item: {
      slug: d.slug,
      docTitle: d.title,
      kind: 'page',
      title: d.title,
      anchor: null,
      body: '',
    },
  }))

  let results = $derived<Result[]>(
    query.trim().length >= 2
      ? fuse
          .search(query.trim())
          .slice(0, 10)
          .map((r) => r)
      : defaults,
  )

  $effect(() => {
    if (open) {
      query = ''
      activeIndex = 0
      tick().then(() => inputEl?.focus())
    }
  })

  function go(item: SearchEntry) {
    const url = resolve(`/docs/${item.slug}${item.anchor ? `#${item.anchor}` : ''}`)
    goto(url)
    open = false
  }

  function onKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      open = !open
      return
    }
    if (
      e.key === '/' &&
      !open &&
      !(e.target instanceof HTMLInputElement) &&
      !(e.target instanceof HTMLTextAreaElement) &&
      !(e.target instanceof HTMLElement && e.target.isContentEditable)
    ) {
      e.preventDefault()
      open = true
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      activeIndex = Math.min(activeIndex + 1, results.length - 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      activeIndex = Math.max(activeIndex - 1, 0)
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault()
      go(results[activeIndex].item)
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<button
  type="button"
  onclick={() => (open = true)}
  class="border-border bg-muted/60 text-muted-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors"
  aria-label="Search documentation"
>
  <SearchIcon class="size-4" />
  <span class="flex-1 text-left">Search docs</span>
  <kbd
    class="bg-background text-muted-foreground hidden rounded border px-1.5 py-0.5 font-mono text-[10px] sm:inline"
    >⌘K</kbd
  >
</button>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60"
    />
    <Dialog.Content
      class="bg-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[15%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border shadow-2xl outline-none"
    >
      <Dialog.Title class="sr-only">Search documentation</Dialog.Title>
      <div class="border-border flex items-center gap-2 border-b px-4">
        <SearchIcon class="text-muted-foreground size-4 shrink-0" />
        <input
          bind:this={inputEl}
          bind:value={query}
          type="text"
          placeholder="Search documentation..."
          class="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div class="max-h-80 overflow-y-auto p-2" role="listbox">
        {#if results.length === 0}
          <p class="text-muted-foreground px-3 py-6 text-center text-sm">
            No results for "{query}"
          </p>
        {:else}
          {#each results as result, i (`${result.item.slug}-${result.item.anchor ?? 'page'}`)}
            <button
              type="button"
              role="option"
              aria-selected={i === activeIndex}
              class={cn(
                'flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors',
                i === activeIndex && 'bg-accent text-accent-foreground',
              )}
              onmouseenter={() => (activeIndex = i)}
              onclick={() => go(result.item)}
            >
              {#if result.item.kind === 'page'}
                <FileTextIcon class="text-muted-foreground mt-0.5 size-4 shrink-0" />
              {:else}
                <HashIcon class="text-muted-foreground mt-0.5 size-4 shrink-0" />
              {/if}
              <span class="min-w-0">
                <span class="block truncate text-sm font-medium">{result.item.title}</span>
                {#if result.item.kind !== 'page'}
                  <span class="text-muted-foreground block truncate text-xs"
                    >{result.item.docTitle}</span
                  >
                {/if}
              </span>
            </button>
          {/each}
        {/if}
      </div>

      <div
        class="border-border text-muted-foreground flex items-center gap-4 border-t px-4 py-2.5 text-xs"
      >
        <span class="flex items-center gap-1"
          ><kbd class="rounded border px-1 font-mono">↑↓</kbd> navigate</span
        >
        <span class="flex items-center gap-1"
          ><kbd class="rounded border px-1 font-mono">↵</kbd> open</span
        >
        <span class="flex items-center gap-1"
          ><kbd class="rounded border px-1 font-mono">esc</kbd> close</span
        >
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
