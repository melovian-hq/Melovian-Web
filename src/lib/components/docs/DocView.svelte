<script lang="ts">
  import { resolve } from '$app/paths'
  import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
  import ArrowRightIcon from '@lucide/svelte/icons/arrow-right'
  import PencilIcon from '@lucide/svelte/icons/pencil'
  import type { Attachment } from 'svelte/attachments'
  import { docHtml, docPager, DOCS, editUrl, manifest } from '$lib/docs/docs'
  import DocsToc from './DocsToc.svelte'

  let { slug }: { slug: string } = $props()

  const html = $derived(docHtml(slug))
  const pager = $derived(docPager(slug))
  const meta = $derived(DOCS.find((d) => d.slug === slug))

  type TocItem = { id: string; text: string; depth: number }
  let tocItems = $state<TocItem[]>([])

  const COPY_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'
  const CHECK_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'

  // Enhances rendered markdown: heading TOC, in-page anchor clicks, and a
  // copy button on each code block.
  const enhance: Attachment<HTMLElement> = (node) => {
    void html // re-run when the rendered doc changes

    tocItems = Array.from(node.querySelectorAll('h2, h3')).map((h) => ({
      id: h.id,
      text: h.textContent?.replace(/^#\s*/, '') ?? '',
      depth: Number(h.tagName[1]),
    }))

    node.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.doc-copy')) return
      pre.classList.add('doc-pre')
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'doc-copy'
      button.ariaLabel = 'Copy code'
      button.innerHTML = COPY_ICON
      button.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.innerText ?? pre.innerText
        try {
          await navigator.clipboard.writeText(code)
          button.innerHTML = CHECK_ICON
          setTimeout(() => (button.innerHTML = COPY_ICON), 2000)
        } catch {
          // clipboard unavailable, leave icon as-is
        }
      })
      pre.appendChild(button)
    })
  }

  const syncedLabel = manifest.syncedAt
    ? new Date(manifest.syncedAt).toLocaleDateString('en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null
</script>

{#if html === null}
  <div class="py-16 text-center">
    <h1 class="text-2xl font-semibold">Page not found</h1>
    <p class="text-muted-foreground mt-2">
      That doc does not exist. <a href={resolve('/docs')} class="text-primary">Back to docs</a>.
    </p>
  </div>
{:else}
  <div class="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-10">
    <article class="min-w-0">
      <nav class="text-muted-foreground mb-4 text-sm" aria-label="Breadcrumb">
        <a href={resolve('/docs')} class="hover:text-foreground transition-colors">Docs</a>
        <span class="mx-1.5">/</span>
        <span class="text-foreground">{meta?.title}</span>
      </nav>

      <div {@attach enhance} class="prose prose-neutral dark:prose-invert doc-content max-w-[75ch]">
        <!-- markdown is synced from the Melovian repo, a trusted source -->
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html html}
      </div>

      <div
        class="border-border mt-12 flex items-center justify-between gap-4 border-t pt-6 text-sm"
      >
        <a
          href={editUrl(slug)}
          target="_blank"
          rel="external noopener noreferrer"
          class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
        >
          <PencilIcon class="size-3.5" />
          Edit this page
        </a>
        {#if syncedLabel}
          <span class="text-muted-foreground">Synced {syncedLabel}</span>
        {/if}
      </div>

      <nav class="mt-6 grid grid-cols-2 gap-4" aria-label="Page navigation">
        {#if pager.prev}
          <a
            href={resolve(`/docs/${pager.prev.slug}`)}
            class="border-border hover:border-primary/50 group flex flex-col rounded-lg border p-4 transition-colors"
          >
            <span class="text-muted-foreground flex items-center gap-1 text-xs"
              ><ArrowLeftIcon class="size-3.5" /> Previous</span
            >
            <span class="mt-1 font-medium group-hover:text-primary">{pager.prev.title}</span>
          </a>
        {:else}
          <span></span>
        {/if}
        {#if pager.next}
          <a
            href={resolve(`/docs/${pager.next.slug}`)}
            class="border-border hover:border-primary/50 group flex flex-col rounded-lg border p-4 text-right transition-colors"
          >
            <span class="text-muted-foreground flex items-center justify-end gap-1 text-xs"
              >Next <ArrowRightIcon class="size-3.5" /></span
            >
            <span class="mt-1 font-medium group-hover:text-primary">{pager.next.title}</span>
          </a>
        {/if}
      </nav>
    </article>

    <aside class="hidden xl:block">
      <div class="sticky top-24">
        <DocsToc items={tocItems} />
      </div>
    </aside>
  </div>
{/if}
