import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Política de cookies",
};

const GSK_COOKIES = "https://privacy.gsk.com/es-ar/privacy-notice/";

/** Redirige al centro de privacidad de GSK (Argentina), que incluye cookies. */
export default function CookiesPage() {
  redirect(GSK_COOKIES);
}
