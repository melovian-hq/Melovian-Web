<script lang="ts">
  import { cn } from '$lib/utils'
  import { reveal } from '$lib/reveal'
  import type { Snippet } from 'svelte'

  let {
    id,
    eyebrow,
    title,
    description,
    class: className,
    children,
  }: {
    id: string
    eyebrow: string
    title: string
    description?: string
    class?: string
    children: Snippet
  } = $props()
</script>

<section {id} class={cn('mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6', className)}>
  <div {@attach reveal} class="max-w-2xl">
    <p class="text-primary text-sm font-semibold tracking-widest uppercase">
      {eyebrow}
    </p>
    <h2 class="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
      {title}
    </h2>
    {#if description}
      <p class="text-muted-foreground mt-4 text-lg text-pretty">
        {description}
      </p>
    {/if}
  </div>

  <div class="mt-10">
    {@render children()}
  </div>
</section>
