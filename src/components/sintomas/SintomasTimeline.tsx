"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import type { SintomaData, SintomaPhase } from "@/lib/sintomasData";

export const SINTOMA_PHASE_UI: Record<
  SintomaPhase,
  {
    badge: string;
    lead: string;
    line: string;
    badgeBg: string;
    badgeText: string;
    badgeRadius: string;
    titleColor: string;
    iconColor: string;
    markerIdle: string;
    markerActive: string;
  }
> = {
  early: {
    badge: "Primeras 12hs · Síntomas inespecíficos",
    lead: "Pueden confundirse con otras enfermedades. Prestá atención si aparecen juntos.",
    line: "bg-primary",
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
    badgeRadius: "rounded-[8px]",
    titleColor: "text-primary",
    iconColor: "text-primary",
    markerIdle: "bg-white text-primary ring-primary",
    markerActive: "bg-primary text-white ring-primary",
  },
  alarm: {
    badge: "Pasadas las 12hs · Señales de alarma",
    lead: "Si aparecen estos síntomas, buscá atención médica de inmediato.",
    line: "bg-[#DD876E]",
    badgeBg: "bg-[#DD876E]/15",
    badgeText: "text-[#DD876E]",
    badgeRadius: "rounded-[12px]",
    titleColor: "text-[#DD876E]",
    iconColor: "text-[#DD876E]",
    markerIdle: "bg-white text-[#DD876E] ring-[#DD876E]",
    markerActive: "bg-[#DD876E] text-white ring-[#DD876E]",
  },
};

const DEFAULT_WARNING =
  "Ante la presencia de estos síntomas, consultá al médico o pediatra.";

export { DEFAULT_WARNING };

export function PhaseHeader({
  phase,
  showTimelineDot = true,
}: {
  phase: SintomaPhase;
  showTimelineDot?: boolean;
}) {
  const cfg = SINTOMA_PHASE_UI[phase];
  return (
    <div className="relative mb-4">
      {showTimelineDot ? null : (
        <div className="mb-3 flex items-center gap-3">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full ${cfg.line} text-white`}
            aria-hidden
          >
            <span className="material-symbols-outlined text-[18px] leading-none">
              schedule
            </span>
          </span>
        </div>
      )}
      <p
        className={`w-full px-4 py-2.5 text-[13px] font-bold leading-snug ${cfg.badgeRadius} ${cfg.badgeBg} ${cfg.badgeText}`}
      >
        {cfg.badge}
      </p>
      <p className="mt-3 text-[13px] font-normal leading-[18px] tracking-normal text-dark">
        {cfg.lead}
      </p>
    </div>
  );
}

export function SymptomCard({
  item,
  phase,
  compact = false,
}: {
  item: SintomaData;
  phase: SintomaPhase;
  compact?: boolean;
}) {
  const cfg = SINTOMA_PHASE_UI[phase];
  const isSvg = item.icon.endsWith(".svg") || item.icon.startsWith("/");
  const borderClass =
    phase === "early" ? "border-[#E2E8F0]" : "border-[#F0C4B8]";

  return (
    <div
      className={`rounded-[12px] border bg-white p-2 ${borderClass} ${
        compact && !item.description ? "min-h-12" : ""
      }`}
    >
      <div
        className={`flex gap-3 ${
          item.description ? "items-start" : "items-center"
        } ${compact && !item.description ? "min-h-8" : ""}`}
      >
        {isSvg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.icon}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0"
            aria-hidden
          />
        ) : (
          <span
            className={`material-symbols-outlined text-[28px] leading-none ${cfg.iconColor}`}
            aria-hidden
          >
            {item.icon}
          </span>
        )}
        <div className="min-w-0">
          <p
            className={`text-[13px] font-bold leading-tight ${cfg.titleColor}`}
          >
            {item.label}
          </p>
          {item.description ? (
            <p className="mt-1 text-[12px] leading-[1.5] text-muted">
              <RichText text={item.description} />
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * Timeline mobile: línea que se rellena con el scroll, marcadores que se
 * activan al cruzar el 60% del viewport, y cards en cascada al ~82%.
 */
export function SintomasMobileTimeline({
  early,
  alarm,
  warningText = DEFAULT_WARNING,
  showWarningMarker = true,
  className = "relative mt-10 lg:hidden",
}: {
  early: SintomaData[];
  alarm: SintomaData[];
  warningText?: string;
  /** Si false, no muestra el marcador/caja de alerta al final (p. ej. aviso arriba). */
  showWarningMarker?: boolean;
  className?: string;
}) {
  const phases = [
    early.length > 0 ? ("early" as const) : null,
    alarm.length > 0 ? ("alarm" as const) : null,
  ].filter(Boolean) as SintomaPhase[];

  const cardCount =
    early.length + alarm.length + (showWarningMarker ? 1 : 0);
  const markerCount = phases.length + (showWarningMarker ? 1 : 0);

  const ref = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [fill, setFill] = useState(0);
  const [active, setActive] = useState<boolean[]>(() =>
    Array(markerCount).fill(false),
  );
  const [shown, setShown] = useState<boolean[]>(() =>
    Array(cardCount).fill(true),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setActive(Array(markerCount).fill(false));
    setShown(Array(cardCount).fill(false));
    setFill(0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFill(1);
      setActive(Array(markerCount).fill(true));
      setShown(Array(cardCount).fill(true));
      return;
    }

    let raf = 0;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const line = vh * 0.6;
      setFill(Math.max(0, Math.min(1, (line - rect.top) / rect.height)));
      setActive(
        markerRefs.current.map((m) => {
          if (!m) return false;
          const r = m.getBoundingClientRect();
          return r.top + r.height / 2 <= line;
        }),
      );
      setShown((prev) => {
        let changed = false;
        const next = prev.slice();
        cardRefs.current.forEach((c, i) => {
          if (!next[i] && c && c.getBoundingClientRect().top <= vh * 0.82) {
            next[i] = true;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
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
  }, [cardCount, markerCount]);

  let cardIndex = 0;
  const alertMarkerIndex = phases.length;
  const itemsByPhase: Record<SintomaPhase, SintomaData[]> = {
    early,
    alarm,
  };

  return (
    <div ref={ref} className={className}>
      <span
        aria-hidden
        className="absolute bottom-0 left-[13px] top-3 w-0.5 rounded-full bg-[#E8E4EC]"
      />
      <span
        aria-hidden
        className="absolute left-[13px] top-3 bottom-0 w-0.5 rounded-full transition-[clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          background:
            "linear-gradient(180deg, #503C77 0%, #503C77 45%, #DD876E 80%, #EF4444 100%)",
          clipPath: `inset(0 0 ${Math.max(0, (1 - fill) * 100)}% 0)`,
        }}
      />

      <div className="space-y-8">
        {phases.map((phase, pi) => {
          const cfg = SINTOMA_PHASE_UI[phase];
          const items = itemsByPhase[phase];
          return (
            <div key={phase} className="relative pl-11">
              <span
                ref={(n) => {
                  markerRefs.current[pi] = n;
                }}
                className={`absolute left-0 top-0 z-10 flex h-7 w-7 items-center justify-center rounded-full ring-2 transition-colors duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active[pi] ? cfg.markerActive : cfg.markerIdle
                }`}
                aria-hidden
              >
                <span className="material-symbols-outlined text-[16px] leading-none">
                  schedule
                </span>
              </span>

              <Reveal from="up">
                <PhaseHeader phase={phase} showTimelineDot />
              </Reveal>

              <div className="flex flex-col gap-3">
                {items.map((s) => {
                  const gi = cardIndex++;
                  return (
                    <div
                      key={s.id}
                      ref={(n) => {
                        cardRefs.current[gi] = n;
                      }}
                      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        shown[gi]
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
                    >
                      <SymptomCard item={s} phase={phase} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {showWarningMarker ? (
          <div className="relative pl-11">
            <span
              aria-hidden
              className="absolute bottom-0 left-[12px] top-1/2 w-1 bg-white"
            />
            <span
              ref={(n) => {
                markerRefs.current[alertMarkerIndex] = n;
              }}
              className={`absolute left-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full ring-2 transition-colors duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                active[alertMarkerIndex]
                  ? "bg-[#EF4444] text-white ring-[#EF4444]"
                  : "bg-white text-[#EF4444] ring-[#EF4444]"
              }`}
              aria-hidden
            >
              <span className="material-symbols-outlined text-[16px] leading-none">
                warning
              </span>
            </span>
            <div
              ref={(n) => {
                cardRefs.current[cardIndex] = n;
              }}
              className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                shown[cardIndex]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <div className="rounded-[8px] bg-[#FEF2F2] px-4 py-[14px] shadow-[inset_0_0_0_2px_#EF4444]">
                <p className="text-[12px] font-bold leading-snug text-[#7F1D1D]">
                  {warningText}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DesktopPhaseHeader({ phase }: { phase: SintomaPhase }) {
  const cfg = SINTOMA_PHASE_UI[phase];
  const isAlarm = phase === "alarm";

  return (
    <div className="mb-4">
      <div className={isAlarm ? "mb-5 mt-2" : "mb-3"}>
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-white ${cfg.line}`}
          aria-hidden
        >
          <span className="material-symbols-outlined text-[20px] leading-none">
            schedule
          </span>
        </span>
      </div>
      <p
        className={`w-full px-4 py-2.5 text-[13px] font-bold leading-snug ${cfg.badgeRadius} ${cfg.badgeBg} ${cfg.badgeText}`}
      >
        {cfg.badge}
      </p>
      <p className="mt-3 text-[13px] font-normal leading-[18px] tracking-normal text-dark">
        {cfg.lead}
      </p>
    </div>
  );
}

function PhasePanel({
  phase,
  items,
  desktop = false,
  active = true,
}: {
  phase: SintomaPhase;
  items: SintomaData[];
  desktop?: boolean;
  active?: boolean;
}) {
  if (!items.length) return null;

  const isEarly = phase === "early";

  return (
    <div
      className={`rounded-[22px] p-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isEarly
          ? "border-l-4 border-primary bg-[#F3F0F8]"
          : "border-r-4 border-[#DD876E] bg-[#FDF0EC]"
      } ${
        active
          ? "translate-y-0 opacity-100 shadow-[0_8px_28px_rgba(80,60,119,0.08)]"
          : "translate-y-3 opacity-75"
      }`}
    >
      {desktop ? (
        <DesktopPhaseHeader phase={phase} />
      ) : (
        <PhaseHeader phase={phase} showTimelineDot={false} />
      )}
      <ul
        className={`mt-4 grid grid-cols-1 gap-2 ${
          desktop ? "" : "lg:grid-cols-2 lg:gap-3"
        }`}
      >
        {items.map((s, i) => (
          <li
            key={s.id}
            className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              !desktop && s.description ? "lg:col-span-2" : undefined
            } ${
              active
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
            style={{ transitionDelay: active ? `${i * 60}ms` : "0ms" }}
          >
            <SymptomCard item={s} phase={phase} compact={desktop} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DesktopTimelineMarker({
  label,
  variant,
  active = true,
}: {
  label: string;
  variant: "early" | "alarm" | "warning";
  active?: boolean;
}) {
  const earlyCfg = SINTOMA_PHASE_UI.early;
  const alarmCfg = SINTOMA_PHASE_UI.alarm;

  const markerClass =
    variant === "early"
      ? active
        ? earlyCfg.markerActive
        : earlyCfg.markerIdle
      : variant === "alarm"
        ? active
          ? alarmCfg.markerActive
          : alarmCfg.markerIdle
        : active
          ? "bg-[#EF4444] text-white ring-[#EF4444]"
          : "bg-white text-[#EF4444] ring-[#EF4444]";

  const labelClass =
    variant === "early"
      ? active
        ? "text-primary"
        : "text-muted"
      : variant === "alarm"
        ? active
          ? "text-[#DD876E]"
          : "text-muted"
        : active
          ? "text-[#EF4444]"
          : "text-muted";

  return (
    <div className="relative flex h-10 w-full items-center justify-center">
      <span
        className={`absolute left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full ring-2 transition-all duration-500 ${markerClass}`}
        aria-hidden
      >
        <span className="material-symbols-outlined text-[18px] leading-none">
          {variant === "warning" ? "warning" : "schedule"}
        </span>
      </span>
      <span
        className={`absolute left-[calc(50%+1.375rem)] top-1/2 -translate-y-1/2 whitespace-nowrap bg-white px-0.5 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors duration-500 ${labelClass}`}
      >
        {label}
      </span>
    </div>
  );
}

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
      const line = vh * 0.62;
      setFill(Math.max(0, Math.min(1, (line - rect.top) / rect.height)));
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

/**
 * Timeline desktop (≥992px): grid 3 columnas con línea vertical central.
 */
export function SintomasDesktopTimeline({
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

  const earlyActive = fill >= 0.1;
  const alarmActive = fill >= 0.38;
  const warningActive = fill >= 0.82;

  return (
    <div ref={ref} className={className}>
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="grid grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] grid-rows-[auto_auto_auto] gap-x-10">
          {/* Raíl vertical — columnas de contenido + fila de alerta */}
          <div
            aria-hidden
            className="relative col-start-2 row-start-1 row-span-2 min-h-0 self-stretch justify-self-center"
          >
            <div className="relative h-full w-[120px]">
              <div className="absolute bottom-4 left-1/2 top-1 w-0.5 -translate-x-1/2 rounded-full bg-[#E8E4EC]" />
              <div
                className="absolute left-1/2 top-1 w-0.5 -translate-x-1/2 rounded-full transition-[clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  bottom: "1rem",
                  background:
                    "linear-gradient(180deg, #503C77 0%, #503C77 42%, #DD876E 68%, #EF4444 100%)",
                  clipPath: `inset(0 0 ${Math.max(0, (1 - fill) * 100)}% 0)`,
                }}
              />
              <div
                className="absolute left-1/2 top-[58%] w-0 -translate-x-1/2 border-l-2 border-dashed border-[#EF4444]/45"
                style={{
                  bottom: "1rem",
                  opacity: fill >= 0.5 ? 1 : 0.35,
                }}
              />
            </div>

            {/* Nodos 0–12 h y +12 h */}
            {early.length > 0 ? (
              <div className="absolute left-0 right-0 top-1 z-10">
                <DesktopTimelineMarker
                  label="0–12 h"
                  variant="early"
                  active={earlyActive}
                />
              </div>
            ) : null}

            {alarm.length > 0 ? (
              <div className="absolute left-0 right-0 top-1/2 z-10 -translate-y-1/2">
                <DesktopTimelineMarker
                  label="+12 h"
                  variant="alarm"
                  active={alarmActive}
                />
              </div>
            ) : null}
          </div>

          {/* Tarjeta violeta — arriba izquierda */}
          {early.length > 0 ? (
            <div className="col-start-1 row-start-1 self-start">
              <PhasePanel
                phase="early"
                items={early}
                desktop
                active={earlyActive}
              />
            </div>
          ) : null}

          {/* Tarjeta naranja — derecha, más abajo */}
          {alarm.length > 0 ? (
            <div className="col-start-3 row-start-1 z-10 mt-48 self-start lg:mt-56">
              <PhasePanel
                phase="alarm"
                items={alarm}
                desktop
                active={alarmActive}
              />
            </div>
          ) : null}

          {/* Nodo alerta — fila propia, separado del aviso */}
          {showWarningMarker ? (
            <div className="col-start-2 row-start-2 z-10 flex justify-center pt-6">
              <DesktopTimelineMarker
                label="Alerta"
                variant="warning"
                active={warningActive}
              />
            </div>
          ) : null}

          {/* Aviso médico — debajo del nodo alerta */}
          {showWarningMarker ? (
            <div className="col-span-3 col-start-1 row-start-3 mt-4">
              <div
                className={`mx-auto w-full max-w-md rounded-[10px] bg-[#FEF2F2] px-4 py-3.5 shadow-[inset_0_0_0_2px_#EF4444] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  warningActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                }`}
              >
                <p className="text-center text-[12px] font-bold leading-snug text-[#7F1D1D] lg:text-[13px]">
                  {warningText}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
