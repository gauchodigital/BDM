import { isCampaignPreviewMode } from "@/lib/popupPreview";
import {
  dismissPopupForToday,
  shouldShowPopupOncePerDay,
} from "@/lib/popupFrequency";

const STORAGE_KEY = "bdm-world-meningitis-day-dismissed";

/** Ventana de campaña: 1 de septiembre al 15 de octubre. */
export function isWorldMeningitisDayCampaignActive(date = new Date()): boolean {
  const year = date.getFullYear();
  const start = new Date(year, 8, 1);
  const end = new Date(year, 9, 15, 23, 59, 59);
  return date >= start && date <= end;
}

export function shouldShowWorldMeningitisDayPopup(): boolean {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  const preview = params.get("wmd") === "1" || isCampaignPreviewMode();

  if (!preview && !isWorldMeningitisDayCampaignActive()) return false;

  return shouldShowPopupOncePerDay(STORAGE_KEY, preview);
}

export function dismissWorldMeningitisDayPopup(): void {
  if (isCampaignPreviewMode()) return;
  const params = new URLSearchParams(window.location.search);
  if (params.get("wmd") === "1") return;
  dismissPopupForToday(STORAGE_KEY);
}

/** @deprecated Usar shouldShowWorldMeningitisDayPopup */
export const shouldShowWorldMeningitisDayPopupHome2 =
  shouldShowWorldMeningitisDayPopup;
/** @deprecated Usar dismissWorldMeningitisDayPopup */
export const dismissWorldMeningitisDayPopupHome2 = dismissWorldMeningitisDayPopup;

export const HOLD_SECONDS = 5;
export const HOLD_DURATION_MS = HOLD_SECONDS * 1000;
/** @deprecated Usar HOLD_DURATION_MS */
export const HOLD_DURATION_HOME2_MS = HOLD_DURATION_MS;
/** @deprecated Usar HOLD_SECONDS */
export const HOLD_SECONDS_HOME2 = HOLD_SECONDS;
