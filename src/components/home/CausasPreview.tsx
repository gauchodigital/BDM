import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { RichText } from "@/components/ui/RichText";
import type { CausaData } from "@/lib/causasData";

/** Spec Figma card: fill #FFF, radius 12, border 1px, shadow, pad 20, gap 10 */
const CARD_CLASS =
  "flex flex-col gap-2.5 rounded-[12px] border border-[#E5E5E5] bg-white p-5 shadow-[0_2px_12px_rgba(68,39,75,0.08)]";

export function CausasPreview({ causas }: { causas: CausaData[] }) {
  return (
    <>
      <section id="causas" className="scroll-mt-16 bg-white section-pad">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
          <div className="mx-auto max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
              ¿Cómo se clasifica?
            </p>
            <h2 className="mt-3 text-[28px] font-extrabold leading-tight text-primary">
              Causas de meningitis
            </h2>
            <p className="mt-4 text-[15px] leading-[1.55] text-dark">
              La meningitis puede ser clasificada por su causa: bacteriana (la más
              grave), viral (la más común), por hongos o parásitos. Si bien hay
              tipos más frecuentes o más graves que otros,{" "}
              <strong className="font-bold text-primary">
                es imprescindible la visita a un médico
              </strong>{" "}
              para que pueda determinar la causa y el tratamiento
              correspondiente.
              <sup className="text-[0.7em] text-muted">3</sup>
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {causas.map((causa) => (
                <article key={causa.id} className={CARD_CLASS}>
                  <Chip label={causa.tagLabel} color={causa.tagColor} />
                  <h3 className="text-[24px] font-extrabold leading-tight text-primary">
                    {causa.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-muted">
                    <RichText text={causa.description} />
                  </p>
                  <Link
                    href={`/causas/${causa.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Aprender más
                    <span
                      className="material-symbols-outlined text-[1.1rem] leading-none"
                      aria-hidden
                    >
                      open_in_new
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary">
        <div className="border-l-4 border-[#DD876E] px-6 py-10 md:px-8 md:py-12">
          <p className="mx-auto max-w-2xl text-[1.25rem] font-normal leading-snug text-white">
            La meningitis es una{" "}
            <strong className="font-bold text-[#DD876E]">urgencia médica</strong>{" "}
            <strong className="font-bold text-white">
              y requiere consulta y hospitalización
            </strong>{" "}
            inmediata
            <sup className="text-[0.65em] text-white/70">1</sup>.
          </p>
        </div>
      </section>
    </>
  );
}
