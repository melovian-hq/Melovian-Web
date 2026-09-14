<script lang="ts">
  import CheckIcon from '@lucide/svelte/icons/check'
  import ContainerIcon from '@lucide/svelte/icons/container'
  import CopyIcon from '@lucide/svelte/icons/copy'
  import LaptopIcon from '@lucide/svelte/icons/laptop'
  import MonitorIcon from '@lucide/svelte/icons/monitor'
  import SmartphoneIcon from '@lucide/svelte/icons/smartphone'
  import TabletSmartphoneIcon from '@lucide/svelte/icons/tablet-smartphone'
  import TerminalIcon from '@lucide/svelte/icons/terminal'
  import type { Component } from 'svelte'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card'
  import { DOCKER_COMMANDS, LINKS, PLATFORMS } from '$lib/constants'
  import { reveal } from '$lib/reveal'
  import Section from './Section.svelte'

  const icons: Record<string, Component> = {
    terminal: TerminalIcon,
    monitor: MonitorIcon,
    laptop: LaptopIcon,
    smartphone: SmartphoneIcon,
    'tablet-smartphone': TabletSmartphoneIcon,
    container: ContainerIcon,
  }

  let copied = $state(false)
  let copiedTimer: ReturnType<typeof setTimeout> | undefined

  async function copyCommands() {
    try {
      await navigator.clipboard.writeText(DOCKER_COMMANDS.join('\n'))
      copied = true
      clearTimeout(copiedTimer)
      copiedTimer = setTimeout(() => (copied = false), 2000)
    } catch {
      copied = false
    }
  }
</script>

<Section
  id="platforms"
  eyebrow="Platforms"
  title="Desktop, mobile, and a headless server"
  description="Every build ships from the same release page. The Docker image runs the whole app in a browser tab with per-user accounts."
>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each PLATFORMS as platform, i (platform.name)}
      {@const Icon = icons[platform.icon]}
      <div {@attach reveal} style="transition-delay: {(i % 3) * 80}ms">
        <Card class="h-full">
          <CardHeader>
            <div class="flex items-center gap-3">
              <div
                class="bg-secondary text-foreground flex size-9 items-center justify-center rounded-lg"
              >
                <Icon class="size-4" />
              </div>
              <CardTitle class="text-base">{platform.name}</CardTitle>
            </div>
            <CardDescription class="text-pretty">
              {platform.detail}
            </CardDescription>
          </CardHeader>
          <CardContent class="mt-auto flex flex-wrap gap-1.5">
            {#each platform.formats as format (format)}
              <Badge variant="secondary">{format}</Badge>
            {/each}
          </CardContent>
        </Card>
      </div>
    {/each}
  </div>

  <div
    {@attach reveal}
    class="border-border/70 bg-card mt-10 flex flex-col gap-5 rounded-xl border p-6 lg:flex-row lg:items-center lg:justify-between"
  >
    <div class="shrink-0 text-center lg:text-left">
      <p class="font-medium">Run the web build yourself</p>
      <p class="text-muted-foreground mt-1 text-sm">
        One image. Accounts, single sign-on, and monitoring metrics included.
      </p>
    </div>
    <div class="bg-muted/60 relative min-w-0 flex-1 rounded-lg border lg:max-w-2xl">
      <Button
        variant="ghost"
        size="icon"
        onclick={copyCommands}
        aria-label="Copy docker commands"
        class="absolute top-2 right-2 size-8"
      >
        {#if copied}
          <CheckIcon class="size-4" />
        {:else}
          <CopyIcon class="size-4" />
        {/if}
      </Button>
      <div
        class="text-foreground flex flex-col gap-1.5 px-4 py-3.5 pr-12 font-mono text-[13px] leading-relaxed sm:text-sm"
      >
        {#each DOCKER_COMMANDS as command (command)}
          <div class="flex gap-2.5">
            <span class="text-muted-foreground select-none" aria-hidden="true">$</span>
            <code
              class="min-w-0 break-all whitespace-pre-wrap sm:break-normal sm:[overflow-wrap:anywhere]"
              >{command}</code
            >
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div {@attach reveal} class="mt-8 text-center">
    <Button size="lg" href={LINKS.releases} target="_blank" rel="noopener noreferrer">
      Get the latest release
    </Button>
  </div>
</Section>
