<script lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '$lib/components/ui/accordion'
  import { FAQS } from '$lib/constants'
  import { reveal } from '$lib/reveal'
  import Section from './Section.svelte'
</script>

<Section id="faq" eyebrow="FAQ" title="Questions people ask first" class="max-w-3xl">
  <div {@attach reveal}>
    <Accordion type="single" class="w-full">
      {#each FAQS as faq, i (faq.question)}
        <AccordionItem value="faq-{i}">
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent class="text-muted-foreground text-pretty">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      {/each}
    </Accordion>
  </div>
</Section>
