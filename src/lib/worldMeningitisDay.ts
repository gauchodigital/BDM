import { isCampaignPreviewMode } from "@/lib/popupPreview";

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
  if (preview) return true;

  try {
    return localStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    return true;
  }
}

export function dismissWorldMeningitisDayPopup(): void {
  if (isCampaignPreviewMode()) return;
  const params = new URLSearchParams(window.location.search);
  if (params.get("wmd") === "1") return;
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export const HOLD_DURATION_MS = 5000;
