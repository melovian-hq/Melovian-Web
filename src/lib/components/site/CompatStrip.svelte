<script lang="ts">
  import FolderOpenIcon from '@lucide/svelte/icons/folder-open'
  import { LINKS } from '$lib/constants'
  import { reveal } from '$lib/reveal'
  import AirsonicIcon from './icons/AirsonicIcon.svelte'
  import JellyfinIcon from './icons/JellyfinIcon.svelte'
  import NavidromeIcon from './icons/NavidromeIcon.svelte'

  const COMPATIBLE_WITH = [
    { name: 'Navidrome', href: LINKS.navidrome, icon: NavidromeIcon },
    {
      name: 'Subsonic-compatible servers',
      href: LINKS.subsonic,
      icon: AirsonicIcon,
    },
    { name: 'Jellyfin', href: null, icon: JellyfinIcon, soon: true },
    { name: 'Local folders', href: LINKS.gettingStarted, icon: FolderOpenIcon },
  ]
</script>

<div
  {@attach reveal}
  class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-3 px-4 py-8 sm:px-6"
>
  <span class="text-muted-foreground mr-3 text-xs font-semibold tracking-widest uppercase">
    Works with
  </span>
  {#each COMPATIBLE_WITH as item (item.name)}
    {#if item.soon}
      <span
        class="border-border/70 bg-card/60 text-muted-foreground flex items-center gap-2 rounded-full border border-dashed px-3.5 py-1.5 text-sm font-medium"
      >
        <item.icon class="size-4" />
        {item.name}
        <span
          class="bg-primary/15 text-primary rounded-full px-1.5 py-px text-[10px] font-semibold tracking-wide uppercase"
          >Soon</span
        >
      </span>
    {:else}
      <a
        href={item.href}
        target="_blank"
        rel="external noopener noreferrer"
        class="border-border/70 bg-card/60 text-muted-foreground hover:border-border hover:text-foreground flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors"
      >
        <item.icon class="size-4" />
        {item.name}
      </a>
    {/if}
  {/each}
</div>
