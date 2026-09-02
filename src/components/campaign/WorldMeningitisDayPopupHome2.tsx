"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  dismissWorldMeningitisDayPopupHome2,
  shouldShowWorldMeningitisDayPopupHome2,
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

function SideArt({
  phase,
  countdown,
}: {
  phase: Exclude<Phase, "hidden">;
  countdown: number;
}) {
  return (
    <div className="relative flex h-full min-h-[200px] flex-col items-center justify-center overflow-hidden px-6 py-8 md:min-h-[340px]">
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
      <div aria-hidden className="absolute inset-6 rounded-full border border-white/20" />

      {phase === "tease" ? (
        <span
          key={countdown}
          className="animate-fade-in relative text-[72px] font-black leading-none tracking-tight text-white md:text-[88px]"
        >
          {countdown}
        </span>
      ) : null}

      {phase === "question" ? (
        <div className="relative text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-white/80">
            Tu turno
          </p>
          <p className="mt-2 text-[28px] font-black text-white">A · B · C</p>
        </div>
      ) : null}

      {phase === "result" ? (
        <div className="popup-logo-pop relative flex size-[112px] items-center justify-center rounded-full bg-white/20 shadow-[0_0_56px_rgba(255,255,255,0.5)] ring-2 ring-white/35 md:size-[128px]">
          <LogoManito
            variant="white"
            className="h-[68px] w-auto drop-shadow-[0_4px_16px_rgba(80,60,119,0.35)] md:h-[78px]"
            width={78}
            height={86}
          />
        </div>
      ) : null}
    </div>
  );
}

/** Variante horizontal del popup quiz — solo en /home2. */
export function WorldMeningitisDayPopupHome2() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [countdown, setCountdown] = useState(QUIZ_COUNTDOWN_SECONDS);
  const [selected, setSelected] = useState<QuizOptionId | null>(null);
  const [fireworksKey, setFireworksKey] = useState(0);

  const close = useCallback(() => {
    dismissWorldMeningitisDayPopupHome2();
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
    if (!shouldShowWorldMeningitisDayPopupHome2()) return;
    const timer = window.setTimeout(openQuiz, 1400);
    return () => window.clearTimeout(timer);
  }, [openQuiz]);

  useEffect(() => {
    const show = () => openQuiz();
    window.addEventListener(POPUP_DEMO_CAMPAIGN_EVENT, show);
    return () => window.removeEventListener(POPUP_DEMO_CAMPAIGN_EVENT, show);
  }, [openQuiz]);

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

  if (phase === "hidden") return null;

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
        className="absolute inset-0 bg-[#120f18]/55 backdrop-blur-[1px]"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wmd-home2-popup-title"
        className="relative z-10 w-full max-w-[820px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(18,15,24,0.45)]"
      >
        {result ? <PopupFireworks key={fireworksKey} /> : null}
        <div className="relative flex flex-col md:flex-row">
          <div
            className="relative md:w-[36%]"
            style={{
              background:
                "linear-gradient(180deg, #B8B5E8 0%, #C9A8E8 38%, #FEC4B3 100%)",
            }}
          >
            <SideArt phase={phase} countdown={countdown} />
          </div>

          <div className="relative flex flex-1 flex-col px-6 pb-7 pt-8 md:px-8 md:pb-8 md:pt-9">
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-[#503C77]/55 transition hover:bg-[#503C77]/8 hover:text-[#503C77]"
              aria-label="Cerrar aviso"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {phase === "tease" ? (
              <div className="animate-fade-in">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DD876E]">
                  {QUIZ_COPY.eyebrow}
                </p>
                <h2
                  id="wmd-home2-popup-title"
                  className="mt-2 max-w-[360px] text-[24px] font-black leading-tight text-[#503C77] md:text-[28px]"
                >
                  {QUIZ_COPY.teaseTitle}
                </h2>
                <p className="mt-4 text-[15px] font-medium text-[#442748]/85">
                  {QUIZ_COPY.teaseHint}
                </p>
                <p className="mt-6 text-[13px] text-[#442748]/55">
                  El desafío empieza en {countdown}…
                </p>
              </div>
            ) : null}

            {phase === "question" ? (
              <div className="animate-fade-in">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DD876E]">
                  {QUIZ_COPY.eyebrow}
                </p>
                <h2
                  id="wmd-home2-popup-title"
                  className="mt-2 text-[18px] font-black leading-snug text-[#503C77] md:text-[20px]"
                >
                  {QUIZ_COPY.question}
                </h2>
                <div className="mt-4 flex flex-col gap-2">
                  {QUIZ_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => answer(opt.id)}
                      className="rounded-[12px] border border-[#503C77]/12 bg-[#F7F5FA] px-3.5 py-3 text-left transition hover:border-[#503C77]/35 hover:bg-[#EEECF2]"
                    >
                      <span className="flex gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#503C77] text-[13px] font-black text-white">
                          {opt.id}
                        </span>
                        <span className="text-[14px] font-medium leading-snug text-[#442748]">
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
                <h2
                  id="wmd-home2-popup-title"
                  className="max-w-[360px] text-[24px] font-black leading-tight text-[#503C77] md:text-[26px]"
                >
                  {correct ? QUIZ_COPY.correctTitle : QUIZ_COPY.wrongTitle}
                </h2>
                <p className="mt-3 max-w-[380px] text-[14px] leading-[1.55] text-[#442748]/85">
                  {correct ? QUIZ_COPY.correctBody : QUIZ_COPY.wrongBody}
                </p>
                <p className="mt-3 text-[13px] font-semibold text-[#503C77]/90">
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
    </div>
  );
}
