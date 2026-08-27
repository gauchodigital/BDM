"use client";

import { useState } from "react";
import { RichText } from "@/components/ui/RichText";
import { VacunasEtapasPanel } from "@/components/vacunacion/VacunasEtapasPanel";
import { downloadEtapaCalendario } from "@/lib/downloadEtapaCalendario";
import type { VacunaEtapa, VacunacionData } from "@/lib/vacunacionData";

export function VacunacionCalendarioSection({
  hero,
  calendarioIntro,
  etapas,
}: {
  hero: VacunacionData["hero"];
  calendarioIntro: VacunacionData["calendarioIntro"];
  etapas: VacunaEtapa[];
}) {
  const [activeId, setActiveId] = useState(etapas[0]?.id ?? "");
  const active = etapas.find((e) => e.id === activeId) ?? etapas[0];
  const heroParagraphs = hero.body.split(/\n\n+/).filter(Boolean);

  async function onDownload() {
    if (!active) return;
    await downloadEtapaCalendario(active);
  }

  return (
    <>
      <section className="bg-[#F4F1F8] px-5 pb-12 pt-10 md:px-8 md:pb-16 md:pt-14 lg:pt-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex max-w-2xl flex-col gap-6 lg:gap-8">
            <h1 className="text-[32px] font-[900] leading-tight text-primary md:text-[40px] lg:text-[48px] lg:leading-[1.1]">
              {hero.title}
            </h1>
            <div className="flex flex-col gap-4 text-[16px] leading-[26px] text-dark">
              {heroParagraphs.map((p) => (
                <p key={p.slice(0, 40)}>
                  <RichText text={p} strongClassName="font-bold text-accent" />
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => void onDownload()}
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-[#DD876E] px-5 text-[15px] font-bold text-[#503C77] transition hover:brightness-105 sm:w-auto sm:min-w-[240px]"
              >
                Descargar calendario
                <span className="material-symbols-outlined text-[20px] leading-none">
                  download
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="calendario"
        className="scroll-mt-20 bg-white px-5 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-[11px] font-extrabold uppercase leading-[16.5px] tracking-[1.3px] text-accent">
              {calendarioIntro.eyebrow}
            </p>
            <h2 className="mt-2 text-[26px] font-black leading-8 text-primary md:text-[36px] md:leading-tight">
              {calendarioIntro.title}
            </h2>
            <p className="mt-4 text-[16px] leading-[26px] text-dark">
              <RichText text={calendarioIntro.body} />
            </p>
          </div>

          <VacunasEtapasPanel
            etapas={etapas}
            selectLabel={calendarioIntro.selectLabel}
            activeId={activeId}
            onActiveIdChange={setActiveId}
          />
        </div>
      </section>
    </>
  );
}
