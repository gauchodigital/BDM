/** Tracking helpers para GTM / GA4 / Meta. */

export type TrackParamValue = string | number | undefined;

export type TrackPayload = {
  event: string;
  intent?: string;
  subject?: string;
  location?: string;
  [key: string]: TrackParamValue;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * GA4/GTM siempre. Meta Pixel solo si `meta: true` (eventos `bdm_meta_*` con
 * nombres neutros): Meta bloquea custom events con términos/datos de salud.
 */
export function pushDataLayer(
  payload: TrackPayload,
  { meta = false }: { meta?: boolean } = {},
): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  const { event, ...params } = payload;
  const clean = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== "",
    ),
  ) as Record<string, string | number>;

  if (typeof window.gtag === "function" && event) {
    window.gtag("event", event, clean);
  }

  if (meta && typeof window.fbq === "function" && event) {
    window.fbq("trackCustom", event, clean);
  }
}

export const TRACK = {
  ctaClass: "js-bdm-cta",
  events: {
    vacunarseClick: "bdm_vacunarse_click",
    videoClick: "bdm_video_click",
  },
} as const;
