<script lang="ts">
  import { resolve } from '$app/paths'
  import LogoMark from '$lib/components/site/LogoMark.svelte'
  import { Badge } from '$lib/components/ui/badge'
  import { Card, CardContent, CardHeader } from '$lib/components/ui/card'
  import { priceLabel, statusLabel, stockLabel, type StoreItem } from '$lib/store/store'
  import MoneroIcon from './icons/MoneroIcon.svelte'
  import StripeIcon from './icons/StripeIcon.svelte'

  let { item }: { item: StoreItem } = $props()
</script>

<a
  href={resolve(`/store/${item.id}`)}
  class="group focus-visible:ring-ring block rounded-xl outline-none focus-visible:ring-2"
>
  <Card
    class="hover:border-primary/40 h-full overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
  >
    <div class="thumb">
      {#if item.model === 'big-box'}
        <div class="thumb-box">
          <LogoMark class="text-primary size-8" />
          <span class="thumb-name">MELOVIAN</span>
          <span class="thumb-edition">BIG BOX</span>
        </div>
      {/if}
      <div class="absolute top-3 right-3 flex flex-col items-end gap-1.5">
        <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
          {statusLabel(item)}
        </Badge>
        {#if item.edition}
          <Badge variant="outline" class="border-amber-500/50 text-amber-600 dark:text-amber-400">
            {item.edition}
          </Badge>
        {/if}
      </div>
    </div>

    <CardHeader class="pb-2">
      <h3 class="group-hover:text-primary text-lg font-semibold tracking-tight transition-colors">
        {item.name}
      </h3>
      <p class="text-muted-foreground text-sm">{item.tagline}</p>
    </CardHeader>

    <CardContent class="space-y-3">
      <div class="flex items-baseline gap-4 text-sm">
        <span class="text-foreground font-semibold">{priceLabel(item)}</span>
        <span class="text-muted-foreground">{stockLabel(item)}</span>
      </div>
      <div class="text-muted-foreground flex items-center gap-3 text-xs">
        <span class="inline-flex items-center gap-1.5"><StripeIcon class="size-3.5" />Stripe</span>
        <span class="inline-flex items-center gap-1.5"><MoneroIcon class="size-3.5" />Monero</span>
      </div>
    </CardContent>
  </Card>
</a>

<style>
  .thumb {
    position: relative;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(80% 90% at 50% 110%, rgba(164, 104, 243, 0.18), transparent 65%),
      linear-gradient(160deg, #17131f, #0d0b13);
    border-bottom: 1px solid var(--border);
  }
  .thumb-box {
    width: 92px;
    height: 124px;
    border-radius: 4px;
    border: 1px solid rgba(164, 104, 243, 0.4);
    background: linear-gradient(160deg, #241c33, #120e1b);
    box-shadow:
      10px 8px 0 -2px #0a0810,
      10px 8px 20px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transform: rotate(-4deg);
    transition: transform 0.25s ease;
  }
  .group:hover .thumb-box {
    transform: rotate(-2deg) translateY(-3px);
  }
  .thumb-name {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.16em;
    color: #ece7f8;
  }
  .thumb-edition {
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 0.24em;
    color: #d4af5f;
  }
</style>
