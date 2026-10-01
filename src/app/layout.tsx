import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import {
  GoogleTagManager,
  GoogleTagManagerNoscript,
} from "@/components/analytics/GoogleTagManager";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { BdmTrackBoot } from "@/components/analytics/BdmTrackBoot";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileAppNav } from "@/components/layout/MobileAppNav";
import { WorldMeningitisDayPopup } from "@/components/campaign/WorldMeningitisDayPopup";
import { PopupDemoBar } from "@/components/engagement/PopupDemoBar";
import { SITE_NAME } from "@/lib/siteLinks";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Información y prevención`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Concientización sobre meningitis: síntomas, causas, vacunación y cuándo consultar. Información clara en español.",
  icons: {
    icon: "/brand/logo-manito-white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-[family-name:var(--font-body)]">
        <GoogleTagManagerNoscript />
        <GoogleTagManager />
        <GoogleAnalytics />
        <MetaPixel />
        <BdmTrackBoot />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileAppNav />
        <WorldMeningitisDayPopup />
        <Suspense fallback={null}>
          <PopupDemoBar />
        </Suspense>
      </body>
    </html>
  );
}
