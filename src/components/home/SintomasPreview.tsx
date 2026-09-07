import Link from "next/link";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import { SintomasMobileTimeline } from "@/components/sintomas/SintomasTimeline";
import { SintomasDesktopTimelineLegacy } from "@/components/sintomas/SintomasDesktopTimelineLegacy";
import { ADULTOS_TIMELINE, splitTimeline } from "@/lib/sintomasPageContent";

const HOME_WARNING =
  "Ante la presencia de estos síntomas, consultá al médico.";

export function SintomasPreview({
  showMoreLink = true,
  headingAs = "h2",
}: {
  showMoreLink?: boolean;
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

        {showMoreLink && (
          <Reveal delay={200}>
            <div className="mt-8 flex justify-center lg:mt-6">
              <Link
                href="/sintomas"
                className="flex w-full min-w-[200px] items-center justify-center gap-2 rounded-[10px] bg-primary px-8 py-3.5 text-[15px] font-bold text-white transition hover:brightness-110 lg:w-auto"
              >
                Conocé más
                <span aria-hidden className="text-lg leading-none">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
