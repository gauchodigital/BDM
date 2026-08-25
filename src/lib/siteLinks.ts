/**
 * Links globales del sitio.
 * TODO: reemplazar placeholders con URLs / números reales cuando estén disponibles.
 */

/** WhatsApp — formato internacional sin símbolos (wa.me) */
export const WHATSAPP_DISPLAY = "+54 9 11 0000-0000";
export const WHATSAPP_NUMBER = "5491100000000";

const WHATSAPP_DEFAULT_MESSAGE =
  "Hola, quiero información sobre meningitis y vacunación.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;

export function buildWhatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** CTA principal de vacunación / consulta (externo o WhatsApp) */
export const VACUNARSE_URL = WHATSAPP_URL;

/** Buscador / listado de centros de vacunación — placeholder */
export const CENTROS_VACUNACION_URL = "/vacunacion";

/** Video de concientización (YouTube) */
export const VIDEO_CONCIENTIZACION_ID = "23eP8YVRXyc";
export const VIDEO_CONCIENTIZACION_URL = `https://www.youtube.com/watch?v=${VIDEO_CONCIENTIZACION_ID}`;

/** Redes — placeholders */
export const FOOTER_SOCIAL_LINKS = [
  {
    id: "instagram",
    href: "https://www.instagram.com/",
    label: "Instagram",
  },
  {
    id: "facebook",
    href: "https://www.facebook.com/",
    label: "Facebook",
  },
  {
    id: "youtube",
    href: "https://www.youtube.com/",
    label: "YouTube",
  },
] as const;

export const SITE_NAME = "BastaDeMeningitis";
export const SITE_URL = "https://bastademeningitis.com";
