import Link from "next/link";

export function VacunasCtaSection({
  showUrgency = false,
}: {
  showUrgency?: boolean;
}) {
  return (
    <>
      {showUrgency ? (
        <section className="bg-[#503C77]">
          <div className="border-l-4 border-[#DD876E] px-6 py-10 md:px-8 md:py-12">
            <p className="mx-auto max-w-2xl text-[1.25rem] font-normal leading-snug text-white">
              La meningitis es una{" "}
              <strong className="font-bold text-[#DD876E]">
                urgencia médica
              </strong>{" "}
              <strong className="font-bold text-white">
                y requiere consulta y hospitalización inmediata
              </strong>
              <sup className="text-[0.65em] text-white/70">1</sup>.
            </p>
          </div>
        </section>
      ) : null}

      <section className="bg-[#503C77]">
        <div className="mx-auto w-full max-w-2xl px-6 py-10 text-left md:px-8 md:py-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#DD876E]">
            Chequeá tu calendario de vacunación
          </p>
          <h2 className="mt-3 text-[28px] font-black leading-tight !text-white">
            ¿Estás al día con las vacunas?
          </h2>
          <p className="mt-3 text-[14px] leading-[1.55] text-white/70">
            Respondé y descubrí si tu familia está protegida.
          </p>
          <Link
            href="/vacunacion"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-[10px] bg-white py-3.5 text-[15px] font-bold text-[#503C77] transition hover:bg-white/95"
          >
            Comenzar
            <span aria-hidden className="text-lg leading-none">
              →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
