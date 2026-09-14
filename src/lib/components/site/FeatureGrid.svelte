<script lang="ts">
  import AudioLinesIcon from '@lucide/svelte/icons/audio-lines'
  import CommandIcon from '@lucide/svelte/icons/command'
  import DownloadIcon from '@lucide/svelte/icons/download'
  import FolderIcon from '@lucide/svelte/icons/folder-open'
  import HistoryIcon from '@lucide/svelte/icons/history'
  import MicIcon from '@lucide/svelte/icons/mic-vocal'
  import MonitorSmartphoneIcon from '@lucide/svelte/icons/monitor-smartphone'
  import ServerIcon from '@lucide/svelte/icons/server'
  import SpeakerIcon from '@lucide/svelte/icons/speaker'
  import SparklesIcon from '@lucide/svelte/icons/sparkles'
  import TagIcon from '@lucide/svelte/icons/tag'
  import UsersRoundIcon from '@lucide/svelte/icons/users-round'
  import type { Component } from 'svelte'
  import { Card, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card'
  import { FEATURES } from '$lib/constants'
  import { reveal } from '$lib/reveal'
  import Section from './Section.svelte'

  const icons: Record<string, Component> = {
    server: ServerIcon,
    folder: FolderIcon,
    sparkles: SparklesIcon,
    mic: MicIcon,
    tag: TagIcon,
    download: DownloadIcon,
    command: CommandIcon,
    'audio-lines': AudioLinesIcon,
    speaker: SpeakerIcon,
    'monitor-smartphone': MonitorSmartphoneIcon,
    'users-round': UsersRoundIcon,
    history: HistoryIcon,
  }
</script>

<Section
  id="features"
  eyebrow="Features"
  title="One player for servers, folders, and everything in them"
  description="Melovian treats a Subsonic server and a folder on disk as the same thing: a library you browse, search, and play without switching apps."
>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each FEATURES as feature, i (feature.title)}
      {@const Icon = icons[feature.icon]}
      <div {@attach reveal} style="transition-delay: {(i % 3) * 80}ms">
        <Card class="hover:border-primary/40 hover:bg-card/80 h-full transition-colors">
          <CardHeader>
            <div
              class="bg-primary/10 text-primary mb-2 flex size-10 items-center justify-center rounded-lg"
            >
              <Icon class="size-5" />
            </div>
            <CardTitle class="text-base">{feature.title}</CardTitle>
            <CardDescription class="text-pretty">
              {feature.description}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    {/each}
  </div>
</Section>
