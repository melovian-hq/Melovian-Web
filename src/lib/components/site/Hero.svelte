<script lang="ts">
  import PlayIcon from '@lucide/svelte/icons/play'
  import { asset } from '$app/paths'
  import { Button } from '$lib/components/ui/button'
  import { LINKS, SITE } from '$lib/constants'
  import { reveal } from '$lib/reveal'
  import GithubIcon from './GithubIcon.svelte'

  // Deterministic bar field so the prerendered HTML matches hydration.
  const BARS = Array.from({ length: 56 }, (_, i) => {
    const a = Math.sin(i * 127.1 + 311.7) * 0.5 + 0.5
    const b = Math.sin(i * 269.5 + 183.3) * 0.5 + 0.5
    return {
      height: 16 + a * 84,
      duration: 1.4 + b * 1.9,
      delay: -a * 3.2,
    }
  })
</script>

<div class="relative overflow-hidden">
  <div
    class="from-surface-glow/25 pointer-events-none absolute inset-x-0 -top-40 h-[34rem] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,var(--tw-gradient-from),transparent_70%)]"
    aria-hidden="true"
  ></div>

  <!-- Audio spectrum backdrop -->
  <div
    class="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] overflow-hidden [mask-image:linear-gradient(to_top,black_40%,transparent)]"
    aria-hidden="true"
  >
    <div class="mx-auto flex h-full max-w-6xl items-end justify-center gap-[3px] px-2">
      {#each BARS as bar, i (i)}
        <div
          class="eq-bar min-w-[3px] max-w-3 flex-1"
          style="--h: {bar.height}%; --d: {bar.duration}s; --dl: {bar.delay}s"
        ></div>
      {/each}
    </div>
  </div>

  <div
    class="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-16 pb-14 text-center sm:px-6 sm:pt-24"
  >
    <div {@attach reveal} class="flex flex-col items-center">
      <h1 class="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
        Every music library you control, in one app
      </h1>

      <p class="text-muted-foreground mt-6 max-w-2xl text-lg text-pretty sm:text-xl">
        {SITE.name} connects to Navidrome and other Subsonic-compatible servers, indexes local folders,
        and plays it all on desktop, mobile, and the web. Free and open source.
      </p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" href={LINKS.releases} target="_blank" rel="noopener noreferrer">
          Download {SITE.name}
        </Button>
        <Button
          size="lg"
          variant="outline"
          href={LINKS.demo}
          target="_blank"
          rel="noopener noreferrer"
        >
          <PlayIcon />
          Try the live demo
        </Button>
        <Button
          size="lg"
          variant="ghost"
          href={LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon />
          GitHub
        </Button>
      </div>

      <p class="text-muted-foreground mt-4 text-sm">
        No account needed. Works with the server and folders you already have.
      </p>
    </div>

    <div {@attach reveal} class="relative mt-9 w-full max-w-5xl">
      <div
        class="bg-surface-glow/20 absolute -inset-x-8 top-8 bottom-0 rounded-[3rem] blur-3xl"
        aria-hidden="true"
      ></div>
      <div class="border-border/70 bg-card relative overflow-hidden rounded-xl border shadow-2xl">
        <div
          class="border-border/70 flex items-center gap-1.5 border-b px-4 py-2.5"
          aria-hidden="true"
        >
          <span class="bg-muted-foreground/30 size-2.5 rounded-full"></span>
          <span class="bg-muted-foreground/30 size-2.5 rounded-full"></span>
          <span class="bg-muted-foreground/30 size-2.5 rounded-full"></span>
        </div>
        <img
          src={asset('/screenshots/desktop-dark-home.webp')}
          alt="{SITE.name} home screen browsing a music library"
          class="block w-full"
          width="1440"
          height="900"
          fetchpriority="high"
        />
      </div>
    </div>
  </div>
</div>
