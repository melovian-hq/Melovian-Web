<script lang="ts">
  import { page } from '$app/state'
  import { Dialog } from 'bits-ui'
  import PanelLeftIcon from '@lucide/svelte/icons/panel-left'
  import XIcon from '@lucide/svelte/icons/x'
  import type { Snippet } from 'svelte'
  import DocsSidebar from '$lib/components/docs/DocsSidebar.svelte'
  import { Button } from '$lib/components/ui/button'

  let { children }: { children: Snippet } = $props()

  let drawerOpen = $state(false)

  // Close the mobile drawer on navigation.
  $effect(() => {
    void page.url.pathname
    drawerOpen = false
  })
</script>

<div class="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
  <div class="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
    <aside class="hidden lg:block">
      <div class="sticky top-24">
        <DocsSidebar />
      </div>
    </aside>

    <div class="min-w-0">
      <div class="mb-6 lg:hidden">
        <Button variant="outline" size="sm" onclick={() => (drawerOpen = true)}>
          <PanelLeftIcon />
          Browse docs
        </Button>
      </div>

      {@render children()}
    </div>
  </div>
</div>

<Dialog.Root bind:open={drawerOpen}>
  <Dialog.Portal>
    <Dialog.Overlay
      class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60"
    />
    <Dialog.Content
      class="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left fixed inset-y-0 left-0 z-50 w-72 border-r p-5 shadow-2xl outline-none"
    >
      <div class="mb-4 flex items-center justify-between">
        <Dialog.Title class="font-semibold">Documentation</Dialog.Title>
        <Dialog.Close
          class="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
          aria-label="Close"
        >
          <XIcon class="size-5" />
        </Dialog.Close>
      </div>
      <DocsSidebar />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
