"use client";

import { Fragment, useState } from "react";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import { VacunasEtapasPanel } from "@/components/vacunacion/VacunasEtapasPanel";
import type { VacunaEtapa, VacunacionData } from "@/lib/vacunacionData";
import { META_ADS_EVENTS, trackMetaAds } from "@/lib/metaAds";

export function VacunacionCalendarioSection({
  hero,
  calendarioIntro,
  calendarioPdfUrl,
  etapas,
}: {
  hero: VacunacionData["hero"];
  calendarioIntro: VacunacionData["calendarioIntro"];
  calendarioPdfUrl: string;
  etapas: VacunaEtapa[];
}) {
  const [activeId, setActiveId] = useState(etapas[0]?.id ?? "");
  const heroParagraphs = hero.body.split(/\n\n+/).filter(Boolean);

  return (
    <>
      <section className="bg-[#F4F1F8] px-5 pb-12 pt-10 md:px-8 md:pb-16 md:pt-14 lg:pt-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex max-w-2xl flex-col gap-6 lg:gap-8">
            <h1 className="animate-fade-up text-[32px] font-[900] leading-tight text-primary md:text-[40px] lg:text-[48px] lg:leading-[1.1]">
              {hero.title}
            </h1>
            <div className="animate-fade-up animate-delay-1 flex flex-col gap-4 text-[16px] leading-[26px] text-dark">
              {heroParagraphs.map((p) => (
                <p key={p.slice(0, 40)}>
                  <RichText text={p} strongClassName="font-semibold text-[#442748]" />
                </p>
              ))}
            </div>

            <div className="animate-fade-up animate-delay-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={calendarioPdfUrl}
                download="calendario-vacunacion-gsk-2026.pdf"
                onClick={() =>
                  trackMetaAds(
                    META_ADS_EVENTS.pdfVacunacion,
                    {
                      file: "calendario-vacunacion-gsk-2026.pdf",
                      location: "vacunacion_hero",
                    },
                    "Lead",
                  )
                }
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-[#DD876E] px-5 text-[15px] font-bold text-white transition hover:brightness-105 sm:w-auto sm:min-w-[240px]"
              >
                Descargar calendario
                <span className="material-symbols-outlined text-[20px] leading-none">
                  download
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="calendario"
        className="scroll-mt-20 bg-white px-5 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16"
      >
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-[11px] font-extrabold uppercase leading-[16.5px] tracking-[1.3px] text-accent">
                {calendarioIntro.eyebrow}
              </p>
              <h2 className="mt-2 text-[26px] font-black leading-8 text-primary md:text-[36px] md:leading-tight">
                {calendarioIntro.title}
              </h2>
              <p className="mt-4 text-[16px] leading-[26px] text-dark">
                {calendarioIntro.body
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((line, i, lines) => (
                    <Fragment key={`${i}-${line.slice(0, 24)}`}>
                      <RichText
                        text={line}
                        strongClassName="font-semibold text-[#442748]"
                      />
                      {i < lines.length - 1 ? <br /> : null}
                    </Fragment>
                  ))}
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <VacunasEtapasPanel
              etapas={etapas}
              selectLabel={calendarioIntro.selectLabel}
              activeId={activeId}
              onActiveIdChange={setActiveId}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
