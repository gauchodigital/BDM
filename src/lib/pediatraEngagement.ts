import { isPediatraPreviewMode } from "@/lib/popupPreview";
import {
  dismissPopupForToday,
  shouldShowPopupOncePerDay,
} from "@/lib/popupFrequency";

const STORAGE_KEY = "bdm-pediatra-consult-popup";

/** Sección «Meningitis en primera persona» en el home. */
export const PEDIATRA_SECTION_ID = "testimonios";

export type PediatraAnswer = "yes" | "no";

export function shouldShowPediatraConsultPopup(): boolean {
  if (typeof window === "undefined") return false;
  return shouldShowPopupOncePerDay(STORAGE_KEY, isPediatraPreviewMode());
}

export function dismissPediatraConsultPopup(_answer?: PediatraAnswer): void {
  if (isPediatraPreviewMode()) return;
  dismissPopupForToday(STORAGE_KEY);
}

export function hasOpenCampaignPopup(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(document.querySelector("[data-campaign-popup-open]"));
}
