<script lang="ts">
  import { page } from '$app/state'
  import { resolve } from '$app/paths'
  import MenuIcon from '@lucide/svelte/icons/menu'
  import XIcon from '@lucide/svelte/icons/x'
  import { slide } from 'svelte/transition'
  import { Button } from '$lib/components/ui/button'
  import { LINKS, NAV_ITEMS, SITE } from '$lib/constants'
  import GithubIcon from './GithubIcon.svelte'
  import LogoMark from './LogoMark.svelte'
  import ThemeToggle from './ThemeToggle.svelte'

  let menuOpen = $state(false)

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') menuOpen = false
  }
</script>

<svelte:window onkeydown={onKeydown} />

<header
  class="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
>
  <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
    <a
      href={resolve('/')}
      class="flex items-center gap-2.5 font-semibold tracking-tight"
      aria-label="{SITE.name} home"
    >
      <LogoMark class="size-7" />
      <span class="text-lg">{SITE.name}</span>
    </a>

    <nav class="hidden items-center gap-1 md:flex" aria-label="Primary">
      {#each NAV_ITEMS as item (item.href)}
        {@const active = !item.href.includes('#') && page.url.pathname.startsWith(item.href)}
        <a
          href={resolve(item.href)}
          aria-current={active ? 'page' : undefined}
          class={active
            ? 'text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors'
            : 'text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors'}
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        href={LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Melovian on GitHub"
      >
        <GithubIcon class="size-4" />
      </Button>
      <ThemeToggle />
      <Button
        href={LINKS.releases}
        target="_blank"
        rel="noopener noreferrer"
        class="ml-2 hidden sm:inline-flex"
      >
        Download
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="md:hidden"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
        onclick={() => (menuOpen = !menuOpen)}
      >
        {#if menuOpen}
          <XIcon class="size-5" />
        {:else}
          <MenuIcon class="size-5" />
        {/if}
      </Button>
    </div>
  </div>

  {#if menuOpen}
    <nav
      id="mobile-nav"
      transition:slide={{ duration: 180 }}
      class="bg-background/95 absolute inset-x-0 top-full border-b px-4 py-3 shadow-xl backdrop-blur md:hidden"
      aria-label="Mobile"
    >
      {#each NAV_ITEMS as item (item.href)}
        <a
          href={resolve(item.href)}
          class="text-muted-foreground hover:text-foreground block rounded-md px-3 py-2.5 text-base font-medium"
          onclick={() => (menuOpen = false)}
        >
          {item.label}
        </a>
      {/each}
      <Button href={LINKS.releases} target="_blank" rel="noopener noreferrer" class="mt-2 w-full">
        Download
      </Button>
    </nav>
  {/if}
</header>
