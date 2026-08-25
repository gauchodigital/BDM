import Script from "next/script";

/** Google Analytics 4 — NEXT_PUBLIC_GA_ID=G-XXXXXXXX */
export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (!measurementId) return null;

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
        gtag('config', '${measurementId}');
      `}</Script>
    </>
  );
}
