import type { Metadata } from "next";
import { SintomasPageView } from "@/components/sintomas/SintomasPageView";
import { VacunasCtaSection } from "@/components/home/VacunasCtaSection";

export const metadata: Metadata = {
  title: "Síntomas",
  description: "Síntomas habituales de la meningitis.",
};

export const dynamic = "force-dynamic";

export default function SintomasPage() {
  return (
    <>
      <SintomasPageView />
      <VacunasCtaSection showUrgency />
    </>
  );
}
