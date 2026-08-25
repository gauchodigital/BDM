import type { Metadata } from "next";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { RichText } from "@/components/ui/RichText";
import { readCausas } from "@/lib/causasData";

export const metadata: Metadata = {
  title: "Causas",
  description:
    "Tipos de meningitis: bacteriana, viral, fúngica y parasitaria.",
};

export const dynamic = "force-dynamic";

const CARD_CLASS =
  "flex flex-col gap-6 rounded-[12px] border border-[#e2e8f0] bg-white p-5 shadow-[2px_2px_6px_rgba(54,50,118,0.1)]";

export default function CausasPage() {
  const causas = readCausas().filter((c) => c.visible);

  return (
    <>
      <section className="bg-white px-5 pb-10 pt-16 md:px-8 md:pt-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-[32px] font-black leading-normal text-[#503c77]">
              Causas de la meningitis
            </h1>
            <p className="mt-4 text-[16px] leading-[26px] text-[#442748]">
              La meningitis puede ser clasificada por su causa: bacteriana (la
              más grave), viral (la más común), por hongos o parásitos. Si bien
              hay tipos más frecuentes o más graves que otros, es{" "}
              <strong className="font-bold text-[#442748]">
                imprescindible la visita a un médico
              </strong>{" "}
              para que pueda determinar la causa y el tratamiento
              correspondiente.
              <sup className="text-[0.7em] text-muted">3</sup>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-16 md:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto flex max-w-2xl flex-col gap-6">
            {causas.map((causa) => (
              <article key={causa.id} className={CARD_CLASS}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Chip label={causa.tagLabel} color={causa.tagColor} />
                    <h2 className="text-[24px] font-bold leading-9 text-[#442748]">
                      {causa.title}
                    </h2>
                  </div>
                  <p className="text-[14px] leading-[21px] text-[#442748]">
                    <RichText text={causa.description} />
                  </p>
                </div>
                <Link
                  href={`/causas/${causa.slug}`}
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold leading-[21px] text-[#503c77] hover:underline"
                >
                  Aprender más
                  <span
                    className="material-symbols-outlined text-[16px] leading-none"
                    aria-hidden
                  >
                    open_in_new
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#503c77]">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-bold uppercase leading-[16.8px] tracking-[1.3px] text-[#dd876e]">
                compromiso social
              </p>
              <h2 className="text-[28px] font-bold leading-9 !text-white">
                Por un mundo sin meningitis
              </h2>
            </div>
            <p className="text-[16px] leading-[26px] text-white/85">
              Nos unimos al compromiso de la Organización Mundial de la Salud
              para poner fin a la meningitis para el 2030
              <sup className="text-[0.65em] text-white/70">22</sup>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
