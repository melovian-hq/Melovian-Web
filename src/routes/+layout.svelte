<script lang="ts">
  import type { Snippet } from 'svelte'
  import SiteFooter from '$lib/components/site/SiteFooter.svelte'
  import SiteHeader from '$lib/components/site/SiteHeader.svelte'
  import { theme } from '$lib/theme.svelte'
  import '../app.css'

  let { children }: { children: Snippet } = $props()

  $effect(() => {
    document.documentElement.classList.toggle('dark', theme.resolved === 'dark')
  })
</script>

<a
  href="#main"
  class="bg-background text-foreground sr-only z-[60] rounded-md px-3 py-2 text-sm font-medium focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:shadow-lg"
>
  Skip to content
</a>

<div class="flex min-h-svh flex-col">
  <SiteHeader />
  <main id="main" class="flex-1">
    {@render children()}
  </main>
  <SiteFooter />
</div>
