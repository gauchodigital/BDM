import { isPediatraPreviewMode } from "@/lib/popupPreview";

const SESSION_KEY = "bdm-pediatra-consult-popup";

/** Sección «Meningitis en primera persona» en el home. */
export const PEDIATRA_SECTION_ID = "testimonios";

export type PediatraAnswer = "yes" | "no";

export function shouldShowPediatraConsultPopup(): boolean {
  if (typeof window === "undefined") return false;
  if (isPediatraPreviewMode()) return true;
  try {
    return sessionStorage.getItem(SESSION_KEY) === null;
  } catch {
    return true;
  }
}

export function dismissPediatraConsultPopup(answer?: PediatraAnswer): void {
  if (isPediatraPreviewMode()) return;
  try {
    sessionStorage.setItem(SESSION_KEY, answer ?? "dismissed");
  } catch {
    /* ignore */
  }
}

export function hasOpenCampaignPopup(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(document.querySelector("[data-campaign-popup-open]"));
}
