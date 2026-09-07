import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Política de privacidad",
};

const GSK_PRIVACY =
  "https://privacy.gsk.com/es-ar/privacy-notice/general/general-full-text/";

/** Redirige al aviso de privacidad oficial de GSK (Argentina). */
export default function PrivacidadPage() {
  redirect(GSK_PRIVACY);
}
