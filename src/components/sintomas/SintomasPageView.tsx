"use client";

import { useState } from "react";
import { RichText } from "@/components/ui/RichText";
import {
  PhaseHeader,
  SymptomCard,
  SintomasMobileTimeline,
} from "@/components/sintomas/SintomasTimeline";
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
            <h1 className="text-[28px] font-[900] leading-tight text-[#503C77] md:text-[40px] lg:text-[48px] lg:leading-[1.08]">
              {SINTOMAS_PAGE.hero.title}
            </h1>
            <p className="mt-4 text-[15px] leading-[1.6] text-dark md:text-[16px]">
              <RichText text={SINTOMAS_PAGE.hero.body} />
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Grupo etario"
            className="mt-8 flex flex-wrap gap-2"
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
                  className={`inline-flex h-10 items-center rounded-full px-4 text-[13px] font-bold transition ${
                    active
                      ? "bg-primary text-white shadow-[0_4px_12px_rgba(80,60,119,0.25)]"
                      : "border border-[#D8D4DE] bg-white text-dark/55 hover:text-dark"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8" key={sub} role="tabpanel">
            <SintomasMobileTimeline
              early={early}
              alarm={alarm}
              warningText={WARNING_SHORT}
              showWarningMarker
              className="relative md:hidden"
            />

            <div className="hidden gap-6 md:grid md:grid-cols-2 lg:gap-8">
              {early.length > 0 ? (
                <div className="rounded-[16px] bg-[#F3F0F8] p-6 lg:p-8">
                  <PhaseHeader phase="early" showTimelineDot={false} />
                  <ul className="flex flex-col gap-3">
                    {early.map((s) => (
                      <li key={s.id}>
                        <SymptomCard item={s} phase="early" />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {alarm.length > 0 ? (
                <div className="rounded-[16px] bg-[#FDF0EC] p-6 lg:p-8">
                  <PhaseHeader phase="alarm" showTimelineDot={false} />
                  <ul className="flex flex-col gap-3">
                    {alarm.map((s) => (
                      <li key={s.id}>
                        <SymptomCard item={s} phase="alarm" />
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-start gap-3">
                    <span
                      className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EF4444] text-white"
                      aria-hidden
                    >
                      <span className="material-symbols-outlined text-[18px] leading-none">
                        warning
                      </span>
                    </span>
                    <div className="flex-1 rounded-[8px] bg-[#FEF2F2] px-4 py-[14px] shadow-[inset_0_0_0_2px_#EF4444]">
                      <p className="text-[12px] font-bold leading-snug text-[#7F1D1D]">
                        {WARNING_SHORT}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
