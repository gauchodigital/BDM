"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  dismissWorldMeningitisDayPopup,
  HOLD_DURATION_MS,
  shouldShowWorldMeningitisDayPopup,
} from "@/lib/worldMeningitisDay";
import { CampaignPopupClouds } from "@/components/campaign/CampaignPopupClouds";

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

export function WorldMeningitisDayPopup() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    dismissWorldMeningitisDayPopup();
    setPhase("hidden");
  }, []);

  const onComplete = useCallback(() => {
    setPhase("complete");
  }, []);

  const { progress, start, stop } = useHoldProgress(onComplete);

  useEffect(() => {
    if (!shouldShowWorldMeningitisDayPopup()) return;
    const timer = window.setTimeout(() => setPhase("intro"), 1400);
    return () => window.clearTimeout(timer);
  }, []);

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
  const glow = complete ? 1 : holding ? progress : 0.08;
  const count =
    holding && progress > 0
      ? Math.min(5, Math.max(1, Math.ceil(progress * 5)))
      : 5;

  const ringRadius = 54;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progress);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="presentation"
      data-campaign-popup-open=""
    >
      <CampaignPopupClouds />

      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 z-[1] bg-[#001B36]/45 backdrop-blur-[1px] transition-opacity duration-500"
        onClick={close}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wmd-popup-title"
        className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-[20px] shadow-[0_24px_80px_rgba(18,15,24,0.45)] transition-[background,box-shadow] duration-700 ease-out"
        style={{
          background: complete
            ? "linear-gradient(165deg, #f9f7f5 0%, #eeecf2 55%, #e9eff5 100%)"
            : `radial-gradient(circle at 50% 42%, rgba(255,214,170,${0.18 + glow * 0.55}) 0%, rgba(122,120,187,${0.12 + glow * 0.2}) 28%, #1e1630 ${38 + glow * 22}%, #120f18 100%)`,
          boxShadow: complete
            ? "0 24px 80px rgba(80,60,119,0.25)"
            : `0 24px 80px rgba(0,0,0,0.5), 0 0 ${80 + glow * 120}px rgba(255,200,140,${0.15 + glow * 0.35})`,
        }}
      >
        {/* Luz central */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${48 + glow * 220}px`,
            height: `${48 + glow * 220}px`,
            background: `radial-gradient(circle, rgba(255,236,210,${0.35 + glow * 0.65}) 0%, rgba(255,200,140,${0.08 + glow * 0.25}) 45%, transparent 72%)`,
            filter: `blur(${4 + glow * 8}px)`,
          }}
        />

        <button
          type="button"
          onClick={close}
          className={`absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-full transition ${
            complete
              ? "text-[#503C77]/60 hover:bg-[#503C77]/10 hover:text-[#503C77]"
              : "text-white/50 hover:bg-white/10 hover:text-white"
          }`}
          aria-label="Cerrar aviso"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="relative z-10 px-6 pb-8 pt-10 text-center sm:px-8">
          {!complete ? (
            <>
              <p
                className={`text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-500 ${
                  holding ? "text-[#FEC4B3]" : "text-white/55"
                }`}
              >
                5 de octubre
              </p>
              <h2
                id="wmd-popup-title"
                className={`mt-2 text-[22px] font-black leading-tight transition-colors duration-500 sm:text-[24px] ${
                  holding ? "text-white" : "text-white/90"
                }`}
              >
                Día Mundial de la Meningitis
              </h2>
              <p
                className={`mx-auto mt-4 max-w-[280px] text-[14px] leading-[1.55] transition-colors duration-500 ${
                  holding ? "text-white/85" : "text-white/65"
                }`}
              >
                {holding
                  ? "Mantené presionado…"
                  : "¿Nos regalás 5 segundos?"}
              </p>

              <div className="relative mx-auto mt-8 flex size-[148px] items-center justify-center">
                {/* Ondas al mantener */}
                {holding ? (
                  <>
                    <span
                      className="absolute inset-0 rounded-full border border-[#FEC4B3]/30 animate-ping"
                      style={{ animationDuration: "1.8s" }}
                    />
                    <span
                      className="absolute inset-3 rounded-full border border-[#FEC4B3]/20"
                      style={{
                        transform: `scale(${1 + progress * 0.35})`,
                        transition: "transform 80ms linear",
                      }}
                    />
                  </>
                ) : null}

                <svg
                  className="absolute inset-0 -rotate-90"
                  width="148"
                  height="148"
                  viewBox="0 0 148 148"
                  aria-hidden
                >
                  <circle
                    cx="74"
                    cy="74"
                    r={ringRadius}
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="74"
                    cy="74"
                    r={ringRadius}
                    fill="none"
                    stroke="#FEC4B3"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={holding ? ringOffset : ringCircumference}
                    className="transition-[stroke-dashoffset] duration-75"
                  />
                </svg>

                <button
                  type="button"
                  className={`relative flex size-[108px] flex-col items-center justify-center rounded-full border transition-all duration-300 select-none touch-none ${
                    holding
                      ? "border-[#FEC4B3]/80 bg-white/15 text-white shadow-[0_0_40px_rgba(255,200,140,0.35)]"
                      : "border-white/25 bg-white/8 text-white hover:border-white/40 hover:bg-white/12"
                  }`}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setPhase("holding");
                    start();
                  }}
                  onPointerUp={() => {
                    stop();
                    setPhase("intro");
                  }}
                  onPointerLeave={() => {
                    if (phase === "holding" && progress < 1) {
                      stop();
                      setPhase("intro");
                    }
                  }}
                  onPointerCancel={() => {
                    stop();
                    setPhase("intro");
                  }}
                >
                  <span className="text-[34px] font-black leading-none tabular-nums">
                    {holding ? count : "5s"}
                  </span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em]">
                    Mantené
                  </span>
                </button>
              </div>

              <p className="mt-5 text-[12px] leading-relaxed text-white/50">
                Mantené presionado para descubrir más
              </p>
            </>
          ) : (
            <div className="animate-fade-in">
              <p className="text-[32px] leading-none" aria-hidden>
                💜
              </p>
              <h2
                id="wmd-popup-title"
                className="mt-4 text-[22px] font-black leading-tight text-[#503C77] sm:text-[24px]"
              >
                Gracias por tus 5 segundos.
              </h2>
              <p className="mx-auto mt-3 max-w-[300px] text-[15px] leading-[1.55] text-[#442748]/85">
                Ahora tomate unos minutos para informarte.
              </p>

              <div className="mt-6 rounded-[14px] border border-[#503C77]/15 bg-white/70 px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DD876E]">
                  5 de octubre
                </p>
                <p className="mt-1 text-[15px] font-bold text-[#503C77]">
                  Día Mundial de la Meningitis
                </p>
                <p className="mt-2 text-[14px] leading-[1.5] text-[#442748]/80">
                  Informarse. Prevenir. Actuar a tiempo.
                </p>
              </div>

              <Link
                href="/#que-es"
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
  );
}
