<script lang="ts">
  import { page } from '$app/state'
  import { resolve } from '$app/paths'
  import { DOCS } from '$lib/docs/docs'
  import { cn } from '$lib/utils'
  import DocsSearch from './DocsSearch.svelte'
</script>

<nav aria-label="Documentation" class="flex flex-col gap-4">
  <DocsSearch />
  <ul class="flex flex-col gap-0.5">
    {#each DOCS as doc (doc.slug)}
      {@const active = page.url.pathname === `/docs/${doc.slug}`}
      <li>
        <a
          href={resolve(`/docs/${doc.slug}`)}
          aria-current={active ? 'page' : undefined}
          class={cn(
            'block rounded-md px-3 py-1.5 text-sm transition-colors',
            active
              ? 'bg-accent text-accent-foreground font-medium'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
          )}
        >
          {doc.title}
        </a>
      </li>
    {/each}
  </ul>
</nav>
