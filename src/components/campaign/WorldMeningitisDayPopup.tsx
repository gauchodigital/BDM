"use client";

import Link from "next/link";
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
import { trackPopup } from "@/lib/bdmTrack";
import { PopupFireworks } from "@/components/campaign/PopupFireworks";
import { LogoManito } from "@/components/layout/LogoManito";
import { RichText } from "@/components/ui/RichText";

type Phase = "hidden" | "tease" | "question" | "result";

function SideArt({
  phase,
  countdown,
}: {
  phase: Exclude<Phase, "hidden">;
  countdown: number;
}) {
  return (
    <div className="relative flex h-full min-h-[180px] flex-col items-center justify-center overflow-hidden px-6 py-8 md:min-h-0 md:py-10">
      <span
        aria-hidden
        className="absolute left-[18%] top-[22%] size-1.5 rounded-full bg-white"
      />
      <span
        aria-hidden
        className="absolute right-[22%] top-[30%] size-1 rounded-full bg-white"
      />
      <span
        aria-hidden
        className="absolute left-[28%] top-[58%] size-1 rounded-full bg-white"
      />
      <div
        aria-hidden
        className="absolute inset-6 rounded-full border border-white"
        style={{ opacity: 0.35 }}
      />

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
          <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-white">
            Tu turno
          </p>
          <p className="mt-2 text-[28px] font-black text-white">A · B · C</p>
        </div>
      ) : null}

      {phase === "result" ? (
        <div className="popup-logo-pop relative flex size-[112px] items-center justify-center rounded-full bg-white shadow-[0_0_40px_rgba(80,60,119,0.2)] ring-2 ring-white md:size-[128px]">
          <LogoManito
            variant="purple"
            className="h-[68px] w-auto md:h-[78px]"
            width={78}
            height={86}
          />
        </div>
      ) : null}
    </div>
  );
}

/** Popup quiz campaña — diseño horizontal (única variante). */
export function WorldMeningitisDayPopup() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [countdown, setCountdown] = useState(QUIZ_COUNTDOWN_SECONDS);
  const [selected, setSelected] = useState<QuizOptionId | null>(null);
  const [fireworksKey, setFireworksKey] = useState(0);

  const close = useCallback((opts?: { skipTrack?: boolean }) => {
    if (!opts?.skipTrack) {
      trackPopup({ popup: "campaign", type: "close" });
    }
    dismissWorldMeningitisDayPopup();
    setPhase("hidden");
    setSelected(null);
    setCountdown(QUIZ_COUNTDOWN_SECONDS);
  }, []);

  const openQuiz = useCallback(() => {
    setSelected(null);
    setCountdown(QUIZ_COUNTDOWN_SECONDS);
    setPhase("tease");
    trackPopup({ popup: "campaign", type: "view" });
  }, []);

  useEffect(() => {
    if (!shouldShowWorldMeningitisDayPopup()) return;
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
    trackPopup({
      popup: "campaign",
      type: "answer",
      answer: id,
      correct: isQuizAnswerCorrect(id) ? 1 : 0,
    });
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
        className="absolute inset-0 bg-[#120f18]"
        style={{ opacity: 0.72 }}
        onClick={() => close()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wmd-popup-title"
        className="relative z-10 w-full max-w-[920px] overflow-hidden rounded-[24px] shadow-[0_24px_80px_rgba(18,15,24,0.55)]"
        style={{ backgroundColor: "#ffffff" }}
      >
        {result && correct ? <PopupFireworks key={fireworksKey} /> : null}
        <div className="relative flex flex-col md:min-h-[320px] md:flex-row">
          <div
            className="relative shrink-0 md:w-[34%] md:self-stretch"
            style={{
              background:
                "linear-gradient(180deg, #B8B5E8 0%, #C9A8E8 38%, #FEC4B3 100%)",
            }}
          >
            <SideArt phase={phase} countdown={countdown} />
          </div>

          <div
            className="relative flex flex-1 flex-col justify-center px-6 py-8 md:px-8 md:py-9"
            style={{ backgroundColor: "#ffffff" }}
          >
            <button
              type="button"
              onClick={() => close()}
              className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full text-[#503C77] transition hover:bg-[#EEECF2]"
              aria-label="Cerrar aviso"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {phase === "tease" ? (
              <div className="animate-fade-in pr-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DD876E]">
                  {QUIZ_COPY.eyebrow}
                </p>
                <h2
                  id="wmd-popup-title"
                  className="mt-2 max-w-[380px] text-[24px] font-black leading-tight text-[#503C77] md:text-[28px]"
                >
                  {QUIZ_COPY.teaseTitle}
                </h2>
                <p className="mt-4 text-[15px] font-medium text-[#442748]">
                  {QUIZ_COPY.teaseHint}
                </p>
                <p className="mt-5 text-[13px] text-[#6B6578]">
                  El desafío empieza en {countdown}…
                </p>
              </div>
            ) : null}

            {phase === "question" ? (
              <div className="animate-fade-in pr-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#DD876E]">
                  {QUIZ_COPY.eyebrow}
                </p>
                <h2
                  id="wmd-popup-title"
                  className="mt-2 text-[17px] font-black leading-snug text-[#503C77] md:text-[19px]"
                >
                  {QUIZ_COPY.question}
                </h2>
                <div className="mt-4 flex flex-col gap-2">
                  {QUIZ_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => answer(opt.id)}
                      className="rounded-[12px] border border-[#E4DFEC] bg-[#F7F5FA] px-3 py-2.5 text-left transition hover:border-[#503C77] hover:bg-[#EEECF2]"
                    >
                      <span className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#503C77] text-[13px] font-black text-white">
                          {opt.id}
                        </span>
                        <span className="text-[13px] font-medium leading-snug text-[#442748] md:text-[14px]">
                          {opt.label}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {result && selected ? (
              <div className="animate-fade-in pr-6">
                <h2
                  id="wmd-popup-title"
                  className="max-w-[400px] text-[24px] font-black leading-tight text-[#503C77] md:text-[26px]"
                >
                  {correct ? QUIZ_COPY.correctTitle : QUIZ_COPY.wrongTitle}
                </h2>
                <p className="mt-3 max-w-[400px] text-[14px] leading-[1.55] text-[#442748]">
                  <RichText
                    text={correct ? QUIZ_COPY.correctBody : QUIZ_COPY.wrongBody}
                  />
                </p>
                <p className="mt-3 text-[13px] font-semibold text-[#503C77]">
                  {correct ? QUIZ_COPY.correctFooter : QUIZ_COPY.wrongFooter}
                </p>

                <Link
                  href={QUIZ_CTA_HREF}
                  onClick={() => {
                    trackPopup({ popup: "campaign", type: "cta" });
                    close({ skipTrack: true });
                  }}
                  className="mt-6 inline-flex h-[48px] w-full max-w-[420px] items-center justify-center gap-2 rounded-[12px] bg-[#503C77] px-4 text-[13px] font-bold text-white transition hover:brightness-110 md:text-[14px]"
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
