<script lang="ts">
  import { cn } from '$lib/utils'

  type TocItem = { id: string; text: string; depth: number }

  let { items }: { items: TocItem[] } = $props()

  let activeId = $state<string | null>(null)
  let listEl = $state<HTMLElement | null>(null)

  // Scroll-spy: highlight the heading nearest the top of the viewport.
  $effect(() => {
    if (items.length === 0) return
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeId = entry.target.id
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )
    for (const h of headings) observer.observe(h)
    return () => observer.disconnect()
  })

  // Keep the active TOC entry visible inside its own scroll area.
  $effect(() => {
    if (!activeId || !listEl) return
    const link = listEl.querySelector<HTMLElement>(`[data-toc-id="${activeId}"]`)
    link?.scrollIntoView({ block: 'nearest' })
  })
</script>

{#if items.length > 0}
  <nav aria-label="On this page" class="text-sm">
    <p class="text-foreground mb-3 font-medium">On this page</p>
    <ul bind:this={listEl} class="flex max-h-[70vh] flex-col gap-1 overflow-y-auto">
      {#each items as item (item.id)}
        <li>
          <a
            href="#{item.id}"
            data-toc-id={item.id}
            class={cn(
              'block border-l-2 py-1 pl-3 transition-colors',
              item.depth === 3 && 'pl-6',
              activeId === item.id
                ? 'border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground border-transparent',
            )}
          >
            {item.text}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}
