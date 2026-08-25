/** Tracking helpers para GTM / GA4 / Meta. */

export type TrackPayload = {
  event: string;
  intent?: string;
  subject?: string;
  location?: string;
  [key: string]: string | undefined;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function pushDataLayer(payload: TrackPayload): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  const { event, ...params } = payload;
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
  );

  if (typeof window.gtag === "function" && event) {
    window.gtag("event", event, clean);
  }

  if (typeof window.fbq === "function" && event) {
    if (event === TRACK.events.whatsappClick) {
      window.fbq("track", "Contact", {
        content_name: clean.subject || "consulta",
        content_category: clean.location || clean.intent || "web",
      });
    }
    window.fbq("trackCustom", event, clean);
  }
}

export const TRACK = {
  ctaClass: "js-bdm-cta",
  events: {
    vacunarseClick: "bdm_vacunarse_click",
    whatsappClick: "bdm_whatsapp_click",
    videoClick: "bdm_video_click",
  },
} as const;
