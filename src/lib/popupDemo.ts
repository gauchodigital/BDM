/** Eventos para reabrir popups desde la barra de demo. */
export const POPUP_DEMO_CAMPAIGN_EVENT = "bdm:demo-show-campaign";
export const POPUP_DEMO_PEDIATRA_EVENT = "bdm:demo-show-pediatra";

export const POPUP_STORAGE_KEYS = [
  "bdm-world-meningitis-day-dismissed",
  "bdm-world-meningitis-day-home2-dismissed",
  "bdm-pediatra-consult-popup",
] as const;

export function clearPopupDismissals(): void {
  if (typeof window === "undefined") return;
  for (const key of POPUP_STORAGE_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

export function dispatchDemoCampaignPopup(): void {
  clearPopupDismissals();
  window.dispatchEvent(new CustomEvent(POPUP_DEMO_CAMPAIGN_EVENT));
}

export function dispatchDemoPediatraPopup(): void {
  clearPopupDismissals();
  window.dispatchEvent(new CustomEvent(POPUP_DEMO_PEDIATRA_EVENT));
}
