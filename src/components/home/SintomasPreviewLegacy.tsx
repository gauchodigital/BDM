"use client";

import Link from "next/link";
import { useState } from "react";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import { SintomasMobileTimeline } from "@/components/sintomas/SintomasTimeline";
import { SintomasDesktopTimelineLegacy } from "@/components/sintomas/SintomasDesktopTimelineLegacy";
import {
  ADULTOS_TIMELINE,
  LACTANTES_RN_TIMELINE,
  LACTANTES_SUBTABS,
  splitTimeline,
} from "@/lib/sintomasPageContent";

const HOME_WARNING =
  "Ante la presencia de estos síntomas, consultá al médico.";

/** Vista previa de síntomas con timeline desktop horizontal (versión anterior). */
export function SintomasPreviewLegacy({
  showMoreLink = true,
  headingAs = "h2",
}: {
  showMoreLink?: boolean;
  headingAs?: "h1" | "h2";
}) {
  const [sub, setSub] = useState<(typeof LACTANTES_SUBTABS)[number]["id"]>(
    "lactantes-rn",
  );
  const timeline =
    sub === "lactantes-rn" ? LACTANTES_RN_TIMELINE : ADULTOS_TIMELINE;
  const { early, alarm } = splitTimeline(timeline);
  const Heading = headingAs;

  return (
    <section id="sintomas" className="section-pad scroll-mt-16 bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <Reveal>
          <div className="max-w-2xl lg:max-w-none">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
              ¿Cómo reconocerla?
            </p>
            <Heading className="mt-3 text-[28px] font-[900] leading-tight text-[#503C77] md:text-[2.5rem]">
              Síntomas habituales de la meningitis
            </Heading>
            <p className="mt-4 text-[14px] leading-[1.55] text-dark md:text-[16px] md:leading-[1.6]">
              <RichText text="Las manifestaciones clínicas de los pacientes con meningitis varían en función de la causa, la evolución de la enfermedad, la edad y otros factores[1,3]. Reconocer los síntomas a tiempo puede salvar una vida." />
            </p>
          </div>
        </Reveal>

        <div
          role="tablist"
          aria-label="Grupo etario"
          className="mt-8 grid grid-cols-2 gap-2 md:flex md:w-fit"
        >
          {LACTANTES_SUBTABS.map((t) => {
            const active = t.id === sub;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSub(t.id)}
                className={`flex min-h-10 items-center justify-center rounded-full px-2 py-2.5 text-center text-[11px] font-bold leading-snug transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:inline-flex md:h-10 md:whitespace-nowrap md:px-4 md:py-0 md:text-[13px] ${
                  active
                    ? "scale-[1.02] bg-primary text-white shadow-[0_4px_12px_rgba(80,60,119,0.25)]"
                    : "border border-[#D8D4DE] bg-white text-dark/55 hover:scale-[1.01] hover:text-dark"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <SintomasMobileTimeline
          key={sub}
          early={early}
          alarm={alarm}
          warningText={HOME_WARNING}
          className="relative mt-8 md:hidden"
        />

        <SintomasDesktopTimelineLegacy
          key={`desktop-legacy-${sub}`}
          early={early}
          alarm={alarm}
          warningText={HOME_WARNING}
          className="relative mt-10 hidden md:block"
        />

        {showMoreLink && (
          <Reveal delay={200}>
            <Link
              href="/sintomas"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-[10px] bg-primary py-3.5 text-[15px] font-bold text-white transition hover:brightness-110 md:inline-flex md:w-auto md:min-w-[200px] md:px-8"
            >
              Conocé más
              <span aria-hidden className="text-lg leading-none">
                →
              </span>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
