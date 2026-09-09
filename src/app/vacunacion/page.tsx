import type { Metadata } from "next";
import { VacunacionCalendarioSection } from "@/components/vacunacion/VacunacionCalendarioSection";
import { CentrosVacunacionMap } from "@/components/vacunacion/CentrosVacunacionMap";
import { VacunacionFaqCta } from "@/components/vacunacion/VacunacionFaqCta";
import { readVacunacion } from "@/lib/vacunacionData";

export const metadata: Metadata = {
  title: "Vacunación",
  description:
    "Calendario Nacional de Vacunación: etapas de la vida, vacunas recomendadas y centros.",
};

export const dynamic = "force-dynamic";

export default function VacunacionPage() {
  const data = readVacunacion();

  return (
    <>
      <VacunacionCalendarioSection
        hero={data.hero}
        calendarioIntro={data.calendarioIntro}
        calendarioPdfUrl={data.calendarioPdfUrl}
        etapas={data.etapas}
      />
      <CentrosVacunacionMap
        eyebrow={data.centros.eyebrow}
        title={data.centros.title}
        body={data.centros.body}
        paso1Label={data.centros.paso1Label}
        placeholder={data.centros.placeholder}
        disclaimer={data.centros.disclaimer}
      />
      <VacunacionFaqCta />
    </>
  );
}
