"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LogoManito } from "@/components/layout/LogoManito";
import { VACUNARSE_URL, SITE_NAME } from "@/lib/siteLinks";
import { TRACK } from "@/lib/analytics";
import { NAV_LINKS } from "@/lib/navLinks";

export function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const isHome = pathname === "/";

  if (isHome) {
    return (
      <>
        {/* Mobile: logo sobre el hero */}
        <header className="absolute inset-x-0 top-0 z-50 lg:hidden">
          <nav className="flex items-center px-6 pt-[max(1.75rem,env(safe-area-inset-top))] pb-2">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label={SITE_NAME}
            >
              <LogoManito
                variant="white"
                priority
                className="h-14 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              />
            </Link>
          </nav>
        </header>

        {/* Desktop: transparente sobre el cielo, con scrim para legibilidad */}
        <header className="absolute inset-x-0 top-0 z-50 hidden bg-gradient-to-b from-[#0B1C33]/70 via-[#0B1C33]/30 to-transparent pb-6 lg:block">
          <nav className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-8">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label={SITE_NAME}
            >
              <LogoManito
                variant="white"
                priority
                className="h-16 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
              />
            </Link>

            <div className="flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const pathOnly = link.href.split("#")[0] || "/";
                const active =
                  pathOnly === "/"
                    ? pathname === "/"
                    : pathname === pathOnly ||
                      pathname.startsWith(pathOnly + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[14px] font-medium transition-colors ${
                      active
                        ? "text-white"
                        : "text-white/75 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </header>
      </>
    );
  }

  return (
    <header className="bg-primary">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8 lg:py-5">
        <Link
          href="/"
          className="inline-flex items-center"
          aria-label={SITE_NAME}
        >
          <LogoManito
            variant="white"
            className="h-16 w-[58px] max-h-16 object-contain"
            width={58}
            height={64}
          />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const pathOnly = link.href.split("#")[0] || "/";
            const active =
              pathOnly === "/"
                ? pathname === "/"
                : pathname === pathOnly || pathname.startsWith(pathOnly + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Button
            href={VACUNARSE_URL}
            external
            variant="onPrimary"
            className="!px-4 !py-2 text-xs"
            trackEvent={TRACK.events.vacunarseClick}
            trackLocation="navbar"
          >
            Vacunarse ahora
          </Button>
        </div>
      </nav>
    </header>
  );
}
