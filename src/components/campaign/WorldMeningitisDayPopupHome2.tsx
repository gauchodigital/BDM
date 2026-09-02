"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  dismissWorldMeningitisDayPopupHome2,
  HOLD_DURATION_MS,
  HOLD_SECONDS,
  shouldShowWorldMeningitisDayPopupHome2,
} from "@/lib/worldMeningitisDay";
import { POPUP_DEMO_CAMPAIGN_EVENT } from "@/lib/popupDemo";
import { PopupFireworks } from "@/components/campaign/PopupFireworks";
import { LogoManito } from "@/components/layout/LogoManito";

type Phase = "hidden" | "intro" | "holding" | "complete";

function useHoldProgress(onComplete: () => void) {
  const [progress, setProgress] = useState(0);
  const holdingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);

  const tick = useCallback(() => {
    if (!holdingRef.current) return;
    const elapsed = Date.now() - startRef.current;
    const next = Math.min(1, elapsed / HOLD_DURATION_MS);
    setProgress(next);
    if (next >= 1) {
      holdingRef.current = false;
      onComplete();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [onComplete]);

  const start = useCallback(() => {
    holdingRef.current = true;
    startRef.current = Date.now();
    setProgress(0);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    holdingRef.current = false;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setProgress(0);
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return { progress, start, stop };
}

function Sparkles() {
  return (
    <>
      <span
        aria-hidden
        className="absolute left-[18%] top-[22%] size-1.5 rounded-full bg-white/70"
      />
      <span
        aria-hidden
        className="absolute right-[22%] top-[30%] size-1 rounded-full bg-white/50"
      />
      <span
        aria-hidden
        className="absolute left-[28%] top-[58%] size-1 rounded-full bg-white/45"
      />
      <span
        aria-hidden
        className="absolute right-[18%] top-[62%] size-1.5 rounded-full bg-white/60"
      />
    </>
  );
}

function IntroArt({ progress, holding }: { progress: number; holding: boolean }) {
  const filledBars = holding
    ? Math.min(HOLD_SECONDS, Math.max(0, Math.ceil(progress * HOLD_SECONDS)))
    : 0;

  return (
    <div className="relative flex h-full min-h-[220px] flex-col items-center justify-center overflow-hidden px-6 py-8 md:min-h-[320px]">
      <Sparkles />
      <div
        aria-hidden
        className="absolute inset-6 rounded-full border border-white/20"
      />
      <p className="relative text-[56px] font-black leading-none tracking-tight text-white md:text-[72px]">
        {HOLD_SECONDS}s
      </p>
      <div className="relative mt-6 flex items-end gap-2">
        {Array.from({ length: HOLD_SECONDS }, (_, index) => {
          const active = index < filledBars;
          return (
            <span
              key={index}
              className={`w-2 rounded-full transition-all duration-150 md:w-2.5 ${
                active ? "bg-white" : "bg-white/25"
              }`}
              style={{ height: `${28 + index * 8}px` }}
            />
          );
        })}
      </div>
    </div>
  );
}

function CompleteArt() {
  return (
    <div className="relative flex h-full min-h-[220px] flex-col items-center justify-center px-6 py-8 md:min-h-[320px]">
      <Sparkles />
      <div
        aria-hidden
        className="absolute left-1/2 top-[42%] size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-2xl"
      />
      <div className="popup-logo-pop relative flex size-[112px] items-center justify-center rounded-full bg-white/20 shadow-[0_0_56px_rgba(255,255,255,0.5)] ring-2 ring-white/35 md:size-[128px]">
        <LogoManito
          variant="white"
          className="h-[68px] w-auto drop-shadow-[0_4px_16px_rgba(80,60,119,0.35)] md:h-[78px]"
          width={78}
          height={86}
        />
      </div>
      <div className="relative mt-10 flex items-center gap-2">
        {Array.from({ length: HOLD_SECONDS }, (_, index) => (
          <span key={index} className="flex items-center">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#503C77] text-[10px] font-bold text-white md:size-6 md:text-[11px]">
              ✓
            </span>
            {index < HOLD_SECONDS - 1 ? (
              <span
                aria-hidden
                className="mx-0.5 h-px w-3 bg-[#503C77]/35 md:w-4"
              />
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Variante horizontal del popup de campaña — solo en /home2. */
export function WorldMeningitisDayPopupHome2() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [fireworksKey, setFireworksKey] = useState(0);
  const phaseRef = useRef<Phase>("hidden");
  phaseRef.current = phase;

  const close = useCallback(() => {
    dismissWorldMeningitisDayPopupHome2();
    setPhase("hidden");
  }, []);

  const onComplete = useCallback(() => {
    setFireworksKey((key) => key + 1);
    setPhase("complete");
  }, []);

  const { progress, start, stop } = useHoldProgress(onComplete);

  useEffect(() => {
    if (!shouldShowWorldMeningitisDayPopupHome2()) return;
    const timer = window.setTimeout(() => setPhase("intro"), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const show = () => {
      stop();
      setPhase("intro");
    };
    window.addEventListener(POPUP_DEMO_CAMPAIGN_EVENT, show);
    return () => window.removeEventListener(POPUP_DEMO_CAMPAIGN_EVENT, show);
  }, [stop]);

  useEffect(() => {
    if (phase === "hidden") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, close]);

  if (phase === "hidden") return null;

  const holding = phase === "holding";
  const complete = phase === "complete";
  const fillPercent = Math.round(progress * 100);

  const resetHold = () => {
    stop();
    setPhase("intro");
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="presentation"
      data-campaign-popup-open=""
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-[#120f18]/55 backdrop-blur-[1px]"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wmd-home2-popup-title"
        className="relative z-10 w-full max-w-[760px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(18,15,24,0.45)]"
      >
        {complete ? <PopupFireworks key={fireworksKey} /> : null}
        <div className="relative flex flex-col md:flex-row">
          <div
            className="relative md:w-[38%]"
            style={{
              background:
                "linear-gradient(180deg, #B8B5E8 0%, #C9A8E8 38%, #FEC4B3 100%)",
            }}
          >
            {complete ? (
              <CompleteArt />
            ) : (
              <IntroArt progress={progress} holding={holding} />
            )}
          </div>

          <div className="relative flex flex-1 flex-col px-6 pb-7 pt-8 md:px-8 md:pb-8 md:pt-10">
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-[#503C77]/55 transition hover:bg-[#503C77]/8 hover:text-[#503C77]"
              aria-label="Cerrar aviso"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {!complete ? (
              <>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#DD876E]">
                  5 de octubre
                </p>
                <h2
                  id="wmd-home2-popup-title"
                  className="mt-2 max-w-[320px] text-[24px] font-black leading-tight text-[#503C77] md:text-[28px]"
                >
                  Día Mundial de la Meningitis
                </h2>
                <p className="mt-3 text-[15px] font-medium text-[#442748]/85">
                  ¿Nos regalás {HOLD_SECONDS} segundos?
                </p>

                <button
                  type="button"
                  className="relative mt-8 h-[52px] w-full overflow-hidden rounded-full border border-[#503C77]/10 bg-[#F3EFF8] shadow-[0_0_0_4px_rgba(184,181,232,0.18)] select-none touch-none"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setPhase("holding");
                    start();
                  }}
                  onPointerUp={() => {
                    if (phaseRef.current === "holding") resetHold();
                  }}
                  onPointerLeave={() => {
                    if (phaseRef.current === "holding") resetHold();
                  }}
                  onPointerCancel={resetHold}
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#B8B5E8] via-[#C9A8E8] to-[#FEC4B3] transition-[width] duration-75"
                    style={{ width: `${holding ? fillPercent : 0}%` }}
                  />
                  <span className="relative z-10 flex h-full items-center justify-center px-4 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#503C77] md:text-[13px]">
                    Mantené {HOLD_SECONDS} segundos
                  </span>
                </button>

                <p className="mt-4 text-center text-[12px] text-[#442748]/55">
                  Mantené presionado para descubrir más
                </p>
              </>
            ) : (
              <div className="animate-fade-in">
                <h2
                  id="wmd-home2-popup-title"
                  className="max-w-[320px] text-[24px] font-black leading-tight text-[#503C77] md:text-[28px]"
                >
                  Gracias por tus {HOLD_SECONDS} segundos.
                </h2>
                <p className="mt-3 max-w-[340px] text-[15px] leading-[1.55] text-[#442748]/85">
                  Ahora tomate unos minutos para informarte.
                </p>

                <div className="mt-6 rounded-[16px] bg-[#EEECF2] px-5 py-5 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DD876E]">
                    5 de octubre
                  </p>
                  <p className="mt-1 text-[16px] font-bold text-[#503C77]">
                    Día Mundial de la Meningitis
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[#442748]/80">
                    Informarse. Prevenir. Actuar a tiempo.
                  </p>
                </div>

                <Link
                  href="/home2#que-es"
                  onClick={close}
                  className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#503C77] px-5 text-[15px] font-bold text-white transition hover:brightness-110"
                >
                  Conocé más
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden
                  >
                    arrow_forward
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
