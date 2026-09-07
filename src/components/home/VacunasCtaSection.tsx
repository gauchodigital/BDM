import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

function UrgencyBannerText({ className = "" }: { className?: string }) {
  return (
    <p className={className}>
      La meningitis es una{" "}
      <strong className="font-bold text-[#DD876E]">urgencia médica</strong> y{" "}
      <strong className="font-bold text-white">
        requiere consulta y hospitalización
      </strong>{" "}
      inmediata
      <sup className="text-[0.65em] font-bold text-white">1</sup>.
    </p>
  );
}

/**
 * CTA de vacunas.
 * - Default (home): bloque violeta autotest.
 * - showUrgency (síntomas): franja urgencia + CTA calendario, antes de Referencias.
 */
export function VacunasCtaSection({
  showUrgency = false,
}: {
  showUrgency?: boolean;
}) {
  if (showUrgency) {
    return (
      <>
        <section className="bg-[#503C77]">
          <div className="flex md:hidden">
            <span className="w-2 shrink-0 bg-[#DD876E]" aria-hidden />
            <UrgencyBannerText className="flex-1 px-4 py-12 text-[17px] font-medium leading-[1.45] text-white" />
          </div>
          <div className="hidden px-6 py-14 md:block md:px-8 lg:py-16">
            <UrgencyBannerText className="mx-auto max-w-3xl text-center text-[20px] font-medium leading-[1.4] text-white lg:text-[22px]" />
          </div>
        </section>

        <section className="border-t border-[#E8E4EF] bg-white px-5 py-12 md:px-8 md:py-14">
          <div className="mx-auto max-w-7xl md:flex md:items-center md:justify-between md:gap-10">
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
              </div>
            </Reveal>
            <Link
              href="/vacunacion"
              className="mt-6 flex w-full shrink-0 items-center justify-center rounded-[10px] bg-[#503C77] px-6 py-3.5 text-[15px] font-bold text-white transition hover:brightness-110 md:mt-0 md:w-auto md:px-8"
            >
              Ver calendario de vacunación
            </Link>
          </div>
        </section>
      </>
    );
  }
  return (
    <section className="bg-[#503C77]">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-16">
        <Reveal>
          <div className="flex max-w-2xl flex-col gap-6 text-left lg:max-w-none lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div className="flex flex-col gap-4 lg:max-w-2xl">
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-bold uppercase leading-[16.8px] tracking-[1.3px] text-[#DD876E]">
                  Chequeá tu calendario de vacunación
                </p>
                <h2 className="text-[28px] font-bold leading-[36px] tracking-normal text-white">
                  ¿Estás al día con las vacunas?
                </h2>
              </div>
              <p className="text-[15px] leading-6 text-white/85">
                Respondé y descubrí si tu familia está protegida.
              </p>
            </div>
            <Link
              href="/autotest"
              className="flex h-[52px] w-full items-center justify-center rounded-[10px] bg-white px-6 text-[16px] font-semibold text-[#503C77] transition hover:bg-white/95 lg:w-auto lg:shrink-0 lg:px-14"
            >
              Comenzar
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
