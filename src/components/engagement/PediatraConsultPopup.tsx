"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  dismissPediatraConsultPopup,
  hasOpenCampaignPopup,
  PEDIATRA_SECTION_ID,
  shouldShowPediatraConsultPopup,
  type PediatraAnswer,
} from "@/lib/pediatraEngagement";
import { isDemoMode, isPediatraPreviewMode } from "@/lib/popupPreview";
import { POPUP_DEMO_PEDIATRA_EVENT } from "@/lib/popupDemo";
import { trackPopup } from "@/lib/bdmTrack";

type Step = "hidden" | "question" | "thanks";

const SECTION_VISIBLE_RATIO = 0.22;

function PediatraIcon({ kind }: { kind: "question" | "check" }) {
  return (
    <div
      className="mx-auto flex size-[72px] items-center justify-center rounded-full bg-[#C5C4E8]/55"
      aria-hidden
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-[#9B99D0] text-white">
        {kind === "question" ? (
          <span className="text-[28px] font-bold leading-none">?</span>
        ) : (
          <span className="material-symbols-outlined text-[28px] font-bold leading-none">
            check
          </span>
        )}
      </div>
    </div>
  );
}

export function PediatraConsultPopup() {
  const [step, setStep] = useState<Step>("hidden");
  const [answer, setAnswer] = useState<PediatraAnswer | null>(null);
  const stepRef = useRef<Step>("hidden");
  const sectionVisibleRef = useRef(false);
  const autoShownRef = useRef(false);
  stepRef.current = step;

  const close = useCallback((value?: PediatraAnswer) => {
    if (stepRef.current === "question") {
      trackPopup({ popup: "pediatra", type: "close" });
    }
    dismissPediatraConsultPopup(value);
    autoShownRef.current = true;
    setStep("hidden");
  }, []);

  const respond = useCallback((value: PediatraAnswer) => {
    setAnswer(value);
    trackPopup({
      popup: "pediatra",
      type: "answer",
      answer: value,
    });
    dismissPediatraConsultPopup(value);
    autoShownRef.current = true;
    setStep("thanks");
  }, []);

  const tryShow = useCallback(() => {
    if (stepRef.current !== "hidden") return;
    if (!shouldShowPediatraConsultPopup()) return;
    if (hasOpenCampaignPopup()) return;
    if (isDemoMode()) return;
    if (autoShownRef.current) return;
    if (!isPediatraPreviewMode() && !sectionVisibleRef.current) return;
    autoShownRef.current = true;
    setStep("question");
    trackPopup({ popup: "pediatra", type: "view" });
  }, []);

  useEffect(() => {
    const show = () => {
      setAnswer(null);
      setStep("question");
      trackPopup({ popup: "pediatra", type: "view" });
    };
    window.addEventListener(POPUP_DEMO_PEDIATRA_EVENT, show);
    return () => window.removeEventListener(POPUP_DEMO_PEDIATRA_EVENT, show);
  }, []);

  useEffect(() => {
    if (step !== "hidden") return;
    if (isDemoMode()) return;
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
        className="relative z-10 w-full max-w-[360px] animate-fade-in rounded-[20px] bg-white px-7 pb-7 pt-9 shadow-[0_20px_60px_rgba(68,39,72,0.22)] sm:max-w-[400px]"
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
            <PediatraIcon kind="question" />

            <p
              id="pediatra-popup-title"
              className="mt-6 text-center text-[15px] leading-[1.55] text-[#4a4a4a]"
            >
              Después de leer esta información,{" "}
              <strong className="font-bold text-[#1a1a1a]">
                ¿vas a consultarle a tu pediatra acerca de la vacunación contra
                los distintos tipos de meningitis?
              </strong>
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => respond("no")}
                className="h-11 rounded-[10px] bg-[#F0F0F0] text-[15px] font-semibold text-[#333] transition hover:bg-[#e8e8e8]"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => respond("yes")}
                className="h-11 rounded-[10px] bg-[#F0F0F0] text-[15px] font-semibold text-[#333] transition hover:bg-[#e8e8e8]"
              >
                Si
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <PediatraIcon kind="check" />
            <p
              id="pediatra-popup-title"
              className="mt-6 text-[20px] font-bold leading-snug text-[#1a1a1a]"
            >
              ¡Gracias por tu respuesta!
            </p>
            <p className="mt-3 text-[14px] leading-[1.55] text-[#4a4a4a]">
              {answer === "yes"
                ? "Hablar con el pediatra es un gran paso para proteger la salud de quienes más importan."
                : "Haber llegado hasta acá es el primer paso. Siempre podés consultar con el pediatra cuando estés listo/a."}
            </p>
            <button
              type="button"
              onClick={() => close(answer ?? undefined)}
              className="mt-7 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#F0F0F0] text-[15px] font-semibold text-[#333] transition hover:bg-[#e8e8e8]"
            >
              Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
