<script lang="ts">
  import { resolve } from '$app/paths'
  import { Button } from '$lib/components/ui/button'

  let { status, message }: { status: number; message?: string } = $props()

  const notFound = $derived(status === 404)
  const heading = $derived(notFound ? 'This page is off the record' : 'Something broke')
  const detail = $derived(
    notFound
      ? 'The link may be broken, or the page moved. The rest of the site still plays.'
      : (message ?? 'An unexpected error occurred.'),
  )
</script>

<div
  class="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6"
>
  <p
    class="from-primary to-primary/40 bg-gradient-to-b bg-clip-text text-[clamp(5rem,18vw,10rem)] leading-none font-bold tracking-tighter text-transparent select-none"
  >
    {status}
  </p>
  <h1 class="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{heading}</h1>
  <p class="text-muted-foreground mt-3 max-w-md text-pretty">{detail}</p>
  <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
    <Button href={resolve('/')}>Back to home</Button>
    <Button variant="outline" href={resolve('/docs')}>Browse the docs</Button>
  </div>
</div>
