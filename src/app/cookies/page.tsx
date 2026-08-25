import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SITE_NAME } from "@/lib/siteLinks";

export const metadata: Metadata = {
  title: "Cookies",
};

export default function CookiesPage() {
  return (
    <Section tone="white" className="!pt-12 md:!pt-16">
      <SectionHeading title="Cookies" />
      <div className="max-w-2xl space-y-4 text-base leading-[1.65] text-muted">
        <p>
          {SITE_NAME} puede utilizar cookies y tecnologías similares para el
          funcionamiento del sitio y, cuando estén configuradas, para medición
          de audiencia.
        </p>
        <p>
          Este texto es un borrador operativo. Reemplazalo con la política de
          cookies definitiva antes del lanzamiento.
        </p>
      </div>
    </Section>
  );
}
