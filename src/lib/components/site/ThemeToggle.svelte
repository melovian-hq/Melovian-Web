<script lang="ts">
  import MoonIcon from '@lucide/svelte/icons/moon'
  import SunIcon from '@lucide/svelte/icons/sun'
  import { Button } from '$lib/components/ui/button'
  import { theme } from '$lib/theme.svelte'
</script>

<Button
  variant="ghost"
  size="icon"
  onclick={() => theme.toggle()}
  aria-label="Toggle theme"
  title="Toggle theme"
>
  {#if theme.resolved === 'dark'}
    <SunIcon class="size-4" />
  {:else}
    <MoonIcon class="size-4" />
  {/if}
</Button>
