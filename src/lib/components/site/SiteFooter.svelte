<script lang="ts">
  import { resolve } from '$app/paths'
  import RssIcon from '@lucide/svelte/icons/rss'
  import { LINKS, SITE } from '$lib/constants'
  import LogoMark from './LogoMark.svelte'
</script>

<footer class="border-t">
  <div
    class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between"
  >
    <div class="flex items-center gap-2.5">
      <LogoMark class="size-6" />
      <div class="flex flex-col">
        <span class="font-semibold">{SITE.name}</span>
        <span class="text-muted-foreground text-xs">
          {SITE.license} open source
        </span>
      </div>
    </div>

    <nav
      class="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
      aria-label="Footer"
    >
      <a
        class="hover:text-foreground transition-colors"
        href={LINKS.github}
        target="_blank"
        rel="external noopener noreferrer"
      >
        GitHub
      </a>
      <a
        class="hover:text-foreground transition-colors"
        href={LINKS.releases}
        target="_blank"
        rel="external noopener noreferrer"
      >
        Releases
      </a>
      <a class="hover:text-foreground transition-colors" href={resolve('/changelog')}>
        Changelog
      </a>
      <a class="hover:text-foreground transition-colors" href={resolve('/store')}> Store </a>
      <a class="hover:text-foreground transition-colors" href={resolve('/docs')}> Docs </a>
      <a
        class="hover:text-foreground transition-colors"
        href={LINKS.issues}
        target="_blank"
        rel="external noopener noreferrer"
      >
        Issues
      </a>
      <a
        class="hover:text-foreground transition-colors"
        href={LINKS.license}
        target="_blank"
        rel="external noopener noreferrer"
      >
        License
      </a>
      <a
        class="hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
        href={LINKS.releasesAtom}
        target="_blank"
        rel="external noopener noreferrer"
        title="Release feed (Atom)"
      >
        <RssIcon class="size-3.5" />
        Release feed
      </a>
    </nav>
  </div>
</footer>
