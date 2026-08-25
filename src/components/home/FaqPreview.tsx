import { Section, SectionHeading } from "@/components/ui/Section";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { Button } from "@/components/ui/Button";
import type { FaqData } from "@/lib/faqTypes";

export function FaqPreview({ items }: { items: FaqData[] }) {
  return (
    <Section tone="white">
      <SectionHeading
        title="Cómo prevenir la meningitis"
        subtitle="Respuestas rápidas sobre prevención, vacunas y cuándo consultar."
      />
      <FaqAccordion items={items.slice(0, 4)} showCategories={false} />
      <div className="mt-8">
        <Button href="/faq" variant="secondary">
          Ver todas las preguntas
        </Button>
      </div>
    </Section>
  );
}
