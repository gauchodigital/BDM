"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  dismissPediatraConsultPopup,
  hasOpenCampaignPopup,
  PEDIATRA_SECTION_ID,
  shouldShowPediatraConsultPopup,
  type PediatraAnswer,
} from "@/lib/pediatraEngagement";
import { isPediatraPreviewMode } from "@/lib/popupPreview";

type Step = "hidden" | "question" | "thanks";

const SECTION_VISIBLE_RATIO = 0.22;

export function PediatraConsultPopup() {
  const [step, setStep] = useState<Step>("hidden");
  const [answer, setAnswer] = useState<PediatraAnswer | null>(null);
  const stepRef = useRef<Step>("hidden");
  const sectionVisibleRef = useRef(false);
  stepRef.current = step;

  const close = useCallback((value?: PediatraAnswer) => {
    dismissPediatraConsultPopup(value);
    setStep("hidden");
  }, []);

  const respond = useCallback((value: PediatraAnswer) => {
    setAnswer(value);
    dismissPediatraConsultPopup(value);
    setStep("thanks");
    window.setTimeout(() => setStep("hidden"), value === "yes" ? 3200 : 1800);
  }, []);

  const tryShow = useCallback(() => {
    if (stepRef.current !== "hidden") return;
    if (!shouldShowPediatraConsultPopup()) return;
    if (hasOpenCampaignPopup()) return;
    if (!isPediatraPreviewMode() && !sectionVisibleRef.current) return;
    setStep("question");
  }, []);

  useEffect(() => {
    if (step !== "hidden") return;
    if (!shouldShowPediatraConsultPopup()) return;

    const preview = isPediatraPreviewMode();
    let armed = false;

    const armTimer = window.setTimeout(() => {
      armed = true;
      tryShow();
    }, preview ? 500 : 2000);

    const section = document.getElementById(PEDIATRA_SECTION_ID);
    const intersection = section
      ? new IntersectionObserver(
          ([entry]) => {
            sectionVisibleRef.current =
              entry.isIntersecting &&
              entry.intersectionRatio >= SECTION_VISIBLE_RATIO;
            if (!armed) return;
            tryShow();
          },
          { threshold: [0, SECTION_VISIBLE_RATIO, 0.45] },
        )
      : null;

    intersection?.observe(section!);

    const campaignObserver = new MutationObserver(() => {
      if (!armed) return;
      tryShow();
    });

    campaignObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-campaign-popup-open"],
      subtree: true,
    });

    return () => {
      window.clearTimeout(armTimer);
      intersection?.disconnect();
      campaignObserver.disconnect();
    };
  }, [step, tryShow]);

  useEffect(() => {
    if (step === "hidden") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, close]);

  if (step === "hidden") return null;

  return (
    <div className="fixed inset-0 z-[290] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-[#120f18]/55 backdrop-blur-[1px]"
        onClick={() => close()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pediatra-popup-title"
        className="relative z-10 w-full max-w-[360px] animate-fade-in rounded-[16px] bg-white px-6 pb-6 pt-8 shadow-[0_20px_60px_rgba(68,39,72,0.22)] sm:max-w-[400px]"
      >
        <button
          type="button"
          onClick={() => close()}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-[#94a3b8] transition hover:bg-[#f1f5f9] hover:text-[#64748b]"
          aria-label="Cerrar"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {step === "question" ? (
          <>
            <div
              className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#7A78BB] text-[28px] font-bold text-white"
              aria-hidden
            >
              ?
            </div>

            <p
              id="pediatra-popup-title"
              className="mt-5 text-center text-[15px] leading-[1.55] text-[#442748]"
            >
              Después de leer esta información,{" "}
              <strong className="font-bold text-[#442748]">
                ¿vas a consultarle a tu pediatra acerca de la vacunación contra
                los distintos tipos de meningitis?
              </strong>
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => respond("no")}
                className="h-11 rounded-[10px] bg-[#F0F0F0] text-[15px] font-semibold text-[#442748] transition hover:bg-[#e8e8e8]"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => respond("yes")}
                className="h-11 rounded-[10px] bg-[#F0F0F0] text-[15px] font-semibold text-[#442748] transition hover:bg-[#e8e8e8]"
              >
                Sí
              </button>
            </div>
          </>
        ) : (
          <div className="px-1 pb-1 pt-2 text-center">
            <p className="text-[32px] leading-none" aria-hidden>
              {answer === "yes" ? "💜" : "🙏"}
            </p>
            <p className="mt-4 text-[18px] font-bold leading-snug text-[#503C77]">
              {answer === "yes"
                ? "¡Excelente decisión!"
                : "Gracias por tu tiempo"}
            </p>
            <p className="mt-2 text-[14px] leading-[1.5] text-[#442748]/80">
              {answer === "yes"
                ? "Consultá con tu pediatra y revisá el calendario de vacunación."
                : "Seguí informándote: conocer también es prevenir."}
            </p>
            {answer === "yes" ? (
              <Link
                href="/vacunacion"
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-[#503C77] text-[14px] font-bold text-white transition hover:brightness-110"
              >
                Ver vacunación
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
