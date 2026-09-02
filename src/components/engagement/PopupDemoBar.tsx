"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  dispatchDemoCampaignPopup,
  dispatchDemoPediatraPopup,
} from "@/lib/popupDemo";

export function PopupDemoBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const demo =
    searchParams.get("demo") === "1" || searchParams.get("popups") === "1";

  if (!demo) return null;

  const isHome2 = pathname === "/home2";
  const isHome = pathname === "/" || isHome2;

  return (
    <div
      className="fixed inset-x-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[310] mx-auto flex max-w-lg flex-col gap-2 rounded-[14px] border border-white/15 bg-[#503C77]/95 px-4 py-3 text-white shadow-[0_12px_40px_rgba(18,15,24,0.35)] backdrop-blur-sm lg:bottom-6 lg:left-auto lg:right-6 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:gap-3"
      role="region"
      aria-label="Controles de demo de popups"
    >
      <p className="text-[12px] leading-snug text-white/85 lg:max-w-[11rem]">
        <span className="font-bold text-white">Modo demo</span>
        <span className="hidden lg:inline"> — </span>
        <span className="block lg:inline">
          Popup campaña al cargar. Pediatra: botón o scroll a testimonios.
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {isHome ? (
          <button
            type="button"
            onClick={dispatchDemoCampaignPopup}
            className="rounded-[8px] bg-white/15 px-3 py-2 text-[12px] font-bold transition hover:bg-white/25"
          >
            {isHome2 ? "Popup campaña (home 2)" : "Popup campaña (home 1)"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={dispatchDemoPediatraPopup}
          className="rounded-[8px] bg-white/15 px-3 py-2 text-[12px] font-bold transition hover:bg-white/25"
        >
          Popup pediatra
        </button>
      </div>
    </div>
  );
}
