import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import { CausaSpotlightCard } from "@/components/home/CausaSpotlightCard";
import type { CausaData } from "@/lib/causasData";

export function CausasPreview({ causas }: { causas: CausaData[] }) {
  return (
    <>
      <section id="causas" className="section-pad scroll-mt-16 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F6FB_45%,#FFFFFF_100%)]">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
          <Reveal>
            <div className="max-w-2xl lg:max-w-none">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
                ¿Cómo se clasifica?
              </p>
              <h2 className="mt-3 text-[28px] font-extrabold leading-tight text-primary md:text-[2.5rem]">
                Causas de meningitis
              </h2>
              <p className="mt-4 text-[15px] leading-[1.55] text-dark">
                La meningitis puede ser clasificada por su causa: bacteriana (la
                más grave), viral (la más común), por hongos o parásitos. Si bien
                hay tipos más frecuentes o más graves que otros,{" "}
                <strong className="font-semibold text-[#442748]">
                  es imprescindible la visita a un médico
                </strong>{" "}
                para que pueda determinar la causa y el tratamiento
                correspondiente.
                <sup className="text-[0.7em] text-muted">3</sup>
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:gap-6 xl:grid-cols-4">
            {causas.map((causa, i) => (
              <Reveal key={causa.id} delay={i * 70} className="h-full">
                <CausaSpotlightCard causa={causa} ctaLabel="Aprender más" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary">
        <div className="px-6 py-10 md:px-8 md:py-12">
          <Reveal>
            <p className="mx-auto max-w-7xl text-[1.25rem] font-normal leading-snug text-white md:text-center md:text-[1.5rem]">
              La meningitis es una{" "}
              <strong className="font-bold text-[#DD876E]">
                urgencia médica
              </strong>{" "}
              <strong className="font-bold text-white">
                y requiere consulta y hospitalización
              </strong>{" "}
              inmediata
              <sup className="text-[0.65em] text-white/70">1</sup>.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
