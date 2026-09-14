<script lang="ts">
  import { asset } from '$app/paths'
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs'
  import { SCREENSHOTS } from '$lib/constants'
  import { reveal } from '$lib/reveal'
  import { cn } from '$lib/utils'
  import Section from './Section.svelte'

  let active = $state(SCREENSHOTS[0].id)
</script>

<Section
  id="screenshots"
  eyebrow="Screenshots"
  title="Dark and light, desktop and mobile"
  description="The same interface runs as a desktop app, on Android and iOS, and in the browser from the Docker server mode."
>
  <div {@attach reveal}>
    <Tabs bind:value={active}>
      <TabsList class="mx-auto flex h-auto flex-wrap">
        {#each SCREENSHOTS as shot (shot.id)}
          <TabsTrigger value={shot.id}>{shot.label}</TabsTrigger>
        {/each}
      </TabsList>

      <div class="mt-8">
        {#each SCREENSHOTS as shot (shot.id)}
          <TabsContent value={shot.id} class="mt-0">
            <div
              class={cn(
                'mx-auto overflow-hidden rounded-xl border shadow-2xl',
                shot.device === 'mobile' ? 'max-w-sm' : 'max-w-5xl',
              )}
            >
              <img
                src={asset(shot.src)}
                alt={shot.alt}
                class="block w-full"
                width={shot.device === 'mobile' ? 780 : 1440}
                height={shot.device === 'mobile' ? 1688 : 900}
                loading="lazy"
              />
            </div>
          </TabsContent>
        {/each}
      </div>
    </Tabs>
  </div>
</Section>
