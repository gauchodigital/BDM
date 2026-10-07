import Script from "next/script";

/** Google Analytics 4 — NEXT_PUBLIC_GA_ID=G-XXXXXXXX */
export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (!measurementId) return null;

  // GTM ya carga la etiqueta Google con el mismo ID y envía el page_view.
  // Si se quita esa etiqueta de GTM, volver a `gtag('config', id)` sin opciones.
  const hasGtm = Boolean(process.env.NEXT_PUBLIC_GTM_ID?.trim());
  const config = hasGtm ? `, { send_page_view: false }` : "";

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${measurementId}'${config});
      `}</Script>
    </>
  );
}
