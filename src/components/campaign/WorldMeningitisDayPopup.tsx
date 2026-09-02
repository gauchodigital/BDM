"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  dismissWorldMeningitisDayPopup,
  shouldShowWorldMeningitisDayPopup,
} from "@/lib/worldMeningitisDay";
import {
  isQuizAnswerCorrect,
  QUIZ_COPY,
  QUIZ_COUNTDOWN_SECONDS,
  QUIZ_CTA_HREF,
  QUIZ_CTA_LABEL,
  QUIZ_OPTIONS,
  type QuizOptionId,
} from "@/lib/meningitisDayQuiz";
import { POPUP_DEMO_CAMPAIGN_EVENT } from "@/lib/popupDemo";
import { PopupFireworks } from "@/components/campaign/PopupFireworks";
import { LogoManito } from "@/components/layout/LogoManito";

type Phase = "hidden" | "tease" | "question" | "result";

export function WorldMeningitisDayPopup() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("hidden");
  const [countdown, setCountdown] = useState(QUIZ_COUNTDOWN_SECONDS);
  const [selected, setSelected] = useState<QuizOptionId | null>(null);
  const [fireworksKey, setFireworksKey] = useState(0);

  const close = useCallback(() => {
    dismissWorldMeningitisDayPopup();
    setPhase("hidden");
    setSelected(null);
    setCountdown(QUIZ_COUNTDOWN_SECONDS);
  }, []);

  const openQuiz = useCallback(() => {
    setSelected(null);
    setCountdown(QUIZ_COUNTDOWN_SECONDS);
    setPhase("tease");
  }, []);

  useEffect(() => {
    if (pathname === "/home2") return;
    if (!shouldShowWorldMeningitisDayPopup()) return;
    const timer = window.setTimeout(openQuiz, 1400);
    return () => window.clearTimeout(timer);
  }, [pathname, openQuiz]);

  useEffect(() => {
    const show = () => {
      if (pathname === "/home2") return;
      openQuiz();
    };
    window.addEventListener(POPUP_DEMO_CAMPAIGN_EVENT, show);
    return () => window.removeEventListener(POPUP_DEMO_CAMPAIGN_EVENT, show);
  }, [pathname, openQuiz]);

  useEffect(() => {
    if (phase === "hidden") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, close]);

  useEffect(() => {
    if (phase !== "tease") return;
    setCountdown(QUIZ_COUNTDOWN_SECONDS);
    const startedAt = Date.now();
    const tick = window.setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
      const next = Math.max(1, QUIZ_COUNTDOWN_SECONDS - elapsedSec);
      setCountdown(next);
      if (elapsedSec >= QUIZ_COUNTDOWN_SECONDS) {
        window.clearInterval(tick);
        setPhase("question");
      }
    }, 100);
    return () => window.clearInterval(tick);
  }, [phase]);

  function answer(id: QuizOptionId) {
    setSelected(id);
    setFireworksKey((key) => key + 1);
    setPhase("result");
  }

  if (pathname === "/home2" || phase === "hidden") return null;

  const result = phase === "result";
  const correct = selected ? isQuizAnswerCorrect(selected) : false;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="presentation"
      data-campaign-popup-open=""
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-[#120f18]/55 backdrop-blur-[1px] transition-opacity duration-500"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wmd-popup-title"
        className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-[20px] shadow-[0_24px_80px_rgba(18,15,24,0.55)] transition-[background] duration-700 ease-out"
        style={{
          background: result
            ? "linear-gradient(165deg, #f9f7f5 0%, #eeecf2 55%, #e9eff5 100%)"
            : "linear-gradient(165deg, #2a2140 0%, #1a1428 48%, #120f18 100%)",
        }}
      >
        {result ? <PopupFireworks key={fireworksKey} /> : null}

        {!result ? (
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[22%] size-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#3d3358_0%,transparent_70%)]"
          />
        ) : null}

        <button
          type="button"
          onClick={close}
          className={`absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-full transition ${
            result
              ? "text-[#503C77]/60 hover:bg-[#503C77]/10 hover:text-[#503C77]"
              : "text-white/50 hover:bg-white/10 hover:text-white"
          }`}
          aria-label="Cerrar aviso"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="relative z-10 px-6 pb-8 pt-10 text-center sm:px-8">
          {phase === "tease" ? (
            <div className="animate-fade-in">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FEC4B3]">
                {QUIZ_COPY.eyebrow}
              </p>
              <h2
                id="wmd-popup-title"
                className="mt-3 text-[22px] font-black leading-tight text-white sm:text-[24px]"
              >
                {QUIZ_COPY.teaseTitle}
              </h2>
              <p className="mt-4 text-[14px] text-white/75">{QUIZ_COPY.teaseHint}</p>

              <div className="mx-auto mt-8 flex size-[132px] items-center justify-center rounded-full border border-[#FEC4B3]/70 bg-[#2f2745] shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
                <span
                  key={countdown}
                  className="animate-fade-in text-[56px] font-black leading-none tabular-nums text-white"
                >
                  {countdown}
                </span>
              </div>
            </div>
          ) : null}

          {phase === "question" ? (
            <div className="animate-fade-in text-left">
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[#FEC4B3]">
                {QUIZ_COPY.eyebrow}
              </p>
              <h2
                id="wmd-popup-title"
                className="mt-3 text-center text-[18px] font-black leading-snug text-white sm:text-[20px]"
              >
                {QUIZ_COPY.question}
              </h2>

              <div className="mt-5 flex flex-col gap-2.5">
                {QUIZ_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => answer(opt.id)}
                    className="rounded-[12px] border border-[#3d3358] bg-[#2f2745] px-4 py-3 text-left transition hover:border-[#FEC4B3] hover:bg-[#3a3154]"
                  >
                    <span className="flex gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#FEC4B3] text-[13px] font-black text-[#442748]">
                        {opt.id}
                      </span>
                      <span className="text-[14px] font-medium leading-snug text-white/95">
                        {opt.label}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {result && selected ? (
            <div className="animate-fade-in">
              <div className="popup-logo-pop mx-auto flex size-[96px] items-center justify-center rounded-full bg-white/80 shadow-[0_0_48px_rgba(122,120,187,0.35)] ring-2 ring-[#503C77]/10">
                <LogoManito
                  variant="purple"
                  className="h-[58px] w-auto"
                  width={58}
                  height={64}
                />
              </div>
              <h2
                id="wmd-popup-title"
                className="mt-4 text-[22px] font-black leading-tight text-[#503C77]"
              >
                {correct ? QUIZ_COPY.correctTitle : QUIZ_COPY.wrongTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-[320px] text-[14px] leading-[1.55] text-[#442748]/85">
                {correct ? QUIZ_COPY.correctBody : QUIZ_COPY.wrongBody}
              </p>
              <p className="mx-auto mt-3 max-w-[300px] text-[13px] font-semibold text-[#503C77]/85">
                {correct ? QUIZ_COPY.correctFooter : QUIZ_COPY.wrongFooter}
              </p>

              <Link
                href={QUIZ_CTA_HREF}
                onClick={close}
                className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#503C77] px-5 text-[14px] font-bold text-white transition hover:brightness-110"
              >
                {QUIZ_CTA_LABEL}
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden
                >
                  arrow_forward
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
