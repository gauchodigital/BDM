"use client";

import { useState } from "react";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";
import { SintomasMobileTimeline } from "@/components/sintomas/SintomasTimeline";
import { SintomasDesktopTimelineLegacy } from "@/components/sintomas/SintomasDesktopTimelineLegacy";
import {
  ADULTOS_TIMELINE,
  LACTANTES_RN_TIMELINE,
  LACTANTES_SUBTABS,
  SINTOMAS_PAGE,
  splitTimeline,
} from "@/lib/sintomasPageContent";

const WARNING_SHORT =
  "Ante la presencia de estos síntomas, consultá al médico.";

export function SintomasPageView() {
  const [sub, setSub] = useState<(typeof LACTANTES_SUBTABS)[number]["id"]>(
    "lactantes-rn",
  );

  const timeline =
    sub === "lactantes-rn" ? LACTANTES_RN_TIMELINE : ADULTOS_TIMELINE;
  const { early, alarm } = splitTimeline(timeline);

  return (
    <>
      <section className="bg-white px-5 pb-8 pt-10 md:px-8 md:pb-10 md:pt-14 lg:pt-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
            <h1 className="animate-fade-up text-[28px] font-[900] leading-tight text-[#503C77] md:text-[40px] lg:text-[48px] lg:leading-[1.08]">
              {SINTOMAS_PAGE.hero.title}
            </h1>
            <p className="animate-fade-up animate-delay-1 mt-4 text-[15px] leading-[1.6] text-dark md:text-[16px]">
              <RichText text={SINTOMAS_PAGE.hero.body} />
            </p>
          </div>

          <Reveal delay={80}>
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
          </Reveal>

          <div className="mt-8 animate-fade-up" key={sub} role="tabpanel">
            <SintomasMobileTimeline
              early={early}
              alarm={alarm}
              warningText={WARNING_SHORT}
              showWarningMarker
              className="relative lg:hidden"
            />

            <SintomasDesktopTimelineLegacy
              early={early}
              alarm={alarm}
              warningText={WARNING_SHORT}
              showWarningMarker
              className="relative hidden lg:block"
            />
          </div>
        </div>
      </section>
    </>
  );
}
