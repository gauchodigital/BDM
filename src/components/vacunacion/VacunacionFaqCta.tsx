import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export function VacunacionFaqCta() {
  return (
    <section className="bg-white px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="flex max-w-xl flex-col items-start">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#DD876E]">
              Preguntas frecuentes
            </p>
            <h2 className="mt-3 text-[28px] font-extrabold leading-tight text-[#503C77] md:text-[2rem]">
              Todo lo que necesitás saber sobre las vacunas
            </h2>
            <Link
              href="/faq"
              className="mt-6 inline-flex h-[48px] w-fit items-center justify-center rounded-[10px] bg-[#503C77] px-8 text-[15px] font-bold text-white transition hover:brightness-110"
            >
              Resolvé tus dudas
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
