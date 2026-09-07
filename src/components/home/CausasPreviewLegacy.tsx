import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import type { CausaData } from "@/lib/causasData";

const CARD_CLASS =
  "flex h-full flex-col gap-2.5 rounded-[12px] border border-[#E5E5E5] bg-white p-5 shadow-[0_2px_12px_rgba(68,39,75,0.08)]";

/** Causas sin efecto spotlight (versión anterior). */
export function CausasPreviewLegacy({ causas }: { causas: CausaData[] }) {
  return (
    <>
      <section id="causas" className="section-pad scroll-mt-16 bg-white">
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

          <div className="mt-8 flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {causas.map((causa, i) => (
              <Reveal key={causa.id} delay={i * 70} className="h-full">
                <article className={CARD_CLASS}>
                  <Chip label={causa.tagLabel} color={causa.tagColor} />
                  <h3 className="text-[26px] font-extrabold leading-tight text-primary lg:text-[22px]">
                    {causa.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-muted lg:flex-1">
                    <RichText text={causa.description} />
                  </p>
                  <Link
                    href={`/causas/${causa.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Aprender más
                    <span aria-hidden>→</span>
                  </Link>
                </article>
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
