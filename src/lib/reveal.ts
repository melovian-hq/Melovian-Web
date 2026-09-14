import type { Attachment } from 'svelte/attachments'

/*
 * Scroll-reveal attachment. Adds .reveal on mount and .is-visible when the
 * element enters the viewport. Styles live in app.css and honor
 * prefers-reduced-motion.
 */
export const reveal: Attachment<HTMLElement> = (node) => {
  node.classList.add('reveal')

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  )

  observer.observe(node)
  return () => observer.disconnect()
}
