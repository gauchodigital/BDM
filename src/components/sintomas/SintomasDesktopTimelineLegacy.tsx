"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { SintomaData } from "@/lib/sintomasData";
import {
  DEFAULT_WARNING,
  PhaseHeader,
  SINTOMA_PHASE_UI,
  SymptomCard,
} from "@/components/sintomas/SintomasTimeline";

function useTimelineScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFill(1);
      return;
    }

    let raf = 0;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Completa la animación en ~40% del viewport, sin depender de toda la altura del bloque.
      const start = vh * 0.82;
      const end = vh * 0.38;
      const range = start - end;
      setFill(
        range > 0
          ? Math.max(0, Math.min(1, (start - rect.top) / range))
          : 1,
      );
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return fill;
}

/** Timeline desktop horizontal: línea con 3 nodos + dos columnas de tarjetas. */
export function SintomasDesktopTimelineLegacy({
  early,
  alarm,
  warningText = DEFAULT_WARNING,
  showWarningMarker = true,
  className = "relative mt-10 hidden lg:block",
}: {
  early: SintomaData[];
  alarm: SintomaData[];
  warningText?: string;
  showWarningMarker?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fill = useTimelineScrollProgress(ref);

  const earlyActive = fill >= 0.08;
  const alarmActive = fill >= 0.38;
  const warningActive = fill >= 0.72;

  const earlyCfg = SINTOMA_PHASE_UI.early;
  const alarmCfg = SINTOMA_PHASE_UI.alarm;

  return (
    <div ref={ref} className={className}>
      {/* Línea de tiempo horizontal — de 0–12 h (inicio) a Alerta (fin) */}
      <div className="relative mb-8 lg:mb-10">
        <div
          aria-hidden
          className="pointer-events-none absolute left-5 right-5 top-5 h-0.5 rounded-full bg-[#E8E4EC]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-5 top-5 h-0.5 rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `calc((100% - 2.5rem) * ${fill})`,
            background:
              "linear-gradient(90deg, #503C77 0%, #503C77 42%, #DD876E 72%, #EF4444 100%)",
          }}
        />

        <div className="relative flex items-start justify-between">
          <div className="flex flex-col items-center text-center">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ring-2 transition-all duration-500 ${
                earlyActive ? earlyCfg.markerActive : earlyCfg.markerIdle
              }`}
              aria-hidden
            >
              <span className="material-symbols-outlined text-[18px] leading-none">
                schedule
              </span>
            </span>
            <p
              className={`mt-2 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
                earlyActive ? "text-primary" : "text-muted"
              }`}
            >
              0–12 h
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ring-2 transition-all duration-500 ${
                alarmActive ? alarmCfg.markerActive : alarmCfg.markerIdle
              }`}
              aria-hidden
            >
              <span className="material-symbols-outlined text-[18px] leading-none">
                schedule
              </span>
            </span>
            <p
              className={`mt-2 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
                alarmActive ? "text-[#DD876E]" : "text-muted"
              }`}
            >
              +12 h
            </p>
          </div>

          {showWarningMarker ? (
            <div className="flex flex-col items-center text-center">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ring-2 transition-all duration-500 ${
                  warningActive
                    ? "bg-[#EF4444] text-white ring-[#EF4444]"
                    : "bg-white text-[#EF4444] ring-[#EF4444]"
                }`}
                aria-hidden
              >
                <span className="material-symbols-outlined text-[18px] leading-none">
                  warning
                </span>
              </span>
              <p
                className={`mt-2 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
                  warningActive ? "text-[#EF4444]" : "text-muted"
                }`}
              >
                Alerta
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Tarjetas lado a lado */}
      <div className="grid grid-cols-2 gap-5 lg:gap-6">
        {early.length > 0 ? (
          <div
            className={`rounded-[20px] border-l-4 border-primary bg-[#F3F0F8] p-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:p-6 ${
              earlyActive
                ? "translate-y-0 opacity-100 shadow-[0_8px_28px_rgba(80,60,119,0.08)]"
                : "translate-y-3 opacity-70"
            }`}
          >
            <PhaseHeader phase="early" showTimelineDot={false} />
            <ul className="mt-4 flex flex-col gap-2">
              {early.map((s, i) => (
                <li
                  key={s.id}
                  className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    earlyActive
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: earlyActive ? `${i * 60}ms` : "0ms" }}
                >
                  <SymptomCard item={s} phase="early" compact />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {alarm.length > 0 ? (
          <div
            className={`rounded-[20px] border-r-4 border-[#DD876E] bg-[#FDF0EC] p-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:p-6 ${
              alarmActive
                ? "translate-y-0 opacity-100 shadow-[0_8px_28px_rgba(221,135,110,0.12)]"
                : "translate-y-3 opacity-70"
            }`}
          >
            <PhaseHeader phase="alarm" showTimelineDot={false} />
            <ul className="mt-4 flex flex-col gap-2">
              {alarm.map((s, i) => (
                <li
                  key={s.id}
                  className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    alarmActive
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: alarmActive ? `${i * 60}ms` : "0ms" }}
                >
                  <SymptomCard item={s} phase="alarm" compact />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* Aviso médico — debajo, centrado */}
      {showWarningMarker ? (
        <div
          className={`mx-auto mt-6 max-w-md transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            warningActive
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0"
          }`}
        >
          <div className="rounded-[10px] bg-[#FEF2F2] px-4 py-3.5 shadow-[inset_0_0_0_2px_#EF4444]">
            <p className="text-center text-[12px] font-bold leading-snug text-[#7F1D1D] lg:text-[13px]">
              {warningText}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
