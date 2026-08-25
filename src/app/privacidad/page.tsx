import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SITE_NAME } from "@/lib/siteLinks";

export const metadata: Metadata = {
  title: "Política de privacidad",
};

export default function PrivacidadPage() {
  return (
    <Section tone="white" className="!pt-12 md:!pt-16">
      <SectionHeading title="Política de privacidad" />
      <div className="max-w-2xl space-y-4 text-base leading-[1.65] text-muted">
        <p>
          {SITE_NAME} puede utilizar herramientas de medición (por ejemplo Google
          Analytics, Google Tag Manager o Meta Pixel) cuando estén configuradas
          mediante variables de entorno. Esas herramientas pueden recopilar datos
          de uso de forma agregada.
        </p>
        <p>
          Si nos contactás por WhatsApp u otros canales externos, el tratamiento
          de esos datos se rige por las políticas de cada plataforma.
        </p>
        <p>
          Este texto es un borrador operativo. Reemplazalo con la política legal
          definitiva antes del lanzamiento.
        </p>
      </div>
    </Section>
  );
}
