import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { VideoKnowSection } from "@/components/home/VideoKnowSection";
import { CausasPreview } from "@/components/home/CausasPreview";
import { SintomasPreview } from "@/components/home/SintomasPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { DatosSection } from "@/components/home/DatosSection";
import { VacunasCtaSection } from "@/components/home/VacunasCtaSection";
import { readCausas } from "@/lib/causasData";
import { readSintomas } from "@/lib/sintomasData";
import { readTestimonios } from "@/lib/testimoniosData";
import { readDatos } from "@/lib/datosData";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const causas = readCausas().filter((c) => c.visible);
  const sintomas = readSintomas().filter((s) => s.visible);
  const testimonios = readTestimonios().filter((t) => t.visible);
  const datos = readDatos().filter((d) => d.visible);

  return (
    <>
      <HeroSection />
      <IntroSection />
      <VideoKnowSection />
      <CausasPreview causas={causas} />
      <SintomasPreview sintomas={sintomas} />
      <TestimonialsSection testimonios={testimonios} />
      <DatosSection items={datos} />
      <VacunasCtaSection />
    </>
  );
}
