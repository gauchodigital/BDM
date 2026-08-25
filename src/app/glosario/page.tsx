import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { readGlosario } from "@/lib/glosarioData";

export const metadata: Metadata = {
  title: "Glosario",
  description: "Términos frecuentes sobre meningitis, explicados en lenguaje claro.",
};

export const dynamic = "force-dynamic";

export default function GlosarioPage() {
  const terms = readGlosario().filter((t) => t.visible);

  return (
    <Section tone="cream" className="!pt-12 md:!pt-16">
      <SectionHeading
        title="Glosario"
        subtitle="Un nombre difícil de pronunciar, explicado paso a paso."
      />
      <dl className="max-w-2xl divide-y divide-primary/10 border-y border-primary/10">
        {terms.map((t) => (
          <div key={t.id} className="py-5">
            <dt className="font-[family-name:var(--font-headline)] text-lg font-bold text-primary">
              {t.term}
            </dt>
            <dd className="mt-2 text-base leading-[1.65] text-muted">
              {t.definition}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
