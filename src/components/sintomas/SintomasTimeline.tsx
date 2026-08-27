"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
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
      <p className="mt-3 text-[13px] leading-[1.55] text-muted">{cfg.lead}</p>
    </div>
  );
}

export function SymptomCard({
  item,
  phase,
}: {
  item: SintomaData;
  phase: SintomaPhase;
}) {
  const cfg = SINTOMA_PHASE_UI[phase];
  const isSvg = item.icon.endsWith(".svg") || item.icon.startsWith("/");
  const borderGrad =
    phase === "early"
      ? "bg-[linear-gradient(90deg,#442748_0%,#442748_80%,#DD876E_100%)]"
      : "bg-[linear-gradient(90deg,#DD876E_0%,#DD876E_80%,#EF4444_100%)]";

  return (
    <div className={`rounded-[12px] p-[2px] ${borderGrad}`}>
      <div className="rounded-[10px] bg-white p-2">
        <div className="flex items-start gap-3">
          {isSvg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.icon}
              alt=""
              width={28}
              height={28}
              className="mt-0.5 h-7 w-7 shrink-0"
              aria-hidden
            />
          ) : (
            <span
              className={`material-symbols-outlined mt-0.5 text-[28px] leading-none ${cfg.iconColor}`}
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
                {item.description}
              </p>
            ) : null}
          </div>
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
  className = "relative mt-10 md:hidden",
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
    Array(cardCount).fill(false),
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
