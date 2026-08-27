import type { Metadata } from "next";
import { VacunacionCalendarioSection } from "@/components/vacunacion/VacunacionCalendarioSection";
import { CentrosVacunacionBlock } from "@/components/vacunacion/CentrosVacunacionBlock";
import { VacunacionFaqCta } from "@/components/vacunacion/VacunacionFaqCta";
import { readCentros } from "@/lib/readCentros";
import { readVacunacion } from "@/lib/vacunacionData";

export const metadata: Metadata = {
  title: "Vacunación",
  description:
    "Calendario Nacional de Vacunación: etapas de la vida, vacunas recomendadas y centros.",
};

export const dynamic = "force-dynamic";

export default function VacunacionPage() {
  const data = readVacunacion();
  const centros = readCentros();

  return (
    <>
      <VacunacionCalendarioSection
        hero={data.hero}
        calendarioIntro={data.calendarioIntro}
        etapas={data.etapas}
      />
      <CentrosVacunacionBlock {...data.centros} centros={centros} />
      <VacunacionFaqCta />
    </>
  );
}
