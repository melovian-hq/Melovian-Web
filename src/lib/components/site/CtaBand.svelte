<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { LINKS, SITE } from '$lib/constants'
  import { reveal } from '$lib/reveal'
</script>

<section>
  <div
    {@attach reveal}
    class="relative mx-auto w-full max-w-6xl overflow-hidden px-4 py-20 text-center sm:px-6"
  >
    <div
      class="from-surface-glow/20 pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_50%_80%_at_50%_100%,var(--tw-gradient-from),transparent_70%)]"
      aria-hidden="true"
    ></div>
    <div class="relative">
      <h2 class="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Point it at your server. Press play.
      </h2>
      <p class="text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
        {SITE.name} is free, open source, and runs on the hardware you already own.
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
          Try the live demo
        </Button>
      </div>
    </div>
  </div>
</section>
