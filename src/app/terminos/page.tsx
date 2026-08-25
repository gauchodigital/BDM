import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SITE_NAME } from "@/lib/siteLinks";

export const metadata: Metadata = {
  title: "Términos de uso",
};

export default function TerminosPage() {
  return (
    <Section tone="white" className="!pt-12 md:!pt-16">
      <SectionHeading title="Términos de uso" />
      <div className="max-w-2xl space-y-4 text-base leading-[1.65] text-muted">
        <p>
          El contenido de {SITE_NAME} es informativo y de concientización. No
          constituye consejo médico, diagnóstico ni tratamiento.
        </p>
        <p>
          Ante cualquier síntoma o duda de salud, consultá a un profesional
          calificado. En emergencias, dirigite al centro de salud más cercano o
          llamá a los servicios de urgencia.
        </p>
        <p>
          Este texto es un borrador operativo. Reemplazalo con los términos
          legales definitivos antes del lanzamiento.
        </p>
      </div>
    </Section>
  );
}
