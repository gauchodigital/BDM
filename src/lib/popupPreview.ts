/** Modo demo: ?demo=1 — ver popups varias veces (ideal para presentaciones). */
export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("demo") === "1" || params.get("popups") === "1";
}

/** Preview del popup de campaña: ignora frecuencia con ?wmd=1 / ?popups=1 / ?demo=1 */
export function isCampaignPreviewMode(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return (
    params.get("popups") === "1" ||
    params.get("wmd") === "1" ||
    params.get("demo") === "1"
  );
}

/** Preview del popup pediatra: ignora frecuencia con ?pediatra=1 / ?popups=1 (no ?demo=1). */
export function isPediatraPreviewMode(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("popups") === "1" || params.get("pediatra") === "1";
}

/** @deprecated Usar isCampaignPreviewMode o isPediatraPreviewMode */
export function isPopupPreviewMode(): boolean {
  return isCampaignPreviewMode();
}
