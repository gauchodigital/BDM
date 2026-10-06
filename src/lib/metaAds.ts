/**
 * Top eventos BDM para Meta Ads (custom conversions / optimización).
 * Se disparan además del catálogo granular `bdm_*` (Firestore + GA4).
 */
import { pushDataLayer, type TrackParamValue } from "@/lib/analytics";

export const META_ADS_EVENTS = {
  /** Popup campaña (Día Mundial) — usuario respondió A/B/C */
  popupCampaign: "bdm_meta_popup_campaign",
  /** Popup pediatra — usuario respondió Sí/No */
  popupPediatra: "bdm_meta_popup_pediatra",
  /** Formulario / búsqueda de centros de vacunación finalizada */
  formVacunas: "bdm_meta_form_vacunas",
  /** Descarga PDF de ubicaciones / centros (cuando exista el asset) */
  pdfUbicaciones: "bdm_meta_pdf_ubicaciones",
  /** Descarga PDF Calendario Nacional de Vacunación */
  pdfVacunacion: "bdm_meta_pdf_vacunacion",
} as const;

export type MetaAdsEvent =
  (typeof META_ADS_EVENTS)[keyof typeof META_ADS_EVENTS];

type MetaStandard = "Lead" | "Schedule" | "Contact";

/**
 * Evento top para Meta Ads (+ espejo GA4/GTM).
 * Opcionalmente dispara un evento estándar de Meta para optimización.
 */
export function trackMetaAds(
  event: MetaAdsEvent,
  params: Record<string, TrackParamValue> = {},
  standard?: MetaStandard,
): void {
  if (typeof window === "undefined") return;

  pushDataLayer({ event, ...params });

  if (standard && typeof window.fbq === "function") {
    const clean = Object.fromEntries(
      Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== "",
      ),
    ) as Record<string, string | number>;
    window.fbq("track", standard, {
      content_name: event,
      ...clean,
    });
  }
}
