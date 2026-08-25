import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { readFaq } from "@/lib/faqData";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Todo lo que necesitás saber sobre la meningitis y las vacunas.",
};

export const dynamic = "force-dynamic";

export default function FaqPage() {
  const items = readFaq().filter((f) => f.visible);

  return (
    <>
      <section className="bg-white px-5 pb-6 pt-16 md:px-8 md:pt-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-[28px] font-black leading-normal text-[#503c77]">
              Todo lo que necesitas saber sobre la meningitis y las vacunas
            </h1>
            <p className="mt-4 text-[16px] leading-[26px] text-[#442748]">
              Seleccioná una categoría para explorar las preguntas.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-16 md:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-2xl">
            <FaqAccordion items={items} />
          </div>
        </div>
      </section>

      <section className="bg-[#503c77]">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
          <div className="mx-auto flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-bold uppercase leading-[16.8px] tracking-[1.3px] text-[#dd876e]">
                  ¿Dónde me vacuno?
                </p>
                <h2 className="text-[28px] font-bold leading-9 !text-white">
                  Encontrá tu centro de vacunación
                </h2>
              </div>
              <p className="text-[15px] leading-6 text-white/85">
                Buscá el vacunatorio más cercano según tu ubicación.
              </p>
            </div>
            <Link
              href="/vacunacion"
              className="inline-flex h-[52px] w-full items-center justify-center rounded-[10px] bg-white px-6 text-[16px] font-semibold text-[#503c77] transition hover:bg-white/95"
            >
              Ver centros disponibles →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
