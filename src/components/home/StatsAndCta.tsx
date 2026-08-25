import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { VACUNARSE_URL } from "@/lib/siteLinks";
import { TRACK } from "@/lib/analytics";

export function StatsSection() {
  return (
    <Section tone="white">
      <div className="max-w-2xl">
        <h2 className="text-[1.75rem] md:text-[2.5rem] leading-tight text-primary">
          Casi 1 entre 10 morirán.
        </h2>
        <p className="mt-4 text-base leading-[1.65] text-muted">
          Incluso con tratamiento, la meningitis bacteriana puede dejar
          secuelas graves o resultar fatal. La prevención con vacunas y la
          consulta temprana cambian el panorama.
        </p>
        <p className="mt-3 text-xs text-muted/80">
          Dato ilustrativo con fines de concientización. Consultá fuentes
          oficiales y profesionales de la salud para información clínica.
        </p>
      </div>
    </Section>
  );
}

export function FinalCtaSection() {
  return (
    <Section tone="light">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-[1.75rem] md:text-[2.5rem] leading-tight text-primary">
          ¿Por qué darles las vacunas?
        </h2>
        <p className="mt-4 text-base leading-[1.65] text-on-light">
          Porque prevenir es proteger. Hablá con tu médico sobre el esquema
          de vacunación indicado.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            href={VACUNARSE_URL}
            external
            variant="primary"
            trackEvent={TRACK.events.vacunarseClick}
            trackLocation="final-cta"
          >
            Vacunarse ahora
          </Button>
          <Button href="/vacunacion" variant="secondary">
            Ver información
          </Button>
        </div>
      </div>
    </Section>
  );
}
