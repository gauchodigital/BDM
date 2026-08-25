import type { Metadata } from "next";
import { SintomasPreview } from "@/components/home/SintomasPreview";
import { VacunasCtaSection } from "@/components/home/VacunasCtaSection";
import { readSintomas } from "@/lib/sintomasData";

export const metadata: Metadata = {
  title: "Síntomas",
  description: "Síntomas habituales de la meningitis.",
};

export const dynamic = "force-dynamic";

export default function SintomasPage() {
  const sintomas = readSintomas().filter((s) => s.visible);

  return (
    <>
      <SintomasPreview
        sintomas={sintomas}
        showMoreLink={false}
        headingAs="h1"
      />
      <VacunasCtaSection showUrgency />
    </>
  );
}
