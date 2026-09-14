<script lang="ts">
  import { cn } from '$lib/utils'

  let { class: className }: { class?: string } = $props()
</script>

<svg viewBox="0 0 1024 1024" role="img" aria-label="Melovian" class={cn('size-6', className)}>
  <path
    fill="currentColor"
    d="M199.68 839.68 L199.68 184.32 L512.00 498.89 L824.32 184.32 L824.32 839.68 L689.15 839.68 L689.15 367.82 L512.00 656.18 L334.85 367.82 L334.85 839.68 Z"
  />
</svg>
