<script lang="ts">
  import ExtensionCard from '$lib/components/extensions/ExtensionCard.svelte'
  import Section from '$lib/components/site/Section.svelte'
  import { Button } from '$lib/components/ui/button'
  import { SITE, SITE_URL, LINKS } from '$lib/constants'
  import { EXTENSIONS, REGISTRY } from '$lib/extensions/registry'
  import { reveal } from '$lib/reveal'

  const title = `Extensions | ${SITE.name}`
  const description =
    'Community extensions for Melovian. Each package is audited in CI, packaged as a zip, and verified by sha256 on install.'
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="{SITE_URL}/extensions" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content="{SITE_URL}/extensions" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
</svelte:head>

<Section
  id="extensions"
  eyebrow="Extensions"
  title="Customize the player"
  description="Extensions restyle tracks, inject themes, and decorate the player. Every package in the registry passes a CI audit that enforces the same sandbox rules Melovian applies at install time."
>
  {#if EXTENSIONS.length === 0}
    <p class="text-muted-foreground">
      No extensions are listed yet. The registry lives in the
      <a
        class="text-primary decoration-primary/40 underline underline-offset-4 transition-colors hover:decoration-primary"
        href={LINKS.extensionsRepo}
        target="_blank"
        rel="external noopener noreferrer"
      >
        Melovian-Extensions repo</a
      >.
    </p>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each EXTENSIONS as entry, i (entry.id)}
        <div {@attach reveal} style="transition-delay: {(i % 3) * 80}ms">
          <ExtensionCard {entry} />
        </div>
      {/each}
    </div>
    <p class="text-muted-foreground mt-6 text-sm">
      Install in Melovian under Settings, Extensions: use the registry browser, or drop the
      downloaded .zip on the upload box. Package checksums are verified before install.
      {#if REGISTRY.generatedAt}
        Registry updated {REGISTRY.generatedAt.slice(0, 10)}.
      {/if}
      Want to publish one? Read the
      <a
        class="text-primary decoration-primary/40 underline underline-offset-4 transition-colors hover:decoration-primary"
        href="{LINKS.extensionsRepo}/blob/main/CONTRIBUTING.md"
        target="_blank"
        rel="external noopener noreferrer">contribution guide</a
      >.
    </p>
    <div class="mt-4">
      <Button
        variant="outline"
        href={LINKS.extensionsRepo}
        target="_blank"
        rel="external noopener noreferrer"
        class="w-fit"
      >
        Browse the registry repo
      </Button>
    </div>
  {/if}
</Section>
