import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import { SintomasMobileTimeline } from "@/components/sintomas/SintomasTimeline";
import { SintomasDesktopTimelineLegacy } from "@/components/sintomas/SintomasDesktopTimelineLegacy";
import { ADULTOS_TIMELINE, splitTimeline } from "@/lib/sintomasPageContent";

const HOME_WARNING =
  "Ante la presencia de estos síntomas, consultá al médico.";

export function SintomasPreview({
  headingAs = "h2",
}: {
  headingAs?: "h1" | "h2";
}) {
  const { early, alarm } = splitTimeline(ADULTOS_TIMELINE);
  const Heading = headingAs;

  return (
    <section id="sintomas" className="section-pad scroll-mt-16 bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <Reveal>
          <div className="max-w-2xl lg:max-w-none">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
              ¿Cómo reconocerla?
            </p>
            <Heading className="mt-3 text-[28px] font-[900] leading-tight text-[#503C77] md:text-[2.5rem]">
              Síntomas habituales de la meningitis
            </Heading>
            <p className="mt-4 text-[14px] leading-[1.55] text-dark md:text-[16px] md:leading-[1.6]">
              <RichText text="Las manifestaciones clínicas de los pacientes con meningitis varían en función de la causa, la evolución de la enfermedad, la edad y otros factores[1,3]. Reconocer los síntomas a tiempo puede salvar una vida." />
            </p>
          </div>
        </Reveal>

        <SintomasMobileTimeline
          early={early}
          alarm={alarm}
          warningText={HOME_WARNING}
          className="relative mt-8 lg:hidden"
        />

        <SintomasDesktopTimelineLegacy
          early={early}
          alarm={alarm}
          warningText={HOME_WARNING}
          className="relative mt-10 hidden lg:block"
        />
      </div>
    </section>
  );
}
