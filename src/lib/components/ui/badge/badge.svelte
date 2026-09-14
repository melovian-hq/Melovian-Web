<script lang="ts" module>
  import { cn, type WithElementRef } from '$lib/utils'
  import type { HTMLAttributes } from 'svelte/elements'
  import { tv, type VariantProps } from 'tailwind-variants'

  export const badgeVariants = tv({
    base: 'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3',
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
        outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  })

  export type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

  export type BadgeProps = WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
    variant?: BadgeVariant
    href?: string
  }
</script>

<script lang="ts">
  let {
    class: className,
    variant = 'default',
    ref = $bindable(null),
    href,
    children,
    ...restProps
  }: BadgeProps = $props()
</script>

<svelte:element
  this={href ? 'a' : 'span'}
  bind:this={ref}
  data-slot="badge"
  {href}
  class={cn(badgeVariants({ variant }), className)}
  {...restProps}
>
  {@render children?.()}
</svelte:element>
