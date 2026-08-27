import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * CTA de vacunas.
 * - Default (home): bloque violeta autotest.
 * - showUrgency (síntomas): banner urgencia + CTA calendario, antes de Referencias.
 *   Ref: Figma 1765:16266
 */
export function VacunasCtaSection({
  showUrgency = false,
}: {
  showUrgency?: boolean;
}) {
  if (showUrgency) {
    return (
      <>
        {/* Banner urgencia — Figma: barra coral izq, px 16 / py 64, “urgencia médica” en coral */}
        <section className="bg-[#503C77]">
          <div className="mx-auto flex max-w-7xl">
            <span className="w-2 shrink-0 bg-[#DD876E]" aria-hidden />
            <p className="flex-1 px-4 py-16 text-[20px] font-medium leading-[1.4] text-white">
              La meningitis es una{" "}
              <strong className="font-bold text-[#DD876E]">urgencia médica</strong>{" "}
              y{" "}
              <strong className="font-bold text-white">
                requiere consulta y hospitalización
              </strong>{" "}
              inmediata
              <sup className="text-[0.65em] font-bold text-white">1</sup>.
            </p>
          </div>
        </section>

        {/* CTA calendario */}
        <section className="bg-white px-5 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="max-w-xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#DD876E]">
                  Calendario nacional de vacunación
                </p>
                <h2 className="mt-3 text-[28px] font-black leading-tight text-[#503C77] md:text-[2.5rem]">
                  Vacunación es prevención
                </h2>
                <p className="mt-3 text-[14px] leading-[1.55] text-[#6B6570] md:text-[16px]">
                  Protección en cada etapa de tu vida.
                </p>
                <Link
                  href="/vacunacion"
                  className="mt-8 flex w-full items-center justify-center rounded-[10px] bg-[#503C77] px-6 py-3.5 text-[15px] font-bold text-white transition hover:brightness-110 sm:inline-flex sm:w-auto"
                >
                  Ver calendario de vacunación
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </>
    );
  }

  return (
    <section className="bg-[#503C77]">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <Reveal>
          <div className="max-w-2xl text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#DD876E]">
              Chequeá tu calendario de vacunación
            </p>
            <h2 className="mt-3 text-[28px] font-[900] leading-tight !text-white md:text-[2.5rem]">
              ¿Estás al día con las vacunas?
            </h2>
            <p className="mt-3 text-[14px] leading-[1.55] text-white/85 md:text-[16px]">
              Respondé y descubrí si tu familia está protegida.
            </p>
            <Link
              href="/autotest"
              className="mt-8 flex h-[52px] w-full items-center justify-center rounded-full bg-white px-8 text-[15px] font-bold text-[#503C77] transition hover:bg-white/95"
            >
              Comenzar
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
