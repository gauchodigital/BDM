import type { Metadata } from "next";
import { RichText } from "@/components/ui/RichText";
import { VacunasEtapasPanel } from "@/components/vacunacion/VacunasEtapasPanel";
import { CentrosVacunacionBlock } from "@/components/vacunacion/CentrosVacunacionBlock";
import { readCentros } from "@/lib/readCentros";
import { readVacunacion } from "@/lib/vacunacionData";

export const metadata: Metadata = {
  title: "Vacunación",
  description:
    "Calendario Nacional de Vacunación: etapas de la vida, vacunas recomendadas y centros.",
};

export const dynamic = "force-dynamic";

export default function VacunacionPage() {
  const data = readVacunacion();
  const centros = readCentros();
  const heroParagraphs = data.hero.body.split(/\n\n+/).filter(Boolean);

  return (
    <>
      <section className="bg-white px-5 pb-10 pt-16 md:px-8 md:pb-16 md:pt-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto flex max-w-2xl flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h1 className="text-[32px] font-black leading-normal text-primary">
                {data.hero.title}
              </h1>
              <div className="flex flex-col gap-1 text-[16px] leading-[26px] text-dark">
                {heroParagraphs.map((p) => (
                  <p key={p.slice(0, 40)}>
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            </div>

            <a
              href={data.calendarioPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-accent text-[16px] font-bold leading-6 text-on-accent transition hover:brightness-105"
            >
              Descargar calendario
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/vacunacion/download.svg"
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-16 md:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-extrabold uppercase leading-[16.5px] tracking-[1.3px] text-accent">
                  {data.calendarioIntro.eyebrow}
                </p>
                <h2 className="text-[26px] font-black leading-8 text-primary">
                  {data.calendarioIntro.title}
                </h2>
              </div>
              <p className="text-[16px] leading-[26px] text-dark">
                <RichText text={data.calendarioIntro.body} />
              </p>
            </div>

            <VacunasEtapasPanel
              etapas={data.etapas}
              selectLabel={data.calendarioIntro.selectLabel}
            />
          </div>
        </div>
      </section>

      <CentrosVacunacionBlock {...data.centros} centros={centros} />
    </>
  );
}
