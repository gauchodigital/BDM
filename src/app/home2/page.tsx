import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { VideoKnowSection } from "@/components/home/VideoKnowSection";
import { CausasPreviewLegacy } from "@/components/home/CausasPreviewLegacy";
import { SintomasPreviewLegacy } from "@/components/home/SintomasPreviewLegacy";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { DatosSection } from "@/components/home/DatosSection";
import { VacunasCtaSection } from "@/components/home/VacunasCtaSection";
import { CompromisoSocialSection } from "@/components/home/CompromisoSocialSection";
import { PediatraConsultPopup } from "@/components/engagement/PediatraConsultPopup";
import { readCausas } from "@/lib/causasData";
import { readTestimonios } from "@/lib/testimoniosData";
import { readDatos } from "@/lib/datosData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home (versión anterior)",
  robots: { index: false, follow: false },
};

/** Home con timeline horizontal de síntomas y causas sin spotlight (para comparar). */
export default function Home2Page() {
  const causas = readCausas().filter((c) => c.visible);
  const testimonios = readTestimonios().filter((t) => t.visible);
  const datos = readDatos().filter((d) => d.visible);

  return (
    <>
      <HeroSection />
      <IntroSection />
      <VideoKnowSection />
      <CausasPreviewLegacy causas={causas} />
      <SintomasPreviewLegacy />
      <TestimonialsSection testimonios={testimonios} />
      <DatosSection items={datos} />
      <VacunasCtaSection />
      <CompromisoSocialSection />
      <PediatraConsultPopup />
    </>
  );
}
