/**
 * Top eventos BDM para Meta Ads (custom conversions / optimización).
 * Se disparan además del catálogo granular `bdm_*` (Firestore + GA4).
 */
import { pushDataLayer, type TrackParamValue } from "@/lib/analytics";

/**
 * Nombres NEUTROS para Meta Ads (sin “vacuna/meningitis” — Meta bloquea salud).
 * “vc” = abreviatura interna (no escribir vacunas en el event name).
 */
export const META_ADS_EVENTS = {
  /** Popup campaña — usuario respondió A/B/C */
  popupCampaign: "bdm_meta_popup_campaign",
  /** Popup consulta — usuario respondió Sí/No */
  popupPediatra: "bdm_meta_popup_consult",
  /** Formulario / buscador de centros finalizado */
  formVacunas: "bdm_meta_form_vc",
  /** Descarga PDF de ubicaciones (si aplica) */
  pdfUbicaciones: "bdm_meta_pdf_locations",
  /** Descarga PDF calendario */
  pdfVacunacion: "bdm_meta_pdf_vc",
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
